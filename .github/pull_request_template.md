## What

<!-- One sentence: what does this PR do? -->

## Why

<!-- One sentence: why is this change needed? -->

## The gate

<!-- See CONTRIBUTING.md → "The gate". CI runs preflight/lint/typecheck/coverage; -->
<!-- e2e and build are local-only, so tick them honestly. -->

- [ ] `pnpm exec preflight check` — no config drift
- [ ] `pnpm run lint` — clean
- [ ] `pnpm run typecheck` — clean
- [ ] `pnpm exec vitest run` — green (not `pnpm run test`, which is watch mode)
- [ ] `pnpm run test:e2e` — green
- [ ] `pnpm run build` — succeeds

## Checklist

- [ ] Conventional commits, atomic — one logical change per commit
- [ ] Tests added or updated for new behavior
- [ ] No unnecessary dependencies added
- [ ] Docs updated alongside the code — `CONTEXT.md` for new domain terms,
      `docs/adr/` for decisions worth recording, the relevant `**/README.md`,
      and the in-app guides under `content/en/guides/`

## UI changes

<!-- Delete this section if the PR touches no UI. -->

- [ ] Works across all seven themes and in both light and dark mode
- [ ] No hardcoded colors — CSS variables only (`--ui-*`, `--color-*`)
- [ ] No hardcoded icons — `resolveIcon('semanticName')` via `useAppearance()`
- [ ] Responsive and keyboard accessible

## Breaking changes

None
