# Components

Vue 3 Single File Components, auto-imported globally.

## Naming

- **Kebab-case required**: `world-clock.vue`, not `WorldClock.vue`
- **Client-only**: `.client.vue` suffix for browser-only components
- **Template usage**: `<WorldClock />` (PascalCase in templates)

## Subfolders

| Folder            | Purpose                                          |
| ----------------- | ------------------------------------------------ |
| `app/`            | App shell pieces (logos, `app-image.vue`)        |
| `charts/`         | Unovis charts (`.client.vue`/`.server.vue` pairs)|
| `content/`        | Content rendering helpers (TOC, prose, logos)    |
| `content-editor/` | In-app markdown editor + frontmatter form        |
| `email/`          | Email compose/draft/analytics UI                 |
| `examples/`       | Pattern-demo components (calendar, charts, maps, tables) |
| `podcasts/`       | Podcast example app UI (`/labs/podcasts`)        |
| `scoreboard/`     | Scoreboard example app UI (`/labs/scoreboard`)   |
| `llm-optimizer/`  | LLM Visibility Optimizer UI (`/labs/llm-vo`)     |
| `landing/`        | Landing page sections                            |
| `og-image/`       | Satori OG image templates                        |
| `calendar/`       | FullCalendar wrapper                             |
| `tokens/`         | Design-token tooling UI (token tree, editor…)    |

## Notable Components

| Component                   | Purpose                                       |
| --------------------------- | --------------------------------------------- |
| `app/app-image.vue`         | Image with error handling + fallback chain    |
| `world-clock.vue`           | Time display (`ClientOnly` for SSR hydration) |
| `appearance-panel.vue`      | Theme / appearance switcher panel             |
| `language-switcher.vue`     | i18n locale switcher                          |
| `translation-disclaimer.vue`| Machine-translation notice banner             |
| `confirm-dialog.vue`        | Reusable confirmation modal                   |
| `site-map.vue`              | Visual page hierarchy                         |
| `component-catalog.vue`     | UI component browser                          |

## Patterns

- Logic in composables, presentation in components
- Filter state synced to URL query params (`useCollectionFilters`)
- `@error` handlers for graceful image fallbacks
- Wrap client-dependent content in `<ClientOnly>` to avoid hydration mismatches

## Learn More

- [Components Directory](https://nuxt.com/docs/guide/directory-structure/components)
