# Changelog

## [0.2.0] - 2026-07-20

### Switched AI provider from Anthropic (Claude) to OpenAI

**User prompt:** "project needs to switch to using openai apikey instead of claude key" → "ye lets make the switch use subagents to help"

### Changed
- `src/app/api/chapters/generate/route.ts`: `generateChaptersWithAI` now calls OpenAI chat completions (`https://api.openai.com/v1/chat/completions`) with `Authorization: Bearer` auth, model `gpt-4o-mini`, system prompt moved into the `messages` array; response parsed from `choices[0].message.content`. Reads `OPENAI_API_KEY`.
- `src/app/api/health/route.ts`: checks `OPENAI_API_KEY`, tests connectivity against `https://api.openai.com/v1/models`; `services.anthropic` response key renamed to `services.openai` (no external consumers — verified by grep)
- `.env.example` and `README.md`: `ANTHROPIC_API_KEY` → `OPENAI_API_KEY`, provider docs/links/pricing updated
- `src/app/types/api.ts`: model example comment updated

### Removed
- `@anthropic-ai/sdk` dependency (was unused — the API was always called via raw `fetch`)

### Verified
- `tsc --noEmit` clean, lint 0 errors, `next build` green
- Live smoke test with real `OPENAI_API_KEY`: `/api/health` reports `openai: "up"`; `/api/chapters/generate` produced real chapters end-to-end via gpt-4o-mini

## [0.1.1] - 2026-07-20

### Deployment readiness fixes

**User prompt:** "I need to deploy this project, can you check if the project is ready to be deployed and let me know if it's not and what needs updating. Make a plan for the updates" → "ok start at phase 1 and continue until complete please"

### Fixed
- **Production build failure (12 TypeScript errors)**:
  - `src/app/api/chapters/export/route.ts`: hoisted `body` declaration so the `catch` block can reference it; replaced a broken IIFE in the CSV header builder with `chapters.some(ch => ch.endTime !== undefined)`
  - `src/app/api/chapters/generate/route.ts`: typed `videoInfo` as `YouTubeVideoInfo | null` and construct complete objects; added `description` to fallback videoInfo
  - `src/app/api/youtube/transcript/route.ts`: `extractVideoIdFromUrl` null → undefined coercion; removed unsupported `country` option from `YoutubeTranscript.fetchTranscript`; replaced `request.ip` (removed in Next 15) with `x-forwarded-for` header parsing
  - `src/app/components/ExportButton.tsx`: removed dead `disabled={exportState === 'exporting'}` checks inside blocks already guarded by `exportState !== 'exporting'`
  - `src/app/components/ChapterSmithApp.tsx`: `setVideoInfo(... ?? null)` for `VideoInfo | undefined` → `VideoInfo | null`
  - `src/app/types/api.ts`: made `ProcessingMetrics` fields optional so error-path metrics logging type-checks
- **29 ESLint errors** (blocked `next build`): replaced all `any` types with proper types (`unknown`, `VideoInfo`, `Chapter`, `ChapterOptions`, `AIChapterCandidate`, typed metrics objects); escaped unescaped quotes/apostrophes in JSX (`ChaptersList.tsx`, `SRTUpload.tsx`); replaced `.apply()` with spread in `debounce` (`utils/index.ts`)

### Security
- Upgraded `next` 15.4.6 → 15.5.20 and `eslint-config-next` to match, resolving critical advisories (SSRF via middleware redirect handling GHSA-4342-x723-ch2f, RCE in React flight protocol GHSA-9qr9-h5gf-34mp)
- `npm audit fix` resolved remaining fixable transitive vulnerabilities (tar, flatted, form-data, minimatch, js-yaml, ajv, brace-expansion)
- Known remaining: 2 moderate advisories from `postcss` bundled inside Next.js itself — present in all current Next versions, not actionable downstream

### Added
- `.env.example` documenting required environment variables (`YOUTUBE_API_KEY`, `ANTHROPIC_API_KEY`, `NEXT_PUBLIC_APP_URL`); `.gitignore` exception for it

### Verified
- `npx tsc --noEmit` clean, `next lint` 0 errors, `next build` succeeds
- Production server smoke-tested: `/` 200, `/api/health` responds (reports `not_configured` without local keys, as designed), `/api/chapters/export` POST success and validation-error paths both work

## [Unreleased]

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

