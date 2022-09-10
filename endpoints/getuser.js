module.exports = {
	name: "users/get",
	method: "GET",
	execute: async (req, res, fetch, database, auth, DOMpurify, marked) => {
		fetch(`https://discord.com/api/v10/users/775855009421066262`, {
			method: "GET",
			headers: {
				Authorization: 'Bot bot-token-here'
			}
		}).then(async resp => {
			res.send(await resp.json())
		})
	},
};
