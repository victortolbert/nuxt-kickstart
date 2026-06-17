---
number: 5157
title: Facing an issue with bytea in drizzle-orm
category: Q&A
created: 2025-12-19
url: "https://github.com/drizzle-team/drizzle-orm/discussions/5157"
upvotes: 2
comments: 1
answered: false
---

# Facing an issue with bytea in drizzle-orm

I was using bytea with drizzle-orm to ensure storage of my image files, and when I was designing its schema, I was facing an issue where there was no export named bytea in drizzle-orm/pg-core, however in documentation, it was listed as correct export. I also tried custom bytea export, still it was not working, kindly guide me how to fix this issue.

---

## Top Comments

**@wesleysmyth**:

The `bytea` column type support depends on your Drizzle ORM version.

### If you are on drizzle-orm 0.36+

`bytea` is available as a first-class column type:

```typescript
import { pgTable, bytea, text, uuid } from 'drizzle-orm/pg-core';

const files = pgTable('files', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  data: bytea('data', { mode: 'buffer' }).notNull(),
});
```

...