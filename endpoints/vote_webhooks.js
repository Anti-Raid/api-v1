const db = require("../database/handler");

module.exports = {
	name: "webhooks/vote",
	method: "POST",
	/**
	 *
	 * @param {import("express").Request} req
	 * @param {import("express").Response} res
	 * @param {require("node-fetch")} fetch
	 * @param {db} database
	 * @param {*} auth
	 * @param {*} DOMpurify
	 * @param {*} marked
	 */
	execute: async (req, res, fetch, database, auth, DOMpurify, marked) => {
			const embed = {
				title: "New Vote!",
				author: {
					name: `${req.body["userObj"].username}#${req.body["userObj"].discriminator}`,
					icon_url: req.body["userObj"].avatar,
					url: req.body["userObj"].avatar,
				},
				fields: [
					{
						name: "Service",
						value: "Infinity Bot List",
					},
					{
						name: "Vote Time",
						value: String(new Date(req.body["timeStamp"])),
					},
					{
						name: "Total Votes",
						value: String(req.body["votes"]),
					},
				],
			};

			await fetch(
				`https://discord.com/api/v9/channels/1064286667881594921/messages`,
				{
					method: "post",
					body: JSON.stringify({
						embeds: [embed],
					}),
					headers: {
						Authorization: `Bot ODU4MzA4OTY5OTk4OTc0OTg3.GkaOk_.SCzdbnjxQQDmAwxdPJYkpo8TZ-AdJO9C_y6kPY`,
						"Content-Type": "application/json",
					},
				}
			);

                        return res.json({ success: true });
		}
};
