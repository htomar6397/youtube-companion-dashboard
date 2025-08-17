const express = require("express");
const { getGoogleAuthUrl, getTokens } = require("../services/googleAuth");
const User = require("../models/user");
const router = express.Router();

// Step 1: Redirect to Google OAuth
router.get("/google", (req, res) => {
  const url = getGoogleAuthUrl();
  res.redirect(url);
});

// Check authentication status
router.get("/status", async (req, res) => {
  try {
    const userId = req.cookies.uid;
    if (!userId) {
      return res.json({ authenticated: false });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ authenticated: false });
    }

    res.json({
      authenticated: true,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    res.json({ authenticated: false });
  }
});

// Step 2/3: Google redirects back with code
router.get("/google/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send("Missing code");
  try {
    const tokens = await getTokens(code);
    // Get user info from id_token
    const { id_token } = tokens;
    const userInfo = JSON.parse(
      Buffer.from(id_token.split(".")[1], "base64").toString()
    );
    let user = await User.findOne({ googleId: userInfo.sub });
    if (!user)
      user = new User({
        googleId: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
      });
    user.accessToken = tokens.access_token;
    user.refreshToken = tokens.refresh_token || user.refreshToken;
    user.tokenExpiry = new Date(
      Date.now() + (tokens.expires_in || 3600) * 1000
    );
    await user.save();
    // Set session/cookie here (for demo, just send user id)
    res.cookie("uid", user._id, { httpOnly: true });
    res.redirect("http://localhost:5173");
  } catch (e) {
    res.status(500).send("OAuth error: " + e.message);
  }
});

// Logout route
router.post("/logout", (req, res) => {
  try {
    // Clear the authentication cookie
    res.clearCookie("uid", {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // Set to true in production with HTTPS
    });

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Error during logout",
    });
  }
});

module.exports = router;
