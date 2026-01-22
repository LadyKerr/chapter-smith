# Changelog

## [Unreleased]

### Added
- **Dark Mode**: Added full dark mode support with toggle button in the header (2026-01-22)
  - Theme preference persists in localStorage across page reloads
  - Respects system dark mode preference on first visit
  - Smooth transitions between light and dark themes
  - All components styled with dark mode variants
  - User prompt: "add dark mode to the app"
  - Components updated: ThemeToggle (new), ChapterSmithApp, URLInput, ChaptersList, TranscriptLoader, SRTUpload, ErrorDisplay, CopyButton
  - Technical: Uses Tailwind CSS v4's `@variant` directive for class-based dark mode

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
- Added dark mode configuration in `src/app/globals.css`:
  - Line 3: Added `@variant dark (&:where(.dark, .dark *))` for Tailwind CSS v4
  - Custom CSS properties for background and foreground colors
  - Scrollbar styling for both light and dark modes

