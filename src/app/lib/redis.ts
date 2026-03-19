import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

/**
 * Redis client for rate limiting and quota tracking
 * Uses Upstash Redis for serverless-compatible, durable storage
 */
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

/**
 * Rate limiters for different API endpoints
 * Using sliding window algorithm for accurate rate limiting
 */

// Transcript fetching: 10 requests per hour per client
export const transcriptRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 h'),
  analytics: true,
  prefix: '@transcript',
});

// Chapter generation: 20 requests per hour per client
export const chapterGenerationRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 h'),
  analytics: true,
  prefix: '@chapters',
});

// Export endpoint: 50 requests per hour per client
export const exportRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, '1 h'),
  analytics: true,
  prefix: '@export',
});

/**
 * Check if Redis is configured and available
 */
export function isRedisConfigured(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

/**
 * Quota tracking keys
 */
export const QUOTA_KEYS = {
  YOUTUBE_DAILY: 'quota:youtube:daily',
  ANTHROPIC_DAILY: 'quota:anthropic:daily',
  YOUTUBE_HOURLY: 'quota:youtube:hourly',
  ANTHROPIC_HOURLY: 'quota:anthropic:hourly',
} as const;

/**
 * Quota limits (configurable via environment variables)
 */
export const QUOTA_LIMITS = {
  YOUTUBE_DAILY: parseInt(process.env.YOUTUBE_DAILY_QUOTA_LIMIT || '10000', 10),
  ANTHROPIC_DAILY: parseInt(process.env.ANTHROPIC_DAILY_QUOTA_LIMIT || '1000', 10),
  YOUTUBE_HOURLY: parseInt(process.env.YOUTUBE_HOURLY_QUOTA_LIMIT || '500', 10),
  ANTHROPIC_HOURLY: parseInt(process.env.ANTHROPIC_HOURLY_QUOTA_LIMIT || '100', 10),
} as const;

/**
 * Increment quota usage and check if limit is exceeded
 * @param quotaKey - The quota key to check
 * @param limit - The quota limit
 * @param windowSeconds - The time window in seconds (86400 for daily, 3600 for hourly)
 * @returns Object with available status and reset time
 */
export async function checkAndIncrementQuota(
  quotaKey: string,
  limit: number,
  windowSeconds: number
): Promise<{ available: boolean; current: number; limit: number; resetTime: number }> {
  if (!isRedisConfigured()) {
    // If Redis is not configured, log warning and allow request
    console.warn('Redis not configured - quota tracking disabled');
    return {
      available: true,
      current: 0,
      limit,
      resetTime: Date.now() + windowSeconds * 1000,
    };
  }

  try {
    // Get current usage
    const current = await redis.get<number>(quotaKey) || 0;

    // Check if limit exceeded
    if (current >= limit) {
      // Get TTL to determine reset time
      const ttl = await redis.ttl(quotaKey);
      const resetTime = Date.now() + (ttl > 0 ? ttl * 1000 : windowSeconds * 1000);

      return {
        available: false,
        current,
        limit,
        resetTime,
      };
    }

    // Increment usage
    const newCount = await redis.incr(quotaKey);

    // Set expiry if this is the first increment
    if (newCount === 1) {
      await redis.expire(quotaKey, windowSeconds);
    }

    // Get TTL for reset time
    const ttl = await redis.ttl(quotaKey);
    const resetTime = Date.now() + (ttl > 0 ? ttl * 1000 : windowSeconds * 1000);

    return {
      available: true,
      current: newCount,
      limit,
      resetTime,
    };
  } catch (error) {
    console.error('Error checking quota:', error);
    // On error, allow request but log the issue
    return {
      available: true,
      current: 0,
      limit,
      resetTime: Date.now() + windowSeconds * 1000,
    };
  }
}

/**
 * Get current quota usage without incrementing
 */
export async function getQuotaUsage(
  quotaKey: string,
  limit: number
): Promise<{ current: number; limit: number; remaining: number }> {
  if (!isRedisConfigured()) {
    return { current: 0, limit, remaining: limit };
  }

  try {
    const current = await redis.get<number>(quotaKey) || 0;
    return {
      current,
      limit,
      remaining: Math.max(0, limit - current),
    };
  } catch (error) {
    console.error('Error getting quota usage:', error);
    return { current: 0, limit, remaining: limit };
  }
}
