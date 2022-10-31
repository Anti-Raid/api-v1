const database = require("../database/handler");

module.exports = {
	name: "staff/apply",
	method: "POST",
	/**
	 *
	 * @param {*} req
	 * @param {*} res
	 * @param {*} fetch
	 * @param {database} database
	 * @param {*} auth
	 * @param {*} DOMpurify
	 * @param {*} marked
	 */
	execute: async (req, res, fetch, database, auth, DOMpurify, marked) => {
		const discord = req.header("discordUser");
		const position = req.header("position");
		const answers = req.header("answers");

		if (!discord || !position || !answers)
			return res.status(400).json({
				message: "Missing some headers",
				status: 400,
			});

		const user = database.Users.getUser(discord.id);

		const staff_app = {
			position: position,
			answers: answers,
			id: 0,
		};

		if (user) {
			const apps = user.staff_applications;

			if (apps.length > 0) staff_app["id"] = apps.length + 1;
			apps.push(staff_app);

			await database.Users.updateUser(
				user.id,
				user.discordUser,
				user.guilds,
				user.notifications,
				user.tokens,
				apps
			);
		} else
			await database.Users.createUser(
				discord.id,
				discord,
				discord.guilds || [],
				[],
				[],
				staff_app
			);
	},
};
