# Podcasts database (example app)

Self-contained Drizzle ORM schema + client for the **podcast example app**. It
has its own libSQL connection and database file, deliberately separate from the
core/auth database (`server/db/` schema + `server/utils/db.ts` client).

Because it's an example, it lives in one folder you can delete wholesale: remove
`server/podcasts-db/` together with `server/api/podcasts/` and the
rest of the app is unaffected (see "What to Trim" in the Using This Template
guide).

## Files

| File         | Purpose                                          |
| ------------ | ------------------------------------------------ |
| `schema.ts`  | Table definitions (`subscriptions`, `playback_progress`) |
| `index.ts`   | libSQL client + exported `db`; creates the tables on first import |

## Usage

```ts
import { eq } from 'drizzle-orm'
import { db } from '#server/podcasts-db'
import { subscriptions } from '#server/podcasts-db/schema'

const subs = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId))
```

## Connection

Isolated from the core DB. Resolution (`index.ts`):

- **Dev**: in-memory (`:memory:`).
- **Production**: `file:.../podcast-app.db` — under `/tmp/kickstart` on
  serverless (Vercel/Netlify), else `<cwd>/data`.
- **Override**: `PODCAST_DB_PATH` / `NUXT_PODCAST_DB_PATH`.

Tables are created idempotently with `CREATE TABLE IF NOT EXISTS` on first
import — this DB is **not** managed by `drizzle.config.ts` (that config covers
only the core `server/db/schema.ts`). The Drizzle schema here exists for typed
queries.

## Learn More

- [Drizzle ORM](https://orm.drizzle.team/)
