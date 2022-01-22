const mongoose = require("mongoose")

const fileSchema = mongoose.Schema({
  originalFileName: { type: String },
  serverFileName: { type: String },
  size: { type: Number },
  //   uploadedBy: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "user",
  //     required: true,
  //   },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "post" },
  isDeleted: { type: Boolean, default: false },
})

// model & export
const File = mongoose.model("file", fileSchema)

// model methods
File.createNewInstance = async function (file, postId) {
  return await File.create({
    originalFileName: file.originalname,
    serverFileName: file.filename,
    size: file.size,
    postId: postId,
  })
}

module.exports = File
