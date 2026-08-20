# Contributing to Kickstart

Thanks for your interest in improving the template. This guide covers local
setup, the checks your change must pass, and the conventions we follow.

> Building **your own project** from the template? You don't need this file —
> run `pnpm run init` and read the in-app guides at `/guides`. This document is
> for contributing back to nuxt-kickstart itself.

## Local development

```bash
pnpm install          # postinstall runs nuxt prepare + db:init
pnpm dev              # http://localhost:3000  (pnpm dev:op for 1Password secrets)
```

Node `v24` (see `.nvmrc`), **pnpm only** (not npm/yarn/bun).

### Clean builds

If you hit stale-cache build errors (e.g. `no such column` after a schema
change, or odd `.nuxt` issues):

```bash
pnpm run clean        # remove .nuxt/.output/dist, keep deps  (then pnpm dev)
pnpm run clean:full   # also remove node_modules + reinstall
pnpm run fresh        # clean + dev in one
```

Changing a content schema under `schemas/`? Run `pnpm run clean` so the content
cache regenerates against the new schema.

### E2E setup (first run only)

```bash
pnpm exec playwright install chromium
```

`pnpm install` does not download browsers — `playwright` is deliberately absent
from `allowBuilds` in `pnpm-workspace.yaml`, so its postinstall never runs.
Without this, `pnpm run test:e2e` fails with *"Executable doesn't exist"*.

## The gate — run before every PR

All six must pass:

```bash
pnpm exec preflight check  # config drift against the Preflight presets
pnpm run lint              # eslint (lint:fix to auto-fix)
pnpm run typecheck         # nuxt typecheck (vue-tsc)
pnpm exec vitest run       # unit + nuxt projects, one shot
pnpm run test:e2e          # Playwright smoke (port 3210)
pnpm run build             # production build
```

`preflight check` is the one most easily missed: CI runs it first, and it fails
if a file Preflight manages (`.editorconfig`, `.nvmrc`, `axe-linter.yml`) has
diverged without this repo declaring it. To keep a deliberate local change,
declare the file under `unmanaged` in `preflight.config.ts` — that file is
optional and does not exist yet, so create it when you first need one.

Use `pnpm exec vitest run`, not `pnpm run test`: the latter is bare `vitest`,
which starts watch mode in a terminal and never exits. CI is unaffected — vitest
runs once when it detects a non-TTY.

| Command | Purpose |
| --- | --- |
| `pnpm run dev` | Dev server, hot reload |
| `pnpm run build` | Production build |
| `pnpm run preview` | Preview the production build |
| `pnpm run lint` / `lint:fix` | Check / auto-fix code style |
| `pnpm run lint:md` / `lint:md:fix` | Check / auto-fix Markdown (markdownlint) |
| `pnpm run typecheck` | TypeScript checks |
| `pnpm run test` / `test:unit` / `test:nuxt` | Vitest (watch mode) |
| `pnpm exec vitest run` | Vitest, one shot |
| `pnpm run test:coverage` | Coverage report |
| `pnpm run test:e2e` | Playwright smoke tests |
| `pnpm run clean` / `clean:full` / `fresh` | Reset build artifacts |

## Conventions

`CLAUDE.md` and `AGENTS.md` are the source of truth; the essentials:

- **pnpm only**; **kebab-case** filenames (ESLint-enforced); `<script setup>` → `<template>` → `<style>`.
- **Imports**: `#shared` (not `~/shared/`), `#server` for server code.
- **No hardcoded colors** — CSS variables only (`--ui-*`, `--color-*`); every change must work across all themes and light/dark.
- **No hardcoded icons** — use `resolveIcon('semanticName')` from `useAppearance()` (see `CLAUDE.md` → Icons).
- **Nuxt UI v4** — consult the `nuxt-ui-remote` MCP before using a `U*` component; v2 patterns break silently.
- **i18n** — user-visible strings go through `t()`; keep `en`/`es` at parity.
- **Zod** at boundaries (API input, content frontmatter); descriptive errors, no silent `return null`.
- **TDD** where it fits: failing test → implement → verify. Test files mirror sources (`shared/utils/case.ts` → `test/unit/case.test.ts`).

## Pull requests

- **Conventional commits**: `type(scope): description` (`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `content`). Atomic — one logical change per commit. No AI/tool footnotes in commit messages.
- Keep the gate green; add tests for new behavior.
- If you touch UI, check it across all themes + light/dark and keep it accessible.
- Update docs alongside code: `CONTEXT.md` for new domain terms, `docs/adr/` for decisions worth recording, the relevant `**/README.md`, and the in-app guides under `content/en/guides/`.

## Environment variables

Use `useRuntimeConfig()` — never read `process.env` directly in app/server code.

- `NUXT_PUBLIC_SITE_URL` — production site URL

Secrets resolve from 1Password at runtime via `pnpm dev:op` (see the Secrets
guide at `/guides/secrets-1password`).
