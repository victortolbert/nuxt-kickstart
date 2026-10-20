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

- **United States English** in everything authored here: prose, UI strings, comments, identifiers (*color, license, catalog, behavior, gray*). `test/unit/us-english.test.ts` sweeps the authored surface for the British spellings listed in `test/helpers/us-english.ts`, and `node scripts/us-english.mjs` rewrites them. The vendored agent skills under `.claude/skills/` are left as written.
- **ESLint**: `@antfu/eslint-config` — 2-space indent, no semicolons, single quotes
- **File naming**: kebab-case everywhere (enforced). `tech-badge.vue`, `use-theme.ts`, `tech-config.ts`. Exception: `[param].vue` routes
- **Vue blocks**: `<script setup lang="ts">` → `<template>` → `<style>`
- **Component casing in templates**: kebab-case (enforced)
- **TypeScript**: `interface` over `type` for objects. Strict mode. Avoid `any`
- **Pre-commit**: `nano-staged` via `simple-git-hooks`

## Import Aliases (Nuxt 4)

| Alias | Resolves To | Note |
| --- | --- | --- |
| `~` / `@` | `app/` | `~/components/foo.vue` |
| `~~` / `@@` | project root | `~~/lib/env.ts` |
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

Test files match source: `shared/utils/case.ts` → `test/unit/case.test.ts`. Coverage tracks `shared/utils/`, `app/utils/`, `app/composables/`, `app/middleware/`, `server/`, and `lib/`; target >70% for utilities. Vitest config (`vitest.config.ts`) defines the `unit` and `nuxt` projects. OG Image module disabled during tests (`process.env.VITEST`).

`pnpm run test` and its `test:unit`/`test:nuxt`/`test:watch` siblings are bare `vitest` — watch mode in a terminal. Use `pnpm exec vitest run` for a one-shot pass. Playwright browsers are not installed by `pnpm install`; run `pnpm exec playwright install chromium` once before `test:e2e`.

## Content Architecture

**Collection schemas live in the top-level `schemas/` directory**, not inline in `content.config.ts` (which just imports `collections` from `./schemas`). Schemas are grouped by area: `examples/`, `publishing/`, `registries/`, `systems/`, plus shared helpers in `schemas/shared/`. When adding or changing a collection, edit the relevant file under `schemas/` and register it in `schemas/index.ts`.

Collections:

- **publishing**: `guides` (documentation, `content/{en,es}/guides/` in one locale-aware collection with English fallback), `posts` (blog pattern, `content/en/posts/`), `meta` (landing/system pages, `content/_meta/`)
- **registries**: `tech` (technology registry, `content/tech/`), `apps` + `blocks` (back the `/blocks` showcase — app blocks grouped by parent app, `content/en/apps/`, `content/en/blocks/`)
- **email subsystem**: `emailLists`, `emailDrafts`, `emailAnalytics` (`content/email-*/`)

Localized content lives under per-locale folders (`content/en/`, `content/es/`). Navigation groups are YAML files in `content/navigation/*.yml`, served by `/api/navigation` and consumed by `useNavigationConfig()`.

**Base schema** (all collections): `title`, `description?`, `tags[]`, `status`, `visibility`, `created?`, `updated?`

**Nuxt Content does not validate frontmatter against these schemas**: not enums, not `.refine()`, nothing (ADR-0009). `test/unit/content-schema-validation.test.ts` parses every document under `content/` with its collection's Zod schema, and that test is the only place a constraint bites. A document that fails it is a finding, so fix the document, not the schema. Its sibling `content-collection-coverage.test.ts` fails on any markdown file that no collection source matches (a new locale folder without a source entry renders nowhere), and `content-secrets.test.ts` fails on a credential, a real email address or a phone number anywhere under `content/`, because every collection ships in a public `sql_dump.txt` whatever its `visibility`.

**Nothing from the author's employer belongs in this repository.** `test/unit/employer-terms.test.ts` fails on any tracked file naming the employer, its products or its internal systems; the list is in `test/helpers/employer-terms.ts`.

### Key Conventions

