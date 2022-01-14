const mongoose = require("mongoose")
const Schema = mongoose.Schema

const postSchema = new Schema({
  title: String,
  content: String,
  postid: Number,
  date: { type: Date, default: Date.now() },
})

//검색 인덱싱을 위해 추가
postSchema.index({ title: "text", content: "text" })

module.exports = mongoose.model("post", postSchema)
