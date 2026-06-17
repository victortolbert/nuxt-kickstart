Drizzle ORM - Supabase

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

PlanetScale Postgres Neon Vercel Postgres Prisma Postgres Supabase

Xata PGLite Nile Bun SQL Effect Postgres

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

# Drizzle <> Supabase

This guide assumes familiarity with:

- Database connection basics with Drizzle
- Drizzle PostgreSQL drivers - docs

According to the **official website**, Supabase is an open source Firebase alternative for building secure and performant Postgres backends with minimal configuration.

Checkout official **Supabase + Drizzle** docs.

#### Step 1 - Install packages [](#step-1---install-packages)

npm

yarn

pnpm

bun

__

```
npm i drizzle-orm postgres
npm i -D drizzle-kit
```

__

```
yarn add drizzle-orm postgres
yarn add -D drizzle-kit
```

__

```
pnpm add drizzle-orm postgres
pnpm add -D drizzle-kit
```

__

```
bun add drizzle-orm postgres
bun add -D drizzle-kit
```

#### Step 2 - Initialize the driver and make a query [](#step-2---initialize-the-driver-and-make-a-query)

_index.ts_

```
import { drizzle } from 'drizzle-orm/postgres-js'

const db = drizzle(process.env.DATABASE_URL);

const allUsers = await db.select().from(...);
```

If you need to provide your existing driver:

_index.ts_

```
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const client = postgres(process.env.DATABASE_URL)
const db = drizzle({ client });

const allUsers = await db.select().from(...);
```

If you decide to use connection pooling via Supabase (described here), and have “Transaction” pool mode enabled, then ensure to turn off prepare, as prepared statements are not supported.

_index.ts_

```
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

// Disable prefetch as it is not supported for "Transaction" pool mode 
const client = postgres(process.env.DATABASE_URL, { prepare: false })
const db = drizzle({ client });

const allUsers = await db.select().from(...);
```

Connect to your database using the Connection Pooler for **serverless environments**, and the Direct Connection for **long-running servers**.

#### What’s next? [](#whats-next)

**Manage schema**

Drizzle Schema  PostgreSQL data types  Indexes and Constraints  Database Views  Database Schemas  Sequences  Extensions

**Query data**

Relational Queries  Select  Insert  Update  Delete  Filters  Joins  sql`` operator