const mongoose = require("mongoose")

let likedpoem = mongoose.model("likedpoem", {
    owner:String,
	poems: []
})

module.exports = {
	likedpoem
}
