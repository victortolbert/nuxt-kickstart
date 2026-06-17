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
| `pnpm run db:init` | `init-better-auth-db.ts` | Create the local Better Auth SQLite tables |

## Other Scripts

| Pattern / file       | Purpose                                             |
| -------------------- | --------------------------------------------------- |
| `add-*-columns.ts`   | Lightweight schema migrations (admin, role, phone…) |

## Creating Scripts

```ts
// scripts/my-script.ts
// run: pnpm exec tsx scripts/my-script.ts
async function main() {
  // ...
}
main()
```
