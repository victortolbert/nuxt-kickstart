# AGENTS.md

Refer to CLAUDE.md for full project context. Key points for agents below.

## Quick Reference

| Task | Command |
| --- | --- |
| Install | `pnpm install` |
| Dev | `pnpm dev` |
| Build | `pnpm run build` |
| Lint + fix | `pnpm run lint:fix` |
| All tests | `pnpm run test` |
| Unit tests | `pnpm run test:unit` |
| Nuxt tests | `pnpm run test:nuxt` |
| Single file | `pnpm run test test/unit/case.test.ts` |
| Single name | `pnpm run test -t "converts kebab-case"` |
| Watch | `pnpm run test:watch` |
| Coverage | `pnpm run test:coverage` |
| E2E (Playwright) | `pnpm run test:e2e` |
| Typecheck | `pnpm run typecheck` |
| Template rename | `pnpm run init` |
| Changelog preview | `pnpm run changelog` |

## Project Structure

```
app/           # Nuxt app (~ or @)
  components/  # kebab-case.vue
  composables/ # use-*.ts
  utils/       # App utils
shared/        # #shared alias (use #shared not ~/shared)
  utils/       # Pure utils (case.ts, glossary.ts, token-*.ts)
  types/       # TypeScript types
server/        # Server routes/utils (#server alias)
content/       # Markdown content (docs, posts, registries)
test/
  unit/        # Node env — pure function tests
  nuxt/        # Nuxt env — component tests
  e2e/         # Playwright smoke tests (port 3210)
```

## Critical Rules

1. **Package manager**: pnpm only (not npm/yarn/bun)
2. **File naming**: kebab-case everywhere (enforced by ESLint)
3. **Imports**: `#shared` for shared/, not `~/shared/`
4. **Nuxt UI v4**: Always call `mcp__nuxt-ui-remote__get-component` before using any `U*` component — v2 patterns break silently
5. **No hardcoded colors**: Use CSS variables (`--ui-*`, `--color-*`)
6. **No hardcoded icons**: Use `resolveIcon('semanticName')` from `useAppearance()` — never literal `i-tabler-*` in app UI (see CLAUDE.md Icons for the exempt list); `resolveIcon` throws on unknown names
7. **Error handling**: Zod for validation, descriptive errors, no silent `return null`
8. **TypeScript**: `interface` over `type` for objects, strict mode, avoid `any`
9. **Git**: Conventional commits `type(scope): description`, atomic, no Claude footnote
10. **UI workflow**: Use `frontend-design` skill before building, `web-design-guidelines` after
