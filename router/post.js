//---------------------------- import --------------------------------//

import express from "express"
import * as postController from "../controller/post.js"
import { isAuth } from "../middleware/auth.js"

//------------------------------------- router ---------------------------------------//

const router = express.Router()

router.get("/search", isAuth, postController.searchPosts)
router.get("/getAll", isAuth, postController.getAllPosts)
router.get("/:category", isAuth, postController.getCategory)
router.get("/:category/:postNumber", isAuth, postController.getPostbyNumber)
// router.get("/:id", postController.getPost)
router.get("/:category/search", isAuth, postController.searchInCategory)
router.post("/:category/createPost", isAuth, postController.createPost)
router.delete("/deletePost/:id", isAuth, postController.deletePost)
router.put("/updatePost/:id", isAuth, postController.updatePost)
router.put("/postLike/:id", isAuth, postController.postLike)
// router.post("/img", postController.img)
router.get("/:category/:postNumber/nextPost", isAuth, postController.nextPost)
router.get("/:category/:postNumber/prevPost", isAuth, postController.prevPost)

export default router

//공지사항, 정기모임, IT이슈, 스터디, 프로젝트, 소모임, 번개, 자유, 정보공유
