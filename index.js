const express = require("express")
const app = express()
const port = 3000
const bodyParser = require("body-parser")
const config = require("./config/key")
const posts = require("./models/post")
// const boardRouter = require("./routes/boardhome")
// const updateRouter = require("./routes/postupdate")
// const writeRouter = require("./routes/postwrite")
// const onboardRouter = require("./routes/onBoard")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// app.use("/board", boardRouter)
// app.use("/board/:id", onboardRouter)
// app.use("/update", updateRouter)
// app.use("/write", writeRouter)

const mongoose = require("mongoose")
const req = require("express/lib/request")

let db = mongoose.connection
db.on("error", console.error)
db.once("open", function () {
  console.log("Connected to mongodb server")
})

mongoose
  .connect(config.mongoURI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//게시글 모두 가져오기 API (getAllpost)
app.get("/board", function (req, res) {
  posts.find({}, function (err, posts) {
    if (err) return res.json(err)
    res.send(posts)
  })
})

//게시글 등록 API(createPost)
app.post("/board/create", (req, res, next) => {
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

//게시판 검색 기능
app.get("/board/search", async (req, res) => {
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
  console.log(options)
  posts.find({ $or: options }, (err, result) => {
    res.json(result)
  })
})

// 선택된 게시글 정보를 불러오는 요청 API(toPost)
app.get("/board/:id", (req, res) => {
  posts.findOne({ postid: parseInt(req.params.id) }, (err, post) => {
    if (err) return res.json(err)
    res.send(post)
  })
})

//게시글 삭제 API(deletePost)
app.delete("/board/:id", (req, res) => {
  posts.deleteOne({ postid: parseInt(req.params.id) }, (err, post) => {
    if (err) return res.json(err)
    res.redirect("/board")
  })
})
