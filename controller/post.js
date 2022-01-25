import * as Posts from "../data/post.js"

export async function getAllPosts(req, res) {
  const data = await Posts.getAllPost()
  res.status(200).json(data)
  console.log(data)
}

export async function getPost(req, res) {
  const id = req.params.id
  const data = await Posts.getById(id)
  data
    ? res.status(200).json(data)
    : res.status(400).json({ message: `Post id(${id}) not found` })
}

export async function createPost(req, res) {
  const id = req.body._id
  const title = req.body.title
  const desc = req.body.desc
  const img = req.body.image //수정필요
    ? {
        data: fs.readFileSync(
          path.join(__dirname + "/uploads/" + req.files.image[0].originalname)
        ),
        contentType: "image/png",
      }
    : undefined
  const file = req.body.file //수정필요
    ? {
        originalFileName: req.files.file[0].originalname,
        serverFileName: req.files.file[0].filename,
        size: req.files.file[0].size,
        //   uploadedBy: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "user",
        //     required: true,
        //   },
        postId: req.body._id,
      }
    : undefined
  const data = await Posts.createPost(id, title, desc, img, file)
  res.status(201).json(data)
}

export async function updatePost(req, res) {
  const id = req.params.id
  const title = req.body.title
  const desc = req.body.desc
  const img = req.body.image
    ? {
        data: fs.readFileSync(
          path.join(__dirname + "/uploads/" + req.files.image[0].originalname)
        ),
        contentType: "image/png",
      }
    : undefined
  const file = req.body.file
    ? {
        originalFileName: req.files.file[0].originalname,
        serverFileName: req.files.file[0].filename,
        size: req.files.file[0].size,
        //   uploadedBy: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "user",
        //     required: true,
        //   },
        postId: req.body._id,
      }
    : undefined
  const data = await Posts.updatePost(id, title, desc, img, file)
  res.status(200).json(data)
}

export async function deletePost(req, res) {
  const id = req.params.id
  await Posts.deletePost(id)
  res.sendStatus(204)
}

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
