# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kickstart (`nuxt-kickstart`): an opinionated, content-first enterprise starter on Nuxt 4 + Nuxt Content v3. Ships with passwordless auth, an admin suite, an email subsystem, real-time examples, design tokens tooling, theming, and i18n. Package manager: **pnpm** (Node `v24`, see `.nvmrc`).

## Development Commands

```bash
pnpm install           # Install deps (postinstall runs nuxt prepare + db:init)
pnpm run db:init       # Initialize local SQLite auth DB (first-time setup)
pnpm dev:op            # Dev server with secrets resolved from 1Password (preferred)
pnpm dev               # Dev server without op (plaintext .env — no live secrets)
pnpm run build         # Production build (8GB heap)
pnpm run test          # All tests (unit + nuxt projects, vitest)
pnpm run test:unit     # Unit project only (node env)
pnpm run test:nuxt     # Component tests (nuxt env)
pnpm run test:watch    # Watch mode (unit project)
pnpm run test:coverage # Coverage report
pnpm run test:e2e      # Playwright smoke tests (also :ui, :debug; specs in test/e2e/)
pnpm run lint:fix      # Lint + auto-fix
pnpm run typecheck     # TypeScript checks (vue-tsc)
pnpm run changelog     # Preview release notes (changelogithub --dry)
```

Run a single test file or by name (vitest):

```bash
pnpm run test test/unit/case.test.ts        # one file
pnpm run test -t "converts kebab-case"      # by test name
```

Run `pnpm nuxi prepare` after clone to generate `.nuxt/`. Run `pnpm run db:init` to create the local database tables.

## Code Style

- **ESLint**: `@antfu/eslint-config` — 2-space indent, no semicolons, single quotes
- **File naming**: kebab-case everywhere (enforced). `tech-badge.vue`, `use-theme.ts`, `tech-config.ts`. Exception: `[param].vue` routes
- **Vue blocks**: `<script setup lang="ts">` → `<template>` → `<style>`
- **Component casing in templates**: kebab-case (enforced). Exception: `app/emails/**` (Maizzle templates) use **PascalCase** (`<Layout>`, `<Container>`) and `<script>`-first block order — scoped override in `eslint.config.mjs`
- **TypeScript**: `interface` over `type` for objects. Strict mode. Avoid `any`
- **Pre-commit**: `lint-staged` via `simple-git-hooks`

## Import Aliases (Nuxt 4)

| Alias | Resolves To | Note |
| --- | --- | --- |
| `~` / `@` | `app/` | `~/components/foo.vue` |
| `~~` / `@@` | project root | `~~/shared/data/quotes.ts` |
| `#shared` | `shared/` | **Preferred** for shared/ imports |
| `#server` | `server/` | Server-only code |

**Use `#shared` not `~/shared/`** for imports from the `shared/` directory.

## Testing

TDD: write failing test → implement → verify → refactor.

| Type | Directory | Vitest project | Environment |
| --- | --- | --- | --- |
| Unit | `test/unit/` | `unit` | Node |
| Component | `test/nuxt/` | `nuxt` | Nuxt |
| E2E smoke | `test/e2e/` | — (Playwright) | Chromium, port 3210 |

Test files match source: `shared/utils/case.ts` → `test/unit/case.test.ts`. Coverage tracks `shared/utils/`, `app/utils/`, `lib/`; target >70% for utilities. Vitest config (`vitest.config.ts`) defines the `unit` and `nuxt` projects. OG Image module disabled during tests (`process.env.VITEST`).

## Content Architecture

**Collection schemas live in the top-level `schemas/` directory**, not inline in `content.config.ts` (which just imports `collections` from `./schemas`). Schemas are grouped by area: `examples/`, `publishing/`, `registries/`, `systems/`, plus shared helpers in `schemas/shared/`. When adding or changing a collection, edit the relevant file under `schemas/` and register it in `schemas/index.ts`.

Collections:

- **publishing**: `guides` (documentation, `content/{en,es}/guides/` in one locale-aware collection with English fallback), `posts` (blog pattern, `content/en/posts/`), `meta` (landing/system pages, `content/_meta/`)
- **registries**: `tech` (technology registry, `content/tech/`), `apps` + `blocks` (back the `/blocks` showcase — app blocks grouped by parent app, `content/en/apps/`, `content/en/blocks/`)
- **email subsystem**: `emailLists`, `emailDrafts`, `emailAnalytics` (`content/email-*/`)
- **examples**: `examplesPodcasts`, `examplesEpisodes` (`content/examples/`)

Localized content lives under per-locale folders (`content/en/`, `content/es/`). Navigation groups are YAML files in `content/navigation/*.yml`, served by `/api/navigation` and consumed by `useNavigationConfig()`.

