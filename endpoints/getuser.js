module.exports = {
	name: "user/get",
	method: "GET",
	execute: async (req, res, fetch, database, auth, DOMpurify, marked) => {
		// have to refactor this so it can run with not just putting id in the code but in the url
		fetch(`https://discord.com/api/v10/users/${req.params.id}`, {
			method: "GET",
			headers: {
				Authorization: 'Bot ODQ5MzMxMTQ1ODYyMjgzMjc1.YLZnRA.GOd92__QEBiBjGZDEhgMONOjwGg'
			}
		}).then(async resp => {
			res.send(await resp.json())
		})
	},
};
