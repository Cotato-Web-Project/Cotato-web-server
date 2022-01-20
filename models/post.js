const mongoose = require("mongoose")
const Schema = mongoose.Schema
// const comments = require("./comment")

const imageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
  required: false,
})

const postSchema = new Schema({
  title: String,
  desc: String,
  postid: Number,
  date: { type: Date, default: Date.now() },
  img: imageSchema,
  _id: Number,
})

postSchema.set("toObject", { virtuals: true })
postSchema.set("toJSON", { virtuals: true })
postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
})

//검색 인덱싱을 위해 추가
postSchema.index({ title: "text", content: "text" })

module.exports = mongoose.model("post", postSchema)
