//------------------------------------- import---------------------------------------//

import express from "express"
import multer from "multer"
import path from "path"

//import { upload } from "../database/storage.js"

//------------------------------------- middleware ---------------------------------------//

//------------------------------------- storage setting ---------------------------------------//
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public/uploads")
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname)
    cb(null, path.basename(file.originalname, ext) + Date.now() + ext)

    // const ext = path.extname(file.originalname)
    // const filename = path.basename(file.originalname, ext) + Date.now() + ext

    // console.log(req.body)
    // req.body.file = filename
    // cb(null, filename)
  },
})

export const upload = multer({ storage: storage })
