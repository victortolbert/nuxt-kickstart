Drizzle ORM - Drizzle with Neon Postgres

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

# Drizzle with Neon Postgres

This tutorial demonstrates how to use Drizzle ORM with Neon Postgres database. If you do not have an existing Neon account, sign up here.

This guide assumes familiarity with:

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

- You should also install the Neon serverless driver.

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

- You should have installed the `dotenv` package for managing environment variables.

npm

yarn

pnpm

bun

__

```
npm i dotenv
```

__

```
yarn add dotenv
```

__

```
pnpm add dotenv
```

__

```
bun add dotenv
```

## Setup Neon and Drizzle ORM [](#setup-neon-and-drizzle-orm)

#### Create a new Neon project [](#create-a-new-neon-project)

Log in to the Neon Console and navigate to the Projects section. Select a project or click the `New Project` button to create a new one.

Your Neon projects come with a ready-to-use Postgres database named `neondb`. We’ll use it in this tutorial.

#### Setup connection string variable [](#setup-connection-string-variable)

Navigate to the **Connection Details** section in the project console to find your database connection string. It should look similar to this:

__

```
postgres://username: [\[email protected\]](https://orm.drizzle.team/cdn-cgi/l/email-protection)/neondb
```

Add the `DATABASE_URL` environment variable to your `.env` or `.env.local` file, which you’ll use to connect to the Neon database.

__

```
DATABASE_URL=NEON_DATABASE_CONNECTION_STRING
```

#### Connect Drizzle ORM to your database [](#connect-drizzle-orm-to-your-database)

Create a `db.ts` file and set up your database configuration:

_src/db.ts_

```
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" }); // or .env.local

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });
```

#### Create tables [](#create-tables)

Create a `schema.ts` file and declare your tables:

_src/schema.ts_

```
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  email: text('email').notNull().unique(),
});

export const postsTable = pgTable('posts_table', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;
```

#### Setup Drizzle config file [](#setup-drizzle-config-file)

**Drizzle config** - a configuration file that is used by Drizzle Kit and contains all the information about your database connection, migration folder and schema files.

Create a `drizzle.config.ts` file in the root of your project and add the following content:

_drizzle.config.ts_

```
import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({ path: '.env' });

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

#### Applying changes to the database [](#applying-changes-to-the-database)

You can generate migrations using `drizzle-kit generate` command and then run them using the `drizzle-kit migrate` command.

Generate migrations:

__

```
npx drizzle-kit generate
```

These migrations are stored in the `drizzle/migrations` directory, as specified in your `drizzle.config.ts`. This directory will contain the SQL files necessary to update your database schema and a `meta` folder for storing snapshots of the schema at different migration stages.

Example of a generated migration:

__

```
CREATE TABLE IF NOT EXISTS "posts_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"age" integer NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "users_table_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts_table" ADD CONSTRAINT "posts_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
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

### Basic file structure [](#basic-file-structure)

This is the basic file structure of the project. In the `src/db` directory, we have database-related files including connection in `db.ts`, schema definitions in `schema.ts`, and a migration script in `migrate.ts` file which is responsible for applying migrations that stored in the `migrations` directory.

__

```
📦 <project root>
 ├ 📂 src
 │  ├ 📜 db.ts
 │  └ 📜 schema.ts
 ├ 📂 migrations
 │  ├ 📂 meta
 │  │  ├ 📜 _journal.json
 │  │  └ 📜 0000_snapshot.json
 │  └ 📜 0000_dry_richard_fisk.sql
 ├ 📜 .env
 ├ 📜 drizzle.config.ts
 ├ 📜 package.json
 └ 📜 tsconfig.json
```

## Query examples [](#query-examples)

For instance, we create `src/queries` folder and separate files for each operation: insert, select, update, delete.

#### Insert data [](#insert-data)

Read more about insert query in the documentation.

_src/queries/insert.ts_

```
import { db } from '../db';
import { InsertPost, InsertUser, postsTable, usersTable } from '../schema';

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}

export async function createPost(data: InsertPost) {
  await db.insert(postsTable).values(data);
}
```

#### Select data [](#select-data)

Read more about select query in the documentation.

IMPORTANT

`getColumns` available starting from `[\[email protected\]](https://orm.drizzle.team/cdn-cgi/l/email-protection)`(read more here)

If you are on pre-1 version(like `0.45.1`) then use `getTableColumns`

_src/queries/select.ts_

```
import { asc, between, count, eq, getColumns, sql } from 'drizzle-orm';
import { db } from '../db';
import { SelectUser, usersTable, postsTable } from '../schema';

export async function getUserById(id: SelectUser['id']): Promise<
  Array<{
    id: number;
    name: string;
    age: number;
    email: string;
  }>
> {
  return db.select().from(usersTable).where(eq(usersTable.id, id));
}

export async function getUsersWithPostsCount(
  page = 1,
  pageSize = 5,
): Promise<
  Array<{
    postsCount: number;
    id: number;
    name: string;
    age: number;
    email: string;
  }>
> {
  return db
    .select({
      ...getColumns(usersTable),
      postsCount: count(postsTable.id),
    })
    .from(usersTable)
    .leftJoin(postsTable, eq(usersTable.id, postsTable.userId))
    .groupBy(usersTable.id)
    .orderBy(asc(usersTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

export async function getPostsForLast24Hours(
  page = 1,
  pageSize = 5,
): Promise<
  Array<{
    id: number;
    title: string;
  }>
> {
  return db
    .select({
      id: postsTable.id,
      title: postsTable.title,
    })
    .from(postsTable)
    .where(between(postsTable.createdAt, sql\`now() - interval '1 day'\`, sql\`now()\`))
    .orderBy(asc(postsTable.title), asc(postsTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}
```

Alternatively, you can use relational query syntax.

#### Update data [](#update-data)

Read more about update query in the documentation.

_src/queries/update.ts_

```
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { SelectPost, postsTable } from '../schema';

export async function updatePost(id: SelectPost['id'], data: Partial<Omit<SelectPost, 'id'>>) {
  await db.update(postsTable).set(data).where(eq(postsTable.id, id));
}
```

#### Delete data [](#delete-data)

Read more about delete query in the documentation.

_src/queries/delete.ts_

```
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { SelectUser, usersTable } from '../schema';

export async function deleteUser(id: SelectUser['id']) {
  await db.delete(usersTable).where(eq(usersTable.id, id));
}
```