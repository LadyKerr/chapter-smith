'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

/**
 * Auth Provider Component
 *
 * Wraps the application with NextAuth SessionProvider
 * Must be a client component to use React Context
 */
export default function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
