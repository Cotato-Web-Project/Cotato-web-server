const express = require("express")
const router = express.Router()
const posts = require("../models/post")

//선택된 게시글을 보여주는 페이지
router.get("/", (req, res, next) => {
  res.send("onBoard 홈페이지")
})

//게시글 등록 API(createPost) -> control폴더 만들어서 따로 보관해야함.
router.post("/create", (req, res, next) => {
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

//선택된 게시글 정보 요청 API(toPost) -> control폴더 만들어서 따로 보관해야함.
router.get("/", (req, res) => {
  posts.findOne({ postid: parseInt(req.params.id) }, (err, post) => {
    if (err) return res.json(err)
    res.send(post)
  })
})

module.exports = router
