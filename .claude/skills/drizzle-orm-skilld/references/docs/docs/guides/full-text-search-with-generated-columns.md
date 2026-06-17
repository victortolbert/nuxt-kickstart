Drizzle ORM - Full-text search with Generated Columns

We've merged alternation-engine into Beta release. Try it out!

 Documentation

33k+ 

Dark

System

meet drizzle

Get started Sustainability Why Drizzle? Guides

Tutorials Latest releases Gotchas

Upgrade to v1.0 RC

 How to upgrade? Relational Queries v1 to v2

Fundamentals

 Schema Relations Database connection Query Data Migrations

Connect

PostgreSQL Gel MySQL SQLite MSSQL CockroachDB SingleStore

PlanetScale Postgres Neon Vercel Postgres Prisma Postgres Supabase Xata PGLite Nile Bun SQL Effect Postgres

PlanetScale MySQL TiDB

Turso Cloud Turso Database SQLite Cloud Cloudflare D1 Bun SQLite Node SQLite Cloudflare Durable Objects

Expo SQLite OP SQLite React Native SQLite

AWS Data API Postgres AWS Data API MySQL

Drizzle Proxy

Expand

Manage schema

 Data types Indexes & Constraints Sequences Views Schemas Drizzle Relations Row-Level Security (RLS)Extensions

[\[OLD\] Drizzle Relations](https://orm.drizzle.team/docs/relations)

Migrations

 Overview `generate` `migrate` `push` `pull` `export` `check` `up` `studio` Custom migrations Migrations for teams Web and mobile drizzle.config.ts

Seeding

 Overview Generators Versioning

Access your data

 Query Select Insert Update Delete Filters Utils Joins Magic sql`` operator

[\[OLD\] Query V1](https://orm.drizzle.team/docs/rqb)

Performance

 Queries Serverless

Advanced

 Set Operations Generated Columns Transactions Batch Cache Dynamic query building Read Replicas Custom types Goodies

Validations

 zod valibot typebox arktype typebox-legacy effect-schema

Extensions

 Prisma ESLint Plugin drizzle-graphql

System Light Dark

Become a Sponsor Twitter Discord

v1.0 98%

Benchmarks

Extension

Studio

Studio Package

Gateway

Drizzle Run

Our goodies!

Our Primary backer Our Cloud Partner

     Drizzle is giving you 10% off Turso Scaler and Pro for 1 Year           

Product by Drizzle Team

One Dollar Stats $1 per mo web analytics christmas  deal

Drizzle | Full-text search with Generated Columns

This guide assumes familiarity with:

- Get started with PostgreSQL
- Select statement
- Indexes
- sql operator
- Full-text search
- Generated columns

This guide demonstrates how to implement full-text search in PostgreSQL with Drizzle and generated columns. A generated column is a special column that is always computed from other columns. It is useful because you don’t have to compute the value of the column every time you query the table:

schema.ts

migration.sql

__

```
import { SQL, sql } from 'drizzle-orm';
import { index, pgTable, serial, text, customType } from 'drizzle-orm/pg-core';

export const tsvector = customType<{
data: string;
}>({
dataType() {
  return \`tsvector\`;
},
});

export const posts = pgTable(
'posts',
{
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  bodySearch: tsvector('body_search')
    .notNull()
    .generatedAlwaysAs((): SQL => sql\`to_tsvector('english', ${posts.body})\`),
},
(t) => [
  index('idx_body_search').using('gin', t.bodySearch),
]
);
```

__

```
CREATE TABLE "posts" (
  "id" serial PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "body" text NOT NULL,
  "body_search" "tsvector" GENERATED ALWAYS AS (to_tsvector('english', "posts"."body")) STORED NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_body_search" ON "posts" USING gin ("body_search");
```

When you insert a row into a table, the value of a generated column is computed from an expression that you provide when you create the column:

__

```
import { posts } from './schema';

const db = drizzle(...);

const body = "Golden leaves cover the quiet streets as a crisp breeze fills the air, bringing the scent of rain and the promise of change"

await db.insert(posts).values({
    body,
    title: "The Beauty of Autumn",
  }
).returning();
```

__

```
[
  {
    id: 1,
    title: 'The Beauty of Autumn',
    body: 'Golden leaves cover the quiet streets as a crisp breeze fills the air, bringing the scent of rain and the promise of change',
    bodySearch: "'air':13 'breez':10 'bring':14 'chang':23 'cover':3 'crisp':9 'fill':11 'golden':1 'leav':2 'promis':21 'quiet':5 'rain':18 'scent':16 'street':6"
  }
]
```

This is how you can implement full-text search with generated columns in PostgreSQL with Drizzle ORM. The `@@` operator is used for direct matches:

__

```
const searchParam = "bring";

await db
  .select()
  .from(posts)
  .where(sql\`${posts.bodySearch} @@ to_tsquery('english', ${searchParam})\`);
```

__

```
select * from posts where body_search @@ to_tsquery('english', 'bring');
```

This is more advanced schema with a generated column. The `search` column is generated from the `title` and `body` columns and `setweight()` function is used to assign different weights to the columns for full-text search. This is typically used to mark entries coming from different parts of a document, such as title versus body.

schema.ts

migration.sql

__

```
import { SQL, sql } from 'drizzle-orm';
import { index, pgTable, serial, text, customType } from 'drizzle-orm/pg-core';

export const tsvector = customType<{
data: string;
}>({
dataType() {
  return \`tsvector\`;
},
});

export const posts = pgTable(
'posts',
{
 id: serial('id').primaryKey(),
 title: text('title').notNull(),
 body: text('body').notNull(),
 search: tsvector('search')
   .notNull()
   .generatedAlwaysAs(
      (): SQL =>
       sql\`setweight(to_tsvector('english', ${posts.title}), 'A')
        ||
        setweight(to_tsvector('english', ${posts.body}), 'B')\`,
   ),
},
(t) => [
  index('idx_search').using('gin', t.search),
],
);
```

__

```
CREATE TABLE "posts" (
  "id" serial PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "body" text NOT NULL,
  "search" "tsvector" GENERATED ALWAYS AS (setweight(to_tsvector('english', "posts"."title"), 'A')
        ||
        setweight(to_tsvector('english', "posts"."body"), 'B')) STORED NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_search" ON "posts" USING gin ("search");
```

This is how you can query the table with full-text search:

__

```
const search = 'travel';

await db
  .select()
  .from(posts)
  .where(sql\`${posts.search} @@ to_tsquery('english', ${search})\`);
```

__

```
select * from posts where search @@ to_tsquery('english', 'travel');
```