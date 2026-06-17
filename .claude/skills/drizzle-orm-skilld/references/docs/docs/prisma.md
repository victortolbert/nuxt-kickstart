Drizzle ORM - Prisma

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

 Queries Serverless

Advanced

 Set Operations Generated Columns Transactions Batch Cache Dynamic query building Read Replicas Custom types Goodies

Validations

 zod valibot typebox arktype typebox-legacy effect-schema

Extensions

 Prisma

[How to use](#how-to-use) [Limitations](#limitations)

ESLint Plugin drizzle-graphql

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

# Drizzle extension for Prisma

If you have an existing project with Prisma and want to try Drizzle or gradually adopt it, you can use our first-class extension that will add Drizzle API to your Prisma client. It will allow you to use Drizzle alongside your Prisma queries reusing your existing DB connection.

## How to use [](#how-to-use)

#### Install dependencies [](#install-dependencies)

You need to install Drizzle itself and a generator package that will create Drizzle schema from the Prisma schema.

npm

yarn

pnpm

bun

__

```
npm i drizzle-orm@latest
npm i -D drizzle-prisma-generator
```

__

```
yarn add drizzle-orm@latest
yarn add -D drizzle-prisma-generator
```

__

```
pnpm add drizzle-orm@latest
pnpm add -D drizzle-prisma-generator
```

__

```
bun add drizzle-orm@latest
bun add -D drizzle-prisma-generator
```

#### Update your Prisma schema [](#update-your-prisma-schema)

Add Drizzle generator to your Prisma schema. `output` is the path where generated Drizzle schema TS files will be placed.

_schema.prisma_

```
generator client {
  provider = "prisma-client-js"
}

generator drizzle {
  provider = "drizzle-prisma-generator"
  output   = "./drizzle" // Where to put generated Drizle tables
}

// Rest of your Prisma schema

datasource db {
  provider = "postgresql"
  url      = env("DB_URL")
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}

...
```

#### Generate Drizzle schema [](#generate-drizzle-schema)

__

```
prisma generate
```

#### Add Drizzle extension to your Prisma client [](#add-drizzle-extension-to-your-prisma-client)

PostgreSQL

MySQL

SQLite

__

```
import { PrismaClient } from '@prisma/client';
import { drizzle } from 'drizzle-orm/prisma/pg';

const prisma = new PrismaClient().$extends(drizzle());
```

__

```
import { PrismaClient } from '@prisma/client';
import { drizzle } from 'drizzle-orm/prisma/mysql';

const prisma = new PrismaClient().$extends(drizzle());
```

__

```
import { PrismaClient } from '@prisma/client';
import { drizzle } from 'drizzle-orm/prisma/sqlite';

const prisma = new PrismaClient().$extends(drizzle());
```

#### Run Drizzle queries via `prisma.$drizzle`  [](#run-drizzle-queries-via-prismadrizzle-)

In order to use Drizzle query builder, you need references to Drizzle tables. You can import them from the output path that you specified in the generator config.

__

```
import { User } from './drizzle';

await prisma.$drizzle.insert().into(User).values({ email: ' [\[email protected\]](https://orm.drizzle.team/cdn-cgi/l/email-protection)', name: 'Søren' });
const users = await prisma.$drizzle.select().from(User);
```

## Limitations [](#limitations)

- Relational queries are not supported due to a Prisma driver limitation. Because of it, Prisma is unable to return query results in array format, which is required for relational queries to work.
- In SQLite, `.values()` (e.g. `await db.select().from(table).values()`) is not supported, because of the same reason as above.
- Prepared statements support is limited - `.prepare()` will only build the SQL query on Drizzle side, because there is no Prisma API for prepared queries.