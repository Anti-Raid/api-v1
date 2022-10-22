// Packages
const express = require("express"),
	app = express();
const fs = require("node:fs");
const markdown = require("markdown-parse");
const logger = require("./logger");
const fetch = require("node-fetch");
const database = require("./database/handler");
const auth = require("./auth")(database);
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

// DOMPurify
const { JSDOM } = require("jsdom");
const DOMPurify = require("dompurify")(new JSDOM().window);

// Middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(require("cors")());
app.use(
	express.static("static", {
		root: __dirname,
	})
);

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

// API Endpoints
app.all(`/api/:category/:endpoint`, async (req, res) => {
	const endpoint = `${req.params.category}/${req.params.endpoint}`;
	const data = apiEndpoints.get(endpoint);
	console.log(apiEndpoints)
	if (data) {
		if (data.method != req.method)
			return res.status(405).json({
				error: `Method "${method}" is not allowed for endpoint "${endpoint}"`,
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

app.get('/api', async (req, res) => {
	const api_endpoints = fs.readdirSync("./endpoints").filter((file) => file.endsWith(".js"))
	// console.log(api_endpoints)
	// const api_url = apiEndpoints.get(api)
	res.render('pages/api', {apiend: apiEndpoints})
})

// Authentication Endpoints
app.all("/auth/login", async (req, res) => {
	// Check if origin is allowed.
	const allowedOrigins = [
		"https://antiraid.xyz",
		"https://v6-beta.antiraid.xyz",
                "https://apply.antiraid.xyz"
	];

	if (!allowedOrigins.includes(req.get("origin")))
		return res.status(403).json({
			error: `\`${req.get("origin")}\` is not a allowed origin.`,
		});

	// If allowed, send client to Discord
	const url = await auth.discord.getAuthURL(`${req.get("origin")}/auth/callback`);

	res.status(200).json({
		url: url,
		verification_passed: true,
	});
});

app.all("/auth/callback", async (req, res) => {
	const data = await auth.discord.getAccessToken(req.query.code);
	const user = await auth.discord.getUserInfo(data.access_token);

	const extraData = JSON.parse(req.query.state);

	let url = extraData.redirect;
	url += "?data=" + encodeURIComponent(JSON.stringify(user));
	url += "&platform=discord";

	setTimeout(() => {
		res.redirect(url);
	}, 1000);
});

// Page not Found
app.all("*", async (req, res) => {
       res.status(404).json({
           error: "This endpoint does not exist.",
	});
});

// Start Server
app.listen(9527, () => {
	logger.info("Express", "Server started on port 9527");
});
