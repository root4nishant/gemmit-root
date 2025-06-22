const express = require("express");
const axios = require("axios");
const User = require("../models/user.js");

const router = express.Router();

router.post("/github", async (req, res) => {
  const { code } = req.body;
  try {
    const tokenRes = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenRes.data.access_token;
    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `token ${accessToken}` },
    });

    const { id, email, name } = userRes.data;
    let user = await User.findOne({ githubId: id });
    if (!user) {
      user = await User.create({ githubId: id, email, name, accessToken });
    } else {
      user.accessToken = accessToken;
      await user.save();
    }
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "GitHub login failed" });
  }
});

module.exports = router;