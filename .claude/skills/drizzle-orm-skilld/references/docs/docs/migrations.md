Drizzle ORM - Migrations

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

# Drizzle migrations fundamentals

SQL databases require you to specify a **strict schema** of entities you’re going to store upfront and if (when) you need to change the shape of those entities - you will need to do it via **schema migrations**.

There’re multiple production grade ways of managing database migrations. Drizzle is designed to perfectly suits all of them, regardless of you going **database first** or **codebase first**.

**Database first** is when your database schema is a source of truth. You manage your database schema either directly on the database or via database migration tools and then you pull your database schema to your codebase application level entities.

**Codebase first** is when database schema in your codebase is a source of truth and is under version control. You declare and manage your database schema in JavaScript/TypeScript and then you apply that schema to the database itself either with Drizzle, directly or via external migration tools.

#### How can Drizzle help? [](#how-can-drizzle-help)

We’ve built **drizzle-kit** - CLI app for managing migrations with Drizzle.

__

```
drizzle-kit migrate
drizzle-kit generate
drizzle-kit push
drizzle-kit pull
```

It is designed to let you choose how to approach migrations based on your current business demands.

It fits in both database and codebase first approaches, it lets you **push your schema** or **generate SQL migration** files or **pull the schema** from database. It is perfect wether you work alone or in a team.

---

**Now let’s pick the best option for your project:**

**Option 1**

> I manage database schema myself using external migration tools or by running SQL migrations directly on my database. From Drizzle I just need to get current state of the schema from my database and save it as TypeScript schema file.

Expand details

That’s a **database first** approach. You have your database schema as a **source of truth** and Drizzle lets you pull database schema to TypeScript using `drizzle-kit pull` command.

__

```
                                  ┌────────────────────────┐      ┌─────────────────────────┐ 
                                  │                        │ <---  CREATE TABLE "users" (
┌──────────────────────────┐      │                        │        "id" SERIAL PRIMARY KEY,
│ ~ drizzle-kit pull       │      │                        │        "name" TEXT,
└─┬────────────────────────┘      │        DATABASE        │        "email" TEXT UNIQUE
  │                               │                        │       );
  └ Pull datatabase schema -----> │                        │
  ┌ Generate Drizzle       <----- │                        │
  │ schema TypeScript file        └────────────────────────┘
  │
  v
```

__

```
import * as p from "drizzle-orm/pg-core";

export const users = p.pgTable("users", {
  id: p.serial().primaryKey(),
  name: p.text(),
  email: p.text().unique(),
});
```

**Option 2**

> I want to have database schema in my TypeScript codebase, I don’t wanna deal with SQL migration files. I want Drizzle to “push” my schema directly to the database

Expand details

That’s a **codebase first** approach. You have your TypeScript Drizzle schema as a **source of truth** and Drizzle lets you push schema changes to the database using `drizzle-kit push` command.

That’s the best approach for rapid prototyping and we’ve seen dozens of teams and solo developers successfully using it as a primary migrations flow in their production applications.

_src/schema.ts_

```
import * as p from "drizzle-orm/pg-core";

export const users = p.pgTable("users", {
  id: p.serial().primaryKey(),
  name: p.text(),
  email: p.text().unique(), // <--- added column
});
```

__

```
Add column to \`users\` table                                                                          
┌──────────────────────────┐                  
│ + email: text().unique() │                  
└─┬────────────────────────┘                  
  │                                           
  v                                           
┌──────────────────────────┐                  
│ ~ drizzle-kit push       │                  
└─┬────────────────────────┘                  
  │                                           ┌──────────────────────────┐
  └ Pull current datatabase schema ---------> │                          │
                                              │                          │
  ┌ Generate alternations based on diff <---- │         DATABASE         │
  │                                           │                          │
  └ Apply migrations to the database -------> │                          │
                                       │      └──────────────────────────┘
                                       │
  ┌────────────────────────────────────┴──────────────┐
   ALTER TABLE \`users\` ADD COLUMN \`email\` TEXT UNIQUE;
```

