const mongoose = require("mongoose")

const commentSchema = mongoose.Schema(
  {
<<<<<<< HEAD
    post: {
      //populate
      type: String,
    },
    parentComment: {
      type: String,
=======
    // 댓글 쓰는 게시물 아이디
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    // 대댓글 구현시 부모 댓글이 무엇인지
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    isDeleted: {
      type: Boolean,
      default: false,
>>>>>>> 1c128cb9718bb8843b38bb4eccde6734b3d486be
    },
    text: {
      type: String,
      required: true,
    },
    depth: {
      type: Number,
      default: 1,
    },
<<<<<<< HEAD
    isDelete: {
      type: Boolean,
      default: false,
    },
=======
>>>>>>> 1c128cb9718bb8843b38bb4eccde6734b3d486be
    createdAt: {
      type: Date,
      default: Date.now,
    },
<<<<<<< HEAD
    updatedAt: {
      type: Date,
    },
  },
  { toObject: { virtuals: true }, toJson: { virtuals: true } }
)
=======
  },
  { toObject: { virtuals: true }, toJSON: { virtuals: true } }
)

>>>>>>> 1c128cb9718bb8843b38bb4eccde6734b3d486be
commentSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parentComment",
})

commentSchema
  .virtual("childComments")
  .get(function () {
    return this._childComments
  })
  .set(function (v) {
    this._childComments = v
  })

<<<<<<< HEAD
module.exports = mongoose.model("Comment", commentSchema)
=======
const Comment = mongoose.model("Comment", commentSchema)

module.exports = Comment
>>>>>>> 1c128cb9718bb8843b38bb4eccde6734b3d486be
