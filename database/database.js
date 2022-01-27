//------------------------------------- import ---------------------------------------//

import mongoose from "mongoose"
import { config } from "../config.js"

//------------------------------------- DB connector ---------------------------------------//

export function connectDB() {
  return mongoose
    .connect(config.db.host, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err))
}

export function useVirtualId(schema) {
  // _id -> id 데이터베이스에는 _id로 저장되지만 사용자가 불러올떄는 id라는 가상의 이름을 적용해준다.
  schema.virtual("id").get(function () {
    return this._id.toString()
  })
  schema.set("toJSON", { virtuals: true }) // json으로 변환할 때 가상의 요소도 포함시켜준다.
  schema.set("toObject", { virtuals: true }) // log에도 요소를 포함시켜준다.
}
