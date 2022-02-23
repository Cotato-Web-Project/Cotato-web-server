//------------------------------------- import ---------------------------------------//

import express from "express"
import * as commentController from "../controller/comment.js"
import { isAuth } from "../middleware/auth.js"

//------------------------------------- router ---------------------------------------//

const router = express.Router()

router.post("/:id/replyComment",  commentController.createReplyComment)
router.post("/:id/createComment",  commentController.createComment)
router.get("/:id/getComments", commentController.getComments)
router.get("/:id/getComment",  commentController.getComment)
router.put("/:id/updateComment",  commentController.updateComment)
router.put("/:id/deleteComment",  commentController.deleteComment)
router.put("/:id/commentLike",  commentController.commentLike)

export default router
