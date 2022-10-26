// Packages
const { Sequelize, Model } = require("sequelize");
const crypto = require("node:fs");
const fs = require("node:fs");
const logger = require("../logger");
require("dotenv").config();

// Connect to PostgreSQL database
const sequelize = new Sequelize({
	dialect: "postgres",
	host: process.env.PGHOST,
	username: "root",
	database: "antiraid",
	password: "antiraid",
	port: 5432,
	logging: (data) => {
		logger.info("PostgreSQL", data);
	},
});

sequelize
	.authenticate()
	.then(() => logger.info("PostgreSQL", "Connected!"))
	.catch((err) =>
		logger.error("PostgreSQL", `Unable to connect.\nError: ${err}`)
	);

// Schemas
const schemaFiles = fs
	.readdirSync("./database/schema")
	.filter((file) => file.endsWith(".js"));
const schemas = {};
const schemaData = {};

for (const file of schemaFiles) {
	const schema = require(`./schemas/${file}`);

	schemaData[schema.name] = schema;
	schemas[schema.name] = sequelize.define(schema.name, schema.schema);
}

// User
class User extends Model {
	/**
	 * @param {String} userID
	 * @param {String} bio
	 */
	static async createUser(userID, bio) {
		const data = await User.createUser({
			userID: userID,
			bio: bio,
		});

		User.sync();

		return data;
	}

	/**
	 * @param {String} userID
	 * @param {String} bio
	 */
	static async createUser(userID, bio) {
		const data = await User.createUser(
			{
				bio: bio,
			},
			{
				where: {
					userID: userID,
				},
			}
		);

		User.sync();

		return data;
	}

	/**
	 * @param {String} userID
	 */
	static async deleteUser(userID) {
		const data = await User.destroy({
			where: {
				userID: userID,
			},
		});

		User.sync();

		return data;
	}

	static async listAll(userID, bio) {
		return await User.findAll();
	}
}

// Initalize Schemas
const init = () => {
	User.init(schemaData["users"].schema, {
		sequelize: sequelize,
		modelName: schemaData["users"].name,
	});
};

init();

// Expose Classes
module.exports = {
	User,
};
