const mongoose = require("mongoose")

const commentSchema = mongoose.Schema(
  {
    // 댓글 쓰는 게시물 아이디
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
    },
    // 대댓글 구현시 부모 댓글이 무엇인지
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comments",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    text: String,
    depth: {
      type: Number,
      default: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    liked: { type: Number, default: 0 },
  },
  { toObject: { virtuals: true }, toJSON: { virtuals: true } }
)

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

const Comment = mongoose.model("Comment", commentSchema)

module.exports = Comment
