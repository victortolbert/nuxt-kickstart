---
title: Adding Content
description: Frontmatter conventions and collection-specific fields for guides, posts, and registries
tags:
  - content
  - markdown
  - frontmatter
status: evergreen
visibility: public
category: content
difficulty: beginner
order: 3
prerequisites:
  - getting-started
created: '2026-01-23'
updated: '2026-06-11'
---

## Content Basics

All content lives in the `content/` folder as Markdown files with YAML frontmatter.

```markdown
---
title: My First Post
description: A quick idea, written down
tags:
  - idea
  - design
status: seed
visibility: private
---

## The actual content

Write your content here using Markdown.
```

## Base Fields (All Collections)

Every content file shares these fields:

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `title` | Yes | - | Display title |
| `description` | No | - | Short summary |
| `tags` | No | `[]` | Categorization tags |
| `status` | No | `seed` | Lifecycle stage |
| `visibility` | No | `private` | Access control |
| `created` | No | - | ISO date string |
| `updated` | No | - | ISO date string |

## Status Lifecycle

Content grows through stages:

| Status | Meaning |
|--------|---------|
| `seed` | New idea, rough draft |
| `sprout` | Developing, taking shape |
| `evergreen` | Mature, maintained |
| `wilted` | Outdated, needs review |

## Visibility Levels

| Level | Who Can View |
|-------|--------------|
| `private` | Only you (author) or admins |
| `internal` | Any logged-in user |
| `public` | Everyone |

Dev mode (`?dev=true`) bypasses visibility checks so you can preview everything locally.

### How visibility is enforced — and its limits

Visibility is applied in three independent layers:

- **Listings** — `useVisibilityFilter` drops entries a viewer can't access from index pages (e.g. `/guides`, `/blocks`).
- **Detail pages** — `useContentAccess` guards each content route: `internal` redirects guests to `/login`; `private` returns a 404 for non-admins.
- **Navigation** — set `visibility` on the matching item in `content/navigation/*.yml` so the sidebar and command palette hide links a viewer can't follow. (This is declarative — keep it in sync with the content's `visibility`.)

::warning
These layers control the **UI and navigation experience** — they keep non-public content out of lists, pages, and menus, which is the right default for a content site. They are **not** a hard confidentiality boundary. On client-side navigation the content body is fetched *before* the page guard redirects, and Nuxt Content's query API isn't auth-gated on its own. For genuinely secret material, enforce access on the server (a custom server route that checks the session before returning content) or simply don't build it into the shipped content database.
::

## Collection-Specific Fields

### Guides (`content/en/guides/`)

```yaml
---
title: Deployment
category: deployment # getting-started | authentication | content | customization | deployment | other
difficulty: beginner # beginner | intermediate | advanced
order: 5
prerequisites:
  - getting-started
---
```

### Posts (`content/en/posts/`)

```yaml
---
title: Hello World
date: '2026-06-11'
author: Your Name
---
```

### Tech Registry (`content/tech/`)

```yaml
---
title: Nuxt
slug: nuxt
displayName: Nuxt
category: meta-framework # see the full taxonomy in schemas/registries/tech.ts
ecosystem: javascript
maturity: active # emerging | active | mature | legacy | deprecated
icon:
  provider: iconify
  name: logos:nuxt-icon # brand logo (logos:* / simple-icons:*)
website: https://nuxt.com
secondaryCategories: []
relatedTech: []
aliases: []
usageContexts: []
---
```

`category` uses a fine-grained taxonomy (`programming-language`, `meta-framework`, `ui-library`, `build-tool`, …); the `/tech` page rolls these up into coarse buckets (Languages, Frameworks, Libraries, Tooling, Platforms, Other) — see `app/utils/tech-taxonomy.ts`. Brand colors/icons for `TechBadge` live in `app/utils/tech-config.ts`.

## File Organization

```
content/
  en/
    guides/
      getting-started.md   # /guides/getting-started
    posts/
      hello-world.md       # /posts/hello-world
  es/
    guides/                # Spanish translations (same filenames)
  tech/
    nuxt.md                # Registry entries use slugs
```

## Linking Content

Registries use stable slugs that other content references:

```yaml
tech:
  - nuxt        # References content/tech/nuxt.md
  - tailwind    # References content/tech/tailwind.md
```

Keep slugs stable — renaming one breaks every reference to it.

## Rich Media

Enhance your content with embedded media using MDC components:

- **[Mermaid Diagrams](/guides/mermaid-diagrams)** - Flowcharts, sequence diagrams, ERDs
- **[Video & Social Embeds](/guides/video-embeds)** - YouTube videos, Twitter/X posts

## Tips

1. **Use tags liberally** - They power search and filtering
2. **Keep slugs stable** - Other content references them
3. **Default to private** - Make public intentionally
4. **Adding a whole collection?** - See the [Architecture guide](/guides/architecture#adding-a-collection)
