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
updated: '2026-10-20'
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
EMAIL_FROM_ADDRESS=Kickstart <onboarding@resend.dev>
```

`onboarding@resend.dev` is Resend's zero-setup test sender — it works with any valid
API key without verifying a domain, but it only **delivers to your own Resend-account
email** (sign-ins for other addresses will send OK yet never arrive). For production,
verify your sending domain in Resend and set `EMAIL_FROM_ADDRESS` to an address on it
(e.g. `Kickstart <noreply@yourdomain.com>`).

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

## Membership

Two variables decide who may hold an account:

```bash
ADMIN_EMAILS=owner@example.com                 # Owners: admin role
MEMBER_EMAILS=alice@example.com,bob@example.com # Members: viewer role
```

| Configuration | Who can sign up | Who can sign in |
| --- | --- | --- |
| Both unset (**open**, the default) | Anyone with a verified email | Anyone with an account |
| Either set (**closed**) | Only listed addresses | Only listed addresses |

**Open** is how a fresh clone runs: you can sign in straight away. The server
logs a warning at boot so a deployment doesn't stay open by accident.

**Closed** is invitation-only. The lists are re-read at every sign-in, so
removing an address ends that person's access the next time they sign in. Their
account is kept, and adding the address back restores it. `ADMIN_EMAILS` counts
as an invitation, so owners don't need to be repeated in `MEMBER_EMAILS`.

> Switching a running deployment from open to closed refuses every existing
> account that isn't listed. Add everyone who should keep access to
> `MEMBER_EMAILS` before you set either variable.

Rules that apply in both modes:

- **GitHub** sign-up needs an email GitHub has verified. Otherwise the person is
  asked to use the emailed link instead.
- **Phone** sign-in can't create an account. It only works for a number already
  linked to an existing account.
- The admin plugin's create-user route doesn't admit anyone. Membership is
  granted by the lists.

A refused magic link or GitHub sign-in lands back on `/login` with a message
explaining why. The URL carries a stable code, for example
`?error=MEMBERSHIP_BY_INVITATION_ONLY`.

## Admin Role

`ADMIN_EMAILS` is the only way to grant the `admin` role, and it syncs both
ways on every login. A listed address is promoted, and an `admin` whose address
has been removed is demoted to `viewer`. Other roles, such as `editor`, are
never touched. That's why the admin UI offers only `editor` and `viewer`: a
grant of `admin` there would be undone at the next login.

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

In server routes, gate on an ability with `authorizeUser`, which answers `401`
when nobody is signed in and `403` when someone is but the ability denies them:

```ts
import { isAdmin } from '#shared/utils/abilities'

export default defineEventHandler(async (event) => {
  await authorizeUser(event, isAdmin)
  const body = await readBody(event) // safe: the session is read from headers only
})
```
