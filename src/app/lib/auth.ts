import { NextRequest } from 'next/server';
import { redis, isRedisConfigured } from './redis';

/**
 * Authentication configuration
 */
export const AUTH_CONFIG = {
  // Allow unauthenticated requests if set to false (for development)
  REQUIRE_API_KEY: process.env.REQUIRE_API_KEY === 'true',
  // Master API keys (comma-separated in environment variable)
  API_KEYS: (process.env.API_KEYS || '').split(',').filter(Boolean),
  // API key header name
  API_KEY_HEADER: 'x-api-key',
} as const;

/**
 * Extract API key from request
 */
export function getApiKeyFromRequest(request: NextRequest): string | null {
  return request.headers.get(AUTH_CONFIG.API_KEY_HEADER);
}

/**
 * Validate API key
 * @returns true if valid, false otherwise
 */
export async function validateApiKey(apiKey: string | null): Promise<boolean> {
  if (!apiKey) {
    return false;
  }

  // Check against configured API keys
  if (AUTH_CONFIG.API_KEYS.includes(apiKey)) {
    return true;
  }

  // If Redis is configured, check for dynamic API keys
  if (isRedisConfigured()) {
    try {
      const isValid = await redis.get<boolean>(`api-key:${apiKey}`);
      return isValid === true;
    } catch (error) {
      console.error('Error validating API key:', error);
      return false;
    }
  }

  return false;
}

/**
 * Check if request is authenticated
 * If authentication is not required, always returns true
 */
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  // If authentication is not required, allow request
  if (!AUTH_CONFIG.REQUIRE_API_KEY) {
    return true;
  }

  const apiKey = getApiKeyFromRequest(request);
  return validateApiKey(apiKey);
}

/**
 * Get client identifier for rate limiting
 * Uses API key if available, otherwise falls back to IP address
 */
export function getClientIdentifier(request: NextRequest): string {
  // Use API key as identifier if available
  const apiKey = getApiKeyFromRequest(request);
  if (apiKey) {
    return `key:${apiKey}`;
  }

  // Fallback to IP address
  const ip = request.ip ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'anonymous';

  return `ip:${ip}`;
}

/**
 * Create API key (for administrative use)
 * @param keyName - Descriptive name for the API key
 * @param expirySeconds - Optional expiry time in seconds
 * @returns The generated API key
 */
export async function createApiKey(
  keyName: string,
  expirySeconds?: number
): Promise<string> {
  if (!isRedisConfigured()) {
    throw new Error('Redis must be configured to create dynamic API keys');
  }

  // Generate secure random key
  const apiKey = `sk_${Date.now()}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

  // Store in Redis
  await redis.set(`api-key:${apiKey}`, true, expirySeconds ? { ex: expirySeconds } : {});

  // Store metadata
  await redis.set(
    `api-key-meta:${apiKey}`,
    JSON.stringify({
      name: keyName,
      createdAt: new Date().toISOString(),
      expiresAt: expirySeconds ? new Date(Date.now() + expirySeconds * 1000).toISOString() : null,
    }),
    expirySeconds ? { ex: expirySeconds } : {}
  );

  return apiKey;
}

/**
 * Revoke API key
 */
export async function revokeApiKey(apiKey: string): Promise<boolean> {
  if (!isRedisConfigured()) {
    return false;
  }

  try {
    await redis.del(`api-key:${apiKey}`);
    await redis.del(`api-key-meta:${apiKey}`);
    return true;
  } catch (error) {
    console.error('Error revoking API key:', error);
    return false;
  }
}
