const express = require("express")
const app = express()
const port = 3000
const bodyParser = require("body-parser")
const router = require("express").Router()
const config = require("./config/key")
const boardRouter = require("./routes/boardhome")
const updateRouter = require("./routes/postupdate")
const writeRouter = require("./routes/postwrite")
const onboardRouter = require("./routes/onBoard")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use("/board", boardRouter)
app.use("/board/:id", onboardRouter)
app.use("/update", updateRouter)
app.use("/write", writeRouter)

const mongoose = require("mongoose")
const req = require("express/lib/request")

let db = mongoose.connection
db.on("error", console.error)
db.once("open", function () {
  console.log("Connected to mongodb server")
})

mongoose
  .connect(config.mongoURI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
