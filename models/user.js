const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  githubId: { type: String, unique: true, required: true },
  username: String,
  avatarUrl: String,
  email: String,
  credits: { type: Number, default: 100 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
