//filename : user.js
const mongoose = require("mongoose")

let Poem = mongoose.model("poem", {
	title: String,
	content: String,
    author:String
})

module.exports = {
	Poem
}