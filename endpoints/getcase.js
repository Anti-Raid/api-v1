module.exports = {
    name: "case/get",
    method: "GET",
    execute: async (req, res, fetch, database, auth, DOMpurify, marked) => {
        const guild = req.query.gid;
        const caseid = req.query.cid;
        const casee = await database.getCase(guild, caseid);
        res.send(casee);
    }
}