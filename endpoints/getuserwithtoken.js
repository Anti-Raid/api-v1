const database = require("../database/handler");
const { PermissionsBitField } = require("discord.js");

module.exports = {
	name: "users/getwithtoken",
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
		const token = req.query.token;
		const tokenInfo = await database.Tokens.getToken(token);

		if (!tokenInfo)
			res.status(404).send({
				message:
					"We couldn't fetch any information about this user in our database",
				token: token,
				error: true,
				fatal: false,
			});

		const user = await database.Users.getUser(tokenInfo.userID);

        let guilds = [];
        user.guilds.map((guild) => {
            const permissions = new PermissionsBitField(guild.permissions);
            guild["permissions"] = permissions;

            guilds.push(guild);
        });

        user["guilds"] = guilds;
        
		if (user) res.send(user);
		else
			res.status(404).send({
				message:
					"We couldn't fetch any information about this user in our database",
				token: token,
				error: true,
				fatal: false,
			});
	},
};
