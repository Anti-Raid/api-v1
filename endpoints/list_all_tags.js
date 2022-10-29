const db = require("../database/handler");
module.exports = {
	name: "tags/list",
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
		const guildID = req.query.guildId;
		const tags = await database.Tags.listAll();
		if (tags.length > 0) res.send(tags);
		else
			res.status(404).send({
				message:
					"We couldn't find any tags within our database for this guild",
				Guild_ID: guildID,
				error: true,
				fatal: false,
			});
	},
};
