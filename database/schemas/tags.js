const { DataTypes } = require("sequelize");

const schema = {
    GuildID: {
        type: DataTypes.STRING
    },

    Command: {
        type: DataTypes.STRING
    },

    Content: {
        type: DataTypes.STRING
    }
};

module.exports = {
    name: "tags",
    schema: schema,
}