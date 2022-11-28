const db = require("../database/handler");
const {EmbedBuilder}=require("discord.js")
const Infinity = require('infinity-bots');
const webhook = new Infinity.Webhook('AntiRaidIsTheBest499')
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
   execute: webhook.hookListener(async (vote, req, res, fetch, database, auth, DOMpurify, marked) => {
        await fetch(
            `https://discord.com/api/v9/channels/1045460117287616552/messages`,
            {
                method: "post",
                body: JSON.stringify({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Green")
                            .setThumbnail('https://api.antiraid.xyz/cdn/images/logo_main')
                            .setAuthor({name: "Infinity Bot List", url: votes.userObj.avatar})
                            .setDescription(`A vote has been received!\n>>> User ID: ${vote.user}\nVotes: ${vote.votes}\nType: ${vote.type}`)
                    ],
                }),
                headers: {
                    Authorization: `Bot ODQ5MzMxMTQ1ODYyMjgzMjc1.YLZnRA.GOd92__QEBiBjGZDEhgMONOjwGg`,
                    "Content-Type": "application/json",
                },
            }
        );
	}),
};
