# Plugins

Nitro request lifecycle hooks.

## Available Plugins

| Plugin             | Purpose                                          |
| ------------------ | ------------------------------------------------ |
| `authorization.ts` | Adds the authorization resolver to each request  |

## Authorization Plugin

Bridges the Better Auth session with `nuxt-authorization` by resolving the
current user for ability checks:

```ts
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', async (event) => {
    event.context.$authorization = {
      resolveServerUser: async () => {
        const session = await auth.api.getSession({ headers: event.headers })
        return session?.user ?? null
      },
    }
  })
})
```

## Available Hooks

| Hook             | When                    |
| ---------------- | ----------------------- |
| `request`        | Before route handler    |
| `beforeResponse` | Before sending response |
| `afterResponse`  | After response sent     |
| `error`          | On unhandled error      |

## Learn More

- [Nitro Plugins](https://nitro.build/guide/plugins)
