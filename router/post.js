//---------------------------- import --------------------------------//

import express from "express"
import * as postController from "../controller/post.js"
import { isAuth } from "../middleware/auth.js"

//------------------------------------- router ---------------------------------------//

const router = express.Router()
router.get("/search", postController.searchPosts)
router.get("/", postController.getAllPosts)
router.get("/:id", postController.getPost)
router.post("/createPost", isAuth, postController.createPost)
router.put("/updatePost/:id", isAuth, postController.updatePost)
router.delete("/deletePost/:id", isAuth, postController.deletePost)

export default router
