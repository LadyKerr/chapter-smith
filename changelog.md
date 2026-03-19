# Changelog

## [Unreleased]

### Added
- **API Security & Rate Limiting** (2026-03-19): Implemented comprehensive authentication, rate limiting, and quota management for all cost-bearing API endpoints to prevent abuse and quota exhaustion.
  - Added API key-based authentication via `x-api-key` header
  - Implemented Redis-backed rate limiting using Upstash for durable, multi-instance support
  - Added YouTube API quota tracking (daily and hourly limits)
  - Added Anthropic API quota tracking (daily and hourly limits)
  - Proper 401, 429, and 503 error responses with retry-after headers
  - Configurable via environment variables for flexible deployment
  - User Prompt: "Complete issue #7 - Enforce auth and rate limits on public APIs"

### Security Features
- **Authentication**:
  - All cost-bearing endpoints now require valid API key when `REQUIRE_API_KEY=true`
  - Supports both static API keys (env var) and dynamic keys (Redis-backed)
  - Graceful degradation for development (authentication optional)

- **Rate Limiting**:
  - Transcript endpoint: 10 requests/hour per client
  - Chapter generation: 20 requests/hour per client
  - Export endpoint: 50 requests/hour per client
  - Uses sliding window algorithm for accurate enforcement
  - Client identification by API key or IP address

- **Quota Management**:
  - YouTube API: 10,000 daily / 500 hourly (configurable)
  - Anthropic API: 1,000 daily / 100 hourly (configurable)
  - Automatic quota reset based on time windows
  - Prevents upstream provider calls when quotas exhausted

### Technical Implementation
- Created `src/app/lib/redis.ts`:
  - Redis client configuration using Upstash
  - Rate limiter instances for each endpoint
  - Quota tracking functions with automatic expiry
  - Graceful error handling when Redis unavailable

- Created `src/app/lib/auth.ts`:
  - API key validation (static and dynamic)
  - Client identification for rate limiting
  - API key creation and revocation utilities
  - Configurable authentication requirements

- Modified `src/app/api/youtube/transcript/route.ts`:
  - Added authentication check at request start
  - Replaced placeholder `checkRateLimit()` with Redis-backed implementation
  - Replaced placeholder `checkYouTubeQuota()` with quota tracking
  - Removed duplicate `getClientIdentifier()` function
  - Imports auth and rate limiting from shared libraries

- Modified `src/app/api/chapters/generate/route.ts`:
  - Added authentication requirement
  - Added rate limiting (20 req/hour)
  - Added Anthropic API quota tracking (daily & hourly)
  - Returns proper 401/429/503 error responses

- Modified `src/app/api/chapters/export/route.ts`:
  - Added authentication requirement
  - Added rate limiting (50 req/hour)
  - Returns proper 401/429 error responses

- Modified `src/app/types/api.ts`:
  - Added `UNAUTHORIZED`, `FORBIDDEN`, `INVALID_API_KEY` error codes
  - Added `ANTHROPIC_QUOTA_EXCEEDED` error code
  - Existing `RateLimitInfo` and `YouTubeQuotaInfo` types now utilized

### Documentation
- Created `docs/API_SECURITY.md`:
  - Complete security implementation guide
  - Authentication setup instructions
  - Rate limiting configuration details
  - Quota management explanation
  - Client integration examples
  - Troubleshooting guide
  - Production deployment best practices

- Created `.env.example`:
  - Documents all required environment variables
  - Provides sensible defaults
  - Explains Redis configuration
  - Shows quota limit customization

### Dependencies Added
- `@upstash/redis`: Redis client for serverless environments
- `@upstash/ratelimit`: Sliding window rate limiting library

### Configuration
All security features configurable via environment variables:
- `REQUIRE_API_KEY`: Enable/disable authentication
- `API_KEYS`: Comma-separated list of valid API keys
- `UPSTASH_REDIS_REST_URL`: Redis connection URL
- `UPSTASH_REDIS_REST_TOKEN`: Redis authentication token
- `YOUTUBE_DAILY_QUOTA_LIMIT`: YouTube daily quota (default: 10000)
- `YOUTUBE_HOURLY_QUOTA_LIMIT`: YouTube hourly quota (default: 500)
- `ANTHROPIC_DAILY_QUOTA_LIMIT`: Anthropic daily quota (default: 1000)
- `ANTHROPIC_HOURLY_QUOTA_LIMIT`: Anthropic hourly quota (default: 100)

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

