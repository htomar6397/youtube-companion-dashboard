import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import React from "react";

type Props = {
  comments: any[];
  newComment: string;
  setNewComment: (v: string) => void;
  handleAddComment: (e: React.FormEvent) => void;
  reply: { [id: string]: string };
  setReply: (
    cb: (r: { [id: string]: string }) => { [id: string]: string }
  ) => void;
  handleReply: (id: string, e: React.FormEvent) => void;
  handleDeleteComment: (id: string) => void;
};

export default function CommentsSection({
  comments,
  newComment,
  setNewComment,
  handleAddComment,
  reply,
  setReply,
  handleReply,
  handleDeleteComment,
}: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Add Comment Form */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Add New Comment
        </h3>
        <form onSubmit={handleAddComment} className="space-y-3">
          <Input
            value={newComment}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewComment(e.target.value)
            }
            placeholder="Share your thoughts about this video..."
            required
            className="w-full"
          />
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6"
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
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            Post Comment
          </Button>
        </form>
      </div>

      <Separator />

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((c: any) => (
            <div
              key={c.snippet.topLevelComment.id}
              className="bg-gray-50 rounded-lg p-4 space-y-3"
            >
              {/* Main Comment */}
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {c.snippet.topLevelComment.snippet.authorDisplayName
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">
                        {c.snippet.topLevelComment.snippet.authorDisplayName}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {formatDate(
                          c.snippet.topLevelComment.snippet.publishedAt
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-800 leading-relaxed">
                  {c.snippet.topLevelComment.snippet.textDisplay}
                </p>

                <div className="flex items-center space-x-2 pt-2">
                  <Button
                    onClick={() =>
                      handleDeleteComment(c.snippet.topLevelComment.id)
                    }
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
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
                    Delete
                  </Button>
                  <Button
                    onClick={() =>
                      setReply((r) => ({
                        ...r,
                        [c.snippet.topLevelComment.id]:
                          r[c.snippet.topLevelComment.id] === undefined
                            ? ""
                            : r[c.snippet.topLevelComment.id],
                      }))
                    }
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                      />
                    </svg>
                    Reply
                  </Button>
                </div>
              </div>

              {/* Reply Form */}
              {typeof reply[c.snippet.topLevelComment.id] === "string" && (
                <div className="ml-6 bg-white rounded-lg p-3 border border-gray-200">
                  <form
                    onSubmit={(e: React.FormEvent) =>
                      handleReply(c.snippet.topLevelComment.id, e)
                    }
                    className="space-y-3"
                  >
                    <Input
                      value={reply[c.snippet.topLevelComment.id] || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setReply((r) => ({
                          ...r,
                          [c.snippet.topLevelComment.id]: e.target.value,
                        }))
                      }
                      placeholder="Write a reply..."
                      required
                      className="w-full"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Send Reply
                    </Button>
                  </form>
                </div>
              )}

              {/* Replies */}
              {c.replies?.comments && c.replies.comments.length > 0 && (
                <div className="ml-6 space-y-2">
                  <Badge variant="secondary" className="text-xs">
                    {c.replies.comments.length} replies
                  </Badge>
                  {c.replies.comments.map((r: any) => (
                    <div
                      key={r.id}
                      className="bg-white rounded-lg p-3 border border-gray-200"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            {r.snippet.authorDisplayName
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-sm text-gray-900">
                          {r.snippet.authorDisplayName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(r.snippet.publishedAt)}
                        </span>
                      </div>
                      <p className="text-gray-800 text-sm leading-relaxed">
                        {r.snippet.textDisplay}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
