const { google } = require("googleapis");

function getYoutubeClient(accessToken) {
  return google.youtube({
    version: "v3",
    auth: accessToken,
  });
}

async function getVideoDetails(accessToken, videoId) {
  const youtube = getYoutubeClient(accessToken);
  const res = await youtube.videos.list({
    part: "snippet,statistics",
    id: videoId,
  });
  return res.data.items[0];
}

// Add more YouTube API helpers as needed (comments, update, etc.)

module.exports = { getYoutubeClient, getVideoDetails };
