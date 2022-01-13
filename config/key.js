if (process.env.NODE_ENV === "production") {
  module.exprots = require("./prod")
} else {
  module.exports = require("./dev")
}
