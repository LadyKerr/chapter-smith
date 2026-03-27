'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

/**
 * Auth Error Page
 *
 * Displays authentication errors with helpful messages
 */
export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: Record<string, { title: string; description: string }> = {
    Configuration: {
      title: 'Server Configuration Error',
      description: 'There is a problem with the server configuration. Please contact support.',
    },
    AccessDenied: {
      title: 'Access Denied',
      description: 'You do not have permission to sign in.',
    },
    Verification: {
      title: 'Verification Failed',
      description: 'The sign in link is no longer valid. It may have been used already or expired.',
    },
    OAuthSignin: {
      title: 'OAuth Sign In Error',
      description: 'Error occurred while trying to sign in with OAuth provider.',
    },
    OAuthCallback: {
      title: 'OAuth Callback Error',
      description: 'Error occurred during OAuth callback.',
    },
    OAuthCreateAccount: {
      title: 'Account Creation Failed',
      description: 'Could not create OAuth account in the database.',
    },
    EmailCreateAccount: {
      title: 'Email Account Creation Failed',
      description: 'Could not create email account in the database.',
    },
    Callback: {
      title: 'Callback Error',
      description: 'Error occurred in the callback handler.',
    },
    OAuthAccountNotLinked: {
      title: 'Account Already Exists',
      description: 'This email is already associated with another account. Please sign in with the original provider.',
    },
    SessionRequired: {
      title: 'Sign In Required',
      description: 'You must be signed in to access this page.',
    },
    Default: {
      title: 'Authentication Error',
      description: 'An unexpected error occurred during authentication.',
    },
  }

  const errorInfo = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20">
            <svg
              className="h-6 w-6 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            {errorInfo.title}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {errorInfo.description}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <Link
            href="/auth/signin"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Try signing in again
          </Link>

          <Link
            href="/"
            className="w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Go back home
          </Link>
        </div>

        {error && (
          <div className="text-xs text-center text-gray-500 dark:text-gray-400">
            Error code: {error}
          </div>
        )}
      </div>
    </div>
  )
}
