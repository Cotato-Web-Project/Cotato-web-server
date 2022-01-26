//------------------------------------- import ---------------------------------------//

import mongoose from "mongoose"

//------------------------------------- comment Schema ---------------------------------------//

const commentSchema = mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
    },
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

//------------------------------------- method ---------------------------------------//

//------------------------------------- 댓글 가져오기 ---------------------------------------//

export async function getComment(post) {
  return Comment.findById(post)
}

//------------------------------------- 댓글 작성 ---------------------------------------//

export async function createComment(post, text, parentComment) {
  return new Comment({ post, text }).save()
}

//------------------------------------- 댓글(대댓글) 수정 ---------------------------------------//

export async function updateComment(id, text) {
  return Comment.findByIdAndUpdate(id, { text }, { returnOriginal: false })
}

//------------------------------------- 댓글(대댓글) 삭제 ---------------------------------------//

export async function deleteComment(id, isDeleted) {
  return Comment.findByIdAndUpdate(id, { isDeleted })
}

//------------------------------------- 부모댓글 가져오기 ---------------------------------------//
export async function getParentComment(id) {
  return Comment.findById(id)
}

//------------------------------------- 대댓글 작성 ---------------------------------------//
export async function createReplyComment(post, parentComment, text, depth) {
  return new Comment({ post, parentComment, text, depth }).save()
}
