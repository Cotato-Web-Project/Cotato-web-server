const express = require("express")
const app = express()
const port = 3001
const bodyParser = require("body-parser")
const config = require("./config/key")
const posts = require("./models/post")
const comment = require("./models/comment")
const fs = require("fs")
const path = require("path")
const multer = require("multer")

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use("/uploads", express.static("uploads"))

//=================================| Mongoose |==================================//

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

//=================================| IMG |==================================//

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads")
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })

//=================================| API |==================================//

// 홈화면 (getAllpost)
app.get("/", (req, res) => {
  posts.find({}, function (err, posts) {
    if (err) return res.json(err)
    res.render("boardhome.ejs", { items: posts })
  })
})

//글쓰기 화면
app.get("/createPost", (req, res) => {
  posts.find({}, function (err, posts) {
    if (err) return res.json(err)
    res.render("createPost.ejs", { items: posts })
  })
})

//글수정 화면
app.get("/updatePost/:id", function (req, res) {
  posts.findById(req.params.id, (err, post) => {
    if (err) return res.json(err)
    res.render("updatePost.ejs", { item: post })
  })
})

//게시글 등록 ( 이미지 추가 )
app.post(
  "/createPost",
  upload.fields([{ name: "image" }, { name: "file" }]),
  (req, res) => {
    console.log(req.files)
    Promise.all([
      req.files.image
        ? {
            data: fs.readFileSync(
              path.join(
                __dirname + "/uploads/" + req.files.image[0].originalname
              )
            ),
            contentType: "image/png",
          }
        : undefined,
      req.files.file
        ? {
            originalFileName: req.files.file[0].originalname,
            serverFileName: req.files.file[0].filename,
            size: req.files.file[0].size,
            //   uploadedBy: {
            //     type: mongoose.Schema.Types.ObjectId,
            //     ref: "user",
            //     required: true,
            //   },
            postId: req.body._id,
          }
        : undefined,
    ]).then(([img, file]) => {
      let obj = {
        title: req.body.title,
        desc: req.body.desc,
        img: img,
        id: req.body._id,
        file: file,
      }
      posts.create(obj, (err, item) => {
        if (err) {
          console.log(err)
        } else {
          item.save()
          res.redirect("/")
        }
      })
    })
  }
)

//게시판 검색
app.get("/search", async (req, res) => {
  let options = []
  if (req.query.option == "title") {
    options = [{ title: new RegExp(req.query.content) }]
  } else if (req.query.option == "content") {
    options = [{ desc: new RegExp(req.query.content) }]
  } else if (req.query.option == "title+content") {
    options = [
      { title: new RegExp(req.query.content) },
      { desc: new RegExp(req.query.content) },
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

// 선택된 게시글 정보를 불러오는 요청(toPost)
app.get("/board/:id", (req, res) => {
  Promise.all([
    posts.findById(req.params.id),
    comment.find({ post: req.params.id }).sort("createdAt"),
  ]).then(([post, comment]) => {
    post.views++
    post.save()
    res.render("selected.ejs", {
      item: post,
      comment: comment,
    })
  })
})

//게시글 삭제(deletePost)
app.delete("/deletePost", (req, res) => {
  posts.findByIdAndDelete(req.body.id, (err, post) => {
    if (err) return res.send(err)
    res.redirect("/")
  })
})

//게시글 수정(updatePost)
app.post(
  "/updatePost/:id",
  upload.fields([{ name: "image" }, { name: "file" }]),
  (req, res) => {
    console.log(req.files)
    Promise.all([
      req.files.image
        ? {
            data: fs.readFileSync(
              path.join(
                __dirname + "/uploads/" + req.files.image[0].originalname
              )
            ),
            contentType: "image/png",
          }
        : undefined,
      req.files.file
        ? {
            originalFileName: req.files.file[0].originalname,
            serverFileName: req.files.file[0].filename,
            size: req.files.file[0].size,
            //   uploadedBy: {
            //     type: mongoose.Schema.Types.ObjectId,
            //     ref: "user",
            //     required: true,
            //   },
            postId: req.body._id,
          }
        : undefined,
    ]).then(([img, file]) => {
      posts.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            title: req.body.title,
            desc: req.body.desc,
            img: img,
            file: file,
          },
        },
        (err, post) => {
          if (err) return res.json(err)
          res.redirect("/board/" + req.params.id)
        }
      )
    })
  }
)

//댓글등록
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

//댓글(대댓글)삭제
app.get("/board/:id/deleteComment", (req, res) => {
  comment.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        isDeleted: true,
      },
    },
    (err, result) => {
      if (err) return res.send(err)
      res.redirect("/board/" + result.post)
    }
  )
})

//댓글(대댓글) 수정 페이지 ( 임시 )
app.get("/board/:id/updatePage", (req, res) => {
  comment.findById(req.params.id, (err, result) => {
    if (err) return res.send(err)
    res.render("updateComment", { item: result })
  })
})

//댓글(대댓글) 수정
app.post("/board/:id/updateComment", (req, res) => {
  comment.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        text: req.body.comment,
      },
    },
    (err, result) => {
      if (err) return res.send(err)
      res.redirect("/board/" + result.post)
    }
  )
})

//대댓글 작성
app.post("/board/:id/replyComment", (req, res) => {
  comment.findOne({ _id: req.params.id }, (err, result) => {
    const comment_obj = new comment({
      post: result.post,
      parentComment: req.params.id,
      isDeleted: false,
      text: req.body.comment,
      depth: result.depth + 1,
    })
    comment.create(comment_obj, function (err, comment) {
      if (err) {
        console.error(err)
      } else {
        res.redirect("/board/" + result.post)
      }
    })
  })
})

app.get("/board/:id/comment", (req, res) => {
  Promise(comment.find({ post: req.params.id }).sort("createdAt")).then(
    (comment) => {
      res.send(comment)
    }
  )
})

app.get("/board/like/:id", (req, res) => {
  posts.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $inc: {
        liked: 1,
      },
    },
    (err, result) => {
      res.redirect("/board/" + req.params.id)
    }
  )
})

app.get("/comment/like/:id", (req, res) => {
  comment.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $inc: {
        liked: 1,
      },
    },
    (err, result) => {
      res.redirect("/board/" + result.post)
    }
  )
})
