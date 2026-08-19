# App

Nuxt 4 client application root. Contains all Vue components, pages, layouts, and client-side logic.

## Structure

| Folder         | Purpose                                              |
| -------------- | ---------------------------------------------------- |
| `components/`  | Vue 3 SFCs, auto-imported globally                   |
| `composables/` | Composition API functions (`use-*`), auto-imported   |
| `pages/`       | File-based routing                                   |
| `layouts/`     | Page layout wrappers                                 |
| `middleware/`  | Route guards                                         |
| `plugins/`     | App initialization hooks                             |
| `utils/`       | Pure utility functions, auto-imported                |
| `lib/`         | Client library code (e.g. `auth-client.ts`)          |
| `types/`       | TypeScript declarations                              |
| `assets/`      | CSS/themes, processed by the bundler                 |
| `emails/`      | Maizzle email templates (Vue SFCs, own conventions — see its README) |

Entry points: `app.vue` (root component), `error.vue` (error boundary), and
`app.config.ts` (runtime app config).

## Key Behaviors

- **Auto-imports**: Components, composables, and utils are auto-imported (no explicit imports needed)
- **Kebab-case naming**: All files use kebab-case (enforced by ESLint)
- **Client-only files**: `.client.vue` / `.client.ts` suffix for browser-only code
- **Imports**: use `#shared` for `shared/`, `~`/`@` for `app/`

## Learn More

- [Nuxt App Directory](https://nuxt.com/docs/guide/directory-structure/app)
- [Auto-imports](https://nuxt.com/docs/guide/concepts/auto-imports)
