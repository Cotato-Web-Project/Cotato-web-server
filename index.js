//---------------------------- import --------------------------------//

import express from "express"
import postRouter from "./router/post.js"
import commentRouter from "./router/comment.js"
import userRouter from "./router/user.js"
import { connectDB } from "./database/database.js"
import { config } from "./config.js"
import cors from "cors"

//---------------------------- middleware --------------------------------//

const app = express()
app.use(cors())
app.use(express.json())
app.use("/", postRouter)
app.use("/board", commentRouter)
app.use("/users", userRouter)

//---------------------------- server listen --------------------------------//
connectDB()
  .then(() => {
    app.listen(config.port.port, () => {
      console.log(`Server is running`)
    })
  })
  .catch(console.error)
