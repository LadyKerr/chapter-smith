import { auth } from "@/app/lib/auth"

/**
 * Middleware for protecting routes with authentication
 *
 * This middleware runs on the edge and protects specific routes
 * from unauthorized access. It redirects unauthenticated users to
 * the sign-in page.
 *
 * Protected routes:
 * - /api/chapters/* - Chapter generation and export endpoints
 * - /api/youtube/* - YouTube transcript fetching endpoints
 * - /dashboard/* - User dashboard (future)
 *
 * Public routes:
 * - /api/health - Health check endpoint
 * - /api/auth/* - Authentication endpoints
 * - / - Homepage
 */
export { auth as middleware } from "@/app/lib/auth"

/**
 * Matcher configuration
 * Specifies which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api/auth (authentication endpoints)
     * - api/health (health check)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api/auth|api/health|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
