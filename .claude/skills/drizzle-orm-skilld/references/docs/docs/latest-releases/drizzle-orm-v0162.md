Drizzle ORM - DrizzleORM v0.16.2 release

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

DrizzleORM v0.16.2 release

Jan 21, 2023

Drizzle ORM - is an idiomatic TypeScript ORM which can be used as query builder and as an ORM being the source of truth for SQL schema and CLI for automatic migrations generation.

Since last major update we’ve added numerous requested features 

###  PostgreSQL schemas [](#-postgresql-schemas)

You can now declare PostgreSQL schemas and tables to be created within this schema

__

```
// src/schema.ts
import { pgSchema } from "drizzle-orm-pg";

export const mySchema = pgSchema("my_schema");

export const users = mySchema("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email"),
});
```

__

```
CREATE SCHEMA "my_schema";

CREATE TABLE IF NOT EXISTS "my_schema"."users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"email" text
);
```

drizzle-kit will automatically generate all needed SQL migrations

__

```
drizzle-kit generate:pg --schema=src/schema.ts --out=migrations/
```

###  MySQL databases/schemas [](#-mysql-databasesschemas)

You can now declare MySQL databases/schemas and tables to be created within it

__

```
// schema.ts
import { mysqlSchema } from "drizzle-orm-mysql";

const mySchema = mysqlSchema("my_schema");

const users = mySchema("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email"),
});
```

drizzle-kit will automatically generate all needed SQL migrations `shell drizzle-kit generate:mysql --schema=src/schema.ts --out=migrations/`

which will automatically generate you SQL migration

__

```
CREATE DATABASE \`my_schema\`;

CREATE TABLE \`my_schema\`.\`users\` (
	\`id\` serial PRIMARY KEY NOT NULL,
	\`name\` text,
	\`email\` text
);
```

###  PostgreSQL introspect [](#-postgresql-introspect)

You can now pull database schema from your existing PostgreSQL database within seconds with drizzle-kit, this vanishes mostly any friction for you to switch from any existing orm or vanilla SQL. It supports:

- enums
- tables with all native and non-native columns
- indexes
- foreign keys, self references and cyclic fks
- schemas

__

```
drizzle-kit introspect:pg --out=migrations/ --connectionString=postgresql://user:pass@host:port/db_name
```

it will print you `schema.ts`

__

```
export const myEnum = pgEnum("my_enum", ["one", "two", "three"]);
export const mySchema = pgSchema("my_schema");

export const users = mySchema("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email"),
});

export const users2 = pgTable("users2", {
  id: serial("id").primaryKey(),
  name: varchar("name2"),
  enum: myEnum("enum"),
});

export const allColumns = pgTable("all_columns", {
  sm: smallint("smallint"),
  smdef: smallint("smallint_def").default(10),
  int: integer("integer"),
  intdef: integer("integer_def").default(10),
  numeric: numeric("numeric"),
  numeric2: numeric("numeric2", { precision: 7 }),
  numeric3: numeric("numeric3", { scale: 7 }),
  numeric4: numeric("numeric4", { precision: 7, scale: 7 }),
  numericdef: numeric("numeridef").default("100"),
  bigint: bigint("bigint", { mode: "number" }),
  bigintdef: bigint("bigint", { mode: "number" }).default(100),
  bool: boolean("boolean"),
  booldef: boolean("boolean_def").default(true),
  text: text("text"),
  textdef: text("textdef").default("text"),
  varchar: varchar("varchar"),
  varchardef: varchar("varchardef").default("text"),
  serial: serial("serial"),
  bigserial: bigserial("bigserial", { mode: "bigint" }),
  decimal: decimal("decimal", { precision: 100, scale: 2 }),
  decimaldef: decimal("decimaldef", { precision: 100, scale: 2 }).default(
    "100.0",
  ),
  doublePrecision: doublePrecision("decimal"),
  doublePrecisiondef: doublePrecision("decimaldef").default(100.0),
  real: real("real"),
  realdef: real("decimaldef").default(100.0),
  json: json<{ attr: string }>("json"),
  jsondef: json<{ attr: string }>("jsondef").default({ attr: "value" }),
  jsonb: jsonb<{ attr: string }>("jsonb"),
  jsonbdef: jsonb<{ attr: string }>("jsonbdef").default({ attr: "value" }),
  time: time("time"),
  time2: time("time2", { precision: 6, withTimezone: true }),
  timedefnow: time("timedefnow").defaultNow(),
  timestamp: timestamp("timestamp"),
  timestamp2: timestamp("timestamp2", { precision: 6, withTimezone: true }),
  timestamp3: timestamp("timestamp3", { withTimezone: true }),
  timestamp4: timestamp("timestamp4", { precision: 4 }),
  timestampdef: timestamp("timestampdef").defaultNow(),
  date: date("date", { mode: "date" }),
  datedef: date("datedef").defaultNow(),
  interval: interval("interval"),
  intervaldef: interval("intervaldef").default("10 days"),
});

export const cyclic1 = pgTable("cyclic1", {
  id: serial("id").primaryKey(),
  ext2: integer("ext2").references(() => cyclic2.id),
});

export const cyclic2 = pgTable("cyclic2", {
  id: serial("id").primaryKey(),
  ext1: integer("ext1").references((): AnyPgColumn => cyclic1.id),
});

export const example = pgTable(
  "example",
  {
    id: serial("id").primaryKey(),
    reportsTo: integer("reports_to"),
  },
  (table) => {
    return {
      reportsToFK: foreignKey({
        columns: [table.reportsTo],
        foreignColumns: [table.id],
      }),
    };
  },
);
```

###  Postgres.js driver support [](#-postgresjs-driver-support)

We’ve added full support for postgres.js, it is lightweight and it is fast 

__

```
// schema.ts
import { pgTable, serial, text, varchar } from "drizzle-orm-pg";
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name"),
  phone: varchar("phone", { length: 256 }),
});

// index.ts
import { drizzle, PostgresJsDatabase } from "drizzle-orm-pg/postgres.js";
import postgres from "postgres";
import { users } from "./schema";

const client = postgres(connectionString);
const db: PostgresJsDatabase = drizzle(client);

const allUsers = await db.select(users);
```

Full PostgreSQL docs see here

###  PostgreSQL and MySQL types [](#-postgresql-and-mysql-types)

We’ve added useful operators for you to create any needed non-native PostgreSQL or MySQL types

__

```
// PostgreSQL
const customText = customType<{ data: string }>({
  dataType() {
    return "text";
  },
});

const usersTable = pgTable("users", {
  name: customText("name").notNull(),
});

// MySQL
const customText = customType<{ data: string }>({
  dataType() {
    return "text";
  },
});

const usersTable = mysqlTable("users", {
  name: customText("name").notNull(),
});
```