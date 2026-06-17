Drizzle ORM - Meet Drizzle Studio

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

# Meet Drizzle Studio

🖥 Drizzle Studio is a new way for you to explore SQL database on Drizzle projects.

![Drizzle Studio](https://orm.drizzle.team/_astro/drizzle-studio.YeMH1cmC_15sm1a.webp)

Drizzle studio grabs your drizzle config file, connects to your database and lets you browse, add, delete and update everything based on your existing drizzle sql schema. It supports explicit `null` and `empty string` values, `booleans`, `numbers` and `big integers`, `json objects` and `json arrays`.

## Quick start [](#quick-start)

#### Install dependencies [](#install-dependencies)

Make sure to go through our get started guides first!

npm

yarn

pnpm

bun

__

```
npm i drizzle-orm
npm i -D drizzle-kit
```

__

```
yarn add drizzle-orm
yarn add -D drizzle-kit
```

__

```
pnpm add drizzle-orm
pnpm add -D drizzle-kit
```

__

```
bun add drizzle-orm
bun add -D drizzle-kit
```

#### Prepare your database schema [](#prepare-your-database-schema)

Check out extended schema declaration **docs.**

_schema.ts_

```
import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
  phone: varchar('phone', { length: 256 }),
});
```

#### Prepare config file [](#prepare-config-file)

Check out extended config file **docs.**

_drizzle.config.ts_

```
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./schema/*",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URL,
  }
});
```

#### Launch Drizzle Studio [](#launch-drizzle-studio)

npm

yarn

pnpm

bun

__

```
npx drizzle-kit studio
```

__

```
yarn drizzle-kit studio
```

__

```
pnpm drizzle-kit studio
```

__

```
bunx drizzle-kit studio
```

You can launch studio with `port` cli flag to customize process port and `verbose` flag for extended SQL statements logging

npm

yarn

pnpm

bun

__

```
npx drizzle-kit studio --port 3000 --verbose
```

__

```
yarn drizzle-kit studio --port 3000 --verbose
```

__

```
pnpm drizzle-kit studio --port 3000 --verbose
```

__

```
bunx drizzle-kit studio --port 3000 --verbose
```

By default, Drizzle Studio will be launched on the `https://local.drizzle.studio` host, and studio server will be launched on 127.0.0.1 host but you can specify any host you want

npm

yarn

pnpm

bun

__

```
npx drizzle-kit studio --host 0.0.0.0
```

__

```
yarn drizzle-kit studio --host 0.0.0.0
```

__

```
pnpm drizzle-kit studio --host 0.0.0.0
```

__

```
bunx drizzle-kit studio --host 0.0.0.0
```

## What’s next? [](#whats-next)

We’re going to massively improve and extend Drizzle Studio in the upcoming months! Subscribe on Twitter and welcome to our Discord



Headless TypeScript ORM with a head.

GitHub Drizzle Github Discord Drizzle Discord Drizzle Twitter

Documentation

Get Started Manage Schema Access Data Migrations

Resources

Drizzle Studio Drizzle Gateway Benchmarks

Learn

Guides Tutorials Latest Releases