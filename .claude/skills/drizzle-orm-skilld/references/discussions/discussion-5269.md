---
number: 5269
title: How to support both PostgreSQL and SQLite ?
category: Q&A
created: 2026-01-16
url: "https://github.com/drizzle-team/drizzle-orm/discussions/5269"
upvotes: 1
comments: 1
answered: false
---

# How to support both PostgreSQL and SQLite ?

I plan to shift from typeorm to drizzle and have found that drizzle defines schema and client that must be referenced from different packages. How can I make it support both at the same time? I hope to switch between them through DATABASE_URL after deployment.

---

## Top Comments

**@ismaildasci**:

supporting both postgres and sqlite with drizzle requires some abstraction. here is how to do it:

1. create separate schema files for each database:

```ts
// schema/postgres.ts
import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});
```

```ts
// schema/sqlite.ts
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});
```

...