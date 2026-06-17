Drizzle ORM - Drizzle with Vercel Edge Functions

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

# Drizzle with Vercel Edge Functions

This tutorial demonstrates how to use Drizzle ORM with Vercel Functions in Edge runtime.

This guide assumes familiarity with:

- You should have the latest version of Vercel CLI installed.

npm

yarn

pnpm

bun

__

```
npm i -g vercel
```

__

```
yarn add -g vercel
```

__

```
pnpm add -g vercel
```

__

```
bun add -g vercel
```

- You should have an existing Next.js project or create a new one using the following command:

__

```
npx create-next-app@latest --typescript
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

IMPORTANT

In case you face the issue with resolving dependencies during installation:

If you’re not using React Native, forcing the installation with `--force` or `--legacy-peer-deps` should resolve the issue. If you are using React Native, then you need to use the exact version of React which is compatible with your React Native version.

## Edge-compatible driver [](#edge-compatible-driver)

When using Drizzle ORM with Vercel Edge functions you have to use edge-compatible drivers because the functions run in Edge runtime not in Node.js runtime, so there are some limitations of standard Node.js APIs.

You can choose one of these drivers according to your database dialect:

- Neon serverless driver allows you to query your Neon Postgres databases from serverless and edge environments over HTTP or WebSockets in place of TCP. We recommend using this driver for connecting to `Neon Postgres`.
- Vercel Postgres driver is built on top of the `Neon serverless driver`. We recommend using this driver for connecting to `Vercel Postgres`.
- PlanetScale serverless driver allows you access any `MySQL` client and execute queries over an HTTP connection, which is generally not blocked by cloud providers.
- libSQL client allows you to access Turso database.

## Navigation [](#navigation)

- Navigate directly to the Neon Postgres section.
- Navigate directly to the Vercel Postgres section.
- Navigate directly to the PlanetScale section.
- Navigate directly to the Turso section.

### Neon Postgres [](#neon-postgres)

#### Install the `@neondatabase/serverless` driver [](#install-the-neondatabaseserverless-driver)

Install the `@neondatabase/serverless` driver:

npm

yarn

pnpm

bun

__

```
npm i @neondatabase/serverless
```

__

```
yarn add @neondatabase/serverless
```

__

```
pnpm add @neondatabase/serverless
```

__

```
bun add @neondatabase/serverless
```

#### Create a table [](#create-a-table)

Create a `schema.ts` file in the `src/db` directory and declare a table schema:

_src/db/schema.ts_

```
import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: text('age').notNull(),
  email: text('email').notNull().unique(),
})
```

#### Setup Drizzle config file [](#setup-drizzle-config-file)

**Drizzle config** - a configuration file that is used by Drizzle Kit and contains all the information about your database connection, migration folder and schema files.

Create a `drizzle.config.ts` file in the root of your project and add the following content:

_drizzle.config.ts_

```
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
```

Configure your database connection string in the `.env` file:

_.env_

```
POSTGRES_URL="postgres://[user]:[password]@[host]-[region].aws.neon.tech:5432/[db-name]?sslmode=[ssl-mode]"
```

#### Applying changes to the database [](#applying-changes-to-the-database)

You can generate migrations using `drizzle-kit generate` command and then run them using the `drizzle-kit migrate` command.

Generate migrations:

__

```
npx drizzle-kit generate
```

These migrations are stored in the `drizzle` directory, as specified in your `drizzle.config.ts`. This directory will contain the SQL files necessary to update your database schema and a `meta` folder for storing snapshots of the schema at different migration stages.

Example of a generated migration:

__

```
CREATE TABLE IF NOT EXISTS "users_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"age" text NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "users_table_email_unique" UNIQUE("email")
);
```

Run migrations:

__

```
npx drizzle-kit migrate
```

Alternatively, you can push changes directly to the database using Drizzle kit push command:

__

```
npx drizzle-kit push
```

IMPORTANT

Push command is good for situations where you need to quickly test new schema designs or changes in a local development environment, allowing for fast iterations without the overhead of managing migration files.

#### Connect Drizzle ORM to your database [](#connect-drizzle-orm-to-your-database)

Create a `index.ts` file in the `src/db` directory and set up your database configuration:

_src/db/index.ts_

```
import { drizzle } from 'drizzle-orm/neon-serverless';


