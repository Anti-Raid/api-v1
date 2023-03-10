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
					name: `${vote.userObj.username}#${vote.userObj.discriminator}`,
					icon_url: vote.userObj.avatar,
					url: vote.userObj.avatar,
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
						Authorization: `Bot ODQ5MzMxMTQ1ODYyMjgzMjc1.YLZnRA.GOd92__QEBiBjGZDEhgMONOjwGg`,
						"Content-Type": "application/json",
					},
				}
			);
		}
	),
};
