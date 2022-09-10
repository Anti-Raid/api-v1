module.exports = {
    name: "version/check",
    method: "GET",
    /**
     * 
     * @param {import("express").Request} req 
     * @param {import("express").Response} res 
     * @param {*} fetch 
     * @param {*} database 
     * @param {*} auth 
     * @param {*} DOMpurify 
     * @param {*} marked 
     */
    execute: async (req, res, fetch, database, auth, DOMpurify, marked) => {
        res.send({production: "5", development: "TBD"})
        // res.sendStatus(200)
    },
}