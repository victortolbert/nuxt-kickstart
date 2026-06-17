Drizzle ORM - Insert

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

 Query Select Insert

[returning](#returning) [$returningId](#returningid) [output](#output) [Insert multiple rows](#insert-multiple-rows) [Upserts and conflicts](#upserts-and-conflicts) [On conflict do nothing](#on-conflict-do-nothing) [On conflict do update](#on-conflict-do-update) [On duplicate key update](#on-duplicate-key-update) [with insert clause](#with-insert-clause) [Insert into … select](#insert-into--select)

Update Delete Filters Utils Joins Magic sql`` operator

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

# SQL Insert

Drizzle ORM provides you the most SQL-like way to insert rows into the database tables.

Inserting data with Drizzle is extremely straightforward and sql-like. See for yourself:

__

```
await db.insert(users).values({ name: 'Andrew' });
```

__

```
insert into "users" ("name") values ("Andrew");
```

If you need insert type for a particular table you can use `typeof usersTable.$inferInsert` syntax.

__

```
type NewUser = typeof users.$inferInsert;

const insertUser = async (user: NewUser) => {
  return db.insert(users).values(user);
}

const newUser: NewUser = { name: "Alef" };
await insertUser(newUser);
```

## returning [](#returning)

PostgreSQL

SQLite

MySQL

SingleStore

MSSQL

CockroachDB

You can insert a row and get it back in PostgreSQL and SQLite like such:

__

```
await db.insert(users).values({ name: "Dan" }).returning();

// partial return
await db.insert(users).values({ name: "Partial Dan" }).returning({ insertedId: users.id });
```

## $returningId [](#returningid)

PostgreSQL

SQLite

MySQL

SingleStore

MSSQL

CockroachDB

MySQL itself doesn’t have native support for `RETURNING` after using `INSERT`. There is only one way to do it for `primary keys` with `autoincrement` (or `serial`) types, where you can access `insertId` and `affectedRows` fields. We’ve prepared an automatic way for you to handle such cases with Drizzle and automatically receive all inserted IDs as separate objects

__

```
import { boolean, int, text, mysqlTable } from 'drizzle-orm/mysql-core';

const usersTable = mysqlTable('users', {
  id: int('id').primaryKey(),
  name: text('name').notNull(),
  verified: boolean('verified').notNull().default(false),
});


const result = await db.insert(usersTable).values([{ name: 'John' }, { name: 'John1' }]).$returningId();
//    ^? { id: number }[]
```

Also with Drizzle, you can specify a `primary key` with `$default` function that will generate custom primary keys at runtime. We will also return those generated keys for you in the `$returningId()` call

__

```
import { varchar, text, mysqlTable } from 'drizzle-orm/mysql-core';
import { createId } from '@paralleldrive/cuid2';

const usersTableDefFn = mysqlTable('users_default_fn', {
  customId: varchar('id', { length: 256 }).primaryKey().$defaultFn(createId),
  name: text('name').notNull(),
});


const result = await db.insert(usersTableDefFn).values([{ name: 'John' }, { name: 'John1' }]).$returningId();
//  ^? { customId: string }[]
```

> If there is no primary keys -> type will be `{}[]` for such queries
## output [](#output)

MSSQL

You can insert a row and get it back in PostgreSQL and SQLite like such:

__

```
await db.insert(users).values({ name: "Dan" }).output();

// partial return
await db.insert(users).values({ name: "Partial Dan" }).output({ insertedId: users.id });
```

## Insert multiple rows [](#insert-multiple-rows)

__

```
await db.insert(users).values([{ name: 'Andrew' }, { name: 'Dan' }]);
```

## Upserts and conflicts [](#upserts-and-conflicts)

Drizzle ORM provides simple interfaces for handling upserts and conflicts.

### On conflict do nothing [](#on-conflict-do-nothing)

PostgreSQL

SQLite

MySQL

SingleStore

CockroachDB

`onConflictDoNothing` will cancel the insert if there’s a conflict:

__

```
await db.insert(users)
  .values({ id: 1, name: 'John' })
  .onConflictDoNothing();

// explicitly specify conflict target
await db.insert(users)
  .values({ id: 1, name: 'John' })
  .onConflictDoNothing({ target: users.id });
```

### On conflict do update [](#on-conflict-do-update)

PostgreSQL

SQLite

MySQL

`onConflictDoUpdate` will update the row if there’s a conflict:

__

```
await db.insert(users)
  .values({ id: 1, name: 'Dan' })
  .onConflictDoUpdate({ target: users.id, set: { name: 'John' } });
```

#### `where` clauses [](#where-clauses)

`on conflict do update` can have a `where` clause in two different places - as part of the conflict target (i.e. for partial indexes) or as part of the `update` clause:

__

```
insert into employees (employee_id, name)
values (123, 'John Doe')
on conflict (employee_id) where name <> 'John Doe'
do update set name = excluded.name

insert into employees (employee_id, name)
values (123, 'John Doe')
on conflict (employee_id) do update set name = excluded.name
where name <> 'John Doe';
```

To specify these conditions in Drizzle, you can use `setWhere` and `targetWhere` clauses:

__

```
await db.insert(employees)
  .values({ employeeId: 123, name: 'John Doe' })
  .onConflictDoUpdate({
    target: employees.employeeId,
    targetWhere: sql\`name <> 'John Doe'\`,
    set: { name: sql\`excluded.name\` }
  });

await db.insert(employees)
  .values({ employeeId: 123, name: 'John Doe' })
  .onConflictDoUpdate({
    target: employees.employeeId,
    set: { name: 'John Doe' },
    setWhere: sql\`name <> 'John Doe'\`
  });
```

---

Upsert with composite indexes, or composite primary keys for `onConflictDoUpdate`:

__

```
await db.insert(users)
  .values({ firstName: 'John', lastName: 'Doe' })
  .onConflictDoUpdate({
    target: [users.firstName, users.lastName],
    set: { firstName: 'John1' }
  });
```

### On duplicate key update [](#on-duplicate-key-update)

PostgreSQL

SQLite

MySQL

SingleStore

CockroachDB

MySQL supports `ON DUPLICATE KEY UPDATE` instead of `ON CONFLICT` clauses. MySQL will automatically determine the conflict target based on the primary key and unique indexes, and will update the row if _any_ unique index conflicts.

Drizzle supports this through the `onDuplicateKeyUpdate` method:

__

```
// Note that MySQL automatically determines targets based on the primary key and unique indexes
await db.insert(users)
  .values({ id: 1, name: 'John' })
  .onDuplicateKeyUpdate({ set: { name: 'John' } });
```

While MySQL does not directly support doing nothing on conflict, you can perform a no-op by setting any column’s value to itself and achieve the same effect:

__

```
import { sql } from 'drizzle-orm';

await db.insert(users)
  .values({ id: 1, name: 'John' })
  .onDuplicateKeyUpdate({ set: { id: sql\`id\` } });
```

## `with insert` clause [](#with-insert-clause)

Check how to use WITH statement with select, update, delete

Using the `with` clause can help you simplify complex queries by splitting them into smaller subqueries called common table expressions (CTEs):

__

```
const userCount = db.$with('user_count').as(
	db.select({ value: sql\`count(*)\`.as('value') }).from(users)
);

const result = await db.with(userCount)
	.insert(users)
	.values([
		{ username: 'user1', admin: sql\`((select * from ${userCount}) = 0)\` }
	])
	.returning({
		admin: users.admin
	});
```

__

```
with "user_count" as (select count(*) as "value" from "users") 
insert into "users" ("username", "admin") 
values ($1, ((select * from "user_count") = 0)) 
returning "admin"
```

## Insert into … select [](#insert-into--select)

As the SQLite documentation mentions:

The second form of the INSERT statement contains a SELECT statement instead of a VALUES clause. A new entry is inserted into the table for each row of data returned by executing the SELECT statement. If a column-list is specified, the number of columns in the result of the SELECT must be the same as the number of items in the column-list. Otherwise, if no column-list is specified, the number of columns in the result of the SELECT must be the same as the number of columns in the table. Any SELECT statement, including compound SELECTs and SELECT statements with ORDER BY and/or LIMIT clauses, may be used in an INSERT statement of this form.

IMPORTANT

To avoid a parsing ambiguity, the SELECT statement should always contain a WHERE clause, even if that clause is simply “WHERE true”, if the upsert-clause is present. Without the WHERE clause, the parser does not know if the token “ON” is part of a join constraint on the SELECT, or the beginning of the upsert-clause.

As the PostgreSQL documentation mentions:

A query (SELECT statement) that supplies the rows to be inserted

And as the MySQL documentation mentions:

With INSERT … SELECT, you can quickly insert many rows into a table from the result of a SELECT statement, which can select from one or many tables

Drizzle supports the current syntax for all dialects, and all of them share the same syntax. Let’s review some common scenarios and API usage. There are several ways to use select inside insert statements, allowing you to choose your preferred approach:

- You can pass a query builder inside the select function.
- You can use a query builder inside a callback.
- You can pass an SQL template tag with any custom select query you want to use

Query Builder

Callback

SQL template tag

__

```
const insertedEmployees = await db
  .insert(employees)
  .select(
    db.select({ name: users.name }).from(users).where(eq(users.role, 'employee'))
  )
  .returning({
    id: employees.id,
    name: employees.name
  });
```

__

```
const qb = new QueryBuilder();
await db.insert(employees).select(
    qb.select({ name: users.name }).from(users).where(eq(users.role, 'employee'))
);
```

__

```
await db.insert(employees).select(
    () => db.select({ name: users.name }).from(users).where(eq(users.role, 'employee'))
);
```

__

```
await db.insert(employees).select(
    (qb) => qb.select({ name: users.name }).from(users).where(eq(users.role, 'employee'))
);
```

__

```
await db.insert(employees).select(
    sql\`select "users"."name" as "name" from "users" where "users"."role" = 'employee'\`
);
```

__

```
await db.insert(employees).select(
    () => sql\`select "users"."name" as "name" from "users" where "users"."role" = 'employee'\`
);
```