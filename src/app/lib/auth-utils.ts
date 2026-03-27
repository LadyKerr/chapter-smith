import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/lib/auth'
import { APIErrorCode } from '@/app/types/api'

/**
 * Auth Utilities for Chapter Smith
 *
 * Helper functions for authentication and authorization in API routes
 */

/**
 * Rate limiting store (in-memory)
 * In production, replace with Redis or similar distributed cache
 */
interface RateLimitEntry {
  count: number
  resetAt: number
}

const userRateLimits = new Map<string, RateLimitEntry>()
const ipRateLimits = new Map<string, RateLimitEntry>()

/**
 * Get the current authenticated session
 * Wrapper around NextAuth's auth() function for consistent usage
 */
export async function getServerSession() {
  return await auth()
}

/**
 * Require authentication for an API route
 * Returns the session if authenticated, throws error response if not
 *
 * @param request - Next.js request object
 * @returns Session object if authenticated
 * @throws NextResponse with 401 if not authenticated
 */
export async function requireAuth(request?: NextRequest) {
  const session = await auth()

  if (!session?.user) {
    throw NextResponse.json(
      {
        success: false,
        error: {
          code: APIErrorCode.UNAUTHORIZED,
          message: 'Authentication required. Please sign in to continue.',
          details: {
            loginUrl: '/auth/signin',
          }
        },
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      },
      { status: 401 }
    )
  }

  return session
}

/**
 * Check rate limit for authenticated user
 * Authenticated users get 100 requests per hour
 *
 * @param userId - User ID from session
 * @returns Object with allowed status and retry info
 */
export async function checkUserRateLimit(userId: string): Promise<{
  allowed: boolean
  retryAfter?: number
  limit: number
  remaining: number
}> {
  const now = Date.now()
  const limit = 100 // requests per hour for authenticated users
  const windowMs = 3600000 // 1 hour

  const userLimit = userRateLimits.get(userId)

  // Reset if window expired or no limit exists
  if (!userLimit || userLimit.resetAt < now) {
    userRateLimits.set(userId, { count: 1, resetAt: now + windowMs })
    return { allowed: true, limit, remaining: limit - 1 }
  }

  // Check if limit exceeded
  if (userLimit.count >= limit) {
    const retryAfter = Math.ceil((userLimit.resetAt - now) / 1000)
    return { allowed: false, retryAfter, limit, remaining: 0 }
  }

  // Increment counter
  userLimit.count++
  return { allowed: true, limit, remaining: limit - userLimit.count }
}

/**
 * Check rate limit for anonymous/IP-based requests
 * Anonymous users get 10 requests per hour
 *
 * @param request - Next.js request object
 * @returns Object with allowed status and retry info
 */
export async function checkIpRateLimit(request: NextRequest): Promise<{
  allowed: boolean
  retryAfter?: number
  limit: number
  remaining: number
}> {
  const now = Date.now()
  const limit = 10 // requests per hour for anonymous users
  const windowMs = 3600000 // 1 hour

  const ip = getClientIp(request)
  const ipLimit = ipRateLimits.get(ip)

  // Reset if window expired or no limit exists
  if (!ipLimit || ipLimit.resetAt < now) {
    ipRateLimits.set(ip, { count: 1, resetAt: now + windowMs })
    return { allowed: true, limit, remaining: limit - 1 }
  }

  // Check if limit exceeded
  if (ipLimit.count >= limit) {
    const retryAfter = Math.ceil((ipLimit.resetAt - now) / 1000)
    return { allowed: false, retryAfter, limit, remaining: 0 }
  }

  // Increment counter
  ipLimit.count++
  return { allowed: true, limit, remaining: limit - ipLimit.count }
}

/**
 * Get client IP address from request
 * Checks various headers that proxies might set
 *
 * @param request - Next.js request object
 * @returns IP address string
 */
export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    request.ip ||
    'unknown'
  )
}

/**
 * Get user identifier for logging and tracking
 * Returns user ID if authenticated, otherwise IP address
 *
 * @param request - Next.js request object
 * @param session - Optional session object
 * @returns User identifier string
 */
export async function getUserIdentifier(
  request: NextRequest,
  session?: Awaited<ReturnType<typeof auth>>
): Promise<string> {
  const currentSession = session || await auth()

  if (currentSession?.user?.id) {
    return `user:${currentSession.user.id}`
  }

  return `ip:${getClientIp(request)}`
}

/**
 * Clean up expired rate limit entries (call periodically)
 * In production, this should be handled by Redis TTL
 */
export function cleanupRateLimits() {
  const now = Date.now()

  for (const [key, value] of userRateLimits.entries()) {
    if (value.resetAt < now) {
      userRateLimits.delete(key)
    }
  }

  for (const [key, value] of ipRateLimits.entries()) {
    if (value.resetAt < now) {
      ipRateLimits.delete(key)
    }
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimits, 5 * 60 * 1000)
}
