module.exports = {
    name: "tags/get",
    method: "GET",
    execute: async (req, res, fetch, database, auth, DOMpurify, marked) => {
        const id = req.query.id;
        const tag = await database.getTags(id);
        res.send(tag)
    }
}