- **Visibility**: private (default) → internal → public. The rules are pure functions in `shared/utils/content-visibility.ts` (`canViewContent`, `effectiveVisibility`); `useVisibilityFilter`, `useContentAccess`, the navigation rules and the sitemap hook all call them — never re-implement the check. Visibility is editorial, not confidentiality (ADR-0005); tiers are ADR-0006. `?dev=true` bypasses or simulates a tier
- **Status**: seed → sprout → evergreen → wilted. A `wilted` public page reads as `internal` (off a visitor's listings and the sitemap, still at its URL for a member). Color/icon per status come from `app/utils/garden-status.ts` (single source of truth — used by badges and filters)
- **Review gate**: collections whose content-path prefix is in `REVIEW_GATED_PREFIXES` (`shared/utils/content-visibility.ts`, empty by default) hold a `visibility: public` page as `internal` until it carries `reviewed: YYYY-MM-DD`. Every `.select()` that names `visibility` must also select `path`, `reviewed` and `status` (`test/unit/content-visibility-selects.test.ts`)
- **Sitemap**: the `content:file:afterParse` hook in `nuxt.config.ts` drops any document not effectively public. Collections opt in by the `sitemap` field on the base schema (`apps` and `meta` omit it — no route renders them). Nuxt Content caches parses in `.data/content/contents.sqlite`; delete it to see a hook change
- **Protected paths**: `shared/utils/protected-paths.ts` is the one list the global middleware, the sitemap excludes and the `robots: false` route rules read; `test/unit/protected-paths.test.ts` fails on a page with `middleware: 'auth' | 'admin'` the list does not cover
- **Registries** use stable `slug` IDs, referenced by slug arrays
- **Case**: kebab-case for storage/slugs. Title Case for display via `formatLabel()`/`formatTag()`
- Case utilities auto-imported from `shared/utils/case.ts`

## Nuxt UI v4 (CRITICAL)

This project uses **Nuxt UI v4** (`@nuxt/ui` 4.x) with breaking changes from v2. **Always confirm a component's v4 API before writing Nuxt UI code** — v2 patterns break silently rather than erroring.

Two repo-local sources, in order:

1. The **`nuxt-ui` skill** (`.claude/skills/nuxt-ui/`) — component tables, composables, theming, and layout recipes.
2. The **generated theme file** for the exact installed version — `.nuxt/ui/<component>.ts` (e.g. `.nuxt/ui/modal.ts`), which lists that component's real slots and variants. Run `pnpm nuxi prepare` if `.nuxt/` is missing.

Prefer the generated file when the two disagree: it is produced from the installed `@nuxt/ui` and cannot drift.

Key changes vs. legacy v2 patterns:

- `UDivider` → `USeparator`
- `UModal`: use `v-model:open` + `title`/`description` props + `#body`/`#footer` slots (not `UCard` wrapper)
- `USelect`/`USelectMenu`: `:items` (not `:options`)

Using v2 patterns causes empty modals, empty selects, accessibility warnings, and broken slots.

## Theme System

7 themes (System/default, Lyra, Nord, Dracula, Catppuccin, Carnival, Broadsheet) via CSS Zen Garden approach. OKLCH color space, JetBrains Mono font, 0 border-radius.

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
- **Screenshots**: `public/img/screenshots/{project-slug}/`

## Auth & Authorization

- **Auth**: `better-auth` (config in `server/auth.ts`, client in `app/lib/auth-client.ts`). Password auth is **disabled**; sign-in is via magic link + email OTP (Resend), phone OTP (Twilio SMS), and GitHub OAuth.
- **Roles**: `admin` plugin. `ADMIN_EMAILS` is the source of truth for the `admin` (Owner) role and is synced **both ways** on every login: a listed address is promoted, and a stored `admin` it no longer lists is demoted to `viewer` (`roleOnLogin` in `server/utils/membership.ts`). Any other role is left alone. Default role is `viewer`. The admin UI offers only `editor`/`viewer` (`shared/utils/roles.ts`); a grant of `admin` there would be undone at the next login.
- **Membership** (ADR-0007, amending ADR-0006's tiers — `internal` means "let in" once a list is set, "signed in" while both are unset): the rules are pure functions in `server/utils/membership.ts`, enforced in two `databaseHooks` in `server/auth.ts` — admission in `user.create.before` (every sign-in path converges there), continued membership in `session.create.before` (every sign-in mints a session). Two modes:
  - **Closed** — `MEMBER_EMAILS` or `ADMIN_EMAILS` is non-empty. Invitation only, fail-closed: an address on neither list is refused at sign-up (`MEMBERSHIP_BY_INVITATION_ONLY`) and at every later sign-in (`MEMBERSHIP_REVOKED`, row kept — re-listing is the undo). A list holding only malformed entries is still closed and admits nobody; the server warns at boot.
  - **Open** — both unset/empty. Anyone with a proven address may sign up as `viewer`, so a fresh clone works; the server logs one `console.warn` at boot saying so. **This differs from UXLab, where both lists empty signs in nobody.** Setting either list later refuses every account not on it at its next sign-in.
  - In both modes: an unverified address (GitHub OAuth) is refused with `MEMBERSHIP_ADDRESS_NOT_VERIFIED`, phone OTP cannot create accounts, and the admin create-user route is closed (`MEMBERSHIP_ADMIN_CREATE_CLOSED`).
  - A refusal a browser navigated into (magic link, OAuth) lands on `/login?error=<code>`, rendered by `app/pages/login.vue`; `server/utils/auth-refusal.ts` owns that translation.
- **Status codes** (ADR-0008): no session → `401`, a session the ability denies → `403`. Gate server routes with `authorizeUser(event, ability)` (`server/utils/authorize-user.ts`), never the module's bare `authorize()`.
- **Resolve the session from headers only.** `toWebRequest(event)` takes ownership of the body stream, so a route that resolves the session that way and then calls `readBody()` hangs forever with no error. `server/utils/session.ts` and `server/plugins/authorization.ts` share `requestHeaders(event)`; `test/unit/authorization-plugin.test.ts` pins it.
- **Authorization**: `nuxt-authorization` — abilities in `shared/utils/abilities.ts`
- **Middleware** (`app/middleware/`): `auth` (require login), `guest` (redirect if logged in), `admin` (require admin role), `app-auth.global` (global — gates `PROTECTED_PATH_PREFIXES` from `shared/utils/protected-paths.ts`, locale-aware), `dev-only`
- **Navigation** is filtered on the server: `/api/navigation` resolves `getRequestViewer(event)` and returns `filterNavigation(...)` from `shared/utils/navigation-visibility.ts`; `useNavigationConfig()` re-filters with the same rules
- **Rendering**: SSR enabled. `experimental.asyncContext` enabled for composables after `await`

## Database

- **Core DB** (`server/db/` schema + `server/utils/db.ts` client) — the canonical app/auth database. **ORM**: `drizzle-orm` over **libSQL / Turso** (SQLite). Schema: `server/db/schema.ts` (the only schema drizzle-kit migrates — `drizzle.config.ts`). Better Auth and app code share this one connection (see note in `server/auth.ts`). Dev: `file:.data/auth.db`; prod: Turso via `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`. `pnpm run db:init` (`scripts/init-better-auth-db.ts`) creates local tables; column-adding migrations are `scripts/add-*-columns.ts`.

## i18n

Locales: en (default), es. Strategy: `prefix_except_default`. Message files: `i18n/locales/*.json`. Namespaces: `nav.*`, `common.*`, `search.*`, `theme.*`, `auth.*`, `locale.*`, `translation.*`, `appearance.*`.

Localized collections: `guides` ships en + es sources in one collection (see `app/utils/localized-collection.ts` for locale-preferred selection and URLs); `posts` follows the same `en/` folder convention, ready for more locales. Mark auto-translated content with `machineTranslated: true`. Locale persistence key: `localStorage['kickstart-locale']`.

## UI Development Workflow

1. **Before building UI** → invoke `frontend-design` skill
2. **After building UI** → run `web-design-guidelines` skill
3. **Checklist**: CSS vars (no hardcoded colors), all themes, light/dark mode, responsive, accessible

## Git Conventions

- Conventional commits: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `content` (`content` is added by the Preflight commitlint config)
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

Transactional only, sending via Resend (`server/utils/email.ts` → `sendEmail`).
`server/utils/email-templates.ts` renders the two Better Auth emails —
`renderMagicLinkEmail` and `renderOtpEmail` — and `server/auth.ts` is their only
caller. Password auth is disabled, so this path is what makes sign-in work.

## Don'ts

- Don't use npm/yarn/bun — use **pnpm**
- Don't create files when editing existing ones works
- Don't commit `.env` or credentials
- Don't use `console.log` in production code
- Don't skip pre-commit hook (`--no-verify`)
- Don't ship UI without `frontend-design` + `web-design-guidelines` skills

## Agent skills

### Issue tracker

Issues live in GitHub Issues for `victortolbert/nuxt-kickstart`, via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage roles, each label string equal to its name. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context — `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.

<!-- skilld -->
Before modifying code, evaluate each installed skill against the current task.
For each skill, determine YES/NO relevance and invoke all YES skills before proceeding.
<!-- /skilld -->
