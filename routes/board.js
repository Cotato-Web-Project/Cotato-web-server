const express = require("express")
const router = express.Router()

router.get("/", (req, res, next) => {
  res.send("게시판 홈페이지")
})

module.exports = router
