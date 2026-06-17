---
number: 5385
title: One Schema for all (Zod, PostgreSQL, Sqlite)
category: Q&A
created: 2026-02-17
url: "https://github.com/drizzle-team/drizzle-orm/discussions/5385"
upvotes: 1
comments: 3
answered: false
---

# One Schema for all (Zod, PostgreSQL, Sqlite)

Is there a way to create just one schema to use for all of these? (Zod, PostgreSQL, Sqlite)

---

## Top Comments

**@wesleysmyth** (+1):

Not with a single schema definition — Drizzle intentionally uses **separate table builders** for each dialect (`pgTable`, `sqliteTable`, `mysqlTable`) because their column types and capabilities differ (e.g., PostgreSQL has `jsonb`, `uuid`, `serial`; SQLite has `integer` primary keys with autoincrement).

However, you can share **validation schemas** and **TypeScript types** across both:

### 1. Shared types via `$inferSelect` / `$inferInsert`

```typescript
// pg-schema.ts
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull(),
});

...

**@m64s**:

Thank you for your reply.

 Does Drizzle have any plan to provide a way to create a unified schema for all databases, such as Prisma?

In example something like this

`import { Table, integer, text, timestamp } from "drizzle-orm/sql";
`

instead of `from "drizzle-orm/pg-core"` and `from "drizzle-orm/sqlite"`

like a general way 


**@wesleysmyth**:

Good question. Based on Drizzle's design philosophy and public roadmap, a Prisma-style unified schema isn't planned.

Drizzle is intentionally **SQL-first** — it wants you to think in terms of the actual database you're targeting, not an abstraction layer over it. The rationale is that PostgreSQL, SQLite, and MySQL have meaningfully different capabilities:

- **PostgreSQL** has `jsonb`, `uuid`, `serial`, `enum`, arrays, full-text search, `RETURNING *`
- **SQLite** has `integer` primary keys with autoincrement, no native `uuid`, no `enum`, limited `ALTER TABLE`
- **MySQL** has `AUTO_INCREMENT`,...