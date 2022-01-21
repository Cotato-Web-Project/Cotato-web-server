const express = require("express")
const app = express()
const port = 3000
const bodyParser = require("body-parser")
const config = require("./config/key")
const posts = require("./models/post")
const comment = require("./models/comment")
const fs = require("fs")
const path = require("path")
const multer = require("multer")

require("dotenv/config")
app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const mongoose = require("mongoose")

let db = mongoose.connection

db.on("error", console.error)
db.once("open", function () {
  console.log("Connected to mongodb server")
})

mongoose
  .connect(config.mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//img
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads")
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + Date.now() + ".jpg")
  },
})

const upload = multer({ storage: storage })

//=================================| API |==================================//

// 홈화면 API (getAllpost)
app.get("/", (req, res) => {
  posts.find({}, function (err, posts) {
    if (err) return res.json(err)
    res.render("boardhome.ejs", { items: posts })
  })
})

//글쓰기 화면 API
app.get("/createPost", (req, res) => {
  posts.find({}, function (err, posts) {
    if (err) return res.json(err)
    res.render("createPost.ejs", { items: posts })
  })
})

//글수정 화면 API
app.get("/updatePost/:id", function (req, res) {
  posts.findById(req.params.id, (err, post) => {
    if (err) return res.json(err)
    res.render("updatePost.ejs", { item: post })
  })
})

//게시글 등록 ( 이미지 추가 )
app.post("/createPost", upload.single("image"), (req, res, next) => {
  db.collection("counter").findOne({ name: "게시물갯수" }, (err, result) => {
    const id = result.totalPost
    if (!req.file) {
      var obj = {
        title: req.body.title,
        desc: req.body.desc,
        id: id,
      }
    } else {
      var obj = {
        title: req.body.title,
        desc: req.body.desc,
        img: {
          data: fs.readFileSync(
            path.join(__dirname + "/uploads/" + req.file.filename)
          ),
          contentType: "image/png",
        },
        id: id,
      }
    }

    posts.create(obj, (err, item) => {
      if (err) {
        console.log(err)
      } else {
        item.save()
        res.redirect("/")
      }
    })
    db.collection("counter").updateOne(
      { name: "게시물갯수" },
      { $inc: { totalPost: 1 } }
    )
  })
})

//게시판 검색 기능
app.get("/search", async (req, res) => {
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
    res.render("searched.ejs", { item: result })
  })
})

// 선택된 게시글 정보를 불러오는 요청 API(toPost)
app.get("/board/:id", (req, res, next) => {
  Promise.all([
    posts.findById(req.params.id),
    comment.find({ post: req.params.id }).sort("createdAt"),
  ]).then(([post, comment]) => {
    res.render("selected.ejs", { item: post, comment: comment })
  })
})

//게시글 삭제 API(deletePost)
app.delete("/deletePost", (req, res) => {
  posts.findByIdAndDelete(req.body.id, (err, post) => {
    console.log(req.body.id)
    if (err) return res.send(err)
    res.redirect("/")
  })
})

//게시글 수정(updatePost)
app.post("/updatePost/:id", upload.single("image"), (req, res) => {
  if (req.file) {
    posts.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          desc: req.body.desc,
          date: req.body.date,
          img: {
            data: fs.readFileSync(
              path.join(__dirname + "/uploads/" + req.file.filename)
            ),
            contentType: "image/png",
          },
          id: req.params.id,
        },
      },
      (err, post) => {
        if (err) return res.json(err)
        res.redirect("/board/" + req.params.id)
      }
    )
  } else {
    posts.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          desc: req.body.desc,
          date: req.body.date,
        },
      },
      (err, post) => {
        if (err) return res.json(err)
        res.redirect("/board/" + req.params.id)
      }
    )
  }
})

//댓글 등록
app.post("/board/:id/createComment", (req, res) => {
  // 1
  const comment_obj = new comment({
    post: req.params.id,
    idDeleted: false,
    text: req.body.comment,
  })

  comment.create(comment_obj, function (err, comment) {
    if (err) {
      console.error(err)
    } else {
      res.redirect("/board/" + req.params.id)
    }
  })
})
