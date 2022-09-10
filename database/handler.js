// Packages
const mongoose = require("mongoose");
const logger = require("../logger");
const fs = require("node:fs");
require("dotenv").config();

// Schemas
const schemas = new Map();
const schemaFiles = fs
	.readdirSync("./database/schemas")
	.filter((file) => file.endsWith(".js"));

for (const file of schemaFiles) {
	const schema = require(`./schemas/${file}`);
	const name = file.replace(".js", "");

	schemas.set(name, mongoose.model(name, schema, name));
}

// MongoDB Connection Options
const options = {
	useNewUrlParser: true,
};

// Initalize MongoDB
this.mongo = mongoose.connect(process.env.MONGO, options, (err) => {
	if (err) logger.error("MongoDB", `Connection Error:\n${err}`);
	else logger.info("MongoDB", "Connected");
});

// User class
class User {
    static async create() {}

    static async edit() {}

    static async get() {}

    static async delete() {}
}

// Expose functions
module.exports = {
    User
};
