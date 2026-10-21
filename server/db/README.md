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
Auth and app code — they must use the same connection).

## Migrations

Migrations are the only way the schema changes (ADR-0010).

| File / folder     | Purpose                                                        |
| ----------------- | -------------------------------------------------------------- |
| `migrations/`     | The one migration chain, generated and committed               |
| `migrate.ts`      | Applies pending migrations; adopts a pre-migration database    |
| `schema-files.ts` | The schema files drizzle-kit reads: this one plus every layer's |

```bash
pnpm run db:generate   # after editing a schema file: write the migration, commit it
pnpm run db:migrate    # apply pending migrations (runs on install and before deploy)
```

A layer that keeps tables declares them in `layers/<name>/server/db/schema.ts`;
`db:generate` picks it up with no registration. When a layer is deleted,
`db:generate` proposes dropping its tables — do not commit that migration. The
tables stay, inert, and restoring the folder restores the module.

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
