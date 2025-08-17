const express = require("express");
const { getYoutubeClient } = require("../services/youtubeApi");
const requireAuth = require("../middlewares/requireAuth");
const router = express.Router();

router.use(requireAuth);

// Get user's uploaded videos
router.get("/my-videos", async (req, res) => {
  try {
    const youtube = getYoutubeClient(req.user.accessToken);

    // Get user's channel
    const channels = await youtube.channels.list({
      part: ["id"],
      mine: true,
    });

    if (!channels.data.items?.length) {
      return res.json([]);
    }

    const channelId = channels.data.items[0].id;

    // Get user's uploads
    const videos = await youtube.search.list({
      part: ["snippet"],
      channelId: channelId,
      type: "video",
      order: "date",
      maxResults: 50,
    });

    res.json(videos.data.items || []);
  } catch (error) {
    console.error("Error fetching user videos:", error);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

// Get video details
router.get("/video", async (req, res) => {
  const { videoId } = req.query;
  if (!videoId) return res.status(400).json({ error: "Missing videoId" });
  try {
    const youtube = getYoutubeClient(req.user.accessToken);
    const resp = await youtube.videos.list({
      part: "snippet,statistics",
      id: videoId,
    });
    res.json(resp.data.items[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update video title/description
router.post("/video/title", async (req, res) => {
  const { videoId, title, description } = req.body;
  if (!videoId || !title)
    return res.status(400).json({ error: "Missing videoId or title" });
  try {
    const youtube = getYoutubeClient(req.user.accessToken);
    const resp = await youtube.videos.update({
      part: "snippet",
      requestBody: {
        id: videoId,
        snippet: { title, description },
      },
    });
    res.json(resp.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// List comments
router.get("/comments", async (req, res) => {
  const { videoId } = req.query;
  if (!videoId) return res.status(400).json({ error: "Missing videoId" });
  try {
    const youtube = getYoutubeClient(req.user.accessToken);
    const resp = await youtube.commentThreads.list({
      part: "snippet,replies",
      videoId,
      maxResults: 50,
    });
    res.json(resp.data.items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Add comment
router.post("/comments", async (req, res) => {
  const { videoId, text } = req.body;
  if (!videoId || !text)
    return res.status(400).json({ error: "Missing videoId or text" });
  try {
    const youtube = getYoutubeClient(req.user.accessToken);
    const resp = await youtube.commentThreads.insert({
      part: "snippet",
      requestBody: {
        snippet: {
          videoId,
          topLevelComment: { snippet: { textOriginal: text } },
        },
      },
    });
    res.json(resp.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Reply to comment
router.post("/comments/reply", async (req, res) => {
  const { parentId, text } = req.body;
  if (!parentId || !text)
    return res.status(400).json({ error: "Missing parentId or text" });
  try {
    const youtube = getYoutubeClient(req.user.accessToken);
    const resp = await youtube.comments.insert({
      part: "snippet",
      requestBody: {
        snippet: {
          parentId,
          textOriginal: text,
        },
      },
    });
    res.json(resp.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete comment
router.delete("/comments/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Missing comment id" });
  try {
    const youtube = getYoutubeClient(req.user.accessToken);
    await youtube.comments.delete({ id });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