export const db = drizzle(process.env.POSTGRES_URL!)
```

#### Create an API route [](#create-an-api-route)

Create `route.ts` file in `src/app/api/hello` directory. To learn more about how to write a function, see the Functions API Reference and Vercel Functions Quickstart.

_src/app/api/hello/route.ts_

```
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'; // static by default, unless reading the request
export const runtime = 'edge' // specify the runtime to be edge

export async function GET(request: Request) {
  const users = await db.select().from(usersTable)

  return NextResponse.json({ users, message: 'success' });
}
```

#### Test your code locally [](#test-your-code-locally)

Run the `next dev` command to start your local development server:

__

```
npx next dev
```

Navigate to the route you created `(e.g. /api/hello)` in your browser:

__

```
{
  "users": [],
  "message": "success"
}
```

#### Deploy your project [](#deploy-your-project)

Create a new project in the dashboard or run the `vercel` command to deploy your project:

__

```
vercel
```

Add `POSTGRES_URL` environment variable:

__

```
vercel env add POSTGRES_URL
```

Redeploy your project to update your environment variables:

__

```
vercel
```

Finally, you can use URL of the deployed project and navigate to the route you created `(e.g. /api/hello)` to access your edge function.

### Vercel Postgres [](#vercel-postgres)

You can check quickstart guide for Drizzle with Vercel Postgres client in the documentation.

#### Install the `@vercel/postgres` driver [](#install-the-vercelpostgres-driver)

Install the `@vercel/postgres` driver:

npm

yarn

pnpm

bun

__

```
npm i @vercel/postgres
```

__

```
yarn add @vercel/postgres
```

__

```
pnpm add @vercel/postgres
```

__

```
bun add @vercel/postgres
```

#### Create a table [](#create-a-table-1)

Create a `schema.ts` file in the `src/db` directory and declare a table schema:

_src/db/schema.ts_

```
import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: text('age').notNull(),
  email: text('email').notNull().unique(),
})
```

#### Setup Drizzle config file [](#setup-drizzle-config-file-1)

**Drizzle config** - a configuration file that is used by Drizzle Kit and contains all the information about your database connection, migration folder and schema files.

Create a `drizzle.config.ts` file in the root of your project and add the following content:

_drizzle.config.ts_

```
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
```

Configure your database connection string in the `.env` file:

_.env_

```
POSTGRES_URL="postgres://[user]:[password]@[host]-[region].aws.neon.tech:5432/[db-name]?sslmode=[ssl-mode]"
```

#### Applying changes to the database [](#applying-changes-to-the-database-1)

You can generate migrations using `drizzle-kit generate` command and then run them using the `drizzle-kit migrate` command.

Generate migrations:

__

```
npx drizzle-kit generate
```

These migrations are stored in the `drizzle` directory, as specified in your `drizzle.config.ts`. This directory will contain the SQL files necessary to update your database schema and a `meta` folder for storing snapshots of the schema at different migration stages.

Example of a generated migration:

__

```
CREATE TABLE IF NOT EXISTS "users_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"age" text NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "users_table_email_unique" UNIQUE("email")
);
```

Run migrations:

__

```
npx drizzle-kit migrate
```

Alternatively, you can push changes directly to the database using Drizzle kit push command:

__

```
npx drizzle-kit push
```

IMPORTANT

Push command is good for situations where you need to quickly test new schema designs or changes in a local development environment, allowing for fast iterations without the overhead of managing migration files.

#### Connect Drizzle ORM to your database [](#connect-drizzle-orm-to-your-database-1)

Create a `index.ts` file in the `src/db` directory and set up your database configuration:

_src/db/index.ts_

```
import { drizzle } from 'drizzle-orm/vercel-postgres';

export const db = drizzle()
```

#### Create an API route [](#create-an-api-route-1)

Create `route.ts` in `src/app/api/hello` directory. To learn more about how to write a function, see the Functions API Reference and Vercel Functions Quickstart.

_src/app/api/hello/route.ts_

```
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'; // static by default, unless reading the request
export const runtime = 'edge' // specify the runtime to be edge

