const mongoose = require("mongoose")
const Schema = mongoose.Schema

const imageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
  required: false,
})

const postSchema = new Schema({
  title: String,
  desc: String,
  date: { type: Date, default: Date.now() },
  img: imageSchema,
  id: Number,
})

//검색 인덱싱을 위해 추가
postSchema.index({ title: "text", content: "text" })

module.exports = mongoose.model("post", postSchema)
