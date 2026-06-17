# Types

Server-only TypeScript declarations (ambient `.d.ts` files scoped to the Nitro
server build).

This directory is currently a placeholder — there are no server-only type
declarations at the moment.

## Where Types Live

- **Auth types**: inferred from Better Auth in `server/auth.ts`; the client uses `app/lib/auth-client.ts`. There is no `#auth-utils` module augmentation.
- **Database types**: inferred from the Drizzle schemas in `server/db/` (core/auth) and `server/podcasts-db/` (podcast example).
- **Shared types** (client + server): `shared/types/`, imported via `#shared/types/*`.

Add a `*.d.ts` here only for ambient types that must be visible exclusively to
server code.

## Learn More

- [TypeScript Module Declaration](https://www.typescriptlang.org/docs/handbook/modules/reference.html#ambient-modules)
