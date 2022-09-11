const { Schema } = require("mongoose");

const schema = new Schema({
	id: String,
	discordUser: Array,
	guilds: Array,
	notifications: Array,
	tokens: Array
});

module.exports = schema;
