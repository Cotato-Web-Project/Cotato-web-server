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
  posts.findOne({ id: parseInt(req.params.id) }, (err, post) => {
    if (err) return res.json(err)
    res.render("updatePost.ejs", { item: post })
  })
})

//게시글 등록 ( 이미지 추가 )
app.post("/createPost", upload.single("image"), (req, res, next) => {
  db.collection("counter").findOne({ name: "게시물갯수" }, (err, result) => {
    console.log(req)
    if (!req.file) {
      var obj = {
        title: req.body.title,
        desc: req.body.desc,
<<<<<<< HEAD
<<<<<<< Updated upstream
        _id: id,
=======
        id: req.body.id,
>>>>>>> Stashed changes
=======
        id: id,
>>>>>>> f61f4f93a55c0ef05c5f61cc6db0aac7117b4c78
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
<<<<<<< HEAD
<<<<<<< Updated upstream
        _id: id,
=======
        id: req.body.id,
>>>>>>> Stashed changes
=======
        id: id,
>>>>>>> f61f4f93a55c0ef05c5f61cc6db0aac7117b4c78
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

// 선택된 게시글 정보를 불러오는 요청 API(toPost)
app.get("/:id", (req, res) => {
  Promise.all([
    posts.findOne({ id: parseInt(req.params.id) }),
    comment.find({ post: req.body._id }).sort("createdAt"),
  ]).then(([post, comment]) => {
    res.render("selected.ejs", { item: post, comment: comment })
  })
})

//게시글 삭제 API(deletePost)
app.delete("/deletePost", (req, res) => {
  posts.deleteOne({ id: parseInt(req.body.id) }, (err, post) => {
    console.log(req.body.id)
    if (err) return res.send(err)
    res.redirect("/")
  })
})

//게시글 수정(updatePost)
app.post("/updatePost/:id", upload.single("image"), (req, res) => {
  if (req.file) {
    posts.updateOne(
      { id: parseInt(req.params.id) },
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
          id: parseInt(req.params.id),
        },
      },
      (err, post) => {
        if (err) return res.json(err)
        res.redirect("/" + req.params.id)
      }
    )
  } else {
    posts.updateOne(
      { id: parseInt(req.params.id) },
      {
        $set: {
          title: req.body.title,
          desc: req.body.desc,
          date: req.body.date,
        },
      },
      (err, post) => {
        if (err) return res.json(err)
        res.redirect("/" + req.params.id)
      }
    )
  }
})

//댓글 등록
app.post("/createComment/:id", (req, res) => {
  // 1
  obj = {
    post: req.body._id,
    idDeleted: false,
    text: req.body.comment,
  }
  comment.create(obj, function (err, comment) {
    if (err) {
      return console.error(err)
    }
  })
})
<<<<<<< HEAD

<<<<<<< Updated upstream
//게시글 수정(updatePost)
app.post("/updatePost/:id", upload.single("image"), (req, res) => {
  posts.updateOne(
    { _id: parseInt(req.params.id) },
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
        _id: req.params.id,
      },
    },
    (err, post) => {
      if (err) return res.json(err)
      res.redirect("/" + req.params.id)
    }
  )
})
=======
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

app.get("/board/:id/updatePage", (req, res) => {
  comment.findById(req.params.id, (err, result) => {
    if (err) return res.send(err)
    res.render("updateComment", { item: result })
  })
})

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

app.post("/board/:id/replyComment", (req, res) => {
  comment.findOne({ _id: req.params.id }, (err, result) => {
    const comment_obj = new comment({
      post: result.post,
      parentComment: req.params.id,
      isDeleted: false,
      text: req.body.comment,
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
>>>>>>> Stashed changes
=======
>>>>>>> f61f4f93a55c0ef05c5f61cc6db0aac7117b4c78
