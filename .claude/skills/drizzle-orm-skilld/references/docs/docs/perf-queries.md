Drizzle ORM - Queries

We've merged alternation-engine into Beta release. Try it out!

 Documentation

33k+ 

Dark

System

meet drizzle

Get started Sustainability Why Drizzle? Guides Tutorials Latest releases Gotchas

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

 Queries

[Prepared statement](#prepared-statement) [Placeholder](#placeholder)

Serverless

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

# Query performance

When it comes to **Drizzle** — we’re a thin TypeScript layer on top of SQL with almost 0 overhead and to make it actual 0, you can utilise our prepared statements API.

**When you run a query on the database, there are several things that happen:**

- all the configurations of the query builder got concatenated to the SQL string
- that string and params are sent to the database driver
- driver compiles SQL query to the binary SQL executable format and sends it to the database

With prepared statements you do SQL concatenation once on the Drizzle ORM side and then database driver is able to reuse precompiled binary SQL instead of parsing query all the time. It has extreme performance benefits on large SQL queries.

Different database drivers support prepared statements in different ways and sometimes Drizzle ORM you can go **faster than better-sqlite3 driver.**

## Prepared statement [](#prepared-statement)

PostgreSQL

MySQL

SQLite

SingleStore

__

```
const db = drizzle(...);

const prepared = db.select().from(customers).prepare("statement_name");

const res1 = await prepared.execute();
const res2 = await prepared.execute();
const res3 = await prepared.execute();
```

__

```
const db = drizzle(...);

const prepared = db.select().from(customers).prepare();

const res1 = await prepared.execute();
const res2 = await prepared.execute();
const res3 = await prepared.execute();
```

__

```
const db = drizzle(...);

const prepared = db.select().from(customers).prepare();

const res1 = prepared.all();
const res2 = prepared.all();
const res3 = prepared.all();
```

__

```
const db = drizzle(...);

const prepared = db.select().from(customers).prepare();

const res1 = await prepared.execute();
const res2 = await prepared.execute();
const res3 = await prepared.execute();
```

## Placeholder [](#placeholder)

Whenever you need to embed a dynamic runtime value - you can use the `sql.placeholder(...)` api

PostgreSQL

MySQL

SQLite

SingleStore

__

```
import { sql } from "drizzle-orm";

const p1 = db
  .select()
  .from(customers)
  .where(eq(customers.id, sql.placeholder('id')))
  .prepare("p1")

await p1.execute({ id: 10 }) // SELECT * FROM customers WHERE id = 10
await p1.execute({ id: 12 }) // SELECT * FROM customers WHERE id = 12

const p2 = db
  .select()
  .from(customers)
  .where(sql\`lower(${customers.name}) like ${sql.placeholder('name')}\`)
  .prepare("p2");

await p2.execute({ name: '%an%' }) // SELECT * FROM customers WHERE name ilike '%an%'
```

__

```
import { sql } from "drizzle-orm";

const p1 = db
  .select()
  .from(customers)
  .where(eq(customers.id, sql.placeholder('id')))
  .prepare()

await p1.execute({ id: 10 }) // SELECT * FROM customers WHERE id = 10
await p1.execute({ id: 12 }) // SELECT * FROM customers WHERE id = 12

const p2 = db
  .select()
  .from(customers)
  .where(sql\`lower(${customers.name}) like ${sql.placeholder('name')}\`)
  .prepare();

await p2.execute({ name: '%an%' }) // SELECT * FROM customers WHERE name ilike '%an%'
```

__

```
import { sql } from "drizzle-orm";

const p1 = db
  .select()
  .from(customers)
  .where(eq(customers.id, sql.placeholder('id')))
  .prepare()

p1.get({ id: 10 }) // SELECT * FROM customers WHERE id = 10
p1.get({ id: 12 }) // SELECT * FROM customers WHERE id = 12

const p2 = db
  .select()
  .from(customers)
  .where(sql\`lower(${customers.name}) like ${sql.placeholder('name')}\`)
  .prepare();

p2.all({ name: '%an%' }) // SELECT * FROM customers WHERE name ilike '%an%'
```

__

```
import { sql } from "drizzle-orm";

const p1 = db
  .select()
  .from(customers)
  .where(eq(customers.id, sql.placeholder('id')))
  .prepare()

await p1.execute({ id: 10 }) // SELECT * FROM customers WHERE id = 10
await p1.execute({ id: 12 }) // SELECT * FROM customers WHERE id = 12

const p2 = db
  .select()
  .from(customers)
  .where(sql\`lower(${customers.name}) like ${sql.placeholder('name')}\`)
  .prepare();

await p2.execute({ name: '%an%' }) // SELECT * FROM customers WHERE name ilike '%an%'
```