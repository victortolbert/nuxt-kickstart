# Utils

Pure utility functions, auto-imported globally.

## Key Files

| File                 | Purpose                                          |
| -------------------- | ------------------------------------------------ |
| `tech-config.ts`          | Tech stack brand colors, icons, labels           |
| `icon-sets.ts`            | Semantic icon registry: every name maps to all 5 collections (verified against @iconify-json); consumed via `resolveIcon()` |
| `garden-status.ts`        | Source of truth for content lifecycle statuses (seed/sprout/evergreen/wilted): color, icon, CSS-var per status — used by badges, filters, charts |
| `session-identity.ts`     | Awaitable Session Identity for route middleware  |
| `navigate.ts`             | Navigation helpers                               |
| `ui-locale.ts`            | Maps app locales to Nuxt UI locale messages      |
| `tech-taxonomy.ts`        | `TECH_BUCKETS` + `techBucket()` — groups registry entries |

## Tech Config

Defines tech entries with brand identity:

```ts
getTechConfig('nuxt')
// { label: 'Nuxt', icon: 'logos:nuxt-icon', color: '#00DC82' }

hasTechConfig('unknown') // false
```

Add new tech by extending the record in `tech-config.ts`.

## Difference from Composables

| Utils               | Composables        |
| ------------------- | ------------------ |
| Pure functions      | Reactive state     |
| No Vue dependencies | Use Vue reactivity |
| Synchronous         | May be async       |

For framework-agnostic, portable logic prefer `lib/`; for code shared with the server use `shared/utils/`.

## Learn More

- [Utils Directory](https://nuxt.com/docs/guide/directory-structure/utils)
