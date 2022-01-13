const express = require("express")
const router = express.Router()
const posts = require("../models/post")

router.get("/", (req, res, next) => {
  res.send("게시판 홈페이지")
})
router.post("/", (req, res, next) => {
  const { title, content } = req.body
  console.log(req.body)

  const postModel = new posts()
  postModel.title = title
  postModel.content = content

  postModel
    .save()
    .then((newPost) => {
      console.log("Create 완료")
      res.status(200).json({
        message: "Create success",
        data: {
          post: newPost,
        },
      })
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      })
    })
})

module.exports = router
