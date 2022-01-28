//------------------------------------- import ---------------------------------------//

import * as Posts from "../data/post.js"
import { upload } from "../database/storage.js"

//------------------------------------- Post Controller ---------------------------------------//

//------------------------------------- 전체 게시글 ---------------------------------------//

export async function getAllPosts(req, res) {
  const data = await Posts.getAllPost()
  res.status(200).json(data)
  console.log(data)
}

//------------------------------------- 선택한 게시글 ---------------------------------------//

export async function getPost(req, res) {
  const id = req.params.id
  const data = await Posts.getById(id)
  data
    ? res.status(200).json(data)
    : res.status(400).json({ message: `Post id(${id}) not found` })
}

//------------------------------------- 게시글 작성(수정필요) ---------------------------------------//

export async function createPost(req, res) {
  await upload.array("image")
  console.log(req)
  const { _id, title, desc } = req.body
  const userId = req.userId
  const img_url = []
  req.body.image
    ? req.files.image.forEach((e) => {
        img_url.push(`http://localhost:3000/uploads/${e.filename}`)
      })
    : undefined
  // const file_url = []
  // req.files.file
  //   ? req.files.file.forEach((e) => {
  //       file_url.push(`http://localhost:3000/uploads/${e.filename}`)
  //     })
  //   : undefined

  const data = await Posts.createPost(_id, title, desc, img_url, userId)
  res.status(201).json(data)
}

//------------------------------------- 게시글 수정(수정필요) ---------------------------------------//

export async function updatePost(req, res) {
  await upload.array([{ name: "image" }, { name: "file" }])
  const id = req.params.id
  const { title, desc } = req.body
  const img_url = []
  req.body.image
    ? req.file.image.forEach((e) => {
        img_url.push(`http://localhost:3000/uploads/${e.filename}`)
      })
    : undefined
  // const file_url = []
  // req.files.file
  //   ? req.files.file.forEach((e) => {
  //       file_url.push(`http://localhost:3000/uploads/${e.filename}`)
  //     })
  //   : undefined

  const post = await Posts.getById(id)
  if (post.userId !== req.userId) {
    return res.sendStatus(403)
  }

  const data = await Posts.updatePost(id, title, desc, img_url)

  res.status(200).json(data)
}

//------------------------------------- 게시글 삭제 ---------------------------------------//

export async function deletePost(req, res) {
  const id = req.params.id
  const post = await Posts.getById(id)
  if (post.userId !== req.userId) {
    return res.sendStatus(403)
  }
  await Posts.deletePost(id)
  res.sendStatus(204)
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
