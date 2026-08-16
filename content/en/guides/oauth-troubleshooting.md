---
title: OAuth Troubleshooting
description: Fixing redirect_uri mismatches and OAuth callback issues on Vercel
tags:
  - oauth
  - vercel
  - troubleshooting
status: evergreen
visibility: public
category: authentication
difficulty: intermediate
order: 8
created: '2026-06-11'
---

## Error: "The redirect_uri is not associated with this application"

This error occurs when the `redirect_uri` parameter sent to GitHub doesn't match what's configured in your GitHub OAuth App settings.

## Current Configuration

### GitHub OAuth App Settings (Correct ✓)

- **Application name**: Kickstart
- **Homepage URL**: `https://nuxt-kickstart.example.com`
- **Authorization callback URL**: `https://nuxt-kickstart.example.com/api/auth/callback/github`

## Required Vercel Environment Variables

Go to your Vercel project → Settings → Environment Variables and verify:

### 1. BETTER_AUTH_URL (CRITICAL)

```
BETTER_AUTH_URL=https://nuxt-kickstart.example.com
```

**Important:**

- NO trailing slash
- Must be HTTPS in production
- Must match exactly what users type in browser
- This is used by Better Auth to construct OAuth callback URLs

### 2. NUXT_PUBLIC_SITE_URL

```
NUXT_PUBLIC_SITE_URL=https://nuxt-kickstart.example.com
```

**Important:**

- Should match BETTER_AUTH_URL
- Used for generating absolute URLs

### 3. GitHub OAuth Credentials

```
NUXT_OAUTH_GITHUB_CLIENT_ID=your_client_id_here
NUXT_OAUTH_GITHUB_CLIENT_SECRET=your_client_secret_here
```

**Verify:**

- Client ID and Secret are from the correct GitHub OAuth App
- Not from a different environment (dev/staging)

## Troubleshooting Steps

### Step 1: Verify Vercel Environment Variables

```bash
# In Vercel dashboard, check these variables are set for Production:
BETTER_AUTH_URL=https://nuxt-kickstart.example.com
NUXT_PUBLIC_SITE_URL=https://nuxt-kickstart.example.com
NUXT_OAUTH_GITHUB_CLIENT_ID=<your-client-id>
NUXT_OAUTH_GITHUB_CLIENT_SECRET=<your-secret>
BETTER_AUTH_SECRET=<32-char-secret>
```

### Step 2: Check Environment Variable Scope

In Vercel, environment variables have scopes:

- ✓ **Production** - Must be checked
- Preview - Optional
- Development - Optional

Make sure `BETTER_AUTH_URL` is set for **Production** environment.

### Step 3: Redeploy After Changing Env Vars

After updating environment variables:

1. Go to Deployments tab
2. Find the latest deployment
3. Click "..." → "Redeploy"
4. Select "Use existing Build Cache" = OFF
5. Click "Redeploy"

Environment variables only take effect after redeployment.

### Step 4: Test the Callback URL Manually

Visit this URL to see what Better Auth returns:

```
https://nuxt-kickstart.example.com/api/auth/callback/github
```

You should see a JSON response or an error message (not a 404).

### Step 5: Check GitHub OAuth App Configuration

In GitHub → Settings → Developer settings → OAuth Apps:

1. Click on your Kickstart app
2. Verify:
   - Homepage URL: `https://nuxt-kickstart.example.com`
   - Authorization callback URL: `https://nuxt-kickstart.example.com/api/auth/callback/github`
3. If you have multiple OAuth apps, make sure you're using credentials from the correct one

## Common Mistakes

### ❌ Trailing Slash

```bash
# WRONG:
BETTER_AUTH_URL=https://nuxt-kickstart.example.com/

# CORRECT:
BETTER_AUTH_URL=https://nuxt-kickstart.example.com
```

### ❌ HTTP Instead of HTTPS

```bash
# WRONG (in production):
BETTER_AUTH_URL=http://nuxt-kickstart.example.com

# CORRECT:
BETTER_AUTH_URL=https://nuxt-kickstart.example.com
```

### ❌ www vs non-www Mismatch

```bash
# Make sure both match:
BETTER_AUTH_URL=https://nuxt-kickstart.example.com
# GitHub callback: https://nuxt-kickstart.example.com/api/auth/callback/github

# Not a mix like:
# Env var: https://www.nuxt-kickstart.example.com
# GitHub: https://nuxt-kickstart.example.com/api/auth/callback/github
```

### ❌ Wrong GitHub OAuth App

You might have created multiple GitHub OAuth Apps (dev, staging, production). Make sure:

- The Client ID/Secret in Vercel match the app configured with `https://nuxt-kickstart.example.com`
- Not accidentally using credentials from a localhost or Netlify OAuth app

## Verification Checklist

- [ ] `BETTER_AUTH_URL` is set in Vercel Production environment
- [ ] `BETTER_AUTH_URL` has no trailing slash
- [ ] `BETTER_AUTH_URL` uses HTTPS
- [ ] GitHub OAuth App callback URL matches exactly: `https://nuxt-kickstart.example.com/api/auth/callback/github`
- [ ] GitHub OAuth Client ID/Secret in Vercel match the GitHub OAuth App
- [ ] Redeployed Vercel after changing environment variables
- [ ] Cleared browser cache and tried in incognito window

## Debug: What URL is Being Sent?

To see what `redirect_uri` is actually being sent to GitHub:

1. Open DevTools (F12)
2. Go to Network tab
3. Click "Login with GitHub"
4. Look for a request to `https://github.com/login/oauth/authorize`
5. Check the URL parameters - find `redirect_uri`

The `redirect_uri` parameter should be:

```
redirect_uri=https%3A%2F%2Fnuxt-kickstart.example.com%2Fapi%2Fauth%2Fcallback%2Fgithub
```

(URL-encoded version of `https://nuxt-kickstart.example.com/api/auth/callback/github`)

If it shows something different (like `http://` or `localhost` or different domain), that's your problem - `BETTER_AUTH_URL` is wrong or not set.

## Still Not Working?

If you've verified everything above and it still doesn't work:

1. **Create a new GitHub OAuth App** just for production:
   - Homepage URL: `https://nuxt-kickstart.example.com`
   - Callback URL: `https://nuxt-kickstart.example.com/api/auth/callback/github`
   - Get new Client ID and Secret

2. **Update Vercel env vars** with the new credentials

3. **Redeploy** without build cache

4. **Try in incognito window** to avoid cached redirects
