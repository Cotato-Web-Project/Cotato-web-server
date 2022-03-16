import mongoose from "mongoose"

const Schema = mongoose.Schema

const likeSchema = mongoose.Schema(
  {
    //좋아요 누른 사람의 Id
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    //댓글 좋아요의 Id
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    //게시물 좋아요의 정보
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  { timestamps: true }
)

const Like = mongoose.model("Like", likeSchema)

export async function getLike(info) {
  return Like.find(info)
}

export async function upLike(info) {
  return new Like(info).save()
}

export async function unLike(info) {
  return Like.findOneAndDelete(info)
}
