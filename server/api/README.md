# API

REST endpoints via Nitro's file-based routing.

## Routing Conventions

| File                   | HTTP Method | Route             |
| ---------------------- | ----------- | ----------------- |
| `user.get.ts`          | GET         | `/api/user`       |
| `admin/users/[id]/...` | —           | `/api/admin/...`  |

## Subfolders

| Folder           | Purpose                                       |
| ---------------- | --------------------------------------------- |
| `admin/`         | Admin-only endpoints (users, system info)     |
| `content/`       | Content CRUD (dev-only)                        |
| `email/`         | Email campaigns, drafts, tracking              |
| `health/`        | Health/status checks                           |

Root-level endpoints: `user.get.ts`, `navigation.get.ts` (backs
`useNavigationConfig()`, filtered per session by the shared navigation rules),
`search.get.ts` (site search over the search registry, filtered per session by
the shared visibility rules),
`protected.get.ts`, and `auth-test.get.ts` — the last is a diagnostic helper.

> Authentication endpoints are **not** here — they are served by the Better Auth catch-all at `server/routes/api/auth/[...all].ts`.

## Authentication

```ts
import { auth } from '#server/auth'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers })
  if (!session?.user)
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  // session.user is available
})
```

## Authorization

```ts
import { isAdmin } from '#shared/utils/abilities'

export default defineEventHandler(async (event) => {
  await authorizeUser(event, isAdmin)
  // Only admins reach here
})
```

## Error Handling

```ts
throw createError({ statusCode: 404, message: 'Resource not found' })
```

## Learn More

- [Server API Routes](https://nuxt.com/docs/guide/directory-structure/server#api-routes)