**Base schema** (all collections): `title`, `description?`, `tags[]`, `status`, `visibility`, `created?`, `updated?`

### Key Conventions

- **Visibility**: private (default) → internal → public. Dev mode bypasses visibility checks
- **Status**: seed → sprout → evergreen → wilted. Color/icon per status come from `app/utils/garden-status.ts` (single source of truth — used by badges, filters, charts)
- **Registries** use stable `slug` IDs, referenced by slug arrays
- **Case**: kebab-case for storage/slugs. Title Case for display via `formatLabel()`/`formatTag()`
- Case utilities auto-imported from `shared/utils/case.ts`

## Nuxt UI v4 (CRITICAL)

This project uses **Nuxt UI v4** (`@nuxt/ui` 4.x) with breaking changes from v2. **Always consult `nuxt-ui-remote` MCP before writing Nuxt UI code.**

Call `mcp__nuxt-ui-remote__get-component({ componentName: "X", sections: ["usage", "api"] })` before using any `U*` component.

Key changes vs. legacy v2 patterns:
- `UDivider` → `USeparator`
- `UModal`: use `v-model:open` + `title`/`description` props + `#body`/`#footer` slots (not `UCard` wrapper)
- `USelect`/`USelectMenu`: `:items` (not `:options`)

Using v2 patterns causes empty modals, empty selects, accessibility warnings, and broken slots.

## Theme System

6 themes (System/default, Lyra, Nord, Dracula, Catppuccin, Carnival) via CSS Zen Garden approach. OKLCH color space, JetBrains Mono font, 0 border-radius.

- Themes: `app/assets/css/themes/*.css`. Selectors: `:root[data-theme="id"]` / `.dark[data-theme="id"]`
- Composable: `useTheme()` → `{ theme, themes, setTheme, cycleTheme }`
- Types: `shared/types/theme.ts`
- Persistence: `localStorage['kickstart-theme']` → `document.documentElement.dataset.theme`
- CSS vars: `--ui-bg*`, `--ui-text*`, `--ui-border*`, `--color-primary-*`, `--color-chart-*`
- **No hardcoded colors** — always use CSS variables

## Icons

**Never hardcode `i-tabler-*` (or any collection-prefixed) icon names in app UI.** Icons must follow the user's icon-collection appearance setting:

- Use `const { resolveIcon } = useAppearance()` and `:icon="resolveIcon('semanticName')"`. Semantic names live in `app/utils/icon-sets.ts` (`iconMappings`) — `resolveIcon` **throws** on unknown names.
- Adding a new semantic name requires a verified equivalent in all 5 collections (tabler, lucide, ph, heroicons, ri) — check the name exists in each `@iconify-json/*/icons.json` before adding.
- Icon-bearing arrays/objects built in `<script setup>` must be wrapped in `computed()` so they react to setting changes.
- Render via `<UIcon :name>` — never CSS classes (`class="i-tabler-…"` silently renders nothing; no CSS icon plugin is installed).
- Exempt (intentionally hardcoded): brand logos (`i-tabler-brand-*`; `logos:{name}` in the tech registry), theme identity icons in `use-theme.ts`, `json`/`markdown` in `prose-pre.vue`, `app.config.ts` Nuxt UI defaults, and the OG image component.

## Key Components

- **TechBadge**: `slug`, `mode`, `size`, `link` props. Config: `app/utils/tech-config.ts`
- **Charts** (Unovis): `ChartsLineChart`/`ChartsBarChart`/`ChartsDonutChart` — `.client.vue`/`.server.vue` pairs
- **Design tokens**: `tokens/` components + Style Dictionary pipeline (`lib/style-dictionary/`, `/api/tokens/*`)
- **Screenshots**: `public/img/screenshots/{project-slug}/`

## Auth & Authorization

- **Auth**: `better-auth` (config in `server/auth.ts`, client in `app/lib/auth-client.ts`). Password auth is **disabled**; sign-in is via magic link + email OTP (Resend), phone OTP (Twilio SMS), and GitHub OAuth.
- **Roles**: `admin` plugin. Admins are auto-assigned from the `ADMIN_EMAILS` env var (synced on every login via database hooks); default role is `viewer`.
- **Authorization**: `nuxt-authorization` — abilities in `shared/utils/abilities.ts`
- **Middleware** (`app/middleware/`): `auth` (require login), `guest` (redirect if logged in), `admin` (require admin role), `app-auth.global` (global), `dev-only`
- **Rendering**: SSR enabled. `experimental.asyncContext` enabled for composables after `await`

## Database

Two separate databases — don't confuse them:

