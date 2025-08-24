# YouTube Companion Dashboard (MVP)

## Overview

A minimal dashboard to manage YouTube videos with proper Google OAuth authentication, comment management, and personal notes. All actions are logged for auditing and improvement tracking.

## Features

- **Google OAuth Authentication** - Secure login with YouTube API access
- **Video Selection** - Choose from your uploads or enter any video ID/URL
- **Video Management** - Edit title and description
- **Comment System** - Add, reply to, and delete comments
- **Personal Notes** - Add tagged notes with search functionality
- **Activity Logging** - Track all actions in the dashboard

## Setup Instructions

### 1. Google OAuth Setup (REQUIRED)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **YouTube Data API v3**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Configure OAuth consent screen
6. Add these scopes:
   - `https://www.googleapis.com/auth/youtube.readonly`
   - `https://www.googleapis.com/auth/youtube.force-ssl`
   - `https://www.googleapis.com/auth/youtube`
7. Set redirect URI: `http://localhost:3001/api/auth/google/callback`
8. Copy your **Client ID** and **Client Secret**

### 2. Environment Variables

Update `backend/.env` file with your OAuth credentials:

```env
# MongoDB connection
MONGO_URI=mongodb://localhost:27017/ytdashboard

# Google OAuth Configuration (REPLACE WITH YOUR VALUES)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback
SESSION_SECRET=your_random_session_secret_here
```

## User Flow

### Step 1: Login with Google (OAuth)

1. Open `http://localhost:5173`
2. Click "Login with Google"
3. Authorize YouTube access (readonly, force-ssl, upload scopes)
4. App stores access/refresh tokens securely

### Step 2: Upload Video (Manual Step)

1. Upload video directly in YouTube Studio (can be unlisted)
2. Copy video link/ID into the app OR select from your recent uploads

### Step 3: Home Dashboard

- Video title, description, thumbnail
- Stats (views, likes, comments count)
- Central video management page

### Step 4: Manage Video

- **Edit Title & Description** → `videos.update` API
- **Comment System**:
  - Add comment → `commentThreads.insert`
  - Reply to comment → `comments.insert`
  - Delete comment → `comments.delete`
  - View comments → `commentThreads.list`

### Step 5: Notes Section

- Write personal notes (stored in your DB, not YouTube)
- Tag notes (`improvement`, `SEO`, `thumbnail ideas`)
- Search/filter notes by keywords or tags

### Step 6: Event Logging

- Every action logged: "Fetched video at 12:05", "Updated title at 12:20"
- "Posted comment ID 12345 at 12:30", "Added note: Improve intro music"

### Step 7: Search/Tag Notes

- Find past notes with keywords/tags
- Example: search `"thumbnail"` shows all thumbnail ideas
- Edit the video's title and description
- Notes section (stored in MongoDB) for jotting down ideas
- Search and tag notes for easy retrieval
- All user actions (comments, edits, notes, etc.) are logged in the database

## API Endpoints

### Authentication

- `GET /api/auth/google` — Start Google OAuth flow
- `GET /api/auth/google/callback` — OAuth callback handler
- `GET /api/auth/status` — Check authentication status

### Video (YouTube API)

- `GET /api/youtube/my-videos` — Get user's uploaded videos
- `GET /api/youtube/video?videoId=VIDEO_ID` — Get video details
- `POST /api/youtube/video/title` — Update video title/description
  - Body: `{ videoId, title, description }`

### Comments (YouTube API)

- `GET /api/youtube/comments?videoId=VIDEO_ID` — List comments
- `POST /api/youtube/comments` — Add comment
  - Body: `{ videoId, text }`
- `POST /api/youtube/comments/reply` — Reply to comment
  - Body: `{ parentId, text }`
- `DELETE /api/youtube/comments/:id` — Delete own comment

### Notes (MongoDB)

- `GET /api/notes` — List/search notes (`?q=search&tag=tag&videoId=VIDEO_ID`)
- `POST /api/notes` — Add note
  - Body: `{ content, tags, videoId }`
- `DELETE /api/notes/:id` — Delete note

### Logs (MongoDB)

- `GET /api/logs` — List event logs (all user actions)

## Database Schema (MongoDB)

### users

| Field        | Type     | Description               |
| ------------ | -------- | ------------------------- |
| \_id         | ObjectId | User ID                   |
| googleId     | String   | Google account ID         |
| email        | String   | User email                |
| name         | String   | User name                 |
| accessToken  | String   | YouTube API access token  |
| refreshToken | String   | YouTube API refresh token |
| tokenExpiry  | Date     | Access token expiry       |
| createdAt    | Date     | User creation timestamp   |

### notes

| Field      | Type     | Description          |
| ---------- | -------- | -------------------- |
| \_id       | ObjectId | Note ID              |
| userId     | ObjectId | User ID (ref)        |
| videoId    | String   | YouTube video ID     |
| content    | String   | Note content         |
| tags       | String   | Comma-separated tags |
| created_at | Date     | Creation timestamp   |

### logs

| Field      | Type     | Description                |
| ---------- | -------- | -------------------------- |
| \_id       | ObjectId | Log ID                     |
| userId     | ObjectId | User ID (ref)              |
| event      | String   | Event type (e.g. add_note) |
| details    | String   | Event details              |
| created_at | Date     | Event timestamp            |

## Event Logging

All user actions are automatically logged in the `logs` collection for traceability:

- **Video Actions**: Fetching video details, updating title/description
- **Comment Actions**: Adding comments, replying, deleting comments
- **Note Actions**: Adding, deleting, searching notes
- **Authentication**: Login/logout events

## Deployment Guide

### Prerequisites

1. MongoDB Atlas account (or local MongoDB for development)
2. Google Cloud Console project with YouTube API enabled
3. Deployment platforms:
   - **Backend**: Render, Railway, Heroku, or Vercel
   - **Frontend**: Vercel, Netlify, or Cloudflare Pages

### Backend Deployment (Example: Render)

1. **Environment Variables** (Set in deployment platform):

```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/ytdashboard
GOOGLE_CLIENT_ID=your_production_client_id
GOOGLE_CLIENT_SECRET=your_production_client_secret
GOOGLE_REDIRECT_URI=https://your-api-domain.com/api/auth/google/callback
SESSION_SECRET=your_secure_random_string
```

2. **Update OAuth Redirect URI** in Google Cloud Console:
   - Add production callback URL: `https://your-api-domain.com/api/auth/google/callback`

### Frontend Deployment (Example: Vercel)

1. **Update API Base URL** in `frontend/src/pages/Dashboard.tsx`:

```typescript
const API_BASE = "https://your-api-domain.com/api";
```

2. **Environment Variables** (if needed):

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### Quick Deploy Commands

```bash
# Backend (Render/Railway)
git push origin main

# Frontend (Vercel)
npm run build
vercel --prod
```


## Architecture

**Backend**: Node.js + Express + MongoDB + Google OAuth2 + YouTube Data API v3  
**Frontend**: React + TypeScript + Vite + shadcn/ui + Tailwind CSS  
**Authentication**: Google OAuth with YouTube API scopes  
**Database**: MongoDB with Mongoose ODM  
**APIs**: RESTful API design with proper error handling

