---
number: 5371
title: how can I use zod with drizzle?
category: Q&A
created: 2026-02-14
url: "https://github.com/drizzle-team/drizzle-orm/discussions/5371"
upvotes: 1
comments: 3
answered: false
---

# how can I use zod with drizzle?

the documentation says that `drizzle-zod` is getting deprecated for v1 in favor of `drizzle-orm/zod`. When I try to `import { createSelectSchema } from 'drizzle-orm/zod';` as the documentation says I get an error saying *"Cannot find module drizzle-orm/zod or its corresponding type declarations. (ts 2307)"*. I am using `"drizzle-orm": "^0.45.1",` which is very current if not the latest version I get when using `bun add`. Any idea on how to do this?

---

## Top Comments

**@Tilakmahajan**:

Hi 

The issue is with the import path.

`drizzle-zod` was deprecated, but the Zod helpers were not moved into the main `drizzle-orm` package. Instead, they were extracted into a separate package.

You need to install:

  bun add @drizzle-orm/zod

(or npm / pnpm equivalent)

Then import like this:

  import { createSelectSchema } from "@drizzle-orm/zod";

Not:

  import { createSelectSchema } from "drizzle-orm/zod";

That’s why you're seeing:

  Cannot find module 'drizzle-orm/zod'

After installing the correct package, it should work as expected 

Let me know if ...

**@wesleysmyth**:

There are two packages and they serve different purposes — here's the current state:

### `drizzle-zod` (use this now)

This is the stable, published package:

```bash
npm install drizzle-zod
```

```typescript
import { pgTable, text, uuid, integer } from 'drizzle-orm/pg-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';

const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  age: integer('age'),
});

...

**@nferdica**:

The confusion comes from the docs showing v1 syntax while you're on v0.x.

**On stable (0.45.x):** `drizzle-orm/zod` doesn't exist yet. Use the standalone `drizzle-zod` package:
```bash
bun add drizzle-zod zod
```
```ts
import { createSelectSchema, createInsertSchema } from 'drizzle-zod'
import { users } from './schema'

const selectUserSchema = createSelectSchema(users)
const insertUserSchema = createInsertSchema(users)

// You can also refine fields:
const insertUserSchema = createInsertSchema(users, {
  email: (schema) => schema.email.email(),
  name: (schema) => schema.name.min(1),
})
```...