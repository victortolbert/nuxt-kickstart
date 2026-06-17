Drizzle ORM - undefined

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

## Npm [](#npm)

npm

yarn

pnpm

bun

__

```
npm i drizzle-orm
```

__

```
yarn add drizzle-orm
```

__

```
pnpm add drizzle-orm
```

__

```
bun add drizzle-orm
```

npm

yarn

pnpm

bun

__

```
npm i drizzle-orm -D drizzle-kit
```

__

```
yarn add drizzle-orm -D drizzle-kit
```

__

```
pnpm add drizzle-orm -D drizzle-kit
```

__

```
bun add drizzle-orm -D drizzle-kit
```

## AnchorCards [](#anchorcards)

[Anchor1](#anchor1) [Anchor2](#anchor2) [Anchor3](#anchor3) [Anchor4](#anchor4)

## Callout [](#callout)

Callout example

Callout example

Callout example

IMPORTANT

Callout example

WARNING

Callout example

## CodeTabs with CodeTab [](#codetabs-with-codetab)

index.ts

schema.ts

__

```
import * as schema from './schema';
import { drizzle } from 'drizzle-orm/...';

const db = drizzle(client, { schema });

const result = await db.query.users.findMany({
	with: {
		posts: true
	},
});
```

__

```
[{
	id: 10,
	name: "Dan",
	posts: [
		{
			id: 1,
			content: "SQL is awesome",
			authorId: 10,
		},
		{
			id: 2,
			content: "But check relational queries",
			authorId: 10,
		}
	]
}]
```

__

```
import { integer, serial, text, pgTable } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts),
}));

export const posts = pgTable('posts', {
	id: serial('id').primaryKey(),
	content: text('content').notNull(),
	authorId: integer('author_id').notNull(),
});

export const postsRelations = relations(posts, ({ one }) => ({
	author: one(users, { fields: [posts.authorId], references: [users.id] }),
}));
```

## IsSupportedChipGroup [](#issupportedchipgroup)

PostgreSQL

SQLite

MySQL

## Section [](#section)

For codeblocks connection

__

```
import { sql } from "drizzle-orm";
import { integer, sqliteTable } from "drizzle-orm/sqlite-core";

const table = sqliteTable('table', {
int1: integer('int1').default(42),
int2: integer('int2').default(sql\`(abs(42))\`)
});
```

__

```
CREATE TABLE \`table\` (
  \`int1\` integer DEFAULT 42,
  \`int2\` integer DEFAULT (abs(42))
);
```

## Tabs with Tab and Section [](#tabs-with-tab-and-section)

PostgreSQL

MySQL

SQLite

__

```
import { sql } from "drizzle-orm";
import { integer, uuid, pgTable } from "drizzle-orm/pg-core";

const table = pgTable('table', {
  integer1: integer('integer1').default(42),
  integer2: integer('integer2').default(sql\`'42'::integer\`),
  uuid1: uuid('uuid1').defaultRandom(),
  uuid2: uuid('uuid2').default(sql\`gen_random_uuid()\`),
});
```

__

```
CREATE TABLE IF NOT EXISTS "table" (
  "integer1" integer DEFAULT 42,
  "integer2" integer DEFAULT '42'::integer,
  "uuid1" uuid DEFAULT gen_random_uuid(),
  "uuid2" uuid DEFAULT gen_random_uuid()
);
```

__

```
import { sql } from "drizzle-orm";
import { int, time, mysqlTable } from "drizzle-orm/mysql-core";

const table = mysqlTable("table", {
  int: int("int").default(42),
  time: time("time").default(sql\`cast("14:06:10" AS TIME)\`),
});
```

__

```
CREATE TABLE \`table\` (
  \`int\` int DEFAULT 42,
  \`time\` time DEFAULT cast("14:06:10" AS TIME)
);
```

__

```
import { sql } from "drizzle-orm";
import { integer, sqliteTable } from "drizzle-orm/sqlite-core";

const table = sqliteTable('table', {
  int1: integer('int1').default(42),
  int2: integer('int2').default(sql\`(abs(42))\`)
});
```

__

```
CREATE TABLE \`table\` (
  \`int1\` integer DEFAULT 42,
  \`int2\` integer DEFAULT (abs(42))
);
```

## SimpleLinkCards [](#simplelinkcards)

PostgreSQL column types MySQL column types SQLite column types

## Steps [](#steps)

With h4 headers

#### Install babel plugin [](#install-babel-plugin)

It’s necessary to bundle SQL migration files as string directly to your bundle.

__

```
npm install babel-plugin-inline-import
```

#### Update config files. [](#update-config-files)

You will need to update `babel.config.js`, `metro.config.js` and `drizzle.config.ts` files

_babel.config.js_

```
module.exports = function (api) {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [["inline-import", { extensions: [".sql"] }]], // <-- add this
  };
};
```

## YoutubeCards [](#youtubecards)

38:08 Easiest Database Setup in Next.js 14 with Turso & Drizzle Sam Meech-Ward

5:46:28 Next.js Project with Vercel, Neon, Drizzle, TailwindCSS, FlowBite and more! CodingEntrepreneurs

5:46 I Have A New Favorite Database Tool Theo - t3.gg

## Collapsable code block [](#collapsable-code-block)

_prisma/schema.prisma_

```
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}


model Product {
  id              Int           @id @default(autoincrement())
  name            String
  supplierId      Int
  unitPrice       Decimal       @db.Decimal(10, 4)
  unitsInStock    Int

  supplier        Supplier?     @relation(fields: [supplierId], references: [id])
  orderDetails    OrderDetail[]

  @@map("products")
}

model Supplier {
  id           Int       @id @default(autoincrement())
  companyName  String
  city         String
  country      String

  products     Product[]

  @@map("suppliers")
}

model OrderDetail {
  orderId   Int
  productId Int
  quantity  Int

  order   Order   @relation(fields: [orderId], references: [id])
  product Product @relation(fields: [productId], references: [id])

  @@id([orderId, productId])
  @@map("order_details")
}

model Order {
  id             Int       @id @default(autoincrement())
  orderDate      DateTime  @db.Date
  shippedDate    DateTime? @db.Date
  shipAddress    String
  shipPostalCode String?
  shipCountry    String

  orderDetails OrderDetail[]

  @@map("orders")
}
```

Expand