import express from "express"
import * as postController from "../controller/post.js"
import { upload } from "../database/storage.js"

const router = express.Router()
router.get("/search", postController.searchPosts)
router.get("/", postController.getAllPosts)
router.get("/:id", postController.getPost)
router.post(
  "/createPost",
  upload.fields([{ name: "image" }, { name: "file" }]),
  postController.createPost
)
router.put("/updatePost/:id", postController.updatePost)
router.delete("/deletePost/:id", postController.deletePost)

export default router
