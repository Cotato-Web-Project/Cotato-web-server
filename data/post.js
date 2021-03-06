//------------------------------------- import ---------------------------------------//

import mongoose from "mongoose"
// import * as userRepository from "./user.js"

let db = mongoose.connection

// //------------------------------------- post Schema ---------------------------------------//

const postSchema = new mongoose.Schema(
  {
    title: String,
    desc: String,
    date: { type: Date, default: Date.now() },
    img: Array,
    // file: Array,
    file_url: String,
    attachment: String,
    liked: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    userId: {
      type: String,
      required: true,
    },
    // username: {
    //   type: String,
    //   required: true,
    // },
    postNumber: Number,
    category: String,
  },
  { versionKey: false }
)
postSchema.index({ title: "text", content: "text" })

const Post = mongoose.model("Post", postSchema)

// //------------------------------------- method ---------------------------------------//

//------------------------------------- 전체 게시글 ---------------------------------------//

export async function getAllPost() {
  return Post.find().sort({ createdAt: -1 })
}

//------------------------------------- 선택한 게시글 ---------------------------------------//

export async function getById(id) {
  return Post.findById(id)
}
export async function getByPostnumber(postNumber) {
  return Post.findOne({ postNumber: postNumber })
}

//------------------------------------- 게시글 작성 ---------------------------------------//

export async function createPost(
  title,
  desc,
  file_url,
  attachment,
  category,
  userId
) {
  // return userRepository.findById(userId).then((user) =>
  db.collection("counter").findOne({ name: "postNumber" }, (err, data) => {
    const postNumber = data.postNumber
    new Post({
      title: title,
      desc: desc,
      file_url: file_url,
      attachment: attachment,
      userId: userId,
      postNumber: postNumber,
      category: category,
    }).save()

    db.collection("counter").updateOne(
      { name: "postNumber" },
      { $inc: { postNumber: 1 } }
    )
  })
}
// }

//------------------------------------- 게시글 수정 ---------------------------------------//

export async function updatePost(postNumber, title, desc, img, file) {
  return Post.findOneAndUpdate(
    { postNumber: postNumber },
    { title, desc, img, file },
    { returnOriginal: false }
  )
}

//------------------------------------- 게시글 삭제 ---------------------------------------//

export async function deletePost(id) {
  return Post.findByIdAndDelete(id)
}

//------------------------------------- 게시글 검색 ---------------------------------------//
export async function searchPost(options) {
  return Post.find({ $or: options })
}

export async function searchInCategory(category, options) {
  const categoryPost = Post.find({ category: category })
  return categoryPost.find({ $or: options })
}

export async function getByusername(username) {
  return Post.find({ username: username }).sort({ createdAt: -1 })
}

//------------------------------------- 좋아요 기능 ---------------------------------------//

export async function postLike(id) {
  return Post.findByIdAndUpdate(id, { $inc: { liked: 1 } })
}

export async function postView(postNumber) {
  return Post.findOneAndUpdate(
    { postNumber: postNumber },
    { $inc: { views: 1 } }
  )
}

//------------------------------------- 카테고리 게시글 가져오기 ---------------------------------------//

export async function getCategory(category) {
  return Post.find({ category: category }).sort({ createdAt: -1 })
}

export async function nextPost(postNumber, category) {
  const data = Post.find({ category: category })
  return data
    .find({ postNumber: { $gt: postNumber } })
    .sort({ date: -1 })
    .limit(1)
}

export async function prevPost(postNumber, category) {
  const data = Post.find({ category: category })
  return data
    .find({ postNumber: { $lt: postNumber } })
    .sort({ date: -1 })
    .limit(1)
}
