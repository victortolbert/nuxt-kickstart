Drizzle ORM - Latest releases

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

Latest Releases

Drizzle ORM and Drizzle Kit v1.0.0-beta.2 release Feb 12, 2025 v1 pre-release Read more Drizzle Kit v0.23.2 release Aug 5, 2024 Bug fixes Read more DrizzleORM v0.32.2 release Aug 5, 2024 Bug fixes Read more DrizzleORM v0.32.1 release Jul 23, 2024 Bug fixes Read more DrizzleORM v0.32.0 release Jul 10, 2024 Generated columns, identity columns, sequences and more Read more DrizzleORM v0.31.3 release Jul 8, 2024 Prisma-Drizzle extension Read more DrizzleORM v0.31.4 release Jul 8, 2024 Mark prisma clients package as optional Read more DrizzleORM v0.31.2 release Jun 7, 2024 Added support for TiDB Cloud Serverless driver Read more DrizzleORM v0.31.1 release Jun 4, 2024 React Live Queries  Read more DrizzleORM v0.31.0 release May 31, 2024 PostgreSQL indexes API changes Read more DrizzleORM v0.30.10 release May 1, 2024 Added '.if()' function to all WHERE expressions and fixed internal mappings for sessions '.all', '.values', '.execute' functions in AWS DataAPI. Read more DrizzleORM v0.30.9 release Apr 22, 2024 Added 'setWhere' and 'targetWhere' fields to '.onConflictDoUpdate()' config in SQLite, added schema information to Drizzle instances via 'db._.fullSchema' and fixed migrator in AWS Data API. Read more DrizzleORM v0.30.8 release Apr 11, 2024 Added custom schema support to enums in Postgres, changed D1 'migrate()' function to use batch API, updated '.onConflictDoUpdate' method, fixed query generation for 'where' clause in Postgres '.onConflictDoNothing' method and fixed various bugs related to AWS Data API. Read more DrizzleORM v0.30.7 release Apr 3, 2024 Added mappings for '@vercel/postgres' package and fixed interval mapping for neon drivers. Read more DrizzleORM v0.30.6 release Mar 28, 2024 Added support for PGlite driver. Read more DrizzleORM v0.30.5 release Mar 27, 2024 Added '$onUpdate' functionality for PostgreSQL, MySQL and SQLite and fixed insertions on columns with the smallserial datatype. Read more DrizzleORM v0.30.4 release Mar 19, 2024 Added support for Xata driver. Read more DrizzleORM v0.30.3 release Mar 19, 2024 Added raw query support to batch API in Neon HTTP driver, fixed '@neondatabase/serverless' HTTP driver types issue, and fixed sqlite-proxy driver '.run()' result. Read more DrizzleORM v0.30.2 release Mar 14, 2024 Updated LibSQL migrations to utilize batch execution instead of transactions and fixed findFirst query for bun:sqlite. Read more DrizzleORM v0.30.1 release Mar 8, 2024 Added support for op-sqlite driver and fixed migration hook for Expo driver. Read more DrizzleORM v0.30.0 release Mar 7, 2024 Modified the 'postgres.js' driver instance to always return strings for dates, and then Drizzle will provide you with either strings of mapped dates, depending on the selected 'mode'. Fixed many bugs related to timestamps and dates. Read more DrizzleORM v0.29.5 release Mar 6, 2024 Added with update, with delete, with insert, possibility to specify custom schema and custom name for migrations table, sqlite proxy batch and relational queries support. Read more DrizzleORM v0.29.4 release Feb 22, 2024 Added Neon HTTP Batch support and updated the default behavior and instances of database-js. Read more DrizzleORM v0.29.3 release Jan 2, 2024 Fixed expo peer dependencies. Read more DrizzleORM v0.29.2 release Dec 25, 2023 Implemented enhancements in the planescale relational tests. Corrected string escaping for empty PgArrays. Rectified syntax error for the exists function in SQLite. Ensured proper handling of dates in AWS Data API. Resolved the Hermes mixins constructor issue. Read more DrizzleORM v0.29.1 release Nov 29, 2023 Fixed issues include forwarding arguments correctly when using the withReplica feature, resolving the selectDistinctOn not working with multiple columns problem, and providing detailed JSDoc for all query builders in all dialects. Additionally, introduced new helpers for aggregate functions in SQL and a new ESLint Drizzle Plugin package. Read more DrizzleORM v0.29.0 release Nov 9, 2023 Added new features like unsigned option for bigint in MySQL, improved query builder types, added possibility to specify name for primary keys and foreign keys, read replicas support, set operators support, new MySQL and PostgreSQL proxy drivers, D1 Batch API support. Read more DrizzleORM v0.28.6 release Sep 6, 2023 Changed datetime mapping for MySQL, added LibSQL batch API support, added JSON mode for text in SQLite, added '.toSQL()' to Relational Query API calls, added new PostgreSQL operators for Arrays, added more SQL operators for the 'where' function in Relational Queries, and fixed bugs. Read more DrizzleORM v0.28.5 release Aug 24, 2023 Fixed incorrect OpenTelemetry type import that caused a runtime error. Read more DrizzleORM v0.28.4 release Aug 24, 2023 Fixed imports in ESM-based projects and type error on Postgres table definitions. Read more DrizzleORM v0.28.3 release Aug 22, 2023 Added SQLite simplified query API, added methods to column builders and to table model type inference. Fixed sqlite-proxy and SQL.js response from '.get()' when the result is empty. Read more DrizzleORM v0.28.2 release Aug 10, 2023 Added a set of tests for d1, fixed issues in internal documentation, resolved the issue of truncating timestamp milliseconds for MySQL, corrected the type of the '.get()' method for sqlite-based dialects, rectified the sqlite-proxy bug that caused the query to execute twice. Added a support for Typebox package. Read more DrizzleORM v0.28.1 release Aug 7, 2023 Fixed Postgres array-related issues introduced by 0.28.0. Read more DrizzleORM v0.28.0 release Aug 6, 2023 Removed support for filtering by nested relations, Added Relational Queries mode config for mysql2 driver, improved IntelliSense performance for large schemas, improved Relational Queries Permormance and Read Usage. Added possibility to insert rows with default values for all columns. Read more DrizzleORM v0.27.2 release Jul 12, 2023 Added support for unique constraints in PostgreSQL, MySQL, SQLite. Read more DrizzleORM v0.16.2 release Jan 21, 2023 Drizzle ORM - is an idiomatic TypeScript ORM which can be used as query builder and as an ORM being the source of truth for SQL schema and CLI for automatic migrations generation. Read more DrizzleORM v0.11.0 release Jul 20, 2022 DrizzleORM - is an open source TypeScript ORM, supports PostgreSQL and about to have MySQL and SQLite support in couple of weeks. We've decided it's time to share it with public. Read more