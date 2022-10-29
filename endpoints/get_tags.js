const db = require("../database/handler");
module.exports = {
	name: "tags/get",
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
		const guildId = req.query.guildId;
		const cmdName = req.query.cmdName;
		const tag = await database.Tags.getTag(guildId, String(cmdName));
		if (tag) res.send(tag);
		else
			res.status(404).send({
				message:
					"We couldn't find any tags within our database with the following querys",
				GuildId: guildId,
				CommandName: cmdName,
				error: true,
				fatal: false,
			});
	},
};
