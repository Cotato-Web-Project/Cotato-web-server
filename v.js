// //------------------------------------- image Schema ---------------------------------------//

// const imageSchema = new mongoose.Schema({
//   data: Buffer,
//   contentType: String,
//   required: false,
// })

// //------------------------------------- file Schema ---------------------------------------//

// const fileSchema = new mongoose.Schema({
//   originalFileName: { type: String },
//   serverFileName: { type: String },
//   size: { type: Number },
//   //   uploadedBy: {
//   //     type: mongoose.Schema.Types.ObjectId,
//   //     ref: "user",
//   //     required: true,
//   //   },
//   postId: { type: mongoose.Schema.Types.ObjectId, ref: "post" },
//   isDeleted: { type: Boolean, default: false },
//   required: false,
// })

// const img = req.body.image //수정필요
//   ? {
//       data: fs.readFileSync(
//         path.join(__dirname + "/uploads/" + req.files.image[0].originalname)
//       ),
//       contentType: "image/png",
//     }
//   : undefined

// const file = req.body.file //수정필요
//   ? {
//       originalFileName: req.files.file[0].originalname,
//       serverFileName: req.files.file[0].filename,
//       size: req.files.file[0].size,
//       //   uploadedBy: {
//       //     type: mongoose.Schema.Types.ObjectId,
//       //     ref: "user",
//       //     required: true,
//       //   },
//       postId: req.body._id,
//     }
//   : undefined

// const img = req.body.image
//   ? {
//       data: fs.readFileSync(
//         path.join(__dirname + "/uploads/" + req.files.image[0].originalname)
//       ),
//       contentType: "image/png",
//     }
//   : undefined
// const file = req.body.file
//   ? {
//       originalFileName: req.files.file[0].originalname,
//       serverFileName: req.files.file[0].filename,
//       size: req.files.file[0].size,
//       //   uploadedBy: {
//       //     type: mongoose.Schema.Types.ObjectId,
//       //     ref: "user",
//       //     required: true,
//       //   },
//       postId: req.body._id,
//     }
//   : undefined
