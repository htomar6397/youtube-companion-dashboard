import { Card, CardHeader, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import React from "react";

interface UserVideo {
  id: string;
  snippet: {
    title: string;
    publishedAt: string;
  };
}

interface VideoSelectionProps {
  userVideos: UserVideo[];
  onVideoSelect: (videoId: string) => void;
}

export const VideoSelection: React.FC<VideoSelectionProps> = ({
  userVideos,
  onVideoSelect,
}) => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold">Select Video to Manage</h1>
            <p className="text-gray-600">Choose from your uploads below</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {userVideos.length > 0 ? (
              <div>
                <h3 className="font-semibold mb-2">Your Recent Uploads:</h3>
                <div className="space-y-2">
                  {userVideos.slice(0, 10).map((video) => (
                    <div
                      key={video.id}
                      className="border rounded p-3 cursor-pointer hover:bg-gray-50"
                      onClick={() => onVideoSelect(video.id)}
                    >
                      <div className="font-medium">{video.snippet.title}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(
                          video.snippet.publishedAt
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-gray-500">No videos found.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
