import mongoose from "mongoose"
import { useVirtualId } from "../database/database.js"

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, trim: true, unique: 1, required: true },
  password: { type: String, minlength: 4, required: true },
  username: { type: String, required: true },
})

useVirtualId(userSchema)

const User = mongoose.model("User", userSchema)

export async function findByUsername(username) {
  return User.findOne({ username })
}

export async function findById(id) {
  return User.findById(id)
}

export async function createUser(user) {
  return new User(user).save().then((data) => data.id)
}
