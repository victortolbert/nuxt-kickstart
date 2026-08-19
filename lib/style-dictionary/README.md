# Style Dictionary

Token definitions and build configuration for the design tokens pipeline.

The app transforms tokens at runtime through `server/utils/style-dictionary.ts`
(exposed via `/api/tokens/*` and the Design Tokens Studio at
`/examples/design-tokens`). This directory holds the source token JSON
(`tokens/`) and a standalone config (`sd.config.js`):

```bash
pnpm exec style-dictionary build --config lib/style-dictionary/sd.config.js
```

`sd.config.js` sets `buildPath: 'build/css/'`, which Style Dictionary resolves
against the **current working directory** — so run from the repo root, the CLI
writes to `build/css/` at the repo root (gitignored), not into this directory.

See the in-app Design Tokens guide (`/guides/design-tokens`) for the full
workflow and supported output formats (CSS, iOS, Android, JS/TS, Tailwind).
