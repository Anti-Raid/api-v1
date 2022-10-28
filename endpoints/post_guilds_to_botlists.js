module.exports = {
	name: "guilds/post",
	method: "GET",
	execute: async (req, res, fetch, database, auth, DOMpurify, marked) => {
		res.status(409);
		res.send("This endpoint is not yet implemented.");
	},
};
