---
title: Deployment
description: Deploy your site to Vercel, Netlify, or other platforms
tags:
  - deployment
  - vercel
  - netlify
  - production
status: evergreen
visibility: public
category: deployment
difficulty: intermediate
order: 1
prerequisites:
  - getting-started
  - authentication
created: '2026-01-23'
updated: '2026-06-12'
---

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] `BETTER_AUTH_SECRET` is set (32+ characters)
- [ ] `BETTER_AUTH_URL` matches your production URL (no trailing slash)
- [ ] OAuth callback URLs updated to the production domain
- [ ] Sensitive content marked as `visibility: private`
- [ ] A production storage provider configured (`NUXT_STORAGE_PROVIDER=s3` or `cloudinary` — `local` won't work on serverless)
- [ ] Test build locally: `pnpm run build`

## Environment Variables

Add these in your platform's dashboard (only the ones for features you use):

```bash
# Auth (required)
BETTER_AUTH_SECRET=...            # openssl rand -base64 32
BETTER_AUTH_URL=https://yourdomain.com
ADMIN_EMAILS=you@yourdomain.com   # Owners (admin role); setting it closes sign-up
MEMBER_EMAILS=...                 # invited members; see the Authentication guide

# Email: magic link + email OTP + campaigns (Resend)
RESEND_API_KEY=re_...
EMAIL_FROM_ADDRESS="Kickstart <noreply@yourdomain.com>"

# Phone OTP (Twilio)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...

# GitHub OAuth
NUXT_OAUTH_GITHUB_CLIENT_ID=...
NUXT_OAUTH_GITHUB_CLIENT_SECRET=...

# Database (production)
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=...

# File uploads (production)
NUXT_STORAGE_PROVIDER=s3          # or cloudinary
NUXT_S3_BUCKET=...
NUXT_S3_REGION=...
NUXT_S3_ACCESS_KEY_ID=...
NUXT_S3_SECRET_ACCESS_KEY=...

# Site
NUXT_PUBLIC_SITE_URL=https://yourdomain.com
```

See the [Authentication](/guides/authentication) and [File Storage](/guides/file-storage) guides for full setup of each service.

## Vercel

### Quick Deploy

1. Push your code to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in Settings → Environment Variables
4. Deploy

### Custom Domain

1. Go to Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Update `BETTER_AUTH_URL`, `NUXT_PUBLIC_SITE_URL`, and OAuth callback URLs to the new domain

## Netlify

1. Push your code to GitHub
2. Import project at [app.netlify.com](https://app.netlify.com)
3. Build settings are already committed in `netlify.toml` — leave the UI fields
   empty so they are not overridden:
   - Build command: `pnpm run build`
   - Publish directory: `dist`
4. Add environment variables in Site settings → Environment variables
5. Deploy

> Publish `dist`, not `.output/public`. This is an SSR app, and Nitro's Netlify
> preset emits the server handler plus static assets into `dist/`. Pointing
> Netlify at `.output/public` publishes the static half only and every
> server-rendered route 404s.

## OAuth Callback URLs

Update your GitHub OAuth App with the production callback:

| Provider | Callback URL |
|----------|--------------|
| GitHub | `https://yourdomain.com/api/auth/callback/github` |

If you add more Better Auth social providers, their callbacks follow the same pattern: `/api/auth/callback/{provider}`.

## Database Considerations

### Local Development

The app uses local SQLite by default (`.data/auth.db`), which requires no setup. This is ideal for:

- Local development
- Testing
- Avoiding corporate proxy issues

### Production Deployment

For serverless/edge deployments, you'll need a remote database:

**[Turso](https://turso.tech/)** (Recommended - SQLite at the edge)

```bash
# Create database
turso db create kickstart

# Get connection details
turso db show kickstart --url
turso db tokens create kickstart

# Set in production environment
TURSO_DATABASE_URL=libsql://your-db-name.turso.io
TURSO_AUTH_TOKEN=your_token_here
```

### Create the tables — do not skip this

Setting the two variables does **not** create any tables. `pnpm install`'s
postinstall already ran `db:migrate`, but it ran before `TURSO_*` existed, so it
migrated the local `file:.data/auth.db` only. The remote database is still
empty, and the first sign-in fails against it.

Migrate the remote database before the first deploy, and before every deploy
that ships a schema change:

```bash
TURSO_DATABASE_URL=libsql://your-db-name.turso.io \
TURSO_AUTH_TOKEN=your_token_here \
pnpm run db:migrate
```

`scripts/migrate.ts` reads both variables and falls back to `file:.data/auth.db`
when they are absent, which is why they must be present in the same command.
It applies only the migrations the database lacks, all or none, and exits
non-zero on failure, so put it ahead of the deploy step and a failed migration
stops the deploy. A database the old `db:init` script created is adopted onto
the migration chain on its first run, with its rows kept. The Docker image runs
the same migrator on start (see the README).

On Vercel and Netlify the build's `pnpm install` runs `postinstall`, which
migrates whatever `TURSO_*` the build environment holds. That covers a deploy
only while the install actually runs its scripts against the production
variables. A cached dependency layer, an `--ignore-scripts` install, or
variables scoped to runtime only all skip it without saying so. If any of
those apply, make the build command migrate explicitly:

```bash
pnpm run db:migrate && pnpm run build
```

**Automatic Fallback**: If Turso connection fails (certificate errors, corporate proxy), the app automatically falls back to local SQLite with a warning message.

## Environment-Specific Config

Use different `.env` files or platform environment variables:

```bash
# Development
NUXT_PUBLIC_SITE_URL=http://localhost:3000

# Production (set in platform dashboard)
NUXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Build Commands

```bash
# Production build
pnpm run build

# Preview production build locally
pnpm run preview

# Generate static site (if SSG)
pnpm run generate
```

## Troubleshooting

### Auth errors on first deploy

Ensure `BETTER_AUTH_SECRET` (32+ chars) and `BETTER_AUTH_URL` are set in your platform's environment variables.

### OAuth redirect errors

1. Verify callback URLs match exactly (including `https://`)
2. Check for trailing slashes — `BETTER_AUTH_URL` must not have one
3. Ensure environment variables are set correctly

### Build failures

1. Run `pnpm run build` locally first
2. Check for TypeScript errors: `pnpm run typecheck`
3. Verify all dependencies are in `package.json`

## Monitoring

Consider adding:

- Error tracking (Sentry)
- Analytics (Plausible, Fathom)
- Uptime monitoring (Better Uptime, Pingdom)
