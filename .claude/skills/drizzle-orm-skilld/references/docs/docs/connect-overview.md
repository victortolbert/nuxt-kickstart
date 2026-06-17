Drizzle ORM - Database connection

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

 Schema Relations Database connection

Query Data Migrations

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

# Database connection with Drizzle

Drizzle ORM runs SQL queries on your database via **database drivers**.

index.ts

schema.ts

__

```
import { drizzle } from "drizzle-orm/node-postgres"
import { users } from "./schema"

const db = drizzle(process.env.DATABASE_URL);
const usersCount = await db.$count(users);
```

__

```
                        ┌──────────────────────┐
                        │   db.$count(users)   │ <--- drizzle query
                        └──────────────────────┘     
                            │               ʌ
select count(*) from users -│               │
                            │               │- [{ count: 0 }]
                            v               │
                         ┌─────────────────────┐
                         │    node-postgres    │ <--- database driver
                         └─────────────────────┘
                            │               ʌ
01101000 01100101 01111001 -│               │
                            │               │- 01110011 01110101 01110000
                            v               │
                         ┌────────────────────┐
                         │      Database      │ 
                         └────────────────────┘
```

__

```
import { pgTable, integer, text } from "drizzle-orm";

export const users = pgTable("users", {
  id: integer("id").generateAlwaysAsIdentity(),
  name: text("name"),
})
```

Under the hood Drizzle will create a **node-postgres** driver instance which you can access via `db.$client` if necessary

__

```
import { drizzle } from "drizzle-orm/node-postgres"

const db = drizzle(process.env.DATABASE_URL);
const pool = db.$client;
```

__

```
// above is equivalent to
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle({ client: pool });
```

Drizzle is by design natively compatible with every **edge** or **serverless** runtime, whenever you’d need access to a serverless database - we’ve got you covered

Neon HTTP

Neon with websockets

Vercel Postgres

PlanetScale HTTP

Cloudflare d1

__

```
import { drizzle } from "drizzle-orm/neon-http";

const db = drizzle(process.env.DATABASE_URL);
```

__

```
import { drizzle } from "drizzle-orm/neon-serverless";

const db = drizzle(process.env.DATABASE_URL);
```

__

```
import { drizzle } from "drizzle-orm/vercel-postgres";

const db = drizzle();
```

__

```
import { drizzle } from "drizzle-orm/planetscale";

const db = drizzle(process.env.DATABASE_URL);
```

__

```
import { drizzle } from "drizzle-orm/d1";

const db = drizzle({ connection: env.DB });
```

And yes, we do support runtime specific drivers like Bun SQLite or Expo SQLite:

__

```
import { drizzle } from "drizzle-orm/bun-sqlite"

const db = drizzle(); // <--- will create an in-memory db
const db = drizzle("./sqlite.db");
```

__

```
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

const expo = openDatabaseSync("db.db");
const db = drizzle(expo);
```

#### Database connection URL [](#database-connection-url)

Just in case if you’re not familiar with database connection URL concept

__

```
postgresql://alex: [\[email protected\]](https://orm.drizzle.team/cdn-cgi/l/email-protection)/dbname
             └──┘ └───────┘ └─────────────────────────────────────────────┘ └────┘
              ʌ    ʌ          ʌ                                              ʌ
        role -│    │          │- hostname                                    │- database
                   │
                   │- password
```

#### Next steps [](#next-steps)

Feel free to check out per-driver documentations

**PostgreSQL drivers**

PostgreSQL  Neon  Vercel Postgres  Supabase  Xata  PGLite

**MySQL drivers**

MySQL  PlanetsScale  TiDB

**SQLite drivers**

SQLite  Turso Cloud  Turso Database  Cloudflare D1  Bun SQLite  SQLite Cloud

**Native SQLite**

Expo SQLite  OP SQLite  React Native SQLite

**Others**

Drizzle Proxy