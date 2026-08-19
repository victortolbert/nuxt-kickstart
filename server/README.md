# Server

Nitro server powering API endpoints, authentication, and server-side logic.

## Structure

| Folder      | Purpose                                              |
| ----------- | --------------------------------------------------- |
| `api/`      | REST endpoints via file-based routing               |
| `routes/`   | Non-`/api` routes: Better Auth handler, WebSockets  |
| `utils/`    | Shared server utilities, auto-imported              |
| `plugins/`  | Nitro request lifecycle hooks                       |
| `db/`       | Core Better Auth Drizzle schema (`schema.ts`)       |
| `podcasts-db/` | Podcast example's isolated DB: schema + client (deletable with the example) |
| `types/`    | Server-only TypeScript declarations                 |
| `assets/`   | Compiled Maizzle email HTML — committed build output, ESLint-ignored (see `docs/adr/0004`) |

`auth.ts` configures Better Auth (providers, plugins, database hooks).

## Key Behaviors

- **Auto-imports**: Utils are auto-imported in server context
- **File routing**: `api/user.get.ts` → `GET /api/user`
- **Auth**: Better Auth; read the session via `/api/auth/get-session` or `auth.api.getSession()`
- **Dev-only content**: Content CRUD endpoints gated by `import.meta.dev`

## Databases (libSQL / SQLite via Drizzle)

Two separate databases — see each folder's README:

| Schema                 | Purpose                                                    |
| ---------------------- | ---------------------------------------------------------- |
| `db/schema.ts`         | Core: Better Auth tables (`user`, sessions, accounts, OTP, …); the schema drizzle-kit migrates |
| `podcasts-db/schema.ts` | Podcast example's isolated data (subscriptions, playback progress); not drizzle-kit managed |

The core DB uses a local SQLite file (`file:.data/auth.db`) in dev and Turso (`TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`) in production; the example DB is isolated (in-memory in dev). See repo-root `CLAUDE.md` → Database.

## Learn More

- [Nitro Server](https://nitro.build/)
- [Server Directory](https://nuxt.com/docs/guide/directory-structure/server)
