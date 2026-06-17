Drizzle ORM - Drizzle with Encore

We've merged alternation-engine into Beta release. Try it out!

 Documentation

33k+ 

Dark

System

meet drizzle

Get started Sustainability Why Drizzle? Guides Tutorials

Latest releases Gotchas

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

# Drizzle with Encore

This tutorial demonstrates how to use **Drizzle ORM** with **Encore**, an open source backend framework with built-in infrastructure automation and observability.

This guide assumes familiarity with:

- You should have the Encore CLI installed. You can install it with:

__

```
# macOS
brew install encoredev/tap/encore

# Linux
curl -L https://encore.dev/install.sh | bash

# Windows
iwr https://encore.dev/install.ps1 | iex
```

- You should have installed Drizzle ORM and Drizzle kit. You can do this by running the following command:

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

## Setup Encore and Drizzle ORM [](#setup-encore-and-drizzle-orm)

#### Create a new Encore project [](#create-a-new-encore-project)

You can create a new Encore project with Drizzle already configured:

__

```
encore app create my-app --example=ts/drizzle
cd my-app
```

Or if you have an existing Encore project, install Drizzle:

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

#### Create the database [](#create-the-database)

Define your database in a `database.ts` file. Encore automatically provisions a PostgreSQL database locally using Docker and in the cloud when you deploy:

_database.ts_

```
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const db = new SQLDatabase("mydb", {
  migrations: {
    path: "migrations",
    source: "drizzle",
  },
});

export const orm = drizzle(db.connectionString, { schema });
```

Setting `source: "drizzle"` tells Encore to use Drizzle’s migration format.

#### Define your schema [](#define-your-schema)

Create a `schema.ts` file to define your tables:

_schema.ts_

```
import * as p from "drizzle-orm/pg-core";

export const users = p.pgTable("users", {
  id: p.serial().primaryKey(),
  name: p.text().notNull(),
  email: p.text().unique().notNull(),
  createdAt: p.timestamp().defaultNow().notNull(),
});
```

#### Setup Drizzle config [](#setup-drizzle-config)

Create a `drizzle.config.ts` file:

_drizzle.config.ts_

```
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "migrations",
  schema: "schema.ts",
  dialect: "postgresql",
});
```

#### Generate migrations [](#generate-migrations)

Run Drizzle Kit to generate migrations from your schema:

__

```
drizzle-kit generate
```

This creates migration files in the `migrations` folder.

#### Create an API endpoint [](#create-an-api-endpoint)

Use Drizzle in your Encore endpoints:

_users.ts_

```
import { api } from "encore.dev/api";
import { orm } from "./database";
import { users } from "./schema";
import { eq } from "drizzle-orm";

interface User {
  id: number;
  name: string;
  email: string;
}

export const list = api(
  { expose: true, method: "GET", path: "/users" },
  async (): Promise<{ users: User[] }> => {
    const result = await orm.select().from(users);
    return { users: result };
  }
);

export const create = api(
  { expose: true, method: "POST", path: "/users" },
  async (req: { name: string; email: string }): Promise<User> => {
    const [user] = await orm
      .insert(users)
      .values({ name: req.name, email: req.email })
      .returning();
    return user;
  }
);
```

#### Run your application [](#run-your-application)

Start your Encore app:

__

```
encore run
```

Encore automatically applies migrations when starting. Open localhost:9400 to see the local dashboard with API docs, database explorer, and tracing.

Migrations are automatically applied when you run your Encore application. You don’t need to run `drizzle-kit migrate` manually.

## Learn more [](#learn-more)

- Encore Documentation
- Encore Drizzle Guide
- Drizzle ORM Documentation