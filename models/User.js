const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String // "candidate" or "employer"
});

module.exports = mongoose.model("User", UserSchema);