import mongoose from "mongoose"

//-------------------------------- image Schema -------------------------------//

const imageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
  required: false,
})

//-------------------------------- file Schema -------------------------------//

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
  required: false,
})

//-------------------------------- post Schema -------------------------------//

const postSchema = new mongoose.Schema({
  title: String,
  desc: String,
  date: { type: Date, default: Date.now() },
  img: imageSchema,
  file: fileSchema,
  liked: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
})

postSchema.index({ title: "text", content: "text" })

const Post = mongoose.model("Post", postSchema)

//-------------------------------- 전체 게시글 -------------------------------//

export async function getAllPost() {
  return Post.find().sort({ date: -1 })
}

//-------------------------------- 선택한 게시글 -----------------------------//

export async function getById(id) {
  return Post.findById(id)
}

//--------------------------------- 게시글 작성 ------------------------------//

export async function createPost(id, title, desc, img, file) {
  return new Post({
    title: title,
    desc: desc,
    img: img,
    id: id,
    file: file,
  }).save()
}

//--------------------------------- 게시글 수정 ------------------------------//

export async function updatePost(id, title, desc, img, file) {
  return Post.findByIdAndUpdate(
    id,
    { title, desc, img, file },
    { returnOriginal: false }
  )
}

export async function deletePost(id) {
  return Post.findByIdAndDelete(id)
}

export async function searchPost(options) {
  return Post.find({ $or: options })
}
