import express from "express"
import * as getUserController from "../controller/mypage.js"
import { isAuth } from "../middleware/auth.js"

const router = express.Router()

router.get("/getUser", isAuth, getUserController.getUser)

export default router
