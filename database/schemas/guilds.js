const { Schema } = require("mongoose");

const schema = new Schema({
	id: String,
    infractions: Array
});

module.exports = schema;
