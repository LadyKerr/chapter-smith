# GitHub OAuth Setup Guide for Chapter Smith

This guide will walk you through setting up GitHub OAuth authentication for Chapter Smith.

## Prerequisites

- A GitHub account
- Node.js 20+ installed
- Chapter Smith repository cloned locally

## Step 1: Create a GitHub OAuth Application

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"OAuth Apps"** in the left sidebar
3. Click **"New OAuth App"** button
4. Fill in the application details:
   - **Application name**: `Chapter Smith (Development)` or your preferred name
   - **Homepage URL**: `http://localhost:3000`
   - **Application description**: `AI-powered YouTube chapter generator` (optional)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
5. Click **"Register application"**
6. You'll see your **Client ID** on the next page
7. Click **"Generate a new client secret"** and copy both values

## Step 2: Generate NextAuth Secret

Run this command in your terminal to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output - you'll need this for `NEXTAUTH_SECRET`.

## Step 3: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your values:
   ```bash
   # YouTube Data API v3 Key (from Google Cloud Console)
   YOUTUBE_API_KEY=your_youtube_api_key_here

   # Anthropic Claude API Key (from Anthropic Console)
   ANTHROPIC_API_KEY=your_anthropic_api_key_here

   # NextAuth.js Configuration
   NEXTAUTH_SECRET=<paste the secret from Step 2>
   NEXTAUTH_URL=http://localhost:3000

   # GitHub OAuth Application (from Step 1)
   GITHUB_CLIENT_ID=<your GitHub Client ID>
   GITHUB_CLIENT_SECRET=<your GitHub Client Secret>
   ```

## Step 4: Test the Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser to `http://localhost:3000`

3. Click the **"Sign in with GitHub"** button in the header

4. You should be redirected to GitHub to authorize the app

5. After authorization, you'll be redirected back to Chapter Smith, signed in

## Step 5: Production Setup

When deploying to production, create a **separate** GitHub OAuth App:

1. Follow Step 1 again, but use your production URL:
   - **Homepage URL**: `https://your-domain.com`
   - **Authorization callback URL**: `https://your-domain.com/api/auth/callback/github`

2. In your production environment, set these variables:
   ```bash
   NEXTAUTH_URL=https://your-domain.com
   GITHUB_CLIENT_ID=<production client id>
   GITHUB_CLIENT_SECRET=<production client secret>
   NEXTAUTH_SECRET=<generate a new secret for production>
   ```

## Troubleshooting

### "Configuration" Error
- Check that all environment variables are set in `.env.local`
- Make sure `NEXTAUTH_SECRET` is at least 32 characters

### "OAuth Callback Error"
- Verify the callback URL in GitHub matches exactly: `http://localhost:3000/api/auth/callback/github`
- Check that `NEXTAUTH_URL` matches your current domain

### "Access Denied" Error
- Your GitHub account might not have access
- Check GitHub OAuth app settings for restrictions

### Session Not Persisting
- Clear browser cookies and try again
- Check browser console for errors
- Verify `NEXTAUTH_SECRET` is correctly set

## Rate Limits

With authentication enabled, users get:
- **100 requests per hour** for authenticated users
- **10 requests per hour** for anonymous users (if allowed)

Rate limits are tracked per user ID for authenticated users.

## Security Notes

- **Never** commit `.env.local` to version control
- **Never** share your `NEXTAUTH_SECRET` or OAuth secrets
- Use different OAuth apps for development and production
- Rotate secrets regularly in production
- Enable 2FA on your GitHub account

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [GitHub OAuth Apps Documentation](https://docs.github.com/en/apps/oauth-apps)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