export async function GET(request: Request) {
  const users = await db.select().from(usersTable)

  return NextResponse.json({ users, message: 'success' });
}
```

#### Test your code locally [](#test-your-code-locally-1)

Run the `next dev` command to start your local development server:

__

```
npx next dev
```

Navigate to the route you created `(e.g. /api/hello)` in your browser:

__

```
{
  "users": [],
  "message": "success"
}
```

#### Deploy your project [](#deploy-your-project-1)

Create a new project in the dashboard or run the `vercel` command to deploy your project:

__

```
vercel
```

Add `POSTGRES_URL` environment variable:

__

```
vercel env add POSTGRES_URL
```

Redeploy your project to update your environment variables:

__

```
vercel
```

Finally, you can use URL of the deployed project and navigate to the route you created `(e.g. /api/hello)` to access your edge function.

### PlanetScale [](#planetscale)

In this tutorial we use PlanetScale MySQL.

#### Install the `@planetscale/database` driver [](#install-the-planetscaledatabase-driver)

Install the `@planetscale/database` driver:

npm

yarn

pnpm

bun

__

```
npm i @planetscale/database
```

__

```
yarn add @planetscale/database
```

__

```
pnpm add @planetscale/database
```

__

```
bun add @planetscale/database
```

#### Create a table [](#create-a-table-2)

Create a `schema.ts` file in the `src/db` directory and declare a table schema:

_src/db/schema.ts_

```
import { mysqlTable, serial, text } from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: text('age').notNull(),
  email: text('email').notNull().unique(),
})
```

#### Setup Drizzle config file [](#setup-drizzle-config-file-2)

**Drizzle config** - a configuration file that is used by Drizzle Kit and contains all the information about your database connection, migration folder and schema files.

Create a `drizzle.config.ts` file in the root of your project and add the following content:

_drizzle.config.ts_

```
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.MYSQL_URL!,
  },
});
```

Configure your database connection string in the `.env` file:

_.env_

```
MYSQL_URL="mysql://[user]:[password]@[host].[region].psdb.cloud/[db-name]?ssl={'rejectUnauthorized':[ssl-rejectUnauthorized]}"
```

#### Applying changes to the database [](#applying-changes-to-the-database-2)

You can generate migrations using `drizzle-kit generate` command and then run them using the `drizzle-kit migrate` command.

Generate migrations:

__

```
npx drizzle-kit generate
```

These migrations are stored in the `drizzle` directory, as specified in your `drizzle.config.ts`. This directory will contain the SQL files necessary to update your database schema and a `meta` folder for storing snapshots of the schema at different migration stages.

Example of a generated migration:

__

```
CREATE TABLE \`users_table\` (
	\`id\` serial AUTO_INCREMENT NOT NULL,
	\`name\` text NOT NULL,
	\`age\` text NOT NULL,
	\`email\` text NOT NULL,
	CONSTRAINT \`users_table_id\` PRIMARY KEY(\`id\`),
	CONSTRAINT \`users_table_email_unique\` UNIQUE(\`email\`)
);
```

Run migrations:

__

```
npx drizzle-kit migrate
```

Alternatively, you can push changes directly to the database using Drizzle kit push command:

__

```
npx drizzle-kit push
```

IMPORTANT

Push command is good for situations where you need to quickly test new schema designs or changes in a local development environment, allowing for fast iterations without the overhead of managing migration files.

#### Connect Drizzle ORM to your database [](#connect-drizzle-orm-to-your-database-2)

Create a `index.ts` file in the `src/db` directory and set up your database configuration:

_src/db/index.ts_

```
import { drizzle } from "drizzle-orm/planetscale-serverless";

export const db = drizzle(process.env.MYSQL_URL!)
```

#### Create an API route [](#create-an-api-route-2)

Create `route.ts` in `src/app/api/hello` directory. To learn more about how to write a function, see the Functions API Reference and Vercel Functions Quickstart.

_src/app/api/hello/route.ts_

```
import { db } from "@/app/db/db";
import { usersTable } from "@/app/db/schema";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'; // static by default, unless reading the request
export const runtime = 'edge' // specify the runtime to be edge

export async function GET(request: Request) {
  const users = await db.select().from(usersTable)

  return NextResponse.json({ users, message: 'success' });
}
```

#### Test your code locally [](#test-your-code-locally-2)

Run the `next dev` command to start your local development server:

__

```
npx next dev
```

Navigate to the route you created `(e.g. /api/hello)` in your browser:

__

```
{
  "users": [],
  "message": "success"
}
```

#### Deploy your project [](#deploy-your-project-2)

