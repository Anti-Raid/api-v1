module.exports = {
    name: "guilds/get",
    method: "GET",
    execute: async (req, res, fetch, database, auth, DOMpurify, marked) => {
        const id = req.query.id;
        const guild = await database.getGuild(id);
        res.send(guild)
    }
}