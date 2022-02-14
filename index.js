//---------------------------- import --------------------------------//

import express from "express"
import postRouter from "./router/post.js"
import commentRouter from "./router/comment.js"
import userRouter from "./router/user.js"
import { connectDB } from "./database/database.js"
import { config } from "./config.js"
import cors from "cors"
import helmet from "helmet"
import mypageRouter from "./router/mypage.js"

//---------------------------- middleware --------------------------------//

const app = express()
app.use(cors())
app.use(express.json())
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
