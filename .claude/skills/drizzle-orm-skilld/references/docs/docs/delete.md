Drizzle ORM - Delete

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

 Query Select Insert Update Delete

[Limit](#limit) [Order By](#order-by) [Returning](#returning) [Output](#output) [WITH DELETE clause](#with-delete-clause)

Filters Utils Joins Magic sql`` operator

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

# SQL Delete

You can delete all rows in the table:

__

```
await db.delete(users);
```

And you can delete with filters and conditions:

__

```
await db.delete(users).where(eq(users.name, 'Dan'));
```

### Limit [](#limit)

PostgreSQL

MySQL

SQLite

SingleStore

MSSQL

CockroachDB

Use `.limit()` to add `limit` clause to the query - for example:

__

```
await db.delete(users).where(eq(users.name, 'Dan')).limit(2);
```

__

```
delete from "users" where "users"."name" = $1 limit $2;
```

### Order By [](#order-by)

Use `.orderBy()` to add `order by` clause to the query, sorting the results by the specified fields:

__

```
import { asc, desc } from 'drizzle-orm';

await db.delete(users).where(eq(users.name, 'Dan')).orderBy(users.name);
await db.delete(users).where(eq(users.name, 'Dan')).orderBy(desc(users.name));

// order by multiple fields
await db.delete(users).where(eq(users.name, 'Dan')).orderBy(users.name, users.name2);
await db.delete(users).where(eq(users.name, 'Dan')).orderBy(asc(users.name), desc(users.name2));
```

__

```
delete from "users" where "users"."name" = $1 order by "name";
delete from "users" where "users"."name" = $1 order by "name" desc;

delete from "users" where "users"."name" = $1 order by "name", "name2";
delete from "users" where "users"."name" = $1 order by "name" asc, "name2" desc;
```

### Returning [](#returning)

PostgreSQL

SQLite

MySQL

SingleStore

MSSQL

CockroachDB

You can delete a row and get it back in PostgreSQL and SQLite:

__

```
const deletedUser = await db.delete(users)
  .where(eq(users.name, 'Dan'))
  .returning();

// partial return
const deletedUserIds: { deletedId: number }[] = await db.delete(users)
  .where(eq(users.name, 'Dan'))
  .returning({ deletedId: users.id });
```

## Output [](#output)

MSSQL

You can insert a row and get it back in PostgreSQL and SQLite like such:

__

```
await db.insert(users).values({ name: "Dan" }).output();

// partial return
await db.insert(users).values({ name: "Partial Dan" }).output({ insertedId: users.id });
```

## WITH DELETE clause [](#with-delete-clause)

Check how to use WITH statement with select, insert, update

Using the `with` clause can help you simplify complex queries by splitting them into smaller subqueries called common table expressions (CTEs):

__

```
const averageAmount = db.$with('average_amount').as(
  db.select({ value: sql\`avg(${orders.amount})\`.as('value') }).from(orders)
);

const result = await db
	.with(averageAmount)
	.delete(orders)
	.where(gt(orders.amount, sql\`(select * from ${averageAmount})\`))
	.returning({
		id: orders.id
	});
```

__

```
with "average_amount" as (select avg("amount") as "value" from "orders") 
delete from "orders" 
where "orders"."amount" > (select * from "average_amount") 
returning "id"
```