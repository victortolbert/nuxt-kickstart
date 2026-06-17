# Pages

File-based routing. Each `.vue` file becomes a route.

## Routing Conventions

| Pattern         | Example                     | Route                  |
| --------------- | --------------------------- | ---------------------- |
| `index.vue`     | `pages/index.vue`           | `/`                    |
| `[param].vue`   | `pages/examples/[slug].vue` | `/examples/:slug`      |
| `[...slug].vue` | `pages/[...slug].vue`       | catch-all (content)    |

The root `[...slug].vue` renders arbitrary Nuxt Content documents by path.

## Structure

| Path             | Purpose                                  |
| ---------------- | ---------------------------------------- |
| `index.vue`      | Landing page                             |
| `guides/`        | Guides collection (docs)                 |
| `posts/`         | Posts index                              |
| `tech/`          | Tech registry                            |
| `examples/`      | Example apps and pattern demos           |
| `blocks/`        | App blocks showcase                      |
| `app/`           | Authenticated dashboard + admin suite    |
| `admin/`         | Admin screens (email, trash, content)    |
| `login.vue`      | Auth entry (magic link / OTP / GitHub)   |
| `privacy.vue`, `terms.vue` | Legal pages                    |
| `[...slug].vue`  | Catch-all content renderer               |

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
