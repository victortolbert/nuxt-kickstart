Drizzle ORM - Turso Database

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

Turso Cloud Turso Database

SQLite Cloud Cloudflare D1 Bun SQLite Node SQLite Cloudflare Durable Objects

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

# Drizzle <> Turso Database

This guide assumes familiarity with:

- Database connection basics with Drizzle
- Turso Database - website
- Turso Database driver - website & GitHub

According to the **official website**, Turso is the small database to power your big dreams in the age of AI.

#### Step 1 - Install packages [](#step-1---install-packages)

npm

yarn

pnpm

bun

__

```
npm i drizzle-orm@beta @tursodatabase/database
npm i -D drizzle-kit@beta
```

__

```
yarn add drizzle-orm@beta @tursodatabase/database
yarn add -D drizzle-kit@beta
```

__

```
pnpm add drizzle-orm@beta @tursodatabase/database
pnpm add -D drizzle-kit@beta
```

__

```
bun add drizzle-orm@beta @tursodatabase/database
bun add -D drizzle-kit@beta
```

#### Step 2 - Initialize the driver and make a query [](#step-2---initialize-the-driver-and-make-a-query)

__

```
import { drizzle } from 'drizzle-orm/tursodatabase/database';

const db = drizzle('sqlite.db');

const result = await db.execute('select 1');
```

If you need to provide your existing drivers:

__

```
import { Database } from '@tursodatabase/drivers';
import { drizzle } from 'drizzle-orm/tursodatabase/database';

const client = new Database('sqlite.db');
const db = drizzle({ client });

const result = await db.execute('select 1');
```

#### What’s next? [](#whats-next)

**Manage schema**

Drizzle Schema  PostgreSQL data types  Indexes and Constraints  Database Views  Database Schemas  Sequences  Extensions

**Query data**

Relational Queries  Select  Insert  Update  Delete  Filters  Joins  sql`` operator