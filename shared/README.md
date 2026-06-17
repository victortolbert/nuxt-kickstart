# Shared

Code shared between client (`app/`) and server (`server/`). Import via the
`#shared` alias (preferred over `~/shared/`).

## Structure

| Folder     | Purpose                                                |
| ---------- | ------------------------------------------------------ |
| `types/`   | TypeScript types used on client + server               |
| `utils/`   | Pure functions used on client + server (auto-imported) |
| `schemas/` | Zod schemas (auth, content, common) for validation     |
| `data/`    | Static data + token fixtures (quotes, sample tokens…)  |

## Key Files

| File                  | Purpose                            |
| --------------------- | ---------------------------------- |
| `types/theme.ts`      | Theme IDs and config types         |
| `types/navigation.ts` | Navigation menu types              |
| `utils/case.ts`       | Case transformation utilities      |
| `utils/glossary.ts`   | Acronym detection + term lookup    |
| `utils/abilities.ts`  | `nuxt-authorization` ability defs  |
| `schemas/content.ts`  | Content frontmatter Zod schemas    |

## Usage

```ts
import type { ThemeId } from '#shared/types/theme'
import { formatLabel } from '#shared/utils/case'
```

## Learn More

- [Shared Directory](https://nuxt.com/docs/guide/directory-structure/shared)
