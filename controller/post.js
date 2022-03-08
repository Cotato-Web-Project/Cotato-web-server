//------------------------------------- import ---------------------------------------//

import * as Posts from "../data/post.js"
import { upload } from "../database/storage.js"

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
  await upload.array("image")
  const { title, desc } = req.body
  const userId = req.userId
  const category = req.params.category
  const img_url = []
  req.body.image
    ? req.files.image.forEach((e) => {
        img_url.push(`http://localhost:3000/uploads/${e.filename}`)
      })
    : undefined

  const data = await Posts.createPost(title, desc, img_url, category, userId) //img_url,

  res.status(201).json(data)
}

//------------------------------------- 게시글 수정(수정필요) ---------------------------------------//

export async function updatePost(req, res) {
  await upload.single({ name: "image" })
  const postNumber = req.params.postNumber

  const { title, desc } = req.body
  const img_url = []
  req.body.image
    ? req.file.image.forEach((e) => {
        img_url.push(`http://localhost:8080/uploads/${e.filename}`)
      })
    : undefined

  const post = await Posts.getByPostnumber(postNumber)
  if (post.userId !== req.userId) {
    return res.sendStatus(403)
  }

  const data = await Posts.updatePost(postNumber, title, desc, img_url)

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

export async function postLike(req, res) {
  const id = req.params.id
  const post = await Posts.postLike(id)
  res.status(200).json({ liked: post.liked + 1 })
}

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

export async function img(req, res) {
  await upload.single("image")
  const result = req.file
  console.log(result)
  // console.log("전달받은 파일", req.img)
  // console.log("전달", req.file)
  // console.log("으악", req.body)

  // console.log("저장된 파일의 이름", req.file.filename)
  // const IMG_URL = `http://localhost:8080/uploads/${req.img.filename}`
  // console.log(IMG_URL)
  // res.json({ url: IMG_URL })
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
