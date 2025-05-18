import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  githubId: String,
  email: String,
  name: String,
  accessToken: String,
  commitsUsed: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
