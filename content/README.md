# Content

Nuxt Content v3 markdown collections.

> **Schemas live in the repo-root `schemas/` directory** (imported by
> `content.config.ts`), not here. This folder holds the markdown documents; edit
> `schemas/` to change a collection's frontmatter shape.

## Folder Layout

| Path             | Purpose                                              |
| ---------------- | ---------------------------------------------------- |
| `en/`            | English localized content (`guides`, `posts`, `apps`, `blocks`) |
| `es/`            | Spanish translations (same filenames as `en/`)       |
| `tech/`          | Technology registry (non-localized)                  |
| `navigation/`    | Sidebar navigation groups (YAML, served by `/api/navigation`) |
| `_meta/`         | Landing/system pages                                 |
| `examples/`      | Example-app content (podcasts, episodes)             |
| `email-*/`       | Email subsystem (lists, drafts, analytics)           |

## Collections (by area, see `schemas/`)

| Area       | Collections                                          |
| ---------- | ---------------------------------------------------- |
| Publishing | `guides` (docs), `posts` (blog pattern), `meta`      |
| Registries | `tech`, `apps`, `blocks`                             |
| Examples   | `podcasts`, `episodes`                               |
| Systems    | email (`lists`, `drafts`, `analytics`)               |

## Base Schema

All collections share: `title`, `description?`, `tags[]`, `status`,
`visibility`, `created?`, `updated?`. Localized auto-translations are marked
with `machineTranslated: true`. See repo-root `CLAUDE.md` for visibility/status
conventions and collection-specific fields.

## Learn More

- [Nuxt Content](https://content.nuxt.com/)
