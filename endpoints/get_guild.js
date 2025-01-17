const db = require("../database/handler");
module.exports = {
	name: "guilds/get",
	method: "GET",
	/**
	 *
	 * @param {*} req
	 * @param {*} res
	 * @param {*} fetch
	 * @param {db} database
	 * @param {*} auth
	 * @param {*} DOMpurify
	 * @param {*} marked
	 */
	execute: async (req, res, fetch, database, auth, DOMpurify, marked) => {
		const id = req.query.id;
		const guild = await database.Guilds.getGuild(id);
		if (guild) res.send(guild);
		else
			res.status(404).send({
				message:
					"We couldn't fetch any information in our database about the guild with ID => " +
					id,
				error: true,
				fatal: false,
			});
	},
};
