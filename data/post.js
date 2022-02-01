//------------------------------------- import ---------------------------------------//

import mongoose from "mongoose"
import * as userRepository from "./user.js"
import { useVirtualId } from "../database/database.js"

// //------------------------------------- post Schema ---------------------------------------//
let db = mongoose.connection

const postSchema = new mongoose.Schema({
  title: String,
  desc: String,
  date: { type: Date, default: Date.now() },
  img: Array,
  // file: Array,
  liked: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  postnumber: Number,
})
postSchema.index({ title: "text", content: "text" })

useVirtualId(postSchema)

const Post = mongoose.model("Post", postSchema)

// //------------------------------------- method ---------------------------------------//

//------------------------------------- 전체 게시글 ---------------------------------------//

export async function getAllPost() {
  return Post.find().sort({ date: -1 })
}

//------------------------------------- 선택한 게시글 ---------------------------------------//

export async function getById(id) {
  return Post.findById(id)
}

//------------------------------------- 게시글 작성 ---------------------------------------//

export async function createPost(id, title, desc, img, userId) {
  return userRepository.findById(userId).then((user) =>
    new Post({
      title: title,
      desc: desc,
      img: img,
      userId: userId,
      username: user.username,
    }).save()
  )
}

//------------------------------------- 게시글 수정 ---------------------------------------//

export async function updatePost(id, title, desc, img, file) {
  return Post.findByIdAndUpdate(
    id,
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

export async function getByusername(username) {
  return Post.find({ username: username }).sort({ date: -1 })
}
