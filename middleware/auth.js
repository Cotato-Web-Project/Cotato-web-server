import jwt from "jsonwebtoken"
import { config } from "../config.js"
import * as userRepository from "../data/user.js"

export const isAuth = async (req, res, next) => {
  const authHeader = req.get("Authorization")
  console.log(authHeader)
  console.log("하나")
  if (!(authHeader && authHeader.startsWith("Bearer "))) {
    return res.status(401).json({ message: "Authentication Error" })
  }
  const token = authHeader.split(" ")[1]

  jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Authentication Error" })
    }
    const user = await userRepository.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ message: "Authentication Error" })
    }
    req.userId = user.id
    req.token = token
    next()
  })
}
