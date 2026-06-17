Drizzle ORM - DrizzleORM v0.30.8 release

We've merged alternation-engine into Beta release. Try it out!

 Documentation

33k+ 

Dark

System

meet drizzle

Get started Sustainability Why Drizzle? Guides Tutorials Latest releases

Gotchas

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

DrizzleORM v0.30.8 release

Apr 11, 2024

## New Features [](#new-features)

- Added custom schema support to enums in Postgres (fixes #669 via #2048):

__

```
import { pgSchema } from 'drizzle-orm/pg-core';

const mySchema = pgSchema('mySchema');
const colors = mySchema.enum('colors', ['red', 'green', 'blue']);
```

Learn more about Postgres schemas and enums.

## Fixes [](#fixes)

- Changed D1 `migrate()` function to use batch API (#2137)

To get started with Drizzle and D1 follow the documentation.

- Split `where` clause in Postgres `.onConflictDoUpdate` method into `setWhere` and `targetWhere` clauses, to support both `where` cases in `on conflict ...` clause (fixes #1628, #1302 via #2056).

__

```
await db.insert(employees)
  .values({ employeeId: 123, name: 'John Doe' })
  .onConflictDoUpdate({
    target: employees.employeeId,
    targetWhere: sql\`name <> 'John Doe'\`,
    set: { name: sql\`excluded.name\` }
  });
  
await db.insert(employees)
  .values({ employeeId: 123, name: 'John Doe' })
  .onConflictDoUpdate({
    target: employees.employeeId,
    set: { name: 'John Doe' },
    setWhere: sql\`name <> 'John Doe'\`
  });
```

Learn more about `.onConflictDoUpdate` method here.

- Fixed query generation for `where` clause in Postgres `.onConflictDoNothing` method, as it was placed in a wrong spot (fixes #1628 via #2056).

Learn more about `.onConflictDoNothing` method here.

- Fixed multiple issues with AWS Data API driver (fixes #1931, #1932, #1934, #1936 via #2119)
- Fix inserting and updating array values in AWS Data API (fixes #1912 via #1911)

To get started with Drizzle and AWS Data API follow the documentation.