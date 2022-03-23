//---------------------------- import --------------------------------//

import express from "express"
import * as postController from "../controller/post.js"
import { isAuth } from "../middleware/auth.js"
import { upload } from "../database/storage.js"

//------------------------------------- router ---------------------------------------//

const router = express.Router()
router.get("/favicon.ico", (req, res) => res.status(204))
router.get("/search", postController.searchPosts)
router.get("/getAll", postController.getAllPosts)
router.get("/getLike", postController.getLike)
router.get("/:category", postController.getCategory)
router.get("/:category/:postNumber", postController.getPostbyNumber)
// router.get("/:id", postController.getPost)
router.post(
  "/:category/createPost",
  isAuth,
  // upload.single("attachment"),
  postController.createPost
)
router.get("/:category/search", postController.searchInCategory)
router.delete("/deletePost/:id", isAuth, postController.deletePost)
router.delete("/unLike", isAuth, postController.unLike)
router.put("/updatePost/:id", isAuth, postController.updatePost)
router.post("/upLike", isAuth, postController.upLike)
router.get("/:category/:postNumber/nextPost", postController.nextPost)
router.get("/:category/:postNumber/prevPost", postController.prevPost)

export default router

//공지사항, 정기모임, IT이슈, 스터디, 프로젝트, 소모임, 번개, 자유, 정보공유