**Option 3**

> I want to have database schema in my TypeScript codebase, I want Drizzle to generate SQL migration files for me and apply them to my database

Expand details

That’s a **codebase first** approach. You have your TypeScript Drizzle schema as a source of truth and Drizzle lets you generate SQL migration files based on your schema changes with `drizzle-kit generate` and then apply them to the database with `drizzle-kit migrate` commands.

_src/schema.ts_

```
import * as p from "drizzle-orm/pg-core";

export const users = p.pgTable("users", {
  id: p.serial().primaryKey(),
  name: p.text(),
  email: p.text().unique(),
});
```

__

```
┌────────────────────────┐                  
│ $ drizzle-kit generate │                  
└─┬──────────────────────┘                  
  │                                           
  └ 1. read previous migration folders
    2. find diff between current and previous schema
    3. prompt developer for renames if necessary
  ┌ 4. generate SQL migration and persist to file
  │    ┌─┴───────────────────────────────────────┐  
  │      📂 drizzle       
  │      └ 📂 20242409125510_premium_mister_fear
  │        ├ 📜 snapshot.json
  │        └ 📜 migration.sql
  v
```

__

```
-- drizzle/20242409125510_premium_mister_fear/migration.sql

CREATE TABLE "users" (
 "id" SERIAL PRIMARY KEY,
 "name" TEXT,
 "email" TEXT UNIQUE
);
```

__

```
┌───────────────────────┐                  
│ $ drizzle-kit migrate │                  
└─┬─────────────────────┘                  
  │                                                         ┌──────────────────────────┐                                         
  └ 1. read migration.sql files in migrations folder        │                          │
    2. fetch migration history from database -------------> │                          │
  ┌ 3. pick previously unapplied migrations <-------------- │         DATABASE         │
  └ 4. apply new migration to the database ---------------> │                          │
                                                            │                          │
                                                            └──────────────────────────┘
[✓] done!
```

**Option 4**

> I want to have database schema in my TypeScript codebase, I want Drizzle to generate SQL migration files for me and I want Drizzle to apply them during runtime

Expand details

That’s a **codebase first** approach. You have your TypeScript Drizzle schema as a source of truth and Drizzle lets you generate SQL migration files based on your schema changes with `drizzle-kit generate` and then you can apply them to the database during runtime of your application.

This approach is widely used for **monolithic** applications when you apply database migrations during zero downtime deployment and rollback DDL changes if something fails. This is also used in **serverless** deployments with migrations running in **custom resource** once during deployment process.

_src/schema.ts_

```
import * as p from "drizzle-orm/pg-core";

export const users = p.pgTable("users", {
  id: p.serial().primaryKey(),
  name: p.text(),
  email: p.text().unique(),
});
```

__

```
┌────────────────────────┐                  
│ $ drizzle-kit generate │                  
└─┬──────────────────────┘                  
  │                                           
  └ 1. read previous migration folders
    2. find diff between current and previous schema
    3. prompt developer for renames if necessary
  ┌ 4. generate SQL migration and persist to file
  │    ┌─┴───────────────────────────────────────┐  
  │      📂 drizzle       
  │      └ 📂 20242409125510_premium_mister_fear
  │        ├ 📜 snapshot.json
  │        └ 📜 migration.sql
  v
```

__

```
-- drizzle/20242409125510_premium_mister_fear/migration.sql

CREATE TABLE "users" (
 "id" SERIAL PRIMARY KEY,
 "name" TEXT,
 "email" TEXT UNIQUE
);
```

__

```
// index.ts
import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from 'drizzle-orm/node-postgres/migrator';

const db = drizzle(process.env.DATABASE_URL);

await migrate(db);
```

__

