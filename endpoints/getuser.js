module.exports = {
	name: "users/get",
	method: "GET",
<<<<<<< HEAD
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
=======
	execute: async (req, res, fetch, database, auth, DOMpurify, marked) => {},
>>>>>>> 5b635a2e6bdabbb35794d95c0b5dabd4fe12bd31
};
