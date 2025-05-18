import express from "express";
import User from "../models/users.js";
import CommitLog from "../models/CommitLog.js";
import axios from "axios";

const router = express.Router();

router.post("/generate", async (req, res) => {
  const { userId, diff } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    if (!user.isPaid && user.commitsUsed >= 100) {
      return res.status(403).json({ error: "Commit limit reached" });
    }

    const aiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Write a concise Git commit message for this diff:\n${diff}`,
              },
            ],
          },
        ],
      }
    );

    const message =
      aiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Auto commit";
    await CommitLog.create({ userId, message, tokensUsed: 0 });
    user.commitsUsed += 1;
    await user.save();

    res.json({ message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Commit generation failed" });
  }
});

export default route;
