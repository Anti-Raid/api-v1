module.exports = {
	name: "cases/get-all",
	method: "GET",
	execute: async (req, res, fetch, database, auth, DOMpurify, marked) => {
		const guildID = req.query.gid;
		const cases = await database.getAllCases(guildID);
		res.send(cases);
	},
};
