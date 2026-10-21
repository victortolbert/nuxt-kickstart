# Scripts

Development and database scripts, run with [`tsx`](https://github.com/privatenumber/tsx).

## Running Scripts

```bash
pnpm exec tsx scripts/<script>.ts
```

Some are wired to package.json:

| Command | Script | Purpose |
| --- | --- | --- |
| `pnpm run init` | `init.ts` | One-time template rename (project name, site URL, storage keys) |
| `pnpm run db:migrate` | `migrate.ts` | Apply pending migrations (local file, or Turso via `TURSO_*`) |

## Other Scripts

| Pattern / file       | Purpose                                             |
| -------------------- | --------------------------------------------------- |
| `us-english.mjs`     | Rewrite British spellings on the authored surface   |

## Creating Scripts

```ts
// scripts/my-script.ts
// run: pnpm exec tsx scripts/my-script.ts
async function main() {
  // ...
}
main()
```
