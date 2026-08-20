# Pages

File-based routing. Each `.vue` file becomes a route.

## Routing Conventions

| Pattern         | Example                     | Route                  |
| --------------- | --------------------------- | ---------------------- |
| `index.vue`     | `pages/index.vue`           | `/`                    |
| `[param].vue`   | `pages/app/admin/users/[id].vue` | `/app/admin/users/:id` |
| `[...slug].vue` | `pages/guides/[...slug].vue`| `/guides/*`            |

The root `[...slug].vue` renders arbitrary Nuxt Content documents by path.

## Structure

| Path             | Purpose                                  |
| ---------------- | ---------------------------------------- |
| `index.vue`      | Landing page                             |
| `guides/`        | Guides collection (docs)                 |
| `posts/`         | Posts index                              |
| `tech/`          | Tech registry                            |
| `labs/`          | Example apps — currently the broadsheet layout reference |
| `blocks/`        | App blocks showcase                      |
| `app/`           | Authenticated dashboard + admin suite (admin screens live at `app/admin/`) |
| `login.vue`      | Auth entry (magic link / OTP / GitHub)   |
| `settings.vue`, `appearance.vue` | User preferences         |
| `about.vue`, `contact.vue` | Marketing pages                |
| `privacy.vue`, `terms.vue` | Legal pages                    |
| `[...slug].vue`  | Catch-all content renderer               |

There is no top-level `admin/` route — the admin suite is nested under
`app/admin/`. Legacy `/admin/**` URLs are kept
alive by redirect rules in `nuxt.config.ts`.

## Page Titles & SEO

```ts
useHead({ title: 'Projects | Kickstart' })
useSeoMeta({ description: 'Page description for search engines' })
```

## Page Meta

```ts
definePageMeta({
  layout: 'default',
  middleware: ['auth'],
})
```

## Data Fetching

```ts
const { data } = await useAsyncData('projects', () => queryCollection('projects').all())
```

## Learn More

- [Pages Directory](https://nuxt.com/docs/guide/directory-structure/pages)
- [Dynamic Routes](https://nuxt.com/docs/guide/directory-structure/pages#dynamic-routes)
