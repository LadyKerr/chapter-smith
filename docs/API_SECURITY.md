# API Security Implementation

## Overview

This document describes the security implementation for the Chapter Smith API, including authentication, rate limiting, and quota management.

## Security Features

### 1. Authentication

All cost-bearing API endpoints require authentication via API key:

- **Header**: `x-api-key`
- **Format**: String API key
- **Endpoints Protected**:
  - `POST /api/youtube/transcript`
  - `POST /api/chapters/generate`
  - `POST /api/chapters/export`

#### Configuration

Authentication can be configured via environment variables:

```bash
# Require API keys (recommended for production)
REQUIRE_API_KEY=true

# Comma-separated list of valid API keys
API_KEYS=key1,key2,key3
```

For development, authentication can be disabled:

```bash
REQUIRE_API_KEY=false
```

### 2. Rate Limiting

Rate limits are enforced per client (identified by API key or IP address) using Upstash Redis with a sliding window algorithm.

#### Rate Limit Configuration

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/youtube/transcript` | 10 requests | 1 hour |
| `/api/chapters/generate` | 20 requests | 1 hour |
| `/api/chapters/export` | 50 requests | 1 hour |

#### Rate Limit Response

When rate limit is exceeded, the API returns:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "details": {
      "retryAfter": 3600
    }
  }
}
```

**HTTP Status**: `429 Too Many Requests`

**Headers**:
- `Retry-After`: Seconds until rate limit resets

### 3. Quota Management

API quotas track upstream service consumption and prevent abuse:

#### YouTube API Quotas

- **Daily Quota**: 10,000 units (default)
- **Hourly Quota**: 500 units (default)

#### Anthropic API Quotas

- **Daily Quota**: 1,000 requests (default)
- **Hourly Quota**: 100 requests (default)

#### Quota Configuration

Configure via environment variables:

```bash
YOUTUBE_DAILY_QUOTA_LIMIT=10000
YOUTUBE_HOURLY_QUOTA_LIMIT=500
ANTHROPIC_DAILY_QUOTA_LIMIT=1000
ANTHROPIC_HOURLY_QUOTA_LIMIT=100
```

#### Quota Exceeded Response

When quota is exceeded, the API returns:

```json
{
  "success": false,
  "error": {
    "code": "YOUTUBE_QUOTA_EXCEEDED",
    "message": "YouTube API daily quota exceeded",
    "details": {
      "resetTime": 1710892800000
    }
  }
}
```

**HTTP Status**: `503 Service Unavailable`

## Infrastructure Requirements

### Upstash Redis

The security implementation requires Upstash Redis for:
- Durable rate limiting
- Quota tracking
- Multi-instance deployment support

#### Setup

1. Create an Upstash Redis database at https://console.upstash.com/
2. Add credentials to `.env.local`:

```bash
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here
```

3. If Redis is not configured, the system will:
   - Log warnings
   - Allow requests (fail-open for development)
   - Not enforce rate limits or quotas

## Client Integration

### Making Authenticated Requests

```bash
curl -X POST https://your-domain.com/api/youtube/transcript \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key_here" \
  -d '{"url": "https://youtube.com/watch?v=..."}'
```

### Handling Rate Limits

```javascript
async function makeRequest(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.API_KEY,
    },
    body: JSON.stringify(data),
  });

  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    console.log(`Rate limited. Retry after ${retryAfter} seconds`);
    // Implement exponential backoff
    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
    return makeRequest(url, data); // Retry
  }

  return response.json();
}
```

## Security Best Practices

### Production Deployment

1. **Always require API keys in production**:
   ```bash
   REQUIRE_API_KEY=true
   ```

2. **Set appropriate quota limits** based on your budget:
   ```bash
   YOUTUBE_DAILY_QUOTA_LIMIT=5000
   ANTHROPIC_DAILY_QUOTA_LIMIT=500
   ```

3. **Use Upstash Redis** for durable rate limiting:
   - Survives server restarts
   - Works across multiple instances
   - Provides analytics

4. **Monitor quota usage** via logs and Redis keys:
   ```bash
   quota:youtube:daily
   quota:youtube:hourly
   quota:anthropic:daily
   quota:anthropic:hourly
   ```

### API Key Management

1. **Generate secure API keys**:
   ```bash
   openssl rand -hex 32
   ```

2. **Rotate keys regularly**

3. **Use different keys for different clients/services**

4. **Never commit API keys to version control**

### Rate Limit Tuning

Adjust rate limits in `src/app/lib/redis.ts`:

```typescript
// Transcript fetching: 10 requests per hour per client
export const transcriptRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 h'),
  analytics: true,
  prefix: '@transcript',
});
```

## Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `UNAUTHORIZED` | Missing or invalid API key | 401 |
| `FORBIDDEN` | Access denied | 403 |
| `RATE_LIMIT_EXCEEDED` | Rate limit exceeded | 429 |
| `YOUTUBE_QUOTA_EXCEEDED` | YouTube API quota exceeded | 503 |
| `ANTHROPIC_QUOTA_EXCEEDED` | Anthropic API quota exceeded | 503 |

## Monitoring and Debugging

### Check Rate Limit Status

The rate limiter provides analytics in Upstash Redis. View metrics in the Upstash console.

### Check Quota Usage

Query Redis directly to check current usage:

```bash
# Daily YouTube quota
redis-cli GET quota:youtube:daily

# Hourly Anthropic quota
redis-cli GET quota:anthropic:hourly
```

### Logs

Security events are logged to console:

- Authentication failures
- Rate limit violations
- Quota exhaustions
- Redis connection errors

## Troubleshooting

### "Redis not configured" warnings

**Cause**: Missing or invalid Upstash Redis credentials

**Solution**:
1. Check `.env.local` has `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
2. Verify credentials are correct
3. Test connection at https://console.upstash.com/

### Rate limits not working

**Possible causes**:
1. Redis not configured (system fails open)
2. Multiple API keys bypassing per-key limits
3. Clock skew between servers

**Solution**: Check Redis configuration and ensure time synchronization

### Quota resets not working

**Possible causes**:
1. Redis TTL not being set correctly
2. Keys not expiring

**Solution**: Manually delete quota keys in Redis to force reset:
```bash
redis-cli DEL quota:youtube:daily
```

## Future Enhancements

- [ ] API key management dashboard
- [ ] Per-key quota limits
- [ ] Webhook notifications for quota thresholds
- [ ] Rate limit bypass for premium tiers
- [ ] JWT-based authentication
- [ ] OAuth integration
