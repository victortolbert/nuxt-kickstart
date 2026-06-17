Drizzle ORM - v1 Roadmap

We've merged alternation-engine into Beta release. Try it out!



Get Started Documentation Studio Benchmarks

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

 Query Select Insert Update Delete Filters Utils Joins Magic sql`` operator](https://orm.drizzle.team/docs/sql)

[\[OLD\] Query V1](https://orm.drizzle.team/docs/rqb)

Performance

[ Queries](https://orm.drizzle.team/docs/perf-queries) [Serverless](https://orm.drizzle.team/docs/perf-serverless)

Advanced

[ Set Operations](https://orm.drizzle.team/docs/set-operations) [Generated Columns](https://orm.drizzle.team/docs/generated-columns) [Transactions](https://orm.drizzle.team/docs/transactions) [Batch](https://orm.drizzle.team/docs/batch-api) [Cache](https://orm.drizzle.team/docs/cache) [Dynamic query building](https://orm.drizzle.team/docs/dynamic-query-building) [Read Replicas](https://orm.drizzle.team/docs/read-replicas) [Custom types](https://orm.drizzle.team/docs/custom-types) [Goodies](https://orm.drizzle.team/docs/goodies)

Validations

[ zod](https://orm.drizzle.team/docs/zod) [valibot](https://orm.drizzle.team/docs/valibot) [typebox](https://orm.drizzle.team/docs/typebox) [arktype](https://orm.drizzle.team/docs/arktype) [typebox-legacy](https://orm.drizzle.team/docs/typebox-legacy) [effect-schema](https://orm.drizzle.team/docs/effect-schema)

Extensions

[ Prisma](https://orm.drizzle.team/docs/prisma) [ESLint Plugin](https://orm.drizzle.team/docs/eslint-plugin) [drizzle-graphql](https://orm.drizzle.team/docs/graphql)

System Light Dark

[Become a Sponsor](https://driz.link/sponsor) [Twitter](https://mobile.twitter.com/DrizzleORM) [Discord](https://discord.gg/yfjTbVXMW4)

# v1 Roadmap

### Drizzle Kit V1 [](#drizzle-kit-v1)

- `generated` columns support [beta branch]
- Brocli integration to Drizzle Kit
- Generated SQL migration strict mode without `try catches` and `if not exists`
- Drizzle Kit goes OSS steam 🎉
- PostgreSQL enums alternations improvements
- PostgreSQL RLS support
- `check` constraint support in Drizzle Kit
- Exposed API for programmatic access in Drizzle Kit
- `materialized views` support in Drizzle Kit
- Drizzle Studio `mkcert` fixes for dockerised environments

### Drizzle ORM V1 [](#drizzle-orm-v1)

- Migrate to folder v3, remove journal
- Add explain mode for push
- Add commutative migrations check (PostgreSQL, MySQL)
- Add commutative migrations check (SQLite, MSSQL, CockroachDB, SingleStore)
- `generated` columns support [beta branch]
- MySQL `.$returningIds()`
- `mode: number` and `mode: bigint` support for PostgreSQL `decimals`
- Table declarations with `(t) =>` callback to optionally omit column type imports
- Optional database aliases for columns in table declarations -> `id: serial()`
- PostgreSQL RLS support
- Relational Queries V2 API
- `drizzle('pg', ...)` driver instantiation to lower the entrance learning curve
- CockroachDB support (supported with strict SQL migrations)
- Native seeding
- fixes: [#2575](https://github.com/drizzle-team/drizzle-orm/issues/2575), [#2572](https://github.com/drizzle-team/drizzle-orm/issues/2572), [#2571](https://github.com/drizzle-team/drizzle-orm/issues/2571), [#2568](https://github.com/drizzle-team/drizzle-orm/issues/2568), [#2559](https://github.com/drizzle-team/drizzle-orm/issues/2559), [#2555](https://github.com/drizzle-team/drizzle-orm/issues/2555), [#2530](https://github.com/drizzle-team/drizzle-orm/issues/2530), [#2514](https://github.com/drizzle-team/drizzle-orm/issues/2514), [#2510](https://github.com/drizzle-team/drizzle-orm/issues/2510), [#2506](https://github.com/drizzle-team/drizzle-orm/issues/2506), [#2496](https://github.com/drizzle-team/drizzle-orm/issues/2496), [#2486](https://github.com/drizzle-team/drizzle-orm/issues/2486), [#2484](https://github.com/drizzle-team/drizzle-orm/issues/2484), [#2474](https://github.com/drizzle-team/drizzle-orm/issues/2474), [#2472](https://github.com/drizzle-team/drizzle-orm/issues/2472), [#2458](https://github.com/drizzle-team/drizzle-orm/issues/2458), [#2455](https://github.com/drizzle-team/drizzle-orm/issues/2455), add `drizzle-kit migrate/push --inspect` [#2488](https://github.com/drizzle-team/drizzle-orm/issues/2448), [#2432](https://github.com/drizzle-team/drizzle-orm/issues/2432), [#2430](https://github.com/drizzle-team/drizzle-orm/issues/2430), [#2426](https://github.com/drizzle-team/drizzle-orm/issues/2426), [#2424](https://github.com/drizzle-team/drizzle-orm/issues/2424), [#2418](https://github.com/drizzle-team/drizzle-orm/issues/2418), [#2414](https://github.com/drizzle-team/drizzle-orm/issues/2414), [#2401](https://github.com/drizzle-team/drizzle-orm/issues/2401), [#2396](https://github.com/drizzle-team/drizzle-orm/issues/2396), [#2395](https://github.com/drizzle-team/drizzle-orm/issues/2395), [#2394](https://github.com/drizzle-team/drizzle-orm/issues/2394), [#2390](https://github.com/drizzle-team/drizzle-orm/issues/2390), [#2389](https://github.com/drizzle-team/drizzle-orm/issues/2389), [#2388](https://github.com/drizzle-team/drizzle-orm/issues/2388), [#2387](https://github.com/drizzle-team/drizzle-orm/issues/2387), [#2384](https://github.com/drizzle-team/drizzle-orm/issues/2384), [#1210](https://github.com/drizzle-team/drizzle-orm/issues/1210), [#1157](https://github.com/drizzle-team/drizzle-orm/issues/1157), [#1113](https://github.com/drizzle-team/drizzle-orm/issues/1113), [#1020](https://github.com/drizzle-team/drizzle-orm/issues/1020), [#1003](https://github.com/drizzle-team/drizzle-orm/issues/1003), [#998](https://github.com/drizzle-team/drizzle-orm/issues/998), [#830](https://github.com/drizzle-team/drizzle-orm/issues/830), [#724](https://github.com/drizzle-team/drizzle-orm/issues/724), [#2254](https://github.com/drizzle-team/drizzle-orm/issues/2254), [#2239](https://github.com/drizzle-team/drizzle-orm/issues/2239), [#2236](https://github.com/drizzle-team/drizzle-orm/issues/2236), [#2224](https://github.com/drizzle-team/drizzle-orm/issues/2224), [#2216](https://github.com/drizzle-team/drizzle-orm/issues/2216), [#2198](https://github.com/drizzle-team/drizzle-orm/issues/2198), [#2189](https://github.com/drizzle-team/drizzle-orm/issues/2189), [#2183](https://github.com/drizzle-team/drizzle-orm/issues/2183), [#2174](https://github.com/drizzle-team/drizzle-orm/issues/2174), [#2169](https://github.com/drizzle-team/drizzle-orm/issues/2169), [#2157](https://github.com/drizzle-team/drizzle-orm/issues/2157), [#2151](https://github.com/drizzle-team/drizzle-orm/issues/2151), [#2146](https://github.com/drizzle-team/drizzle-orm/issues/2146), [#2136](https://github.com/drizzle-team/drizzle-orm/issues/2136), [#2122](https://github.com/drizzle-team/drizzle-orm/issues/2122), [#2085](https://github.com/drizzle-team/drizzle-orm/issues/2085), [#2067](https://github.com/drizzle-team/drizzle-orm/issues/2067), [#2047](https://github.com/drizzle-team/drizzle-orm/issues/2047), [#2015](https://github.com/drizzle-team/drizzle-orm/issues/2015), [#1928](https://github.com/drizzle-team/drizzle-orm/issues/1928), [#1835](https://github.com/drizzle-team/drizzle-orm/issues/1835), [#1804](https://github.com/drizzle-team/drizzle-orm/issues/1804), [#1765](https://github.com/drizzle-team/drizzle-orm/issues/1765), [#1748](https://github.com/drizzle-team/drizzle-orm/issues/1748), [#1744](https://github.com/drizzle-team/drizzle-orm/issues/1744), [#1625](https://github.com/drizzle-team/drizzle-orm/issues/1625), [#1428](https://github.com/drizzle-team/drizzle-orm/issues/1428), [#1402](https://github.com/drizzle-team/drizzle-orm/issues/1402), [#1315](https://github.com/drizzle-team/drizzle-orm/issues/1315), [#1313](https://github.com/drizzle-team/drizzle-orm/issues/1313), [#1294](https://github.com/drizzle-team/drizzle-orm/issues/1294), [#1272](https://github.com/drizzle-team/drizzle-orm/issues/1272), [#1269](https://github.com/drizzle-team/drizzle-orm/issues/1269), [#1225](https://github.com/drizzle-team/drizzle-orm/issues/1225), [#2378](https://github.com/drizzle-team/drizzle-orm/issues/2378), [#2343](https://github.com/drizzle-team/drizzle-orm/issues/2343), [#2322](https://github.com/drizzle-team/drizzle-orm/issues/2322), [#2315](https://github.com/drizzle-team/drizzle-orm/issues/2315), [#2282](https://github.com/drizzle-team/drizzle-orm/issues/2282), [#2279](https://github.com/drizzle-team/drizzle-orm/issues/2279)
- MSSQL support
- 🎉 V1 RELEASE STREAM 🎉
- Down migrations, better rollbacks and improvements to `migrate` experience in Drizzle Kit
- `NODE_ENV` support for embedded `.env` consumer
- MariaDB support

[

Headless TypeScript ORM with a head.

GitHub Drizzle Github Discord Drizzle Discord Drizzle Twitter

Documentation

Get Started Manage Schema Access Data Migrations

Resources

Drizzle Studio Drizzle Gateway Benchmarks

Learn

Guides Tutorials Latest Releases