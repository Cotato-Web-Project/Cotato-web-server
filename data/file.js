import mongoose from "mongoose"

const fileSchema = new mongoose.Schema({
  originalFileName: String,
  serverFileName: String,
  size: Number,
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  isDeleted: { type: Boolean, default: false },
})

const File = mongoose.model("File", fileSchema)

export async function createNewInstance(file, post) {
  return await File.create({
    originalFileName: file.originalname,
    serverFileName: file.filename,
    size: file.size,
    post: post,
  })
}
