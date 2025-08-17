import { useState, useEffect } from "react";

const API_BASE = "http://localhost:3001/api";

interface Video {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails?: {
      medium?: { url: string };
    };
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
}

export const useVideo = (isAuthenticated: boolean) => {
  const [videoId, setVideoId] = useState("");
  const [video, setVideo] = useState<Video | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [showVideoInput, setShowVideoInput] = useState(false);

  // Fetch video details when videoId changes
  useEffect(() => {
    if (isAuthenticated && videoId) {
      fetch(`${API_BASE}/youtube/video?videoId=${videoId}`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setVideo(data);
          setEditTitle(data?.snippet?.title || "");
          setEditDesc(data?.snippet?.description || "");
        })
        .catch(console.error);
    }
  }, [videoId, isAuthenticated]);

  // Handle video selection
  const handleVideoSelect = (selectedVideoId: string) => {
    setVideoId(selectedVideoId);
    setShowVideoInput(false);
  };

  // Handle manual video ID input
  const handleVideoIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const inputVideoId = formData.get("videoId") as string;
    if (inputVideoId) {
      // Extract video ID from URL if full URL is provided
      const match = inputVideoId.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
      );
      const extractedId = match ? match[1] : inputVideoId;
      setVideoId(extractedId);
      setShowVideoInput(false);
    }
  };

  // Handle edit video
  const handleEditVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE}/youtube/video/title`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId,
          title: editTitle,
          description: editDesc,
        }),
        credentials: "include",
      });
      // Refetch video
      const res = await fetch(`${API_BASE}/youtube/video?videoId=${videoId}`, {
        credentials: "include",
      });
      const data = await res.json();
      setVideo(data);
    } catch (error) {
      console.error("Error updating video:", error);
    }
  };

  // Reset video selection
  const resetVideo = () => {
    setVideoId("");
    setVideo(null);
  };

  return {
    videoId,
    video,
    editTitle,
    setEditTitle,
    editDesc,
    setEditDesc,
    showVideoInput,
    setShowVideoInput,
    handleVideoSelect,
    handleVideoIdSubmit,
    handleEditVideo,
    resetVideo,
  };
};
