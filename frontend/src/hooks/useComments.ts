import { useState, useEffect, useCallback } from "react";

const API_BASE = "http://localhost:3001/api";

interface Comment {
  snippet: {
    topLevelComment: {
      id: string;
      snippet: {
        authorDisplayName: string;
        textDisplay: string;
        publishedAt: string;
      };
    };
  };
  replies?: {
    comments: Array<{
      id: string;
      snippet: {
        authorDisplayName: string;
        textDisplay: string;
        publishedAt: string;
      };
    }>;
  };
}

export const useComments = (isAuthenticated: boolean, videoId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [reply, setReply] = useState<{ [id: string]: string }>({});

  const fetchComments = useCallback(async () => {
    if (isAuthenticated && videoId) {
      try {
        const res = await fetch(
          `${API_BASE}/youtube/comments?videoId=${videoId}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
  }, [isAuthenticated, videoId]);

  // Fetch comments when videoId changes
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Handle add comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE}/youtube/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, text: newComment }),
        credentials: "include",
      });
      setNewComment("");
      await fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Handle reply
  const handleReply = async (id: string, e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE}/youtube/comments/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentId: id, text: reply[id] }),
        credentials: "include",
      });
      setReply((r) => ({ ...r, [id]: "" }));
      await fetchComments();
    } catch (error) {
      console.error("Error replying:", error);
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (id: string) => {
    try {
      await fetch(`${API_BASE}/youtube/comments/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      await fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return {
    comments,
    newComment,
    setNewComment,
    reply,
    setReply,
    handleAddComment,
    handleReply,
    handleDeleteComment,
  };
};
