import * as Users from "../data/user.js"

export async function register(req, res) {
  const { name, email, password, token, tokenExp } = req.body
  const data = await Users.register(name, email, password, token, tokenExp)
  res.status(201).json(data)
}
