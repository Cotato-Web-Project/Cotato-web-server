const mongoose = require("mongoose")

const commentSchema = mongoose.Schema(
  {
    post: {
      //populate
      type: String,
    },
    parentComment: {
      type: String,
    },
    text: {
      type: String,
      required: true,
    },
    depth: {
      type: Number,
      default: 1,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
  },
  { toObject: { virtuals: true }, toJson: { virtuals: true } }
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

module.exports = mongoose.model("Comment", commentSchema)
