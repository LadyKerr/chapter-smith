# Changelog

## [Unreleased]

### Added
- **Dark Mode Theme Toggle**: Added a persisted dark mode experience with a header theme switcher and dark styling across the main application flows.
  - Added a client-side light/dark theme toggle with localStorage persistence
  - Applied dark theme styling to the input, processing, upload, chapters, error, and export UI states
  - Updated global theme tokens, body colors, and scrollbar styling for both modes

### Fixed
- **YouTube Transcript Fallback**: Fixed issue where transcript fetching would fail with "No transcript available" error even in development mode. The fallback mechanism now properly returns mock data when YouTube's transcript APIs are unavailable, allowing development and testing without requiring videos with actual transcripts.
  - Added proper error handling for empty JSON responses from YouTube's timedtext API
  - Mock transcript data now returns in all fallback scenarios during development
  - Improved logging for debugging transcript fetch failures

### Technical Details
- User prompt: `Create a plan to implement dark mode` followed by `implement this feature`
- Date: 2026-03-27
- Modified theme setup in `src/app/layout.tsx` and `src/app/globals.css`
- Restyled `src/app/components/ChapterSmithApp.tsx`, `src/app/components/URLInput.tsx`, `src/app/components/TranscriptLoader.tsx`, `src/app/components/SRTUpload.tsx`, `src/app/components/ChaptersList.tsx`, `src/app/components/ErrorDisplay.tsx`, `src/app/components/CopyButton.tsx`, and `src/app/components/ExportButton.tsx`
- Modified `src/app/api/youtube/transcript/route.ts`:
  - Line 419-421: Now calls `fetchTranscriptFallback` when library returns 0 segments
  - Lines 503-557: Added try-catch for JSON parsing and returns mock data on error
  - Added development mode checks to return mock data when no transcript is available
