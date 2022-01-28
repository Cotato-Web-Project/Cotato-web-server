import jwt from "jsonwebtoken"
import { config } from "../config.js"
import * as userRepository from "../data/user.js"

export const isAuth = async (req, res, next) => {
  const authHeader = req.get("Authorization")
  if (!(authHeader && authHeader.startsWith("Bearer"))) {
    return res.status(401).json({ message: "Authentication Error" })
  }

  const token = authHeader.split(" ")[1]
  // ex ) Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZjJiYjc5M2E5NzVkMzQyM2VmYThhYyIsImlhdCI6MTY0MzI5NzY1NywiZXhwIjoxNjQzMzg0MDU3fQ.HzoYKcIwbI3_SVTeYX49nHLj_5lg8lJkTWVSoWrfEBg
  // 공백으로 구분해서 두 번째 원소가 token이 된다.
  jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
    // decoded는 token을 다시 id로 돌려준 결과값
    if (error) {
      return res.status(401).json({ message: "Authentication Error" })
    }
    // 이 값을 이용해서 user를 찾는다.
    const user = await userRepository.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ message: "Authentication Error" })
    }
    // req에 id와 token을 넘겨주고 미들웨어의 인자인 next를 사용해서 다음으로 넘겨준다.
    req.userId = user.id
    req.token = token
    next()
  })
}
