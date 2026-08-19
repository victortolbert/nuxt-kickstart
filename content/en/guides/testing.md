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
pnpm run lint:fix       # ESLint (@antfu/eslint-config) + auto-fix
pnpm run typecheck      # nuxt typecheck (vue-tsc)
pnpm exec vitest run    # unit + nuxt projects, one shot
```

> `pnpm run test` is bare `vitest`, which in a terminal starts **watch mode and
> never exits** — fine while developing, wrong as a gate. Use `pnpm exec vitest
> run` (or `pnpm run test:coverage`, the only script that already passes `run`)
> when you want a single pass with an exit code. In CI vitest detects the
> non-TTY and runs once, which is why the workflow can call `test:unit` directly.

## Vitest Projects

`vitest.config.ts` defines two projects:

| Project | Directory | Environment | Use for |
| --- | --- | --- | --- |
| `unit` | `test/unit/` | Node | Pure functions, server utils, structure assertions |
| `nuxt` | `test/nuxt/` | Nuxt | Components and composables needing the Nuxt runtime |

```bash
pnpm run test test/unit/case.test.ts   # one file (watch)
pnpm run test -t "converts kebab-case" # by name (watch)
pnpm run test:unit                     # unit project only (watch)
pnpm run test:nuxt                     # nuxt project only (watch)
pnpm exec vitest run                   # one shot, exits with a status code
pnpm run test:coverage                 # coverage report (target >70% on utilities)
```

All the `test*` scripts except `test:coverage` are watch-mode in a terminal;
`test:watch` is currently identical to `test:unit`.

Test files mirror their source: `shared/utils/case.ts` → `test/unit/case.test.ts`. The `unit` project maps the `#shared`/`#server` aliases itself, so server utilities are testable without booting Nuxt.

## Playwright (E2E)

Playwright specs live in `test/e2e/` — the vitest projects glob only `test/unit/` and `test/nuxt/`, so the runners stay separate. The config (`playwright.config.ts`) starts the dev server automatically and reuses an already-running one locally.

**First run only** — install the browser binary. `pnpm install` does not do this: `playwright` is deliberately not in `allowBuilds` (`pnpm-workspace.yaml`), so its postinstall never runs and no browsers are downloaded. Without this step `test:e2e` fails with *"Executable doesn't exist"*:

```bash
pnpm exec playwright install chromium
```

Chromium is the only browser needed — `playwright.config.ts` defines a single `chromium` project.

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
