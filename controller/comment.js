//------------------------------------- import ---------------------------------------//

import * as Comment from "../data/comment.js"

//------------------------------------- Comment Controller ---------------------------------------//

//------------------------------------- 댓글가져오기 ---------------------------------------//

export async function getComment(req, res) {
  const post = req.params.id
  const data = await Comment.getComment(post)
  res.status(200).send(data)
}

//------------------------------------- 댓글 작성 ---------------------------------------//

export async function createComment(req, res) {
  const userId = req.userId
  const post = req.params.id
  const text = req.body.text
  const data = await Comment.createComment(post, text, userId)
  res.status(200).send(data)
}

//------------------------------------- 댓글 수정 ---------------------------------------//

export async function updateComment(req, res) {
  const userId = req.userId
  const id = req.params.id
  const text = req.body.text
  const data = await Comment.updateComment(id, text, userId)
  res.status(200).send(data)
}

//------------------------------------- 댓글 삭제 ---------------------------------------//

export async function deleteComment(req, res) {
  const userId = req.userId
  const id = req.params.id
  const isDeleted = true
  await Comment.deleteComment(id, isDeleted, userId)
  res.sendStatus(204)
}

//------------------------------------- 대댓글 작성 ---------------------------------------//

export async function createReplyComment(req, res) {
  const id = req.params.id
  const parent = await Comment.getParentComment(id)
  const post = parent.post
  const parentComment = req.params.id
  const text = req.body.text
  const depth = parent.depth + 1
  const userId = req.userId
  const data = await Comment.createReplyComment(
    post,
    parentComment,
    text,
    depth,
    userId
  )
  res.status(200).send(data)
}
