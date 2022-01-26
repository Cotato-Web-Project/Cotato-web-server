//---------------------------- import --------------------------------//

import express from "express"
import * as postController from "../controller/post.js"

//------------------------------------- router ---------------------------------------//

const router = express.Router()
router.get("/search", postController.searchPosts)
router.get("/", postController.getAllPosts)
router.get("/:id", postController.getPost)
router.post("/createPost", postController.createPost)
router.put("/updatePost/:id", postController.updatePost)
router.delete("/deletePost/:id", postController.deletePost)

export default router
