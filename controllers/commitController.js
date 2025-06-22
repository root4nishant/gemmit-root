const { getGeminiCommitMessage } = require("../services/aiService");
const User = require("../models/user");

const COMMIT_COST_PER_FILE = 2;

exports.generateCommit = async (req, res) => {
  try {
    const { diff, fileCount } = req.body;
    const user = req.user;

    if (!diff || typeof fileCount !== "number") {
      return res.status(400).json({ error: "Missing diff or fileCount" });
    }

    const requiredCredits = fileCount * COMMIT_COST_PER_FILE;

    if (user.credits < requiredCredits) {
      return res.status(402).json({ error: "Insufficient credits" });
    }

    // Call Gemini/OpenAI to get commit message
    const message = await getGeminiCommitMessage(diff);

    if (!message || typeof message !== "string") {
      return res.status(500).json({ error: "AI failed to generate message" });
    }

    // Deduct credits
    user.credits -= requiredCredits;
    await user.save();

    res.status(200).json({ message });
  } catch (err) {
    console.error("Generate commit failed:", err);
    res.status(500).json({ error: "Server error" });
  }
};
