const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: String,
  name: String,
  accessToken: String,
  refreshToken: String,
  tokenExpiry: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
