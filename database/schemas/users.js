const { Schema } = require("mongoose");

const schema = new Schema({
	id: String,
	user: Array,
	guilds: Array,
	notifications: Array,
	devices: Array
});

module.exports = schema;
