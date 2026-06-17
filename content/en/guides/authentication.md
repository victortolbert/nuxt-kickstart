---
title: Authentication Setup
description: Configure Better Auth with passwordless sign-in, GitHub OAuth, and database options
tags:
  - authentication
  - security
  - oauth
  - database
status: evergreen
visibility: public
category: authentication
difficulty: beginner
order: 1
prerequisites:
  - getting-started
created: '2026-01-23'
updated: '2026-02-06'
---

## Overview

Kickstart uses [Better Auth](https://www.better-auth.com/) for authentication. All methods are passwordless:

| Method | Requirement | Best For |
|--------|------------|----------|
| **Magic Link** | Resend API key | Passwordless email sign-in |
| **Email OTP** | Resend API key | 6-digit code via email |
| **SMS OTP** | Twilio account | Phone-based sign-in |
| **GitHub OAuth** | GitHub OAuth App | Developer-friendly SSO |

## Required Environment Variables

Every deployment needs at minimum:

```bash
# Generate with: openssl rand -base64 32
BETTER_AUTH_SECRET=your-secret-minimum-32-chars

# Your app's base URL (used for OAuth callbacks)
BETTER_AUTH_URL=http://localhost:3000
```

## Database Configuration

Better Auth stores users, sessions, and accounts in a SQLite-compatible database via [Drizzle ORM](https://orm.drizzle.team/) and [`@libsql/client`](https://github.com/tursodatabase/libsql-client-ts).

### Option 1: Local SQLite (default, zero config)

When no database environment variables are set, Kickstart uses a local SQLite file:

```bash
# No env vars needed — this is the default
# Data stored at .data/auth.db (gitignored)
```

This is ideal for:

- Local development
- Self-hosted deployments (VPS, Docker, bare metal)
- Trying out the project without any external accounts

The `.data/` directory is gitignored. To share a pre-seeded database with collaborators, you could move it to a tracked location by setting `TURSO_DATABASE_URL=file:data/auth.db` and committing the `data/` directory.

### Option 2: Turso (recommended for serverless)

[Turso](https://turso.tech/) provides hosted libSQL databases with a generous free tier. Required for serverless platforms (Vercel, Netlify, Cloudflare) where the filesystem is ephemeral.

1. Create a Turso account at [turso.tech](https://turso.tech/)
2. Create a database: `turso db create kickstart`
3. Get the connection URL: `turso db show kickstart --url`
4. Create an auth token: `turso db tokens create kickstart`
5. Add to `.env`:

```bash
TURSO_DATABASE_URL=libsql://your-db-name-your-org.turso.io
TURSO_AUTH_TOKEN=your-token
```

### Option 3: Other databases (requires code changes)

To use Postgres, MySQL, or another database, you would need to modify two files:

**`server/auth.ts`** — Change the Drizzle adapter:

```ts
// Current (SQLite/Turso via libsql)
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
const client = createClient({ url: '...' })
const db = drizzle(client, { schema })

// Postgres example (would replace the above)
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
const client = postgres(process.env.DATABASE_URL)
const db = drizzle(client, { schema })
```

Update the Better Auth adapter provider:

```ts
database: drizzleAdapter(db, {
  provider: 'pg', // was 'sqlite'
})
```

**`server/utils/db.ts`** — Same driver change for the legacy user operations.

Better Auth's schema is database-agnostic. The Drizzle schema in `server/db/schema.ts` may need dialect-specific adjustments (e.g., `integer` vs `serial` for auto-increment).

### Comparison

| | Local SQLite | Turso | Postgres/MySQL |
|---|---|---|---|
| **Setup** | Zero config | Free account + 2 env vars | Hosted DB + code changes |
| **Serverless** | No (ephemeral FS) | Yes | Yes |
| **Self-hosted** | Yes | Yes | Yes |
| **Cost** | Free | Free tier (500 DBs, 9GB) | Varies |
| **Code changes** | None | None | `server/auth.ts` + `server/utils/db.ts` |

## GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set the **Authorization callback URL** to:
   - Dev: `http://localhost:3000/api/auth/callback/github`
   - Prod: `https://yourdomain.com/api/auth/callback/github`
4. Add to `.env`:

```bash
NUXT_OAUTH_GITHUB_CLIENT_ID=Iv1.xxxxx
NUXT_OAUTH_GITHUB_CLIENT_SECRET=xxxxx
```

## Magic Link / Email OTP

Both email-based methods require [Resend](https://resend.com/) for sending emails.

1. Create account at [resend.com](https://resend.com)
2. Generate API key at [resend.com/api-keys](https://resend.com/api-keys)
3. Add to `.env`:

```bash
RESEND_API_KEY=re_xxxx
EMAIL_FROM_ADDRESS=Kickstart <noreply@yourdomain.com>
```

For production, verify your sending domain in Resend.

## SMS OTP

Requires a [Twilio](https://www.twilio.com/) account for sending SMS messages.

1. Create account at [twilio.com](https://www.twilio.com/)
2. Get Account SID and Auth Token from the dashboard
3. Purchase a phone number with SMS capability
4. Add to `.env`:

```bash
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+1234567890
```

## Admin Role

Users whose email appears in `ADMIN_EMAILS` are automatically assigned the `admin` role on sign-up:

```bash
ADMIN_EMAILS=victor@example.com,admin@example.com
```

## Protecting Routes

Use the `auth` middleware to require login:

```vue
<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })
</script>
```

The `guest` middleware redirects authenticated users away (used on the login page):

```vue
<script setup lang="ts">
definePageMeta({ middleware: ['guest'] })
</script>
```

Routes under `/app/*` are automatically protected by the global `app-auth` middleware.

## Authorization

Content visibility is controlled via frontmatter:

```yaml
---
visibility: public    # Anyone
visibility: internal  # Logged-in users
visibility: private   # Author or admin only
---
```

See `shared/utils/abilities.ts` for available permission checks.
