import mongoose from "mongoose"

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, trim: true, unique: 1, required: true },
  password: { type: String, minlength: 4, required: true },
  username: { type: String, required: true },
})

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

export async function editInfo(id, email, password, username) {
  return User.findByIdAndUpdate(
    id,
    { email, password, username },
    {
      returnOriginal: false,
    }
  )
}
