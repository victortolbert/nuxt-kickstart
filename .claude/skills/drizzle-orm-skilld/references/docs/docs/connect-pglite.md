Drizzle ORM - PGLite

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

PlanetScale Postgres Neon Vercel Postgres Prisma Postgres Supabase Xata PGLite

Nile Bun SQL Effect Postgres

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

# Drizzle <> PGlite

This guide assumes familiarity with:

- Database connection basics with Drizzle
- ElectricSQL - website
- PgLite driver - docs & GitHub

According to the **official repo**, PGlite is a WASM Postgres build packaged into a TypeScript client library that enables you to run Postgres in the browser, Node.js and Bun, with no need to install any other dependencies. It is only 2.6mb gzipped.

It can be used as an ephemeral in-memory database, or with persistence either to the file system (Node/Bun) or indexedDB (Browser).

Unlike previous “Postgres in the browser” projects, PGlite does not use a Linux virtual machine - it is simply Postgres in WASM.

#### Step 1 - Install packages [](#step-1---install-packages)

npm

yarn

pnpm

bun

__

```
npm i drizzle-orm @electric-sql/pglite
npm i -D drizzle-kit
```

__

```
yarn add drizzle-orm @electric-sql/pglite
yarn add -D drizzle-kit
```

__

```
pnpm add drizzle-orm @electric-sql/pglite
pnpm add -D drizzle-kit
```

__

```
bun add drizzle-orm @electric-sql/pglite
bun add -D drizzle-kit
```

#### Step 2 - Initialize the driver and make a query [](#step-2---initialize-the-driver-and-make-a-query)

In-Memory

In directory

With extra config options

__

```
import { drizzle } from 'drizzle-orm/pglite';

const db = drizzle();

await db.select().from(...);
```

__

```
import { drizzle } from 'drizzle-orm/pglite';

const db = drizzle('path-to-dir');

await db.select().from(...);
```

__

```
import { drizzle } from 'drizzle-orm/pglite';

// connection is a native PGLite configuration
const db = drizzle({ connection: { dataDir: 'path-to-dir' }});

await db.select().from(...);
```

If you need to provide your existing driver:

__

```
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';

// In-memory Postgres
const client = new PGlite();
const db = drizzle({ client });

await db.select().from(users);
```

#### What’s next? [](#whats-next)

**Manage schema**

Drizzle Schema  PostgreSQL data types  Indexes and Constraints  Database Views  Database Schemas  Sequences  Extensions

**Query data**

Relational Queries  Select  Insert  Update  Delete  Filters  Joins  sql`` operator