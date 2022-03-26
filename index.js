//---------------------------- import --------------------------------//

import express from "express"
import postRouter from "./router/post.js"
import commentRouter from "./router/comment.js"
import userRouter from "./router/user.js"
import { connectDB } from "./database/database.js"
import { config } from "./config.js"
import helmet from "helmet"
import mypageRouter from "./router/mypage.js"
import cors from "cors"
import multer from "multer"
import path from "path"
import * as Files from "./data/file.js"

//---------------------------- middleware --------------------------------//
const __dirname = path.resolve()
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname + "/public")))
app.use(helmet())

app.use("/cotato", postRouter)
app.use("/comment", commentRouter)
app.use("/users", userRouter)
app.use("/mypage", mypageRouter)

//---------------------------- multer --------------------------------//

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "public/uploads")
    },

    filename(req, file, cb) {
      const ext = path.extname(file.originalname)
      console.log("file.originalname", file.originalname)

      cb(null, path.basename(file.originalname, ext) + Date.now() + ext)
    },
  }),
})

//----------------------------- Uploads ------------------------------//

app.post("/cotato/img", upload.single("img"), (req, res) => {
  console.log("전달받은 파일", req.file)
  console.log("저장된 파일의 이름", req.file.filename)

  const IMG_URL = `http://localhost:8080/uploads/${req.file.filename}`
  console.log(IMG_URL)
  res.json({ url: IMG_URL })
})

app.post("/cotato/attachment", upload.array("attachment"), async (req, res) => {
  const data = req.files
  const filenames = []
  const originalnames = []
  console.log("전달받은 파일", data)
  data.forEach((e) => {
    console.log("저장된 파일 이름 ", e.filename)
    filenames.push(e.filename)
    originalnames.push(e.originalname)
    Files.createNewInstance(e)
  })

  res.json({ attachmentName: filenames, originalname: originalnames })
})

app.get("/public/uploads/:filename", (req, res) => {
  const filename = req.params.filename
  res.download("./public/uploads/" + filename)
})

//----------------------------- server listen ------------------------------//

connectDB()
  .then(() => {
    app.listen(config.port.port, () => {
      console.log(`Server is running`)
    })
  })
  .catch(console.error)
