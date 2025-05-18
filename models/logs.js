import mongoose from "mongoose";

const logsSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  message: String,
  timestamp: { type: Date, default: Date.now },
  tokensUsed: Number,
});

export default mongoose.model("Logs", logsSchema);
