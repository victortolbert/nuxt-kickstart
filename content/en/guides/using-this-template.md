---
title: Using This Template
description: Turn nuxt-kickstart into your project — the init script, the rename tokens, and what to trim
tags:
  - setup
  - template
status: evergreen
visibility: public
category: getting-started
difficulty: beginner
order: 0
created: '2026-06-11'
---

## The Flow

1. On GitHub, click **Use this template** and create your repository
2. Clone it and run `pnpm install`
3. Run `pnpm run init`
4. Review the diff, then commit

## What `pnpm run init` Does

The script (`scripts/init.ts`) prompts for your project's kebab-case name, display name, site URL, and npm package name, then rewrites the template tokens across every tracked text file:

| Token | Becomes | Where it appears |
| --- | --- | --- |
| `nuxt-kickstart.example.com` | your site host | site config, OG images, docs |
| `@victortolbert/nuxt-kickstart` | your package name | `package.json` |
| `nuxt-kickstart` | your kebab name | repo references, docs |
| `kickstart-theme`, `kickstart-locale`, … | `<your-name>-theme`, … | localStorage/cookie keys |
| `Kickstart` | your display name | UI copy, email templates, titles |

It is idempotent — re-running after a rename finds zero occurrences and changes nothing.

## Manual Checklist (after init)

- [ ] `package.json` — update `author` and `repository`
- [ ] `README.md` — rewrite the intro for your project
- [ ] `app/components/app/app-logo.vue` — the app name is a text wordmark (`pnpm run init` renames it); restyle it or add a logomark here
- [ ] `public/favicon.svg` / `favicon-dark.svg` — replace favicons
- [ ] `.env.1password` — point the `op://` references at your own vault (see [Secrets](/guides/using-this-template#secrets)) or delete the file and use plain `.env`
- [ ] `content/en/posts/` — replace the sample posts
- [ ] Landing page copy and social links (`app/pages/index.vue`, `app/layouts/landing.vue`, `app/components/landing/contact-section.vue`)

## What to Trim

Everything optional is designed to be removable:

- **Example apps** (podcast, scoreboard) — delete `app/pages/examples/`, the `examples/` schemas, their content folders, and the related `server/api/{examples,scoreboard}` routes. The podcast app also has its own isolated database in `server/podcasts-db/` — delete that folder too (the core/auth DB in `server/db/` is unaffected)
- **Email subsystem** — delete the `systems/email` schemas, `content/email-*/`, `server/api/email/`, and the admin email pages
- **Design tokens tool** — delete `app/components/tokens/`, `lib/style-dictionary/`, and `server/api/tokens/`
- **A theme** — delete its CSS file in `app/assets/css/themes/`, remove it from `use-theme.ts` and `shared/types/theme.ts`

After any trim, run the gate: `pnpm run lint:fix && pnpm run typecheck && pnpm run test`.

## Agent Skills (Agentic-Ready)

The template ships a curated set of agent skills in `.claude/skills/` (used by Claude Code; portable to other agents). Three groups:

- **Stack skills** — Nuxt, Vue, Nuxt UI, Tailwind, Drizzle, Zod, Better Auth, web security, Playwright testing. Consulted automatically when an agent touches the matching code.
- **Agentic workflow** — `improve-codebase-architecture`, `grill-me` / `grill-with-docs` (plan stress-testing that maintains `CONTEXT.md` and `docs/adr/`), `tdd`, `diagnose`, `prd`, issue workflows.
- **Design verbs** — `audit`, `harden`, `optimize`, `polish`, `animate`, and friends for iterating on UI quality.

The domain glossary lives in `CONTEXT.md` and recorded decisions in `docs/adr/` — keep both alive as your project grows; the workflow skills read and update them. Skills you don't want are plain directories: delete them.

## Secrets

Development secrets resolve from 1Password at runtime via `pnpm dev:op` (no plaintext secrets on disk). Create a vault for your project, mirror the item names referenced in `.env.1password`, and you're set. Plain `pnpm dev` with a `.env` file also works. Full workflow: the [Secrets with 1Password](/guides/secrets-1password) guide.
