const axios = require("axios");
const User = require("../models/user");

const verifyGithubToken = async (token) => {
  try {
    const { data } = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "gemmit-app",
      },
    });

    const user = await User.findOne({ githubId: data.id });
    return user || null;
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return null;
  }
};

module.exports = verifyGithubToken;
