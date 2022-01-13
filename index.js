const express = require("express")
const app = express()
const port = 3000
const bodyParser = require("body-parser")

const config = require("./config/key")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const mongoose = require("mongoose")
const { json } = require("body-parser")
mongoose
  .connect(config.mongoURI, {})
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err))

app.get("/", (req, res) => res.send("우와!"))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
