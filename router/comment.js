//--------------------------------- import -----------------------------------//

import express from "express"
import * as commentController from "../controller/comment.js"
import { isAuth } from "../middleware/auth.js"

//---------------------------------- router ------------------------------------//

const router = express.Router()

router.post("/:id/replyComment", isAuth, commentController.createReplyComment)
router.post("/:id/createComment", commentController.createComment)
router.get("/:id/getComments", commentController.getComments)
router.get("/:id/getComment", commentController.getComment)
router.put("/:id/updateComment", isAuth, commentController.updateComment)
router.put("/:id/deleteComment", isAuth, commentController.deleteComment)

export default router
