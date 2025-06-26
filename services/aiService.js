const axios = require("axios");

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log("GEMINI_API_KEY:", GEMINI_API_KEY);

exports.getGeminiCommitMessage = async (diff) => {
  try {
    const prompt = `Generate a concise Git commit message for the following code diff:\n\n${diff}`;
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    const result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!result) throw new Error("No commit message generated");

    return result.trim();
  } catch (err) {
    console.error("Gemini error:", err?.response?.data || err.message);
    return null;
  }
};
