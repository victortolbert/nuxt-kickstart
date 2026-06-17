# Types

TypeScript declarations scoped to the client application.

## Key Files

| File               | Purpose                                                |
| ------------------ | ------------------------------------------------------ |
| `app-config.d.ts`  | Types for `app.config.ts` (runtime app configuration)  |

## Where Other Types Live

- **Auth types** are defined by Better Auth (`server/auth.ts`) and surfaced on the client via `app/lib/auth-client.ts` (`authClient.useSession()`); there is no `#auth-utils` module augmentation.
- **Shared types** used by both client and server live in `shared/types/` (import via `#shared/types/*`).
- **Server-only ambient types** live in `server/types/`.

## Learn More

- [Nuxt App Config](https://nuxt.com/docs/guide/directory-structure/app-config)
- [TypeScript in Nuxt](https://nuxt.com/docs/guide/concepts/typescript)
