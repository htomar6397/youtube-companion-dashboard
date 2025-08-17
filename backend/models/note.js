const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  videoId: { type: String, required: true },
  content: { type: String, required: true },
  tags: String,
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Note", noteSchema);
