const express = require("express");
const axios = require("axios");
const auth = require("../middleware/auth"); // Ensure this exists and works

const router = express.Router();

// POST /api/commit/generate
router.post("/generate", auth, async (req, res) => {
  const { diff, numFiles } = req.body;

  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  const files = numFiles || 1;
  const cost = files * 2;

  if (req.user.credits < cost) {
    return res.status(403).json({ error: "Insufficient credits" });
  }

  try {
    // Call Gemini API to generate commit message
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

    // Deduct credits and save
    req.user.credits -= cost;
    await req.user.save();

    res.json({ message, credits: req.user.credits });
  } catch (err) {
    console.error("[Gemmit] Commit generation failed:", err.message);
    res.status(500).json({ error: "Commit generation failed" });
  }
});

module.exports = router;
