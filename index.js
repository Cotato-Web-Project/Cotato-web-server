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

app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname + "/public")))
app.use(helmet())
app.use("/", postRouter)
app.use("/comment", commentRouter)
app.use("/users", userRouter)
app.use("/mypage", mypageRouter)

//---------------------------- server listen --------------------------------//

connectDB()
  .then(() => {
    app.listen(config.port.port, () => {
      console.log(`Server is running`)
    })
  })
  .catch(console.error)
