# Shared Types

TypeScript types used in both client and server contexts. Import via
`#shared/types/*`.

## Key Files

| File                   | Purpose                                       |
| ---------------------- | --------------------------------------------- |
| `theme.ts`             | Theme IDs and configuration types             |
| `appearance.ts`        | Color-mode / appearance preference types      |
| `auth.ts`              | User, session, and role types                 |
| `navigation.ts`        | Navigation menu item types                    |
| `locale.ts`            | i18n locale types                             |
| `index.ts`             | Barrel re-exports                             |

## Theme Types

Theme IDs cover the 7 user-facing themes (`default`, `lyra`, `nord`, `dracula`,
`catppuccin`, `carnival`, `broadsheet`) — see `theme.ts` for the source of truth.

## Usage

```ts
import type { Role } from '#shared/types/auth'
import type { ThemeId } from '#shared/types/theme'
```

## Learn More

- [Shared Directory](https://nuxt.com/docs/guide/directory-structure/shared)
