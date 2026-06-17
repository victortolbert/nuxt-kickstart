---
title: Testing
description: Vitest unit and component projects, Playwright smoke tests, and the green gate
tags:
  - testing
  - vitest
  - playwright
status: evergreen
visibility: public
category: other
difficulty: intermediate
order: 8
created: '2026-06-11'
---

## The Gate

Before committing, keep these green:

```bash
pnpm run lint:fix     # ESLint (@antfu/eslint-config) + auto-fix
pnpm run typecheck    # vue-tsc
pnpm run test         # vitest: unit + nuxt projects
```

## Vitest Projects

`vitest.config.ts` defines two projects:

| Project | Directory | Environment | Use for |
| --- | --- | --- | --- |
| `unit` | `test/unit/` | Node | Pure functions, server utils, structure assertions |
| `nuxt` | `test/nuxt/` | Nuxt | Components and composables needing the Nuxt runtime |

```bash
pnpm run test test/unit/case.test.ts   # one file
pnpm run test -t "converts kebab-case" # by name
pnpm run test:watch                    # watch mode
pnpm run test:coverage                 # coverage report (target >70% on utilities)
```

Test files mirror their source: `shared/utils/case.ts` → `test/unit/case.test.ts`. The `unit` project maps the `#shared`/`#server` aliases itself, so server utilities are testable without booting Nuxt.

## Playwright (E2E)

Playwright specs live in `test/e2e/` — the vitest projects glob only `test/unit/` and `test/nuxt/`, so the runners stay separate. The config (`playwright.config.ts`) starts the dev server automatically and reuses an already-running one locally.

```bash
pnpm run test:e2e        # headless chromium
pnpm run test:e2e:ui     # interactive UI mode
pnpm run test:e2e:debug  # step-through debugging
```

`test/e2e/smoke.spec.ts` covers the critical paths: landing render, the guides and posts indexes (including the Spanish guides page), the login screen, the unauthenticated-admin redirect, and FOUC-free theme application from localStorage. Add feature specs alongside it as your project grows.

## Writing Tests

TDD: write the failing test → implement → verify → refactor.

- Component tests use `mountSuspended` from `@nuxt/test-utils`
- Structure assertions (locale files, content layout) live in `test/unit/` and keep config honest
- The OG Image module is disabled under test (`process.env.VITEST`)
