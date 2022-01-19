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
  postid: Number,
<<<<<<< HEAD
  date: { type: Date, default: Date.now },
=======
  date: { type: Date, default: Date.now() },
  img: imageSchema,
  _id: Number,
>>>>>>> c7036db55158df4da4b1aa4b62d3d3cad59b03b4
})

//검색 인덱싱을 위해 추가
postSchema.index({ title: "text", content: "text" })

module.exports = mongoose.model("post", postSchema)
