const mongoose = require("mongoose")
const Schema = mongoose.Schema

const imageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
  required: false,
})

const fileSchema = new mongoose.Schema({
  originalFileName: { type: String },
  serverFileName: { type: String },
  size: { type: Number },
  //   uploadedBy: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "user",
  //     required: true,
  //   },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "post" },
  isDeleted: { type: Boolean, default: false },
})

const postSchema = new mongoose.Schema({
  title: String,
  desc: String,
  date: { type: Date, default: Date.now() },
  img: imageSchema,
  file: fileSchema,
  liked: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
})

//검색 인덱싱을 위해 추가
postSchema.index({ title: "text", content: "text" })

const Post = mongoose.model("Post", postSchema)

module.exports = Post
