const { DataTypes } = require("sequelize");

const schema = {
    userID: {
        type: DataTypes.STRING,
        primaryKey: true,
    },

    bio: {
        type: DataTypes.STRING
    }
};

module.exports = {
    name: "user",
    schema: schema,
}