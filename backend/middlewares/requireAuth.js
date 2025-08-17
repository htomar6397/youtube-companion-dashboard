const User = require("../models/user");

// Middleware to authenticate user by session cookie (uid)
module.exports = async function requireAuth(req, res, next) {
  const userId = req.cookies?.uid;
  if (!userId) return res.status(401).json({ error: "Not authenticated" });
  const user = await User.findById(userId);
  if (!user) return res.status(401).json({ error: "User not found" });
  req.user = user;
  next();
};
