import express from "express"
import * as userController from "../controller/user.js"
import { body } from "express-validator"
import { validate } from "../middleware/validator.js"

const router = express.Router()

const validateCredential = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("username should be at least 5 characters"),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("password should be at least 5 characters"),
  validate,
]

const validateSignup = [
  ...validateCredential,
  body("name").notEmpty().withMessage("name is missing"),
  body("email").isEmail().normalizeEmail().withMessage("invalid email"),
  body("url")
    .isURL()
    .withMessage("invalid URL")
    .optional({ nullable: true, checkFalsy: true }),
  validate,
]

router.post("/signup", validateSignup, userController.signup)

router.post("/signin", validateCredential, userController.login)

export default router
