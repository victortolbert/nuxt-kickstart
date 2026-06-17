# Middleware

Route guards that execute before page navigation.

## Available Middleware

| Middleware           | Purpose                                                  |
| -------------------- | -------------------------------------------------------- |
| `auth.ts`            | Requires authentication, redirects to `/login`           |
| `guest.ts`           | Blocks authenticated users, redirects to `/`             |
| `admin.ts`           | Requires admin role                                      |
| `dev-only.ts`        | Blocks routes in production                              |
| `app-auth.global.ts` | Global guard applied to every route                      |

`*.global.ts` middleware runs on every navigation automatically; the rest are opt-in per page.

## Usage

Apply named middleware via `definePageMeta()`:

```ts
definePageMeta({
  middleware: ['auth', 'admin'],
})
```

## Creating Middleware

Auth state comes from Better Auth's session endpoint:

```ts
export default defineNuxtRouteMiddleware(async (to) => {
  const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
  const session = await $fetch('/api/auth/get-session', { headers })

  if (!session?.user) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
})
```

## Learn More

- [Middleware Directory](https://nuxt.com/docs/guide/directory-structure/middleware)
- [Better Auth](https://www.better-auth.com/)
