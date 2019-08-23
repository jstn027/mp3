//filename : user.js
const mongoose = require("mongoose")

let User = mongoose.model("user", {
	username: String,
	password: String,
    fullname:String,
    info:String
})

module.exports = {
	User
}