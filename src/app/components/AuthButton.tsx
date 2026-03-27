'use client'

import { signIn, signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'

/**
 * AuthButton Component
 *
 * Displays authentication state and provides sign in/out functionality
 * - Shows "Sign in with GitHub" button for unauthenticated users
 * - Shows user avatar and name with sign out option for authenticated users
 */
export default function AuthButton() {
  const { data: session, status } = useSession()

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <div className="flex items-center gap-3">
        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
      </div>
    )
  }

  // Show sign in button for unauthenticated users
  if (!session) {
    return (
      <button
        onClick={() => signIn('github', { callbackUrl: '/' })}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
        Sign in with GitHub
      </button>
    )
  }

  // Show user profile for authenticated users
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {session.user?.image && (
          <img
            src={session.user.image}
            alt={session.user.name || 'User avatar'}
            className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-700"
          />
        )}
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {session.user?.name || session.user?.login || 'User'}
          </p>
        </div>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        Sign out
      </button>
    </div>
  )
}
