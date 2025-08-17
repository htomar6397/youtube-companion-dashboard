const express = require("express");
const Log = require("../models/log");
const requireAuth = require("../middlewares/requireAuth");
const router = express.Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
  const logs = await Log.find({ userId: req.user._id })
    .sort({ created_at: -1 })
    .limit(100);
  res.json(logs);
});

module.exports = router;
