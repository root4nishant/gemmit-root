const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    // For CLI: Send user id or JWT to CLI to store for future API calls
    res.json({ token: req.user._id, credits: req.user.credits });
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  res.json({ message: "Logged out" });
});

router.get("/me", require("../middleware/auth"), (req, res) => {
  res.json({
    username: req.user.username,
    credits: req.user.credits,
    email: req.user.email,
    avatarUrl: req.user.avatarUrl,
  });
});

module.exports = router;
