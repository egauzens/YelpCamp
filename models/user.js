var mongoose = require("mongoose");
var passportLocslMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	username: String,
	password: String
});

userSchema.plugin(passportLocslMongoose);

module.exports = mongoose.model("User", userSchema);