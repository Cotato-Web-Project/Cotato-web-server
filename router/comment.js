//------------------------------------- import ---------------------------------------//

import express from "express"
import * as commentController from "../controller/comment.js"

//------------------------------------- router ---------------------------------------//

const router = express.Router()
router.post("/:id/replyComment", commentController.createReplyComment)
router.post("/:id/createComment", commentController.createComment)
router.get("/:id/comment", commentController.getComment)
router.put("/:id/updateComment", commentController.updateComment)
router.put("/:id/deleteComment", commentController.deleteComment)

export default router
