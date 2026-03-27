import { handlers } from "@/app/lib/auth"

/**
 * NextAuth.js API Route Handler
 *
 * This catch-all route handles all NextAuth.js authentication requests:
 * - GET /api/auth/signin - Sign in page
 * - POST /api/auth/signin/:provider - Initiate OAuth flow
 * - GET /api/auth/callback/:provider - OAuth callback handler
 * - GET /api/auth/signout - Sign out page
 * - POST /api/auth/signout - Sign out action
 * - GET /api/auth/session - Get current session
 * - GET /api/auth/csrf - CSRF token
 * - GET /api/auth/providers - Available providers
 */
export const { GET, POST } = handlers
