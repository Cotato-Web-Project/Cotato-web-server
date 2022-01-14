const express = require("express")
const res = require("express/lib/response")
const router = express.Router()
const posts = require("../models/post")

//게시판 첫 페이지
router.get("/", (req, res, next) => {
  res.send("게시판 홈페이지")
})

//게시글 등록 API(createPost)
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

// 선택된 게시글 정보를 불러오는 요청 API(toPost)
router.get("/:id", (req, res) => {
  posts.findOne({ postid: parseInt(req.params.id) }, (err, post) => {
    if (err) return res.json(err)
    res.send(post)
  })
})

//게시판 검색 기능
router.get("/searchpost", async (req, res) => {
  let options = []
  if (req.query.option == "title") {
    options = [{ title: new RegExp(req.query.content) }]
  } else if (req.query.option == "content") {
    options = [{ content: new RegExp(req.query.content) }]
  } else if (req.query.option == "title+content") {
    options = [
      { title: new RegExp(req.query.content) },
      { content: new RegExp(req.query.content) },
    ]
  } else {
    const err = new Error("검색 옵션이 없습니다.")
    err.status = 400
    throw err
  }
  const post = await posts.find({ $or: options })
  return post
})

module.exports = router
