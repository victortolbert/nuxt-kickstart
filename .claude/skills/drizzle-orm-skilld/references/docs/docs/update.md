Drizzle ORM - Update

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

 Query Select Insert Update

[Limit](#limit) [Order By](#order-by) [Returning](#returning) [Output](#output) [with update clause](#with-update-clause) [Update … from](#update--from)

Delete Filters Utils Joins Magic sql`` operator

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

# SQL Update

__

```
await db.update(users)
  .set({ name: 'Mr. Dan' })
  .where(eq(users.name, 'Dan'));
```

The object that you pass to `update` should have keys that match column names in your database schema. Values of `undefined` are ignored in the object: to set a column to `null`, pass `null`. You can pass SQL as a value to be used in the update object, like this:

__

```
await db.update(users)
  .set({ updatedAt: sql\`NOW()\` })
  .where(eq(users.name, 'Dan'));
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
await db.update(usersTable).set({ verified: true }).limit(2);
```

__

```
update "users" set "verified" = $1 limit $2;
```

### Order By [](#order-by)

Use `.orderBy()` to add `order by` clause to the query, sorting the results by the specified fields:

__

```
import { asc, desc } from 'drizzle-orm';

await db.update(usersTable).set({ verified: true }).orderBy(usersTable.name);
await db.update(usersTable).set({ verified: true }).orderBy(desc(usersTable.name));

// order by multiple fields
await db.update(usersTable).set({ verified: true }).orderBy(usersTable.name, usersTable.name2);
await db.update(usersTable).set({ verified: true }).orderBy(asc(usersTable.name), desc(usersTable.name2));
```

__

```
update "users" set "verified" = $1 order by "name";
update "users" set "verified" = $1 order by "name" desc;

update "users" set "verified" = $1 order by "name", "name2";
update "users" set "verified" = $1 order by "name" asc, "name2" desc;
```

### Returning [](#returning)

PostgreSQL

SQLite

MySQL

SingleStore

MSSQL

CockroachDB

You can update a row and get it back in PostgreSQL and SQLite:

__

```
const updatedUserId: { updatedId: number }[] = await db.update(users)
  .set({ name: 'Mr. Dan' })
  .where(eq(users.name, 'Dan'))
  .returning({ updatedId: users.id });
```

### Output [](#output)

MSSQL

You can update a row and get back the row before updated and after:

__

```
type User = typeof users.$inferSelect;

const updatedUserId: User[] = await db.update(users)
  .set({ name: 'Mr. Dan' })
  .where(eq(users.name, 'Dan'))
  .output();
```

To return partial users after update:

__

```
const updatedUserId: { inserted: { updatedId: number }}[] = await db.update(users)
  .set({ name: 'Mr. Dan' })
  .where(eq(users.name, 'Dan'))
  .output({ inserted: { updatedId: users.id }});
```

To return rows that were in database before update:

__

```
type User = typeof users.$inferSelect;

const updatedUserId: { deleted: User }[] = await db.update(users)
  .set({ name: 'Mr. Dan' })
  .where(eq(users.name, 'Dan'))
  .output({ deleted: true });
```

To return both previous and new version on a row:

__

```
type User = typeof users.$inferSelect;

const updatedUserId: { deleted: User, inserted: User }[] = await db.update(users)
  .set({ name: 'Mr. Dan' })
  .where(eq(users.name, 'Dan'))
  .output({ deleted: true, inserted: true });
```

## `with update` clause [](#with-update-clause)

Check how to use WITH statement with select, insert, delete

Using the `with` clause can help you simplify complex queries by splitting them into smaller subqueries called common table expressions (CTEs):

__

```
const averagePrice = db.$with('average_price').as(
        db.select({ value: sql\`avg(${products.price})\`.as('value') }).from(products)
);

const result = await db.with(averagePrice)
		.update(products)
		.set({
			cheap: true
		})
		.where(lt(products.price, sql\`(select * from ${averagePrice})\`))
		.returning({
			id: products.id
		});
```

__

```
with "average_price" as (select avg("price") as "value" from "products") 
update "products" set "cheap" = $1 
where "products"."price" < (select * from "average_price") 
returning "id"
```

## Update … from [](#update--from)

PostgreSQL

MySQL

SQLite

SingleStore

MSSQL

CockroachDB

As the SQLite documentation mentions:

> The UPDATE-FROM idea is an extension to SQL that allows an UPDATE statement to be driven by other tables in the database. The “target” table is the specific table that is being updated. With UPDATE-FROM you can join the target table against other tables in the database in order to help compute which rows need updating and what the new values should be on those rows

Similarly, the PostgreSQL documentation states:

> A table expression allowing columns from other tables to appear in the WHERE condition and update expressions

Drizzle also supports this feature starting from version `[\[email protected\]](https://orm.drizzle.team/cdn-cgi/l/email-protection)`

__

```
await db
  .update(users)
  .set({ cityId: cities.id })
  .from(cities)
  .where(and(eq(cities.name, 'Seattle'), eq(users.name, 'John')))
```

__

```
update "users" set "city_id" = "cities"."id" 
from "cities" 
where ("cities"."name" = $1 and "users"."name" = $2)

-- params: [ 'Seattle', 'John' ]
```

You can also alias tables that are joined (in PG, you can also alias the updating table too).

__

```
const c = alias(cities, 'c');
await db
  .update(users)
  .set({ cityId: c.id })
  .from(c);
```

__

```
update "users" set "city_id" = "c"."id" 
from "cities" "c"
```

PostgreSQL

MySQL

SQLite

SingleStore

MSSQL

CockroachDB

In Postgres, you can also return columns from the joined tables.

__

```
const updatedUsers = await db
  .update(users)
  .set({ cityId: cities.id })
  .from(cities)
  .returning({ id: users.id, cityName: cities.name });
```

__

```
update "users" set "city_id" = "cities"."id" 
from "cities" 
returning "users"."id", "cities"."name"
```