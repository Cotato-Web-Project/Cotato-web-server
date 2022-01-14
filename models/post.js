const mongoose = require("mongoose")
const Schema = mongoose.Schema

const postSchema = new Schema({
  title: String,
  content: String,
  postid: Number,
  date: { type: Date, default: Date.nowm },
})

module.exports = mongoose.model("post", postSchema)
