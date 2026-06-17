Drizzle ORM - Select parent rows with at least one related child row

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

Drizzle | Select parent rows with at least one related child row

PostgreSQL

MySQL

SQLite

This guide assumes familiarity with:

- Get started with PostgreSQL, MySQL and SQLite
- Select statement and select from subquery
- Inner join
- Filter operators and exists function

This guide demonstrates how to select parent rows with the condition of having at least one related child row. Below, there are examples of schema definitions and the corresponding database data:

__

```
import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  userId: integer('user_id').notNull().references(() => users.id),
});
```

users.db

posts.db

__

```
+----+------------+----------------------+
| id |    name    |        email         |
+----+------------+----------------------+
|  1 | John Doe   | [\[email protected\]](https://orm.drizzle.team/cdn-cgi/l/email-protection)   |
+----+------------+----------------------+
|  2 | Tom Brown  | [\[email protected\]](https://orm.drizzle.team/cdn-cgi/l/email-protection)  |
+----+------------+----------------------+
|  3 | Nick Smith | [\[email protected\]](https://orm.drizzle.team/cdn-cgi/l/email-protection) |
+----+------------+----------------------+
```

__

```
+----+--------+-----------------------------+---------+
| id | title  |          content            | user_id |
+----+--------+-----------------------------+---------+
|  1 | Post 1 | This is the text of post 1  |       1 |
+----+--------+-----------------------------+---------+
|  2 | Post 2 | This is the text of post 2  |       1 |
+----+--------+-----------------------------+---------+
|  3 | Post 3 | This is the text of post 3  |       3 |
+----+--------+-----------------------------+---------+
```

To select parent rows with at least one related child row and retrieve child data you can use `.innerJoin()` method:

__

```
import { eq } from 'drizzle-orm';
import { users, posts } from './schema';

const db = drizzle(...);

await db
  .select({
    user: users,
    post: posts,
  })
  .from(users)
  .innerJoin(posts, eq(users.id, posts.userId));
  .orderBy(users.id);
```

__

```
select users.*, posts.* from users
  inner join posts on users.id = posts.user_id
  order by users.id;
```

__

```
// result data, there is no user with id 2 because he has no posts
[
  {
    user: { id: 1, name: 'John Doe', email: ' [\[email protected\]](https://orm.drizzle.team/cdn-cgi/l/email-protection)' },
    post: {
      id: 1,
      title: 'Post 1',
      content: 'This is the text of post 1',
      userId: 1
    }
  },
  {
    user: { id: 1, name: 'John Doe', email: ' [\[email protected\]](https://orm.drizzle.team/cdn-cgi/l/email-protection)' },
    post: {
      id: 2,
      title: 'Post 2',
      content: 'This is the text of post 2',
      userId: 1
    }
  },
  {
    user: { id: 3, name: 'Nick Smith', email: ' [\[email protected\]](https://orm.drizzle.team/cdn-cgi/l/email-protection)' },
    post: {
      id: 3,
      title: 'Post 3',
      content: 'This is the text of post 3',
      userId: 3
    }
  }
]
```

To only select parent rows with at least one related child row you can use subquery with `exists()` function like this:

__

```
import { eq, exists, sql } from 'drizzle-orm';

const sq = db
  .select({ id: sql\`1\` })
  .from(posts)
  .where(eq(posts.userId, users.id));

await db.select().from(users).where(exists(sq));
```

__

```
select * from users where exists (select 1 from posts where posts.user_id = users.id);
```

__

```
// result data, there is no user with id 2 because he has no posts
[
  { id: 1, name: 'John Doe', email: ' [\[email protected\]](https://orm.drizzle.team/cdn-cgi/l/email-protection)' },
  { id: 3, name: 'Nick Smith', email: ' [\[email protected\]](https://orm.drizzle.team/cdn-cgi/l/email-protection)' }
]
```