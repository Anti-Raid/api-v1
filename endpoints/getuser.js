const database = require("../database/handler");
module.exports = {
	name: "users/get",
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
		const id = req.query.id;
		const user = await database.Users.getUser(id);

		user["staff_applications"] = [];
		user["guilds"] = [];

		if (user) res.send(user);
		else
			res.status(404).send({
				message:
					"We couldn't fetch any information about this user in our database",
				userID: id,
				error: true,
				fatal: false,
			});
	},
};
