import express from "express"
import * as userController from "../controller/user.js"

const router = express.Router()
router.post("/register", userController.register)

export default router
