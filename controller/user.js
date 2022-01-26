import * as Users from "../data/user.js"

export async function register(req, res) {
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password
  const token = req.body.token
  const tokenExp = req.body.tokenExp

  const data = await Users.register(name, email, password, token, tokenExp)
  res.status(201).json(data)
}
