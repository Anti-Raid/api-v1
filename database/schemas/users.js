const { DataTypes } = require("sequelize");

const schema = {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },

    discordUser: {
        type: DataTypes.JSON
    },

    guilds: {
        type: DataTypes.JSON
    },

    notifications: {
        type: DataTypes.JSON
    },

    tokens: {
        type: DataTypes.JSON
    }
};

module.exports = {
    name: "users",
    schema: schema,
}