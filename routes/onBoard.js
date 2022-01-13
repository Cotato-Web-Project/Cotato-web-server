const express = require("express")
const postController = require("../controller/post.js")
const router = express.Router()

router.get("/", (req, res, next) => {
  res.send("onBoard 홈페이지")
})
