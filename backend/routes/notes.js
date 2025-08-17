const express = require("express");
const Note = require("../models/note");
const Log = require("../models/log");
const requireAuth = require("../middlewares/requireAuth");
const router = express.Router();

router.use(requireAuth);

// List/search notes
router.get("/", async (req, res) => {
  const { q, tag, videoId } = req.query;
  let filter = { userId: req.user._id };
  if (videoId) filter.videoId = videoId;
  if (q) filter.content = { $regex: q, $options: "i" };
  if (tag) filter.tags = { $regex: tag, $options: "i" };
  const notes = await Note.find(filter).sort({ created_at: -1 });
  res.json(notes);
});

// Add note
router.post("/", async (req, res) => {
  const { content, tags, videoId } = req.body;
  if (!videoId) return res.status(400).json({ error: "videoId required" });
  const note = await Note.create({
    userId: req.user._id,
    videoId,
    content,
    tags,
  });
  await Log.create({
    userId: req.user._id,
    event: "add_note",
    details: `Added note for video ${videoId}: ${content}`,
  });
  res.json({ id: note._id });
});

// Delete note
router.delete("/:id", async (req, res) => {
  await Note.deleteOne({ _id: req.params.id, userId: req.user._id });
  await Log.create({
    userId: req.user._id,
    event: "delete_note",
    details: req.params.id,
  });
  res.json({ success: true });
});

module.exports = router;
