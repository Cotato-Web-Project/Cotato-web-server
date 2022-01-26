import express from "express"
import multer from "multer"
import fs from "fs"
import path from "path"

const app = express()
app.use("/uploads", express.static("uploads"))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads")
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

export const upload = multer({ storage: storage })
