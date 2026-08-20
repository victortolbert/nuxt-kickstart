# Lib

Framework-agnostic utilities, testable without a Nuxt context.

## Purpose

Code that:

- Has no Vue/Nuxt dependencies
- Can be unit tested in isolation
- May be extracted to npm packages

## Key Files

| File                        | Purpose                                          |
| --------------------------- | ------------------------------------------------ |
| `basic.ts`                  | Basic/example utility functions                  |
| `env.ts`                    | Typed environment helpers                        |
| `try-parse-env.ts`          | Safe env parsing (no throw on missing keys)      |

## Testing

Tests live in `test/unit/` and run without a Nuxt environment:

```bash
pnpm exec vitest run --project unit
```

Coverage includes `lib/**/*.ts` (see `vitest.config.ts`).

## When to Use

| Use `lib/`                  | Use `shared/utils/`  | Use `app/utils/` |
| --------------------------- | -------------------- | ---------------- |
| No framework deps           | Shared client+server | Client-only      |
| Portable / extractable      | App domain logic     | App UI helpers   |
