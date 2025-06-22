const { clerkClient, getAuth } = require("@clerk/clerk-sdk-node");
const User = require("../models/user");

async function authMiddleware(req, res, next) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if user exists in MongoDB
    let user = await User.findOne({ githubId: userId });

    // If not, create it
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(userId);

      user = await User.create({
        githubId: userId,
        username:
          clerkUser.username || clerkUser.emailAddresses[0].emailAddress,
        avatarUrl: clerkUser.imageUrl,
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ error: "Authentication failed" });
  }
}

module.exports = authMiddleware;
