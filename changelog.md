# Changelog

## [Unreleased]

### Security
- **Redact API keys from error responses**: Fixed a vulnerability where the YouTube API key could leak to clients in error responses when the upstream YouTube Data API returned non-2xx responses.
  - Removed `url` (containing API key) and raw `errorBody` from YouTubeAPIError details in transcript endpoint
  - Redacted raw upstream response body from console.error logs
  - Added `sanitizeErrorDetails()` defense-in-depth to `createErrorResponse` in all API routes (transcript, generate, export) to strip sensitive fields (`url`, `errorBody`, `apiKey`, `key`, `token`, `secret`, `password`, `authorization`) and redact string values containing API key patterns

### Fixed
- **YouTube Transcript Fallback**: Fixed issue where transcript fetching would fail with "No transcript available" error even in development mode. The fallback mechanism now properly returns mock data when YouTube's transcript APIs are unavailable, allowing development and testing without requiring videos with actual transcripts.
  - Added proper error handling for empty JSON responses from YouTube's timedtext API
  - Mock transcript data now returns in all fallback scenarios during development
  - Improved logging for debugging transcript fetch failures

### Technical Details
- Modified `src/app/api/youtube/transcript/route.ts`:
  - Line 419-421: Now calls `fetchTranscriptFallback` when library returns 0 segments
  - Lines 503-557: Added try-catch for JSON parsing and returns mock data on error
  - Added development mode checks to return mock data when no transcript is available