```
┌───────────────────────┐                  
│ npx tsx src/index.ts  │                  
└─┬─────────────────────┘                  
  │                                                      
  ├ 1. init database connection                             ┌──────────────────────────┐                                         
  └ 2. read migration.sql files in migrations folder        │                          │
    3. fetch migration history from database -------------> │                          │
  ┌ 4. pick previously unapplied migrations <-------------- │         DATABASE         │
  └ 5. apply new migration to the database ---------------> │                          │
                                                            │                          │
                                                            └──────────────────────────┘
[✓] done!
```

**Option 5**

> I want to have database schema in my TypeScript codebase, I want Drizzle to generate SQL migration files for me, but I will apply them to my database myself or via external migration tools

Expand details

That’s a **codebase first** approach. You have your TypeScript Drizzle schema as a source of truth and Drizzle lets you generate SQL migration files based on your schema changes with `drizzle-kit generate` and then you can apply them to the database either directly or via external migration tools.

_src/schema.ts_

```
import * as p from "drizzle-orm/pg-core";

export const users = p.pgTable("users", {
  id: p.serial().primaryKey(),
  name: p.text(),
  email: p.text().unique(),
});
```

__

```
┌────────────────────────┐                  
│ $ drizzle-kit generate │                  
└─┬──────────────────────┘                  
  │                                           
  └ 1. read previous migration folders
    2. find diff between current and previous scheama
    3. prompt developer for renames if necessary
  ┌ 4. generate SQL migration and persist to file
  │    ┌─┴───────────────────────────────────────┐  
  │      📂 drizzle       
  │      └ 📂 20242409125510_premium_mister_fear
  │        ├ 📜 snapshot.json
  │        └ 📜 migration.sql
  v
```

__

```
-- drizzle/20242409125510_premium_mister_fear/migration.sql

CREATE TABLE "users" (
 "id" SERIAL PRIMARY KEY,
 "name" TEXT,
 "email" TEXT UNIQUE
);
```

__

```
┌───────────────────────────────────┐                  
│ (._.) now you run your migrations │           
└─┬─────────────────────────────────┘  
  │
 directly to the database
  │                                         ┌────────────────────┐
  ├────────────────────────────────────┬───>│                    │  
  │                                    │    │      Database      │           
 or via external tools                 │    │                    │   
  │                                    │    └────────────────────┘
  │  ┌────────────────────┐            │      
  └──│ Bytebase           ├────────────┘         
     ├────────────────────┤  
     │ Liquibase          │
     ├────────────────────┤ 
     │ Atlas              │
     ├────────────────────┤ 
     │ etc…               │
     └────────────────────┘

[✓] done!
```

**Option 6**

> I want to have database schema in my TypeScript codebase, I want Drizzle to output the SQL representation of my Drizzle schema to the console, and I will apply them to my database via Atlas

Expand details

That’s a **codebase first** approach. You have your TypeScript Drizzle schema as a source of truth and Drizzle lets you export SQL statements based on your schema changes with `drizzle-kit export` and then you can apply them to the database via Atlas or other external SQL migration tools.

_src/schema.ts_

```
import * as p from "drizzle-orm/pg-core";

export const users = p.pgTable("users", {
  id: p.serial().primaryKey(),
  name: p.text(),
  email: p.text().unique(),
});
```

__

```
┌────────────────────────┐                  
│ $ drizzle-kit export   │                  
└─┬──────────────────────┘                  
  │                                           
  └ 1. read your drizzle schema
    2. generated SQL representation of your schema
  ┌ 3. outputs to console
  │    
  │        
  v
```

__

```
CREATE TABLE "users" (
 "id" SERIAL PRIMARY KEY,
 "name" TEXT,
 "email" TEXT UNIQUE
);
```

__

```
┌───────────────────────────────────┐                  
│ (._.) now you run your migrations │           
└─┬─────────────────────────────────┘  
  │
 via Atlas
  │                                    ┌──────────────┐
  │  ┌────────────────────┐            │              │
  └──│ Atlas              ├───────────>│  Database    │      
     └────────────────────┘            │              │       
                                       └──────────────┘

[✓] done!
```