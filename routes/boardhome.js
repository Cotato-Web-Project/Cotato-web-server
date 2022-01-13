const express = require("express")
const router = express.Router()
const postController = require("../controller/post")

router.get("/", (req, res, next) => {
  res.send("게시판 홈페이지")
})

module.exports = router
