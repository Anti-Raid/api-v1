module.exports = {
	name: "users/get",
	method: "GET",
	execute: async (req, res, fetch, database, auth, DOMpurify, marked) => {
		// res.sendStatus(403)
		const id = req.query.id;
		// have to refactor this so it can run with not just putting id in the code but in the url
		const user = await database.getUser(id);
		res.send(user);
	},
};
