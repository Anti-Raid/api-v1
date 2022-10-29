const database = require("../database/handler");
module.exports = {
	name: "cases/get-all",
	method: "GET",
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
		const guildID = req.query.gid;
		const cases = await database.Cases.listAll();
		if (cases.length > 0) res.send(cases);
		else
			res.status(404).send({
				message:
					"We couldn't find any cases for the server with ID => " +
					guildID,
				error: true,
				fatal: false,
			});
	},
};
