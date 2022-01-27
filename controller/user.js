import * as userRepository from "../data/user.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { config } from "../config.js"

export async function signup(req, res) {
  const { username, password, name, email } = req.body
  const found = await userRepository.findByUsername(username)
  if (found) {
    return res.status(409).json({ message: `${username} already exists` })
  }
  const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds)
  const userId = await userRepository.createUser({
    username,
    password: hashed,
    name,
    email,
  })
  const token = createJwtToken(userId)
  res.status(201).json({ token, username })
}

export async function login(req, res) {
  const { username, password } = req.body
  const user = await userRepository.findByUsername(username)
  if (!user) {
    return res.status(401).json({ message: "Invalid user or password" })
  }
  const isValidPassword = await bcrypt.compare(password, user.password)
  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid user or password" })
  }
  const token = createJwtToken(user.id)
  res.status(200).json({ token, username })
}

function createJwtToken(id) {
  return jwt.sign({ id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  }) // {토큰에 넣을 데이터, 비밀키, 옵션, 콜백함수}
}