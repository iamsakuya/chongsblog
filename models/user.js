const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
	name: {
		type: String, 
		required: true, 
		unique: true 
	}, 
	email: {
		type: String, 
		required: true, 
		unique: true 
	}, 
	password: {
		type: String 
	}, 
	register_date: {
		type: Date, 
		default: Date.now 
	}, 
	isSiteOwner: {
		type: Boolean, 
		default: false 
	} 
});
UserSchema.plugin(passportLocalMongoose, {
	usernameField: 'name', 
	passwordField: 'password' 
});

const User = mongoose.model('user', UserSchema);
module.exports = User;