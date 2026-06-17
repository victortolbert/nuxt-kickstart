Drizzle ORM - Seeding Partially Exposed Tables with Foreign Key

We've merged alternation-engine into Beta release. Try it out!

 Documentation

33k+ 

Dark

System

meet drizzle

Get started Sustainability Why Drizzle? Guides

Tutorials Latest releases Gotchas

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

Drizzle | Seeding Partially Exposed Tables with Foreign Key

PostgreSQL

MySQL

SQLite

This guide assumes familiarity with:

- Get started with PostgreSQL, MySQL or SQLite
- Get familiar with Drizzle Seed

## Example 1 [](#example-1)

Let’s assume you are trying to seed your database using the seeding script and schema shown below.

index.ts

schema.ts

__

```
import { bloodPressure } from './schema.ts';

async function main() {
  const db = drizzle(...);
  await seed(db, { bloodPressure });
}
main();
```

__

```
import { serial, pgTable, integer, doublePrecision } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
});

export const bloodPressure = pgTable("bloodPressure", {
	bloodPressureId: serial().primaryKey(),
	pressure: doublePrecision(),
	userId: integer().references(() => users.id).notNull(),
})
```

If the `bloodPressure` table has a not-null constraint on the `userId` column, running the seeding script will cause an error.

__

```
Error: Column 'userId' has not null constraint, 
and you didn't specify a table for foreign key on column 'userId' in 'bloodPressure' table.
```

What does it mean?

This means we can’t fill the `userId` column with Null values due to the not-null constraint on that column. Additionally, you didn’t expose the `users` table to the `seed` function schema, so we can’t generate `users.id` to populate the `userId` column with these values.

At this point, you have several options to resolve the error:

- You can remove the not-null constraint from the `userId` column;
- You can expose `users` table to `seed` function schema

__

```
await seed(db, { bloodPressure, users });
```

- You can refine the `userId` column generator;

## Example 2 [](#example-2)

index.ts

schema.ts

__

```
import { bloodPressure } from './schema.ts';

async function main() {
  const db = drizzle(...);
  await seed(db, { bloodPressure });
}
main();
```

__

```
import { serial, pgTable, integer, doublePrecision } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
});

export const bloodPressure = pgTable("bloodPressure", {
	bloodPressureId: serial().primaryKey(),
	pressure: doublePrecision(),
	userId: integer().references(() => users.id),
})
```

By running the seeding script above you will see a warning

__

```
Column 'userId' in 'bloodPressure' table will be filled with Null values
because you specified neither a table for foreign key on column 'userId' 
nor a function for 'userId' column in refinements.
```

What does it mean?

This means you neither provided the `users` table to the `seed` function schema nor refined the `userId` column generator. As a result, the `userId` column will be filled with Null values.

Then you will have two choices:

- If you’re okay with filling the `userId` column with Null values, you can ignore the warning;
- Otherwise, you can refine the `userId` column generator.

## Refining the `userId` column generator [](#refining-the-userid-column-generator)

Doing so requires the `users` table to already have IDs such as 1 and 2 in the database.

index.ts

__

```
import { bloodPressure } from './schema.ts';

async function main() {
  const db = drizzle(...);
  await seed(db, { bloodPressure }).refine((funcs) => ({
    bloodPressure: {
      columns: {
        userId: funcs.valuesFromArray({ values: [1, 2] })
      }
    }
  }));
}
main();
```