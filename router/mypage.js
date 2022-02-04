import * as postController from "../controller/post.js"
import * as commentController from "../controller/comment.js"
import * as userController from "../controller/user.js"
import { isAuth } from "../middleware/auth.js"
import express from "express"

const router = express.Router()

router.get("/:name/getUser", isAuth, userController.getUser)
router.get("/:name/recentPost", isAuth, postController.getByusername)
router.get("/:name/recentComment", isAuth, commentController.getByusername)

export default router
