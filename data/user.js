import mongoose from "mongoose"

const userSchema = mongoose.Schema({
  name: String,
  email: { type: String, trim: true, unique: 1 },
  password: { type: String, minlength: 4 },
  token: { type: String },
  tokenExp: { type: Number },
})

const User = mongoose.model("User", userSchema)

export async function register(name, email, password, token, tokenExp) {
  return new User({
    name: name,
    email: email,
    password: password,
    token: token,
    tokenExp: tokenExp,
  }).save()
}
