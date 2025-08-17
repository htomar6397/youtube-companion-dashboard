import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import React from "react";

type Props = {
  notes: any[];
  noteContent: string;
  setNoteContent: (v: string) => void;
  noteTags: string;
  setNoteTags: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
  searchTag: string;
  setSearchTag: (v: string) => void;
  handleAddNote: (e: React.FormEvent) => void;
  handleDeleteNote: (id: string) => void;
};

export default function NotesSection({
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
}: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      search === "" ||
      note.content.toLowerCase().includes(search.toLowerCase());
    const matchesTag =
      searchTag === "" ||
      (note.tags && note.tags.toLowerCase().includes(searchTag.toLowerCase()));
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-6">
      {/* Add Note Form */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Add New Note</h3>
        <form onSubmit={handleAddNote} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Note Content
            </label>
            <Textarea
              value={noteContent}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setNoteContent(e.target.value)
              }
              placeholder="Write your note here..."
              required
              className="w-full min-h-[100px] resize-vertical"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Tags
            </label>
            <Input
              value={noteTags}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNoteTags(e.target.value)
              }
              placeholder="Enter tags separated by commas (e.g., important, tutorial, idea)"
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Note
          </Button>
        </form>
      </div>

      <Separator />

      {/* Search and Filter */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Search & Filter</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Search Notes
            </label>
            <Input
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
              placeholder="Search in note content..."
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Filter by Tag
            </label>
            <Input
              value={searchTag}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTag(e.target.value)
              }
              placeholder="Filter by tag name..."
              className="w-full"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Notes List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Your Notes</h3>
          <Badge variant="secondary" className="text-xs">
            {filteredNotes.length}{" "}
            {filteredNotes.length === 1 ? "note" : "notes"}
          </Badge>
        </div>

        <div className="space-y-4">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              <p>
                No notes found.{" "}
                {search || searchTag
                  ? "Try adjusting your search criteria."
                  : "Start by adding your first note!"}
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note._id}
                className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {note.content}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleDeleteNote(note._id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50 ml-3"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </Button>
                  </div>

                  {note.tags && (
                    <div className="flex flex-wrap gap-1">
                      {note.tags.split(",").map((tag: string, idx: number) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-xs bg-white/50 text-purple-700 border-purple-200"
                        >
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {note.createdAt && (
                    <div className="text-xs text-gray-500 flex items-center">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {formatDate(note.createdAt)}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
