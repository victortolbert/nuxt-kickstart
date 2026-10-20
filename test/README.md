# Test

Vitest test suites plus Playwright end-to-end tests.

## Structure

| Folder       | Runner         | Environment | Purpose                      |
| ------------ | -------------- | ----------- | ---------------------------- |
| `unit/`      | vitest `unit`  | Node        | Pure utility/logic tests     |
| `nuxt/`      | vitest `nuxt`  | Nuxt        | Component/composable tests   |
| `e2e/`       | Playwright     | Chromium    | Browser smoke tests          |
| `templates/` | —              | —           | Starter templates for tests  |

`setup-storage.ts` (shared) and `nuxt/setup.ts` are loaded as setup files; see `vitest.config.ts`. Browser-driven end-to-end tests use Playwright and live in `test/e2e/` (run via `pnpm run test:e2e`, dev server on port 3210). The vitest projects deliberately glob only `test/unit/` and `test/nuxt/`, so the two runners never collide.

## Content and repository integrity

Five unit specs hold the tree to rules nothing else enforces. Each one starts
with a `the check can still fail` block that proves the scan reads real files and
can go red.

| Spec | Fails when |
| --- | --- |
| `content-schema-validation` | a document under `content/` breaks its collection's Zod schema (Nuxt Content stores it anyway; ADR-0009) |
| `content-collection-coverage` | a markdown file under `content/` matches no collection source |
| `content-secrets` | a credential, real email address or phone number appears under `content/` |
| `us-english` | a British spelling appears on the authored surface (`node scripts/us-english.mjs` fixes it) |
| `employer-terms` | a tracked file names the author's employer, its products or internal systems |

`test/helpers/` holds what they share: the content walk and glob matcher
(`content-tree.ts`), the spelling list (`us-english.ts`) and the employer-term
list (`employer-terms.ts`).

## Running Tests

```bash
pnpm exec vitest run                   # all projects, one-shot
pnpm exec vitest run --project unit    # unit project (node env) only
pnpm exec vitest run --project nuxt    # nuxt project only
pnpm run test:coverage                 # coverage report (already one-shot)
pnpm run test:e2e                      # Playwright e2e (also :ui, :debug)

pnpm exec vitest run test/unit/case.test.ts   # single file
pnpm exec vitest run -t "converts kebab-case" # by test name
```

`pnpm run test` and its `test:unit` / `test:nuxt` / `test:watch` siblings are
bare `vitest` — they watch and never exit. Use them when you want watch mode.

## Unit Tests

```ts
import { describe, expect, it } from 'vitest'
import { toKebabCase } from '#shared/utils/case'

describe('toKebabCase', () => {
  it('converts PascalCase', () => {
    expect(toKebabCase('InProgress')).toBe('in-progress')
  })
})
```

## Nuxt (Component) Tests

```ts
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import WorldClock from '~/components/world-clock.vue'

describe('WorldClock', () => {
  it('renders', async () => {
    const wrapper = await mountSuspended(WorldClock)
    expect(wrapper.html()).toBeTruthy()
  })
})
```

## Test Templates

Copy a template from `test/templates/` to scaffold a new test with consistent structure, edge-case examples, and mocking patterns. Use `vi.stubEnv` for environment variables (not `vi.mock`). Coverage targets six globs (`vitest.config.ts`): `shared/utils/`, `app/utils/`,
`app/composables/`, `app/middleware/`, `server/`, and `lib/`.

## Learn More

- [Vitest](https://vitest.dev/)
- [Nuxt Testing](https://nuxt.com/docs/getting-started/testing)
- [Playwright](https://playwright.dev/)
