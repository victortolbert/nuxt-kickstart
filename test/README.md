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

## Running Tests

```bash
pnpm run test          # All vitest projects (unit + nuxt)
pnpm run test:unit     # unit project (node env) only
pnpm run test:nuxt     # nuxt project only
pnpm run test:watch    # watch mode (unit)
pnpm run test:coverage # coverage report
pnpm run test:e2e      # Playwright e2e (also :ui, :debug)

pnpm run test test/unit/case.test.ts   # single file
pnpm run test -t "converts kebab-case" # by test name
```

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

Copy a template from `test/templates/` to scaffold a new test with consistent structure, edge-case examples, and mocking patterns. Use `vi.stubEnv` for environment variables (not `vi.mock`). Coverage targets `shared/utils/`, `app/utils/`, and `lib/`.

## Learn More

- [Vitest](https://vitest.dev/)
- [Nuxt Testing](https://nuxt.com/docs/getting-started/testing)
- [Playwright](https://playwright.dev/)
