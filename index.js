// Packages
const express = require("express"),
	app = express();
const fs = require("node:fs");
const markdown = require("markdown-parse");
const logger = require("./logger");
const fetch = require("node-fetch");
const database = require("./database/handler");
const auth = require("./auth")(database);
const path = require("path");
const crypto = require("node:crypto");
const cloudinary = require("cloudinary");
const ratelimits = require("express-rate-limit");
require("dotenv").config();

// Configure marked
const marked = require("marked");

marked.setOptions({
	renderer: new marked.Renderer(),
	highlight: function (code, lang) {
		const hljs = require("highlight.js");
		const language = hljs.getLanguage(lang) ? lang : "plaintext";

		return hljs.highlight(code, {
			language,
		}).value;
	},
	langPrefix: "hljs language-",
	pedantic: false,
	gfm: true,
	breaks: false,
	sanitize: false,
	smartLists: true,
	smartypants: false,
	xhtml: false,
});

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: 'dzupu7gnk', 
  api_key: '463115852878299', 
  api_secret: 'WJkO6THT4RDtlpmgyfuR3oysoW4' 
});

// DOMPurify
const { JSDOM } = require("jsdom");
const DOMPurify = require("dompurify")(new JSDOM().window);

// Configure Ratelimits
const ratelimitMiddleware = ratelimits({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 5 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	message: {
		alert: "You have exceeded our Rate Limit of 100 requests per 5 minutes!",
		error: true,
	},
});

// Middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(require("cors")());
app.use(
	express.static("static", {
		root: __dirname,
	})
);
app.use(ratelimitMiddleware);

// API Endpoints Map
const apiEndpoints = new Map();
const apiEndpointsFiles = fs
	.readdirSync("./endpoints")
	.filter((file) => file.endsWith(".js"));

for (const file of apiEndpointsFiles) {
	const endpoint = require(`./endpoints/${file}`);
	apiEndpoints.set(endpoint.name, endpoint);
}

// Documentation Map
const docs = new Map();
const documentationFiles = fs
	.readdirSync("./docs")
	.filter((file) => file.endsWith(".md"));

for (const file of documentationFiles) {
	markdown(fs.readFileSync(`./docs/${file}`, "utf8"), (error, result) => {
		if (error) return logger.error("Markdown", error);
		else {
			const metadata = result.attributes;
			const html = result.html;

			docs.set(metadata.title, {
				metadata: metadata,
				html: DOMPurify.sanitize(marked.parse(html)),
			});
		}
	});
}

// CDN endpoints
app.get("/cdn/images/:image", async (req, res) => {
	let file = req.params.image;
	let filePath = path.join(__dirname, `public/images/${file}.png`);
	if (!filePath.includes(file))
		return res.send({
			message:
				"Whoops, seems like i can't find that image! Please try one of the following images that i can show you by typing it's exact name",
			parameters: fs
				.readdirSync("./public/images")
				.filter((file) => file.endsWith(".png"))
				.map((x) => x.split(".")[0])
				.join(" | "),
		});
	else res.sendFile(filePath);
});

app.get("/cdn/images", async (req, res) => {
	return res.send({
		parameters: fs
			.readdirSync("./public/images")
			.filter((file) => file.endsWith(".png"))
			.map((x) => x.split(".")[0])
			.join(" | "),
	});
});

// Regular Endpoint
app.all("/", (req, res) => {
	res.header("Content-Type", "application/json");
	res.json({
		message: "Welcome to the AntiRaid API! 👋",
		error: false,
		fatal: false,
	});
});

// API Endpoints
app.all(`/api/:category/:endpoint`, async (req, res) => {
	const endpoint = `${req.params.category}/${req.params.endpoint}`;
	const data = apiEndpoints.get(endpoint);

	if (data) {
		if (data.method != req.method)
			return res.status(405).json({
				error: `Method "${data.method}" is not allowed for endpoint "${endpoint}"`,
			});

		try {
			await data.execute(
				req,
				res,
				fetch,
				database,
				auth,
				DOMPurify,
				marked
			);
		} catch (error) {
			res.status(500).json({
				error: "Internal Server Error",
				message: "An error occurred while processing your request.",
			});

			logger.error(`API (${endpoint})`, error);
		}
	} else
		return res.status(404).json({
			error: "This endpoint does not exist.",
		});
});

