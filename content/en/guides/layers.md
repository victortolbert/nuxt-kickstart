---
title: Layers, Migrations and Search
description: Add an optional module as a folder, give it tables and searchable content, and remove it by deleting the folder
tags:
  - architecture
  - layers
  - database
  - search
status: evergreen
visibility: public
category: customization
difficulty: intermediate
order: 5
prerequisites:
  - architecture
created: '2026-10-21'
---

An optional module (an AI assistant, an MCP server, a planner) lives in its own
[Nuxt layer](https://nuxt.com/docs/guide/going-further/layers){target="_blank"}
under `layers/<module>/`. Nuxt registers every folder there automatically. The
module arrives as a folder and leaves by deleting it. **A layer never edits a
base file**: everything it contributes comes from inside its folder.

## What a layer can contribute

```text
layers/planner/
├── nuxt.config.ts            # i18n locales, protectedPaths
├── content.config.ts         # its collections
├── content/                  # their sources
├── app/
│   ├── app.config.ts         # search registrations
│   └── pages/planner/        # its routes
├── server/
│   ├── api/                  # its server routes
│   └── db/schema.ts          # its tables
└── i18n/locales/{en,es}.json # its messages
```

### Tables

Declare them in `layers/<module>/server/db/schema.ts`, with Drizzle as usual.
The migration tooling reads the base schema plus every layer's schema file
(`server/db/schema-files.ts`), so there is nothing to register:

```bash
pnpm run db:generate   # writes the migration to server/db/migrations/
pnpm run db:migrate    # applies it
```

Commit the migration with the schema change. All migrations, a layer's
included, live in the base repo's one chain, so a deploy applies a single
ordered sequence.

### Collections

A layer's `content.config.ts` defines its collections. Their sources resolve
under the layer's own `content/` folder:

```ts [layers/planner/content.config.ts]
import { defineCollection, defineContentConfig } from '@nuxt/content'
import { base } from '../../schemas/shared/base'

export default defineContentConfig({
  collections: {
    plans: defineCollection({
      type: 'page',
      source: { include: 'plans/**/*.md', prefix: '/planner' },
      schema: base,
    }),
  },
})
```

The content-integrity checks read layer content too. Every document is parsed
against its collection's schema, every markdown file must belong to a
collection, and nothing under `content/` may carry a secret, because every
collection ships in a public dump whatever its `visibility`.

### Search

Register a collection in the layer's app config with the fields to match on.
Nuxt concatenates app config arrays across layers, so the registration joins
the template's without anyone editing a central list:

```ts [layers/planner/app/app.config.ts]
export default defineAppConfig({
  search: {
    collections: [
      { collection: 'plans', fields: ['title', 'description', 'tags'] },
    ],
  },
})
```

`roles` names the field that plays each part in a result, for a collection
whose fields are not called `title` and `description`:

```ts
{ collection: 'glossary', fields: ['title', 'definitions', 'aliases'], roles: { body: 'definitions', aliases: 'aliases' } }
{ collection: 'organizations', fields: ['name'], roles: { title: 'name' } }
```

Set `localized: true` for a collection that keeps every locale under
locale-prefixed paths, as `guides` does.

`/api/search?q=…&locale=…` answers from the registry. It applies the same
visibility rules as listings, pages and the sitemap. A visitor sees only
public results and a member sees internal ones too. A wilted page, or one held
by the review gate, reads as internal. Results link to the route that renders
them in the reader's locale. A collection that fails to query is dropped from
the response, not turned into an error. The ⌘K palette is built on this route.

### Locale messages

Ship `en.json` and `es.json` in `layers/<module>/i18n/locales/` and declare
them in the layer's `nuxt.config.ts`. Nuxt i18n merges them into the app's
messages:

```ts [layers/planner/nuxt.config.ts]
export default defineNuxtConfig({
  i18n: {
    locales: [
      { code: 'en', file: 'en.json' },
      { code: 'es', file: 'es.json' },
    ],
  },
})
```

The two files must have the same keys. A machine-translated file says so with
`"translation": { "machineTranslated": "true" }`, the message-file counterpart
of `machineTranslated: true` on a guide.

### Protected paths

Gate the layer's routes from its `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  protectedPaths: {
    protected: ['/planner'], // signed-out visitors go to /login
    public: ['/planner/about'], // an open page inside it
  },
})
```

`modules/layers.ts` merges these into the one Protected path list. The global
middleware redirects them (locale forms included), the sitemap leaves them out,
and the route rules mark them `robots: false`. `pageGated` and `unindexed` work
the same way for pages that gate themselves and for pages that are open but
not indexed.

### Icons

Semantic icon names still live in `app/utils/icon-sets.ts`, with a mapping for
each of the five icon collections.

## Removing a layer

Delete the folder. Its routes, collections, search registrations, messages and
protected paths go with it.

Its tables stay. `pnpm run db:generate` will now propose a migration that drops
them. **Do not commit it.** The tables are left in place, unused and harmless,
and the app boots normally with them present. Restoring the folder restores the
module against its existing data.

## Migrating an existing database

Before v1.1 the tables came from a `db:init` script. A database it created has
the tables but no migration journal. The first `pnpm run db:migrate` against
it records the migrations it already satisfies as applied, without running
them, then applies the rest. Rows are kept, and no step is run by hand. The
decision is recorded in ADR-0010.
