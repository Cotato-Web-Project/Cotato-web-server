//------------------------------------- import---------------------------------------//
import express from "express"
import multer from "multer"
import path from "path"

//------------------------------------- middleware ---------------------------------------//

const __dirname = path.resolve()
const app = express()
app.use(express.static(path.join(__dirname + "/public")))

//------------------------------------- storage setting ---------------------------------------//

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads")
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, path.basename(file.originalname, ext) + Date.now() + ext)
  },
})

export const upload = multer({ storage: storage })
