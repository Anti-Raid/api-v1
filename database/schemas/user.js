const {Schema, model} = require('mongoose');

const userSchema = new Schema({
	userID: String,
	bio: String,
});

module.exports = model('User', userSchema);
