Drizzle ORM - Benchmarks

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

 Query Select Insert Update Delete Filters Utils Joins [Magic sql`` operator](https://orm.drizzle.team/docs/sql)

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

Biased benchmarks

We ran perf tests, results are in the awesome dashboard below

Take them with a grain of salt, ofc

1!-- -->x 2!-- -->x 4!-- -->x 8!-- -->x 16!-- -->x 32!-- -->x

Pause

0 VUs

0

1k

1k

2k

2k

3k

3k

Drizzle v1.0.0-beta.2 vs Prisma v7.1.0

Micro database size

E-commerce

PostgreSQL

Lenovo M720q

Linux 5.15.0-86-generic x86_64

Intel Core i3-9100T

RAM 32GB DDR4 2666MHz

Benchmark Config

Drizzle

v1.0.0-beta.2

Bun v1.3.4

Bun Logo

Bun v1.3.4 Node 24.6.0

Prisma

v7.1.0

Bun v1.3.4

Bun Logo

Bun v1.3.4 Node 24.6.0

avg latency: 0.0ms

avg latency: 0.0ms

avg: 0 req/sec

Failed requests

Drizzle handled x NaN less requests

0

avg: 0 req/sec

Failed requests

Drizzle handled x NaN less requests

0

avg CPU load: 0.0 %

avg CPU load: 0.0 %

ORM

Database size

Project type

Database

Drizzle v1.0.0-beta.2 vs Prisma v7.1.0

Drizzle v0.33.0 vs Prisma v5.18.0

Drizzle v1.0.0-beta.2 vs Go v1.25.5

Drizzle vs TypeORM coming soon

[Open on Github ↗︎](https://github.com/drizzle-team/drizzle-benchmarks)

## How it works [](#how-it-works)

Drizzle has been originally designed to be a thin layer on top of SQL and introduce minimal runtime overhead and by introducing Prepared Statements and Relational Queries — we’ve [smashed it](https://medium.com/drizzle-stories/weve-built-typescript-orm-for-821-days-then-this-happened-71282a8b0206). It’s now both fast and has exceptional DX and no n+1 problem for relational queries.

But how fast is it? Is it Drizzle or is it SQL who’s fast? What to measure?

What is a meaningful benchmark? We’ve spent quite some time doing synthetic benchmarks with mitata, tested everything in one runtime and then in separate containerised so there’s no GC cross-influence, community made their own benchmarks and helped us allocate Relational Queries performance and row reads bottlenecks and make them really fast and efficient.

We’ve tested different SQL dialects across all the competitors, and while we were crazy fast, in some cases 100+ times faster than Prisma with SQLite, we only wanted to share benchmarks that were meaningful for businesses and developers.

From business perspective— request roundtrip is the most important metric when it comes down to the server-side performance. While you can influence network latency with services like Cloudflare Argo, on the server side it usually comes down to the database queries.

We’ve composed a test case with a ~370k records in a PostgreSQL database and generated production-like E-commerce traffic benchmarks on 1GB ethernet to eliminate any discrepancies. On Lenovo M720q Drizzle can handle 4.6k reqs/s while maintaining a ~100ms p95 latency.

![](https://orm.drizzle.team/_astro/benchmark-result.ybx85SlV_Z1SJ5Ig.webp)

We ran our benchmarks on 2 separate machines, so that observer does not influence results. For database we’re using PostgreSQL instance with 42MB of E-commerce data(~370k records). K6 benchmarking instance lives on MacBook Air and makes [1M prepared requests](https://github.com/drizzle-team/drizzle-benchmarks/blob/main/data/requests.json) through 1GB ethernet to Lenovo M720q with Intel Core i3-9100T and 32GB of RAM.

![image](https://orm.drizzle.team/_astro/how-it-works.BsFqMOfn_2iTNGW.webp)

To run your own tests - follow instructions below!

## Prepare test machine [](#prepare-test-machine)

1. Spin up a docker container with PostgreSQL using `pnpm start:docker` command. You can configure a desired database port in `./src/docker.ts` file:

__

```
...
}

const desiredPostgresPort = 5432; // change here
main();
```

1. Update `DATABASE_URL` with allocated database port in .env file:

__

```
DATABASE_URL="postgres://postgres:postgres@localhost:5432/postgres"
```

1. Seed your database with test data using `pnpm start:seed` command, you can change the size of the database in `./src/seed.ts` file:

__

```
...
}

main("micro"); // nano | micro
```

1. Make sure you have Node version 18 installed or above. You can use `nvm use 18` command
2. Start Drizzle/Prisma server:

__

```
## Drizzle
pnpm start:drizzle

## Prisma
pnpm prepare:prisma
pnpm start:prisma
```

## Prepare testing machine [](#prepare-testing-machine)

1. Generate a list of http requests with `pnpm start:generate`. It will output a list of http requests to be run on the tested server | `./data/requests.json`
2. Install k6 load tester
3. Run benchmarks  Use the built-in benchmark runner:

__

```
tsx bench/index --host http://192.168.31.144:3000 --name my-bench --folder results

http://192.168.31.144:3000 // drizzle
http://192.168.31.144:3001 // prisma
```

1. Prepare final combined results After benchmarks finish, merge all outputs into a single JSON file:

__

```
tsx bench/prepare --folder results
```



Headless TypeScript ORM with a head.

GitHub Drizzle Github Discord Drizzle Discord Drizzle Twitter

Documentation

Get Started Manage Schema Access Data Migrations

Resources

Drizzle Studio Drizzle Gateway Benchmarks

Learn

Guides Tutorials Latest Releases