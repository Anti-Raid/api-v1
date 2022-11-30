const db = require("../database/handler");
const Infinity = require("infinity-bots");
const webhook = new Infinity.Webhook("AntiRaidIsTheBest499");

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
	execute: webhook.hookListener(
		async (vote, req, res, fetch, database, auth, DOMpurify, marked) => {
			/*const embed = {
                title: "New Vote!",
                author: {
                    name: "",
                    icon_url: "",
                    url: ""
                }
            };*/

            console.log(vote);
            
            await fetch(
				`https://discord.com/api/v9/channels/1045460117287616552/messages`,
				{
					method: "post",
					body: JSON.stringify({
						/*embeds: [embed]*/
                        content: "test"
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
