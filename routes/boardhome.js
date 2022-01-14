const express = require("express")
const router = express.Router()
const posts = require("../models/post")

//게시판 첫 페이지
router.get("/", (req, res, next) => {
  res.send("게시판 홈페이지")
})

//게시글 등록 API(createPost)
router.post("/", (req, res, next) => {
  const { title, content, postid } = req.body.data.post
  console.log(req.body)

  const postModel = new posts()
  postModel.title = title
  postModel.content = content
  postModel.postid = postid

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

//게시글로 들어가는 요청 API(toPost)
router.get("/:id", (req, res) => {
  posts.findOne({ postid: parseInt(req.params.id) }, (err, post) => {
    if (err) return res.json(err)
    res.send(post)
  })
})

module.exports = router
