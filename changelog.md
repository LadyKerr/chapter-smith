# Changelog

## [Unreleased]

### Added
- **GitHub Authentication Flow**: Added Auth.js-based GitHub sign-in to protect transcript lookup, chapter generation, and export actions behind authenticated sessions.
  - Added App Router auth handler configuration for GitHub OAuth
  - Wrapped the app in a shared session provider and added signed-in/signed-out UI states
  - Blocked protected API routes when no authenticated GitHub session is present
  - Updated README environment variable documentation for GitHub OAuth setup

### Fixed
- **Auth API Error Shape**: Hardened the shared API auth gate so Auth.js session failures return structured API errors and unauthenticated responses match the existing error envelope.
  - Added `details: null` and development-only stack traces to auth gate error responses
  - Catches and logs Auth.js session check failures instead of allowing generic 500 responses
  - User prompt: `hey can you take a look at PR #19 and look at the comments and update the code as needed`

- **YouTube Transcript Fallback**: Fixed issue where transcript fetching would fail with "No transcript available" error even in development mode. The fallback mechanism now properly returns mock data when YouTube's transcript APIs are unavailable, allowing development and testing without requiring videos with actual transcripts.
  - Added proper error handling for empty JSON responses from YouTube's timedtext API
  - Mock transcript data now returns in all fallback scenarios during development
  - Improved logging for debugging transcript fetch failures

### Technical Details
- Modified `src/app/api/youtube/transcript/route.ts`:
  - Line 419-421: Now calls `fetchTranscriptFallback` when library returns 0 segments
  - Lines 503-557: Added try-catch for JSON parsing and returns mock data on error
  - Added development mode checks to return mock data when no transcript is available
