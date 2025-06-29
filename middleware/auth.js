const User = require("../models/user");

module.exports = async function (req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const user = await User.findById(token);
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
