---
title: Getting Started
description: Create a project from the template and get the dev server running in minutes
tags:
  - setup
  - quickstart
status: evergreen
visibility: public
category: getting-started
difficulty: beginner
order: 1
created: '2026-01-23'
updated: '2026-06-11'
---

## What is Kickstart?

Kickstart (`nuxt-kickstart`) is an opinionated, content-first enterprise starter built on [Nuxt](https://nuxt.com/){target="_blank"} v4 and [Nuxt Content](https://content.nuxt.com/){target="_blank"} v3. It ships with passwordless authentication, an admin suite, an email subsystem, real-time examples, design tokens tooling, seven themes, and i18n already wired up — so new projects start with the foundations decided.

## Prerequisites

- [Node.js](https://nodejs.org/en){target="_blank"} v24 (see `.nvmrc`)
- [pnpm](https://pnpm.io/){target="_blank"} (the only supported package manager)
- [Git](https://git-scm.com/){target="_blank"}
- A code editor ([VS Code](https://code.visualstudio.com/){target="_blank"} recommended)

## Quick Setup

```bash
# 1. Create your repo from the template on GitHub, then clone it
git clone <your-repository-url>
cd <your-project>

# 2. Install dependencies (postinstall runs nuxt prepare + db:init)
pnpm install

# 3. Rename the template tokens to your project
pnpm run init

# 4. Configure environment
cp .env.example .env
# Edit .env: set BETTER_AUTH_SECRET (32+ chars)
# Generate one with: openssl rand -base64 32

# 5. Start development
pnpm dev

# 6. Optional: install the Playwright browser before your first e2e run
pnpm exec playwright install chromium
```

A few things worth knowing about that order:

- `pnpm install` runs `nuxt prepare && pnpm run db:init` for you. `nuxt prepare`
  has to go first — it creates the gitignored `.data/` directory that `db:init`
  writes `auth.db` into. Running `pnpm run db:init` on its own in a fresh clone
  fails with `Unable to open connection to local database .data/auth.db`.
- Because step 2 runs before step 4, the database is created against the local
  SQLite default. If you later point the app at Turso, re-run `db:init` with the
  `TURSO_*` variables set — see the [Deployment guide](/guides/deployment).
- `pnpm install` does **not** download Playwright browsers, so step 6 is
  required before `pnpm run test:e2e` will run.

Visit `http://localhost:3000`.

See [Using This Template](/guides/using-this-template) for what `pnpm run init` renames and the manual checklist that follows it.

## What's Running

- **Public site** — landing page, [Guides](/guides), [Blog](/posts), and the [Tech registry](/tech)
- **App area** (`/app`) — authenticated dashboard
- **Admin suite** (`/app/admin`) — user management, content editor, email system, trash

Auth features (magic link, OTP, OAuth) need additional environment variables — see the [Authentication guide](/guides/authentication).

## Next Steps

1. [Using This Template](/guides/using-this-template) — finish the rename and trim what you don't need
2. [Architecture](/guides/architecture) — tour of the directories and conventions
3. [Adding Content](/guides/adding-content) — work with the content collections
4. [Customization](/guides/customization) — themes and appearance
5. [Deployment](/guides/deployment) — ship it
