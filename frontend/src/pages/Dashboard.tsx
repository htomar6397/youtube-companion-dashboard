import { Card, CardHeader, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

// Import custom hooks
import {
  useAuth,
  useVideo,
  useUserVideos,
  useComments,
  useNotes,
} from "../hooks";

// Import components
import {
  AuthScreen,
  LoadingScreen,
  VideoSelection,
  DashboardHeader,
} from "../components/Dashboard";

import VideoSection from "../components/VideoSection";
import CommentsSection from "../components/CommentsSection";
import NotesSection from "../components/NotesSection";
import ApiErrorBoundary from "../components/ApiErrorBoundary";

export default function Dashboard() {
  // Custom hooks for state management
  const { isAuthenticated, loading, handleLogin, handleLogout } = useAuth();

  const {
    videoId,
    video,
    editTitle,
    setEditTitle,
    editDesc,
    setEditDesc,
    handleVideoSelect,
    handleEditVideo,
    resetVideo,
  } = useVideo(isAuthenticated);

  const { userVideos } = useUserVideos(isAuthenticated);

  const {
    comments,
    newComment,
    setNewComment,
    reply,
    setReply,
    handleAddComment,
    handleReply,
    handleDeleteComment,
  } = useComments(isAuthenticated, videoId);

  const {
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
  } = useNotes(isAuthenticated, videoId);

  // Early returns for different states
  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <AuthScreen onLogin={handleLogin} />;
  if (!videoId) {
    return (
      <>
        <DashboardHeader onChangeVideo={resetVideo} onLogout={handleLogout} />
        <VideoSelection
          userVideos={userVideos}
          onVideoSelect={handleVideoSelect}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <DashboardHeader onChangeVideo={resetVideo} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Video Details & Comments */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Details Card */}
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Video Details
                  </h2>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <ApiErrorBoundary componentName="Video Details">
                  <VideoSection
                    video={video}
                    editTitle={editTitle}
                    setEditTitle={setEditTitle}
                    editDesc={editDesc}
                    setEditDesc={setEditDesc}
                    handleEditVideo={handleEditVideo}
                  />
                </ApiErrorBoundary>
              </CardContent>
            </Card>

            {/* Comments Card */}
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-600"
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
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Comments
                  </h2>
                  <Badge variant="secondary" className="ml-auto">
                    {comments.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <ApiErrorBoundary componentName="Comments Section">
                  <CommentsSection
                    comments={comments}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    handleAddComment={handleAddComment}
                    reply={reply}
                    setReply={setReply}
                    handleReply={handleReply}
                    handleDeleteComment={handleDeleteComment}
                  />
                </ApiErrorBoundary>
              </CardContent>
            </Card>
          </div>

          {/* Notes Section */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Personal Notes
                  </h2>
                  <Badge variant="secondary" className="ml-auto">
                    {notes.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <ApiErrorBoundary componentName="Notes Section">
                  <NotesSection
                    notes={notes}
                    noteContent={noteContent}
                    setNoteContent={setNoteContent}
                    noteTags={noteTags}
                    setNoteTags={setNoteTags}
                    search={search}
                    setSearch={setSearch}
                    searchTag={searchTag}
                    setSearchTag={setSearchTag}
                    handleAddNote={handleAddNote}
                    handleDeleteNote={handleDeleteNote}
                  />
                </ApiErrorBoundary>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