Create a new project in the dashboard or run the `vercel` command to deploy your project:

__

```
vercel
```

Add `MYSQL_URL` environment variable:

__

```
vercel env add MYSQL_URL
```

Redeploy your project to update your environment variables:

__

```
vercel
```

Finally, you can use URL of the deployed project and navigate to the route you created `(e.g. /api/hello)` to access your edge function.

### Turso [](#turso)

You can check quickstart guide or tutorial for Drizzle with Turso in the documentation.

#### Install the `@libsql/client` driver [](#install-the-libsqlclient-driver)

Install the `@libsql/client` driver:

npm

yarn

pnpm

bun

__

```
npm i @libsql/client
```

__

```
yarn add @libsql/client
```

__

```
pnpm add @libsql/client
```

__

```
bun add @libsql/client
```

#### Create a table [](#create-a-table-3)

Create a `schema.ts` file in the `src/db` directory and declare a table schema:

_src/db/schema.ts_

```
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable('users_table', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  age: text('age').notNull(),
  email: text('email').notNull().unique(),
})
```

#### Setup Drizzle config file [](#setup-drizzle-config-file-3)

**Drizzle config** - a configuration file that is used by Drizzle Kit and contains all the information about your database connection, migration folder and schema files.

Create a `drizzle.config.ts` file in the root of your project and add the following content:

_drizzle.config.ts_

```
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});
```

Configure your database connection string and auth token in the `.env` file:

_.env_

```
TURSO_CONNECTION_URL="libsql://[db-name].turso.io"
TURSO_AUTH_TOKEN="[auth-token]"
```

#### Applying changes to the database [](#applying-changes-to-the-database-3)

You can generate migrations using `drizzle-kit generate` command and then run them using the `drizzle-kit migrate` command.

Generate migrations:

__

```
npx drizzle-kit generate
```

These migrations are stored in the `drizzle` directory, as specified in your `drizzle.config.ts`. This directory will contain the SQL files necessary to update your database schema and a `meta` folder for storing snapshots of the schema at different migration stages.

Example of a generated migration:

__

```
CREATE TABLE \`users_table\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`name\` text NOT NULL,
	\`age\` text NOT NULL,
	\`email\` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX \`users_table_email_unique\` ON \`users_table\` (\`email\`);
```

Run migrations:

__

```
npx drizzle-kit migrate
```

Alternatively, you can push changes directly to the database using Drizzle kit push command:

__

```
npx drizzle-kit push
```

IMPORTANT

Push command is good for situations where you need to quickly test new schema designs or changes in a local development environment, allowing for fast iterations without the overhead of managing migration files.

#### Connect Drizzle ORM to your database [](#connect-drizzle-orm-to-your-database-3)

Create a `index.ts` file in the `src/db` directory and set up your database configuration:

_src/db/index.ts_

```
import { drizzle } from 'drizzle-orm/libsql';

export const db = drizzle({ connection: {
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
}})
```

#### Create an API route [](#create-an-api-route-3)

Create `route.ts` in `src/app/api/hello` directory. To learn more about how to write a function, see the Functions API Reference and Vercel Functions Quickstart.

_src/app/api/hello/route.ts_

```
import { db } from "@/app/db/db";
import { usersTable } from "@/app/db/schema";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'; // static by default, unless reading the request
export const runtime = 'edge' // specify the runtime to be edge

export async function GET(request: Request) {
  const users = await db.select().from(usersTable)

  return NextResponse.json({ users, message: 'success' });
}
```

#### Test your code locally [](#test-your-code-locally-3)

Run the `next dev` command to start your local development server:

__

```
npx next dev
```

Navigate to the route you created `(e.g. /api/hello)` in your browser:

__

```
{
  "users": [],
  "message": "success"
}
```

#### Deploy your project [](#deploy-your-project-3)

Create a new project in the dashboard or run the `vercel` command to deploy your project:

__

```
vercel
```

Add `TURSO_CONNECTION_URL` environment variable:

__

```
vercel env add TURSO_CONNECTION_URL
```

Add `TURSO_AUTH_TOKEN` environment variable:

__

```
vercel env add TURSO_AUTH_TOKEN
```

Redeploy your project to update your environment variables:

__

```
vercel
```

Finally, you can use URL of the deployed project and navigate to the route you created `(e.g. /api/hello)` to access your edge function.