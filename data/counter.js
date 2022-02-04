//------------------------------------- import ---------------------------------------//

import mongoose from "mongoose"

//------------------------------------- counter Schema ---------------------------------------//

const counterSchema = mongoose.Schema({
  name: { type: String, required: true },
  postNumber: { type: Number, default: 0 },
})

const Counter = mongoose.model("counter", counterSchema)
