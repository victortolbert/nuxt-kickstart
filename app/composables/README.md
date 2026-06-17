# Composables

Vue 3 Composition API functions, auto-imported with the `use-` prefix.

## Naming

- **Kebab-case files**: `use-theme.ts`, not `useTheme.ts`
- **Auto-imported**: `useTheme()` available everywhere
- **Prefix convention**: Always start with `use`

## Representative Composables

There are ~27 composables here; a sample of the most central ones:

| Composable               | Purpose                                        |
| ------------------------ | ---------------------------------------------- |
| `useTheme()`             | Theme switching with localStorage persistence  |
| `useAppearance()`        | Color-mode + appearance preferences            |
| `useCollectionFilters()` | Filter state synced to URL query params        |
| `useVisibilityFilter()`  | Visibility-based content filtering             |
| `useContentAccess()`     | Gate content by auth/visibility                |
| `useContentEditor()`     | In-app content editing                         |
| `useLocalizedEntries()`  | Localized Collection lists (locale → en fallback) |
| `useSessionState()`      | Session Identity: loggedIn / user / role / isAdmin |

## Convention-Based Resolution

Several composables implement image resolution chains:

```
Explicit path → Convention lookup (/img/{set}/{slug}.*) → Placeholder
```

## Patterns

- Return readonly refs for defensive programming
- Use `useAsyncData()` for SSR-compatible data
- Sync filter state to `useRoute().query`

## Learn More

- [Composables Directory](https://nuxt.com/docs/guide/directory-structure/composables)
- [Vue Composition API](https://vuejs.org/guide/reusability/composables)
