# Plugins

Nuxt plugins for app initialization and global setup.

## Available Plugins

| Plugin                     | Purpose                                                    |
| -------------------------- | ---------------------------------------------------------- |
| `appearance.client.ts`     | Applies persisted theme/appearance before paint (no FOUC)  |
| `authorization.ts`         | Wires up `nuxt-authorization` for permission checks        |
| `suppress-build-errors.ts` | Dev utility to suppress specific noisy warnings            |

## Naming

- **Standard**: `plugin-name.ts` — runs on both client and server
- **Client-only**: `plugin-name.client.ts` — browser only
- **Server-only**: `plugin-name.server.ts` — server only

## Plugin Structure

```ts
export default defineNuxtPlugin({
  name: 'my-plugin',
  parallel: true, // Run concurrently with other plugins
  async setup(nuxtApp) {
    // Initialization logic
  },
})
```

## Learn More

- [Plugins Directory](https://nuxt.com/docs/guide/directory-structure/plugins)
