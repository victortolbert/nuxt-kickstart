# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root — the domain glossary.
- **`docs/adr/`** — read ADRs that touch the area you're about to work in.

This repo is **single-context**: there is no `CONTEXT-MAP.md`, and no per-context `CONTEXT.md` files. See [File structure](#file-structure) below.

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The `/domain-modeling` skill (reached via `/grill-with-docs` and `/improve-codebase-architecture`) creates them lazily when terms or decisions actually get resolved.

## File structure

This repo (single-context). Note it is a Nuxt 4 app — the code lives in `app/`, `server/`, `shared/` and `schemas/`, not in `src/`:

```
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-no-querycollection-facade.md
│   ├── 0002-curated-agent-skills.md
│   ├── 0003-strict-pnpm-node-modules.md
│   └── 0004-commit-maizzle-build-output.md
├── app/          ← pages, components, composables, utils, middleware
├── server/       ← API routes, db, auth, server utils
├── shared/       ← code shared between app/ and server/ (import via `#shared`)
└── schemas/      ← Nuxt Content collection schemas
```

Multi-context layout, for reference — **not applicable here**. It applies only to repos with a root `CONTEXT-MAP.md` pointing at one `CONTEXT.md` per context, plus context-scoped `docs/adr/` directories. If this repo ever splits into multiple bounded contexts, add `CONTEXT-MAP.md` at the root and the skills will follow it instead.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0003 (strict pnpm node_modules) — but worth reopening because…_
