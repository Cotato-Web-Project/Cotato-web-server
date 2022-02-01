import * as userRepository from "../data/user"
import * as Posts from "../data/post.js"

async function recentPost(userId) {
  return await Posts.find({ userId: userId })
}

const post = recentPost(req.params.id)

import express from "express"
const router = express.Router()
