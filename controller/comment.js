//------------------------------------- import ---------------------------------------//

import * as Comment from "../data/comment.js"

// ---------------------------------- Comment Controller -------------------------------------//

//------------------------------------- 댓글가져오기 ---------------------------------------//

export async function getComments(req, res) {
  const post = req.params.id
  const data = await Comment.getComments(post)
  res.status(200).send(data)
}

export async function getComment(req, res) {
  const id = req.params.id
  const data = await Comment.getComment(id)
  res.status(200).send(data)
}

//------------------------------------- 댓글 작성 ---------------------------------------//

export async function createComment(req, res) {
  const userId = req.userId
  const post = req.params.id
  const text = req.body.text
  const data = await Comment.createComment(post, text, userId)
  console.log(data)
  res.status(200).send(data)
}

//------------------------------------- 댓글 수정 ---------------------------------------//

export async function updateComment(req, res) {
  const id = req.params.id
  console.log(id)
  const text = req.body.text
  const comment = await Comment.getComment(id)
  console.log(comment)
  if (comment.userId !== req.userId) {
    return res.sendStatus(403)
  }
  const data = await Comment.updateComment(id, text)
  res.status(200).send(data)
}

//------------------------------------- 댓글 삭제 ---------------------------------------//

export async function deleteComment(req, res) {
  const id = req.params.id
  const isDeleted = true
  const comment = await Comment.getComment(id)
  console.log(comment)
  if (comment.userId !== req.userId) {
    return res.sendStatus(403)
  }
  await Comment.deleteComment(id, isDeleted).then(() => {
    res.json({ message: "삭제성공" })
  })
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

export async function getByusername(req, res) {
  const username = req.params.name
  const recentPost = await Comment.getByusername(username)
  res.json(recentPost)
}

//------------------------------------- 댓글 좋아요 기능 ---------------------------------------//

export async function commentLike(req, res) {
  const id = req.params.id
  const comment = await Comment.commentLike(id)
  res.status(200).json({ liked: comment.liked + 1 })
}
