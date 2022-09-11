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
    /**
     * 
     * @param {String} id - User snowflake
     * @param {Object} discordUser - User data object (Passed from Discord)
     * @param {Object} guilds - Guilds that the user is in (Passed from Discord)
     * @param {Object} notifications - Notifications that the user has
     * @param {Object} tokens - Authentication tokens that the user has (generated automatically on site login)
     */
    static async create(id, discordUser, guilds, notifications, tokens) {
        const user = schemas.get("users");

        const data = await new user({
            id: id,
            discordUser: discordUser,
            guilds: guilds,
            notifications: notifications,
            tokens: tokens
        });

        data.save();

        return data;
    }

    /**
     * 
     * @param {String} id - User snowflake
     * @param {Object} discordUser - User data object (Passed from Discord)
     * @param {Object} guilds - Guilds that the user is in (Passed from Discord)
    */
    static async edit(id, discordUser, guilds) {
        const User = schemas.get("users");
        let data;

        User.updateOne({ id: id }, {
            discordUser: discordUser,
            guilds: guilds
        }, (err, document) => {
            if (err) {
                logger.error("MongoDB", err);
                
                data = "A error has occured while trying to update this document."
            }
            else data = document;
        });

        return data;
    }

    /**
     * 
     * @param {String} id - User snowflake
    */
    static async getWithSnowflake(id) {
        const user = schemas.get("users");

        const data = await user.findOne({
            id: id
        });

        return data;
    }

    /**
     * @param {String} id - User snowflake
     */
    static async delete(id) {
        const user = schemas.get("users");

        user.deleteOne({
            id: id
        });

        return null;
    }
}

// Guild class
class Guild {
    static async create() {}

    static async edit() {}

    static async get() {}

    static async delete() {}
}

// Expose functions
module.exports = {
    User,
    Guild
};
