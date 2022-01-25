import express from "express"
import postRouter from "./router/post.js"
import commentRouter from "./router/comment.js"
import { connectDB } from "./database/database.js"
import { config } from "./config.js"

const app = express()

app.use(express.json())

app.use("/", postRouter)
app.use("/board", commentRouter)

connectDB()
  .then(() => {
    app.listen(config.port.port, () => {
      console.log(`Server is running`)
    })
  })
  .catch(console.error)
