//------------------------------------- import ---------------------------------------//

import * as Posts from "../data/post.js"
import { File } from "../data/file.js"
import * as Like from "../data/like.js"
import * as Users from "../data/user.js"

//------------------------------------- Post Controller ---------------------------------------//

//------------------------------------- 전체 게시글 ---------------------------------------//

export async function getAllPosts(req, res) {
  const data = await Posts.getAllPost()
  res.status(200).json(data)
}

//------------------------------------- 선택한 게시글 ---------------------------------------//

export async function getPost(req, res) {
  const id = req.params.id
  await Posts.postView(id)
  const data = await Posts.getById(id)
  data
    ? res.status(200).json(data)
    : res.status(400).json({ message: `Post id(${id}) not found` })
}

export async function getPostbyNumber(req, res) {
  const postNumber = parseInt(req.params.postNumber)
  await Posts.postView(postNumber)
  const data = await Posts.getByPostnumber(postNumber)
  data
    ? res.status(200).json(data)
    : res.status(400).json({ message: `Post id(${postNumber}) not found` })
}

//------------------------------------- 게시글 작성(수정필요) ---------------------------------//

export async function createPost(req, res) {
  const { title, desc, attachment } = req.body
  const userId = req.userId
  const user = await Users.findById(userId)
  const username = user.username
  const category = req.params.category
  const filearray = []

  for (var i = 0; i < attachment.length; i++) {
    const file = await File.findOne({ serverFileName: attachment[i] })
    console.log("서버파일이름 ", file.serverFileName)
    filearray.push(
      `http://localhost:8080/public/uploads/${file.serverFileName}`
    )
  }

  const data = await Posts.createPost(
    title,
    desc,
    filearray,
    attachment,
    category,
    userId,
    username
  )

  res.status(201).json(data)
}

//------------------------------------- 게시글 수정(수정필요) ---------------------------------------//

export async function updatePost(req, res) {
  const postNumber = req.params.postNumber

  const { title, desc, attachment } = req.body
  const filearray = []
  for (var i = 0; i < attachment.length; i++) {
    const file = await File.findOne({ serverFileName: attachment[i] })
    console.log("서버파일이름 ", file.serverFileName)
    filearray.push(
      `http://localhost:8080/public/uploads/${file.serverFileName}`
    )
  }

  const post = await Posts.getByPostnumber(postNumber)
  if (post.userId !== req.userId) {
    return res.sendStatus(403)
  }

  const data = await Posts.updatePost(
    postNumber,
    title,
    desc,
    attachment,
    filearray
  )

  res.status(200).json(data)
}

//------------------------------------- 게시글 삭제 ---------------------------------------//

export async function deletePost(req, res) {
  const id = req.params.id
  const post = await Posts.getById(id)
  if (post.userId !== req.userId) {
    return res.sendStatus(403)
  }
  await Posts.deletePost(id).then(() => {
    res.json({ message: "삭제성공" })
  })
}

//------------------------------------- 게시글 검색 ---------------------------------------//

export async function searchPosts(req, res) {
  let options = []
  if (req.query.option == "title") {
    options = [{ title: new RegExp(req.query.title) }]
  } else if (req.query.option == "desc") {
    options = [{ desc: new RegExp(req.query.desc) }]
  } else if (req.query.option == "title+desc") {
    options = [
      { title: new RegExp(req.query.title) },
      { desc: new RegExp(req.query.desc) },
    ]
  } else {
    const err = new Error("검색 옵션이 없습니다.")
    err.status = 400
    throw err
  }
  const data = await Posts.searchPost(options)
  res.status(200).send(data)
}

//------------------------------------- 유저네임으로 검색 ---------------------------------------//

export async function getByusername(req, res) {
  const username = req.params.name
  const recentPost = await Posts.getByusername(username)
  res.json(recentPost)
}

//------------------------------------- 게시글 좋아요 기능 ---------------------------------------//

export async function searchInCategory(req, res) {
  let options = []
  const category = req.params.category
  if (req.query.option == "title") {
    options = [{ title: new RegExp(req.query.title) }]
  } else if (req.query.option == "desc") {
    options = [{ desc: new RegExp(req.query.desc) }]
  } else if (req.query.option == "title+desc") {
    options = [
      { title: new RegExp(req.query.title) },
      { desc: new RegExp(req.query.desc) },
    ]
  } else {
    const err = new Error("검색 옵션이 없습니다.")
    err.status = 400
    throw err
  }
  const data = await Posts.searchInCategory(category, options)
  res.status(200).send(data)
}

//------------------------------------ 카테고리 게시글 가져오기-------------------------------------//

export async function getCategory(req, res) {
  const category = req.params.category
  const data = await Posts.getCategory(category)
  res.status(200).json(data)
}

export async function nextPost(req, res) {
  const postNumber = parseInt(req.params.postNumber)
  const category = req.params.category
  const nextdata = await Posts.nextPost(postNumber, category)
  nextdata ? res.json(nextdata) : {}
}

export async function prevPost(req, res) {
  const postNumber = parseInt(req.params.postNumber)
  const category = req.params.category
  const prevdata = await Posts.prevPost(postNumber, category)
  prevdata ? res.json(prevdata) : {}
}

// 좋아요 ------------------------------------------------------------------

export async function getLike(req, res) {
  let info = {}
  if (req.body.postId) {
    info = { postId: req.body.postId }
  } else {
    info = { commentId: req.body.commentId }
  }
  await Like.getLike(info)
    .then((result) => {
      console.log(result.length)
      res.status(200).json({ success: true, result: result.length })
    })
    .catch((err) => {
      console.log(err)
      res.status(400).json({ success: false, err })
    })
}

export async function upLike(req, res) {
  let info = {}
  if (req.body.postId) {
    info = { postId: req.body.postId, userId: req.body.userId }
  } else {
    info = { commentId: req.body.commentId, userId: req.body.userId }
  }
  const already =
    (await Like.getLike(info)) == 0 ? undefined : await Like.getLike(info)
  console.log(already)
  if (already != undefined) {
    res.json("이미 좋아요를 누른 게시물입니다!")
  } else {
    await Like.upLike(info).then((result) => {
      res.status(200).json({ success: true, result })
    })
  }
}

export async function unLike(req, res) {
  let info = {}
  if (req.body.postId) {
    info = { postId: req.body.postId, userId: req.body.userId }
  } else {
    info = { commentId: req.body.commentId, userId: req.body.userId }
  }
  await Like.unLike(info).then((result) => {
    if (result == null) {
      res.status(400).json("아직 좋아요를 누르지 않은 게시물입니다.")
    } else {
      res.json({ success: true, result })
    }
  })
}
