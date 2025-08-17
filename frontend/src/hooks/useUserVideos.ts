import { useState, useEffect } from "react";

const API_BASE = "http://localhost:3001/api";

interface UserVideo {
  id: string;
  snippet: {
    title: string;
    publishedAt: string;
  };
}

export const useUserVideos = (isAuthenticated: boolean) => {
  const [userVideos, setUserVideos] = useState<UserVideo[]>([]);

  // Fetch user's uploaded videos when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetch(`${API_BASE}/youtube/my-videos`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then(setUserVideos)
        .catch(console.error);
    }
  }, [isAuthenticated]);

  return {
    userVideos,
  };
};