- **Core DB** (`server/db/` schema + `server/utils/db.ts` client) — the canonical app/auth database. **ORM**: `drizzle-orm` over **libSQL / Turso** (SQLite). Schema: `server/db/schema.ts` (the only schema drizzle-kit migrates — `drizzle.config.ts`). Better Auth and app code share this one connection (see note in `server/auth.ts`). Dev: `file:.data/auth.db`; prod: Turso via `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`. `pnpm run db:init` (`scripts/init-better-auth-db.ts`) creates local tables; column-adding migrations are `scripts/add-*-columns.ts`.
- **Podcasts DB** (`server/podcasts-db/`) — the **podcast example app's** isolated database (own connection + `podcast-app.db`, in-memory in dev, raw `CREATE TABLE IF NOT EXISTS` — not drizzle-kit managed). Self-contained so the example can be deleted as one folder. See `server/podcasts-db/README.md`.

## i18n

Locales: en (default), es. Strategy: `prefix_except_default`. Message files: `i18n/locales/*.json`. Namespaces: `nav.*`, `common.*`, `search.*`, `theme.*`, `auth.*`, `locale.*`, `translation.*`, `appearance.*`.

Localized collections: `guides` ships en + es sources in one collection (see `app/utils/localized-collection.ts` for locale-preferred selection and URLs); `posts` follows the same `en/` folder convention, ready for more locales. Mark auto-translated content with `machineTranslated: true`. Locale persistence key: `localStorage['kickstart-locale']`.

## UI Development Workflow

1. **Before building UI** → invoke `frontend-design` skill
2. **After building UI** → run `web-design-guidelines` skill
3. **Checklist**: CSS vars (no hardcoded colors), all 6 themes, light/dark mode, responsive, accessible

## Git Conventions

- Conventional commits: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`
- Atomic commits — one logical change per commit
- No Claude footnote in commits

## Error Handling

- Use Zod for runtime validation
- Throw descriptive errors with context — no silent `return null` failures
- Use `useRuntimeConfig()` not `process.env` directly

## Secrets

Secrets are stored in a 1Password vault and resolved at runtime via `op run` using `.env.1password` (committed, contains only `op://` references). Plaintext `.env` contains **only non-secret public config**. Use `pnpm dev:op` for dev; see the Secrets guide (`content/en/guides/secrets-1password.md`, served at `/guides/secrets-1password`) for the full workflow, item naming, and CI strategy.

## File Uploads & Storage

Kickstart uses a **storage adapter pattern** for file uploads, supporting multiple backends:

- **Development**: `local` provider (writes to `public/img/`)
- **Production**: `s3` (AWS S3) or `cloudinary` providers (serverless-compatible)

### Configuration
Set `NUXT_STORAGE_PROVIDER` environment variable:
- `local` - Local filesystem (dev only, won't work on Vercel/Netlify)
- `s3` - AWS S3 bucket (recommended for production)
- `cloudinary` - Cloudinary CDN (alternative to S3)

### Usage
```typescript
import { handleFileUpload } from '#server/utils/upload'

const result = await handleFileUpload(event, {
  allowedTypes: ['image/png', 'image/jpeg', 'image/webp'],
  maxSizeBytes: 2097152, // 2MB
  pathPrefix: 'img/teams', // S3 folder / local subdirectory
  filename: 'logo',
  imageOptions: { width: 256, height: 256, format: 'webp' },
})

// result.url contains public URL (relative path for local, full URL for cloud)
```

See the File Storage guide (`/guides/file-storage`) for detailed setup instructions for each provider.

## Email

Two complementary systems, both sending via Resend (`server/utils/email.ts` → `sendEmail`):

- **Markdown campaigns** — admin compose/send/track at `/app/admin/email/*`; filesystem-backed collections in `content/email-*`, schemas in `schemas/systems/email/`. See the Email Campaigns guide.
- **Maizzle templates** — designed/transactional emails authored as Vue SFCs in `app/emails/*.vue` (Tailwind → inlined HTML via `@maizzle/framework`). Rendered by `server/utils/maizzle.ts`; admin-only Server API: `GET /api/email/maizzle` (list), `GET /api/email/maizzle/{name}` (render/preview), `POST /api/email/maizzle/send` (per-recipient personalization via `{{ config.* }}`). See `app/emails/README.md`.

## Don'ts

- Don't use npm/yarn/bun — use **pnpm**
- Don't create files when editing existing ones works
- Don't commit `.env` or credentials
- Don't use `console.log` in production code
- Don't skip pre-commit hook (`--no-verify`)
- Don't ship UI without `frontend-design` + `web-design-guidelines` skills

Before modifying code, evaluate each installed skill against the current task.
For each skill, determine YES/NO relevance and invoke all YES skills before proceeding.

<!-- skilld -->
Before modifying code, evaluate each installed skill against the current task.
For each skill, determine YES/NO relevance and invoke all YES skills before proceeding.
<!-- /skilld -->
