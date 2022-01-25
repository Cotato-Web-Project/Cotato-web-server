import * as Comment from "../data/comment.js"

export async function getComment(req, res) {
  const post = req.params.id
  const data = await Comment.getComment(post)
  res.status(200).send(data)
}

export async function createComment(req, res) {
  const post = req.params.id
  const text = req.body.text
  const data = await Comment.createComment(post, text)
  res.status(200).send(data)
}

export async function updateComment(req, res) {
  const id = req.params.id
  const text = req.body.text
  const data = await Comment.updateComment(id, text)
  res.status(200).send(data)
}

export async function deleteComment(req, res) {
  const id = req.params.id
  const isDeleted = true
  await Comment.deleteComment(id, isDeleted)
  res.sendStatus(204)
}

export async function createReplyComment(req, res) {
  const id = req.params.id
  const parent = await Comment.getParentComment(id)
  const post = parent.post
  const parentComment = req.params.id
  const text = req.body.text
  const depth = parent.depth + 1
  const data = await Comment.createReplyComment(
    post,
    parentComment,
    text,
    depth
  )
  res.status(200).send(data)
}