// Blog Endpoints
app.get("/blog", async (req, res) => {
	const data = await database.Blog.listAllPosts();
	let posts = [];

	data.forEach((post) => {
		let i = post;

		markdown(post.Markdown, (error, result) => {
			if (error) return logger.error("Markdown", error);
			else {
				const html = result.html;
				i["Markdown"] = DOMPurify.sanitize(marked.parse(html));
			}
		});

		posts.push(i);
	});

	setTimeout(() => {
		res.json(posts);
	}, 2000);
});

app.get("/blog/:post", async (req, res) => {
	let data = await database.Blog.getPost(req.params.post);

        if (!data) return res.status(404).json({ error: "Post not Found", code: 404 });
	else {
        markdown(data.Markdown, (error, result) => {
		if (error) return logger.error("Markdown", error);
		else {
			const html = result.html;
			data["Markdown"] = DOMPurify.sanitize(marked.parse(html));
		}
	});

	setTimeout(() => {
		res.json(data);
	}, 1000);
        }
});

// Documentation Endpoints
app.get("/docs", async (req, res) => {
	res.render("pages/docs", {
		docs: docs,
	});
});

app.get("/docs/:title", async (req, res) => {
	const doc = docs.get(req.params.title);

	if (doc) res.render("pages/doc", { doc: doc });
	else
		res.status(404).json({
			error: "This documentation page does not exist.",
		});
});

// Authentication Endpoints
app.all("/auth/login", async (req, res) => {
	// Check if origin is allowed.
	const allowedOrigins = [
		"https://v6-beta.antiraid.xyz",
		"https://apply.antiraid.xyz",
		"https://blog.antiraid.xyz",
		"https://marketplace.antiraid.xyz",
                "https://vocid.antiraid.xyz"
	];

	if (!allowedOrigins.includes(req.get("origin")))
		return res.status(403).json({
			error: `\`${req.get("origin")}\` is not a allowed origin.`,
		});

	// If allowed, send client to Discord
	const url = await auth.discord.getAuthURL(
		`${req.get("origin")}/auth/callback`
	);

	res.status(200).json({
		url: url,
		verification_passed: true,
	});
});

app.all("/auth/callback", async (req, res) => {
	let response = null;

	if (!req.query.code || req.query.code === "") {
		if (!req.query.state || req.query.state === "")
			return res.status(400).json({
				message:
					"There was no code, and state provided with this request.",
				error: true,
				status: 400,
			});
		else {
			const data = JSON.parse(req.query.state);
			const domain = new URL(data.redirect);

			return res.redirect(`https://${domain.hostname}/`);
		}
	}

        if (twoFactorSecret) return; // Do not do shit, if they have a Two Factor Authentication secret, at this time.

	const discord = await auth.discord.getAccessToken(req.query.code);
	const userInfo = await auth.discord.getUserInfo(discord.access_token);

	const discordRefresh = await auth.discord.generateAccessToken(
		discord.refresh_token
	);
	const guilds = await auth.discord.getGuilds(discordRefresh.access_token);

	const dbUser = await database.Users.getUser(userInfo.id);

	if (dbUser) {
		const token = crypto.randomUUID();

		await database.Tokens.add(token, dbUser.id, new Date());
		await database.Users.updateUser(
			dbUser.id,
			userInfo,
			guilds,
			dbUser.notifications,
			dbUser.staff_applications,
			dbUser.roles
		);

		response = token;
	} else {
		const token = crypto.randomUUID();

		await database.Users.createUser(
			userInfo.id,
			userInfo,
			guilds,
			[],
			[],
			[]
		);
		await database.Tokens.add(token, userInfo.id, new Date());

		response = token;
	}

	const extraData = JSON.parse(req.query.state);

	let url = extraData.redirect;
	url += "?token=" + encodeURIComponent(response);

	setTimeout(() => {
		res.redirect(url);
	}, 1000);
});

// Start Server
app.listen(9527, () => {
	logger.info("Express", "Server started on port 9527");
});
