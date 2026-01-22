# Chapter Smith - AI Coding Agent Instructions

## Project Overview

Chapter Smith is a Next.js 15 app that generates timestamped video chapters from YouTube URLs or SRT file uploads. It uses Claude 3 Haiku for AI-powered transcript analysis.

**Core data flow:** YouTube URL → Transcript extraction (YouTube API) → AI chapter generation (Anthropic) → Export (7+ formats)

## Architecture

### Directory Structure
```
src/app/
├── api/                    # Next.js API routes (POST handlers)
│   ├── chapters/generate/  # AI chapter generation endpoint
│   ├── chapters/export/    # Multi-format export endpoint
│   ├── youtube/transcript/ # YouTube transcript fetching
│   └── health/             # Service health checks
├── components/             # Client components ('use client')
├── types/                  # TypeScript interfaces
│   ├── index.ts            # Frontend types (Chapter, VideoInfo, ProcessingState)
│   └── api.ts              # API types (requests/responses, APIErrorCode enum)
└── utils/index.ts          # Client utilities + `api` object for fetch calls
```

### Key Patterns

**API Routes:** All endpoints use `NextRequest`/`NextResponse` with consistent error handling:
```typescript
return createErrorResponse(APIErrorCode.INVALID_FIELD_TYPE, 'Message', details, 400);
```

**Client-Server Communication:** The `api` object in `src/app/utils/index.ts` wraps all fetch calls:
```typescript
import { api } from '../utils';
const result = await api.generateChapters(url);
```

**Types Split:** Frontend types in `types/index.ts`, API types in `types/api.ts`. Import from the appropriate file based on context.

## Developer Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build
npm run lint     # ESLint
```

**Testing:** No test framework is currently configured. When adding tests, consider Vitest or Jest with React Testing Library for component tests.

## Change Logging

Log all code changes in `changelog.md` with:
- Date
- Description of changes
- User prompt that triggered the change

Follow semantic versioning guidelines.

## Environment Variables

Required in `.env.local`:
```
YOUTUBE_API_KEY=xxx      # YouTube Data API v3
ANTHROPIC_API_KEY=xxx    # For Claude 3 Haiku
```

Test configuration: `curl http://localhost:3000/api/health`

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/youtube/transcript` | POST | Fetch transcript from YouTube URL/videoId |
| `/api/chapters/generate` | POST | Generate chapters from transcript using AI |
| `/api/chapters/export` | POST | Export chapters in youtube/json/csv/srt/vtt/xml/markdown |
| `/api/health` | GET | Service health and API key validation |

## Export Formats

Supported formats defined in `src/app/api/chapters/export/route.ts`: `youtube`, `text`, `json`, `csv`, `srt`, `vtt`, `xml`, `markdown`

## Important Conventions

1. **Client Components:** All components in `src/app/components/` use `'use client'` directive
2. **Error Codes:** Use `APIErrorCode` enum from `types/api.ts` for consistent error responses
3. **Timestamps:** Store as seconds internally, format with `formatTime()` for display
4. **Validation:** API routes validate input before processing; see `validateChapterRequest()` pattern

## AI Configuration

Claude 3 Haiku settings in `src/app/api/chapters/generate/route.ts`:
- Temperature: 0.3 (consistent output)
- Max tokens: 4000
- Default chapter constraints: min 60s length, max 20 chapters

## Adding New Features

1. API routes go in `src/app/api/[feature]/route.ts`
2. Add types to `src/app/types/api.ts` (API) or `src/app/types/index.ts` (frontend)
3. Extend `api` object in `src/app/utils/index.ts` for new fetch calls
4. Components in `src/app/components/` with 'use client' directive

## Input Flow (Needs Updates)

The app supports two input methods:
1. **YouTube URL** → Transcript API → Chapter generation (primary flow, may have issues)
2. **SRT Upload** → Direct parsing → Chapter generation (fallback when YouTube transcript unavailable)

When YouTube transcript fetching fails, the app redirects users to the SRT upload flow. This dual-input architecture needs refinement.
