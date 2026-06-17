Drizzle ORM - DrizzleORM v0.29.4 release

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

DrizzleORM v0.29.4 release

Feb 22, 2024

## New Features [](#new-features)

###  Neon HTTP Batch [](#-neon-http-batch)

For more info you can check Neon docs and Get started with Neon and Drizzle.

__

```
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { usersTable } from './schema';

const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
const db = drizzle(sql);

const batchResponse: BatchType = await db.batch([
	db.insert(usersTable).values({ id: 1, name: 'John' }).returning({
		id: usersTable.id,
	}),
	db.insert(usersTable).values({ id: 2, name: 'Dan' }),
	db.query.usersTable.findMany({}),
	db.query.usersTable.findFirst({}),
]);
```

__

```
type BatchType = [
	{
		id: number;
	}[],
	NeonHttpQueryResult<never>,
	{
		id: number;
		name: string;
		verified: number;
		invitedBy: number | null;
	}[],
	{
		id: number;
		name: string;
		verified: number;
		invitedBy: number | null;
	} | undefined,
];
```

## Improvements [](#improvements)

Thanks to the `database-js` and `PlanetScale` teams, we have updated the default behavior and instances of `database-js`.

As suggested by the `database-js` core team, you should use the `Client` instance instead of `connect()`:

__

```
import { Client } from '@planetscale/database';
import { drizzle } from 'drizzle-orm/planetscale-serverless';

// create the connection
const client = new Client({
	host: process.env['DATABASE_HOST'],
	username: process.env['DATABASE_USERNAME'],
	password: process.env['DATABASE_PASSWORD'],
});

const db = drizzle(client);
```

> Warning: In this version, there are no breaking changes, but starting from version `0.30.0`, you will encounter an error if you attempt to use anything other than a `Client` instance.
>
> We suggest starting to change connections to PlanetScale now to prevent any runtime errors in the future.

Previously our docs stated to use `connect()` and only this function was can be passed to drizzle. In this realase we are adding support for `new Client()` and deprecating `connect()`, by suggesting from `database-js` team. In this release you will see a `warning` when trying to pass `connect()` function result:

**Warning text**

__

```
Warning: You need to pass an instance of Client:

import { Client } from "@planetscale/database";

const client = new Client({
  host: process.env["DATABASE_HOST"],
  username: process.env["DATABASE_USERNAME"],
  password: process.env["DATABASE_PASSWORD"],
});

const db = drizzle(client);

Starting from version 0.30.0, you will encounter an error if you attempt to use anything other than a Client instance.

Please make the necessary changes now to prevent any runtime errors in the future
```