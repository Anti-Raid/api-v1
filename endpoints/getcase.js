const db = require("../database/handler");
module.exports = {
	name: "case/get",
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
		const guild = req.query.gid;
		const caseid = req.query.cid;
		const casee = await database.Cases.getCase(guild, String(caseid));
		if (casee) res.send(casee);
		else
			res.status(404).send({
				message:
					"We couldn't find any case with this ID within our database",
				caseID: caseid,
				guildID: guild,
				error: true,
				fatal: false,
			});
	},
};
