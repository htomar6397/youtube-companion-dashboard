import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import React from "react";

type Props = {
  video: any;
  editTitle: string;
  setEditTitle: (v: string) => void;
  editDesc: string;
  setEditDesc: (v: string) => void;
  handleEditVideo: (e: React.FormEvent) => void;
};

export default function VideoSection({
  video,
  editTitle,
  setEditTitle,
  editDesc,
  setEditDesc,
  handleEditVideo,
}: Props) {
  if (!video) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-3">
          <div className="animate-pulse rounded-lg bg-gray-200 h-48 w-80"></div>
          <p className="text-gray-500">Loading video details...</p>
        </div>
      </div>
    );
  }

  const formatNumber = (num: string) => {
    return parseInt(num).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Video Info Display */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Current Video
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Title
              </span>
              <p className="text-gray-900 font-medium">{video.snippet.title}</p>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Description
              </span>
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                {video.snippet.description || "No description available"}
              </p>
            </div>

            <div className="flex items-center space-x-4 pt-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                {formatNumber(video.statistics.viewCount)} views
              </Badge>

              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {formatNumber(video.statistics.likeCount || "0")} likes
              </Badge>

              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-800"
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                {formatNumber(video.statistics.commentCount || "0")} comments
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Edit Form */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Edit Video Details
        </h3>
        <form onSubmit={handleEditVideo} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video Title
            </label>
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Enter new title"
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video Description
            </label>
            <Input
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              placeholder="Enter new description"
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Update Video
          </Button>
        </form>
      </div>
    </div>
  );
}
