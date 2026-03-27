import NextAuth, { DefaultSession } from "next-auth"
import GitHub from "next-auth/providers/github"

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      login: string
    } & DefaultSession["user"]
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string
    login?: string
  }
}

/**
 * NextAuth.js v5 Configuration
 * Implements GitHub OAuth authentication with JWT session strategy
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'read:user user:email',
        },
      },
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // Store GitHub user info in JWT token on first sign in
      if (account && profile) {
        token.id = String(profile.id)
        token.login = (profile as any).login || profile.email?.split('@')[0]
      }
      return token
    },
    async session({ session, token }) {
      // Add custom fields to session from JWT token
      if (session.user) {
        session.user.id = token.id as string
        session.user.login = token.login as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
})
