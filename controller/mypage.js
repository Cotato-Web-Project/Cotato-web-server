import * as Users from "../data/user.js"

export async function getUser(req, res) {
  const userId = req.userId
  const data = await Users.findById(userId)
  data
    ? res
        .status(200)
        .json({ name: data.name, username: data.username, email: data.email })
    : res.status(400).json({ message: `User id(${userId}) not found` })
}
