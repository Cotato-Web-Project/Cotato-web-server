//---------------------------- import --------------------------------//

import express from "express"
import postRouter from "./router/post.js"
import commentRouter from "./router/comment.js"
import userRouter from "./router/user.js"
import { connectDB } from "./database/database.js"
import { config } from "./config.js"
//import cors from "cors"
import helmet from "helmet"
import mypageRouter from "./router/mypage.js"
import cors from "cors"
import multer from "multer"
import path from "path"

//---------------------------- middleware --------------------------------//
const __dirname = path.resolve()
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded())

app.use(express.static(path.join(__dirname + "/public")))
app.use(helmet())

app.use("/cotato", postRouter)
app.use("/comment", commentRouter)
app.use("/users", userRouter)
app.use("/mypage", mypageRouter)

//---------------------------- server listen --------------------------------//

const upload = multer({
  storage: multer.diskStorage({
    // 저장할 장소
    destination(req, file, cb) {
      cb(null, "public/uploads")
    },
    // 저장할 이미지의 파일명
    filename(req, file, cb) {
      const ext = path.extname(file.originalname) // 파일의 확장자
      console.log("file.originalname", file.originalname)
      // 파일명이 절대 겹치지 않도록 해줘야한다.
      // 파일이름 + 현재시간밀리초 + 파일확장자명
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext)
    },
  }),
  // limits: { fileSize: 5 * 1024 * 1024 } // 파일 크기 제한
})

app.post("/cotato/img", upload.single("img"), (req, res) => {
  // 해당 라우터가 정상적으로 작동하면 public/uploads에 이미지가 업로드된다.
  // 업로드된 이미지의 URL 경로를 프론트엔드로 반환한다.
  console.log("전달받은 파일", req.file)
  console.log("저장된 파일의 이름", req.file.filename)

  // 파일이 저장된 경로를 클라이언트에게 반환해준다.
  const IMG_URL = `http://localhost:8080/uploads/${req.file.filename}`
  console.log(IMG_URL)
  res.json({ url: IMG_URL })
})
app.post("/cotato/files", upload.array("upload_file"), (req, res) => {
  // 해당 라우터가 정상적으로 작동하면 public/uploads에 이미지가 업로드된다.
  // 업로드된 이미지의 URL 경로를 프론트엔드로 반환한다.
  const file_URL = []
  req.files.forEach((e) => {
    console.log(e)
    file_URL.push(e)
  })
  file_URL.push(`http://localhost:8080/uploads/${req.files.filename}`)
  res.json(file_URL)
})

connectDB()
  .then(() => {
    app.listen(config.port.port, () => {
      console.log(`Server is running`)
    })
  })
  .catch(console.error)
