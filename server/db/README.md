# Core database (auth + app)

The canonical Drizzle ORM schema for the application — primarily the **Better
Auth** tables (`user`, `session`, `account`, `verification`) and their
relations. This is the schema `drizzle-kit` migrates (`drizzle.config.ts` →
`schema: './server/db/schema.ts'`).

## Files

| File        | Purpose                                              |
| ----------- | --------------------------------------------------- |
| `schema.ts` | Better Auth + app table definitions and relations   |

The matching client/connection lives in `server/utils/db.ts` (shared by Better
Auth and app code — they must use the same connection). Column-adding migration
scripts are in `scripts/add-*-columns.ts`; first-time setup is `pnpm run db:init`.

## Usage

```ts
import * as schema from '#server/db/schema'
import { db } from '#server/utils/db'

const users = await db.select().from(schema.user)
```

## Connection

Local SQLite file (`file:.data/auth.db`) in dev; Turso (libSQL) in production
via `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN`. See the project Database notes in
`CLAUDE.md`.

## Learn More

- [Drizzle ORM](https://orm.drizzle.team/)
- [Better Auth](https://www.better-auth.com/)
