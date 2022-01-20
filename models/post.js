const mongoose = require("mongoose")
const Schema = mongoose.Schema

const imageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
  required: false,
})

const postSchema = new mongoose.Schema({
  title: String,
  desc: String,
  date: { type: Date, default: Date.now() },
  img: imageSchema,
  //id: mongoose.Schema.Types.ObjectId,
})

//검색 인덱싱을 위해 추가
postSchema.index({ title: "text", content: "text" })

const Post = mongoose.model("Post", postSchema)

module.exports = Post
