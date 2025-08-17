import { useState, useEffect, useCallback } from "react";

const API_BASE = "http://localhost:3001/api";

interface Note {
  _id: string;
  content: string;
  tags: string;
  createdAt: string;
}

export const useNotes = (isAuthenticated: boolean, videoId: string) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteContent, setNoteContent] = useState("");
  const [noteTags, setNoteTags] = useState("");
  const [search, setSearch] = useState("");
  const [searchTag, setSearchTag] = useState("");

  // Fetch notes when dependencies change
  const fetchNotes = useCallback(async () => {
    if (isAuthenticated && videoId) {
      try {
        const params = new URLSearchParams();
        if (search) params.set("q", search);
        if (searchTag) params.set("tag", searchTag);
        params.set("videoId", videoId);

        const res = await fetch(`${API_BASE}/notes?${params}`, {
          credentials: "include",
        });
        const data = await res.json();
        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    }
  }, [isAuthenticated, videoId, search, searchTag]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Handle add note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: noteContent,
          tags: noteTags,
          videoId,
        }),
        credentials: "include",
      });
      setNoteContent("");
      setNoteTags("");
      await fetchNotes();
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  // Handle delete note
  const handleDeleteNote = async (id: string) => {
    try {
      await fetch(`${API_BASE}/notes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      await fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return {
    notes,
    noteContent,
    setNoteContent,
    noteTags,
    setNoteTags,
    search,
    setSearch,
    searchTag,
    setSearchTag,
    handleAddNote,
    handleDeleteNote,
  };
};
