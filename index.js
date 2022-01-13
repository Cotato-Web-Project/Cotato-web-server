const express = require("express")
const app = express()
const port = 3000
const bodyParser = require("body-parser")
const router = require("express").Router()
const config = require("./config/key")
const boardRouter = require("./routes/board")
const updateRouter = require("./routes/update")
const writeRouter = require("./routes/write")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use("/board", boardRouter)
app.use("/update", updateRouter)
app.use("/write", writeRouter)

const mongoose = require("mongoose")
const req = require("express/lib/request")
// const { json } = require("body-parser")

mongoose
  .connect(config.mongoURI, {})
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err))

app.use((req, res, next) => {
  res.sendStatus(404)
})

app.use((error, req, res, next) => {
  console.error(error)
  res.sendStatus(500)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
