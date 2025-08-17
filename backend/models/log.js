const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: String, required: true },
  details: String,
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Log", logSchema);
