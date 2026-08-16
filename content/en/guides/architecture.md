---
title: Architecture
description: A tour of the directories, content collections, and conventions
tags:
  - architecture
  - conventions
status: evergreen
visibility: internal
category: getting-started
difficulty: intermediate
order: 2
created: '2026-06-11'
---

## Directory Layout

::directory-tree
---
items:

- label: app/
    comment: "Nuxt app (alias ~ or @)"
    children:
  - label: assets/css/themes/
        comment: Theme CSS files (one per theme)
  - label: components/
        comment: Vue components, kebab-case
  - label: composables/
        comment: use-*.ts (auto-imported)
  - label: layouts/
        comment: default, landing, blank
  - label: middleware/
        comment: auth, guest, admin, app-auth.global, dev-only
  - label: pages/
        comment: Routes
- label: content/
    comment: Markdown/YAML content (see Collections)
- label: schemas/
    comment: Content collection schemas (Zod), registered in index.ts
- label: server/
    comment: "Nitro server (alias #server)"
    children:
  - label: api/
        comment: REST endpoints (content, email, examples, tokens)
  - label: routes/_ws/
        comment: WebSocket handlers (scoreboard)
  - label: db/ + podcasts-db/
        comment: Core auth schema + the podcast example's isolated DB
  - label: utils/
        comment: Email, storage adapters, upload
- label: shared/
    comment: "Code shared app/server (alias #shared — preferred)"
    children:
  - label: types/
        comment: TypeScript types
  - label: utils/
        comment: Pure utilities (case, abilities, glossary)
- label: i18n/locales/
    comment: en.json, es.json
- label: lib/style-dictionary/
    comment: Design tokens pipeline
- label: test/
    comment: "unit/ + nuxt/ (vitest), e2e/ (Playwright)"

---
::

## Content Collections

Schemas live in `schemas/`, grouped by area, and are registered in `schemas/index.ts`. `content.config.ts` just imports the registry.

| Collection | Source | Purpose |
| --- | --- | --- |
| `guides` | `content/{en,es}/guides/` | This documentation (locale-aware, English fallback) |
| `posts` | `content/en/posts/` | Posts (blog pattern) |
| `tech` | `content/tech/` | Technology registry (slug-reference pattern) |
| `apps`, `blocks` | `content/en/apps/`, `content/en/blocks/` | App blocks showcase (blocks grouped by parent app) |
| `meta` | `content/_meta/` | Landing/system pages |
| `emailLists`, `emailDrafts`, `emailAnalytics` | `content/email-*/` | Email subsystem |
| `examplesPodcasts`, `examplesEpisodes` | `content/examples/` | Example apps |

**Base schema** shared by all collections: `title`, `description?`, `tags[]`, `status` (seed → sprout → evergreen → wilted), `visibility` (private → internal → public), `created?`, `updated?`. Dev mode bypasses visibility checks.

### Adding a Collection

1. Create the schema in `schemas/<area>/<name>.ts` (extend `schemas/shared/base`)
2. Register it in `schemas/index.ts`
3. Add content under the source glob you configured
4. Build pages (an index page + either dedicated `[...slug]` pages or an entry in the catch-all list in `app/pages/[...slug].vue`)
5. Wire navigation: `content/navigation/*.yml` and, if searchable, the queries in `app/layouts/default.vue`

## Navigation

Sidebar navigation is data-driven: YAML groups in `content/navigation/*.yml` are served by `/api/navigation` (Nitro server asset) and consumed by `useNavigationConfig()`. Each group declares its placement via an optional `section` field (`main` default, or `footer` for bottom-pinned groups like Admin); the sidebar and command palette derive from the same filtered set, so adding a YAML group surfaces it in both with no code change. Labels are translated by slug convention (`nav.<camelCaseSlug>` with the YAML label as fallback) and internal paths are locale-prefixed. Groups support `public`, `requiresAuth`, `requiresRole`, and `devOnly` flags.

## Conventions

- **kebab-case filenames** everywhere (ESLint-enforced); `[param].vue` routes are the exception
- **`#shared` not `~/shared/`** for imports from `shared/`
- **No hardcoded colors** — CSS variables only (`--ui-*`, `--color-*`); every change must work across all themes and light/dark
- **Zod at the boundaries** — runtime validation for API input and content frontmatter
- **`useRuntimeConfig()`** — never read `process.env` directly in app/server code
