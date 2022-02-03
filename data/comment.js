//------------------------------------- import ---------------------------------------//

import mongoose from "mongoose"
import * as userRepository from "./user.js"

//------------------------------------- comment Schema ---------------------------------------//

const commentSchema = mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    text: { type: String, required: true },
    depth: {
      type: Number,
      default: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    liked: { type: Number, default: 0 },
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  { versionKey: false },
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

export async function getComments(post) {
  return Comment.find({ post: post })
}

export async function getComment(id) {
  return Comment.findById(id)
}

//------------------------------------- 댓글 작성 ---------------------------------------//

export async function createComment(post, text, userId) {
  return userRepository.findById(userId).then((user) =>
    new Comment({
      post: post,
      text: text,
      userId: userId,
      username: user.username,
    }).save()
  )
}

//------------------------------------- 댓글(대댓글) 수정 ------------------------------------//

export async function updateComment(id, text) {
  return Comment.findByIdAndUpdate(
    id,
    { text },
    {
      returnOriginal: false,
    }
  )
}

//------------------------------------- 댓글(대댓글) 삭제 ------------------------------------//

export async function deleteComment(id, isDeleted) {
  return Comment.findByIdAndUpdate(id, { isDeleted })
}

//------------------------------------- 부모댓글 가져오기---------------------------------------//

export async function getParentComment(id) {
  return Comment.findById(id)
}

//------------------------------------- 대댓글 작성 ---------------------------------------//

export async function createReplyComment(
  post,
  parentComment,
  text,
  depth,
  userId
) {
  return userRepository
    .findById(userId)
    .then((user) =>
      new Comment({
        post: post,
        parentComment: parentComment,
        text: text,
        depth: depth,
        userId: userId,
        username: user.username,
      }).save()
    )
}

export async function getByusername(username) {
  return Comment.find({ username: username }).sort({ createdAt: -1 })
}
