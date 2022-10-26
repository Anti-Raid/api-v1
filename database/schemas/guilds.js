const { DataTypes } = require("sequelize");

const schema = {
    id: {
        type: DataTypes.STRING,
    },

    infractions: {
        type: DataTypes.JSON
    }
};

module.exports = {
    name: "guilds",
    schema: schema,
}