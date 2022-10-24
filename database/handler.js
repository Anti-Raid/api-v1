const schemauser = require('./schemas/user');
const schemaguild = require('./schemas/servers');
const schematags = require('./schemas/tags');
const schemacases = require('./schemas/cases');
module.exports = {
    /**
     * 
     * @param {schema} schema
     * @param {string} id 
     * @returns 
     */
    getUser: async (id) => {
        const data = schemauser.findOne({userID: id});
        return data;
    },
    getGuild: async (id) => {
        const data = schemaguild.findOne({guildID: id});
        return data;
    },
    getTags: async (guild) => {
        const guild_data = schematags.findOne({guildID: guild});
        return guild_data;
    },
    getCase: async (guild, id) => {
        const guild_data = schemacases.findOne({serverId: guild, caseId: id});
        return guild_data;
    },
    getAllCases: async (guild) => {
        const guild_data = schemacases.find({serverId: guild});
        return guild_data;
    }
};