# Changelog

## [Unreleased]

### Added
- **Sample Video Button**: Added "Try with sample video" button to URLInput component for instant demos without needing to find a video. Button pre-fills a known YouTube URL and validates it automatically.
  - Located below the "Generate Chapters" button
  - Includes play icon for visual clarity
  - Disabled during loading state

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

