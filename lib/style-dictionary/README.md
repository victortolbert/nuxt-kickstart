# Style Dictionary

Token definitions and build configuration for the design tokens pipeline.

The app transforms tokens at runtime through `server/utils/style-dictionary.ts`
(exposed via `/api/tokens/*` and the Design Tokens Studio at
`/examples/design-tokens`). This directory holds the source token JSON
(`tokens/`), a standalone config (`sd.config.js`), and CLI build output
(`build/`):

```bash
pnpm exec style-dictionary build --config lib/style-dictionary/sd.config.js
```

See the in-app Design Tokens guide (`/guides/design-tokens`) for the full
workflow and supported output formats (CSS, iOS, Android, JS/TS, Tailwind).
