import mongoose from "mongoose"

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

export async function getComment(post) {
  return Comment.findById(post)
}

export async function createComment(post, text, parentComment) {
  return new Comment({ post, text }).save()
}

export async function updateComment(id, text) {
  return Comment.findByIdAndUpdate(id, { text }, { returnOriginal: false })
}

export async function deleteComment(id, isDeleted) {
  return Comment.findByIdAndUpdate(id, { isDeleted })
}

export async function getParentComment(id) {
  return Comment.findById(id)
}

export async function createReplyComment(post, parentComment, text, depth) {
  return new Comment({ post, parentComment, text, depth }).save()
}
