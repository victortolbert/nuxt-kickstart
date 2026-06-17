Drizzle ORM - Query Data

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

 Schema Relations Database connection Query Data

[Why SQL-like?](#why-sql-like) [Why not SQL-like?](#why-not-sql-like) [Advanced](#advanced)

Migrations

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

# Drizzle Queries + CRUD

This guide assumes familiarity with:

- How to define your schema - Schema Fundamentals
- How to connect to the database - Connection Fundamentals

Drizzle gives you a few ways for querying your database and it’s up to you to decide which one you’ll need in your next project. It can be either SQL-like syntax or Relational Syntax. Let’s check them:

## Why SQL-like? [](#why-sql-like)

**If you know SQL, you know Drizzle.**

Other ORMs and data frameworks tend to deviate from or abstract away SQL, leading to a double learning curve: you need to learn both SQL and the framework’s API.

Drizzle is the opposite. We embrace SQL and built Drizzle to be SQL-like at its core, so you have little to no learning curve and full access to the power of SQL.

__

```
// Access your data
await db
  .select()
	.from(posts)
	.leftJoin(comments, eq(posts.id, comments.post_id))
	.where(eq(posts.id, 10))
```

__

```
SELECT * 
FROM posts
LEFT JOIN comments ON posts.id = comments.post_id
WHERE posts.id = 10
```

With SQL-like syntax, you can replicate much of what you can do with pure SQL and know exactly what Drizzle will do and what query will be generated. You can perform a wide range of queries, including select, insert, update, delete, as well as using aliases, WITH clauses, subqueries, prepared statements, and more. Let’s look at more examples

insert

update

delete

__

```
await db.insert(users).values({ email: ' [\[email protected\]](https://orm.drizzle.team/cdn-cgi/l/email-protection)' })
```

__

```
INSERT INTO users (email) VALUES (' [\[email protected\]](https://orm.drizzle.team/cdn-cgi/l/email-protection)')
```

__

```
await db.update(users)
        .set({ email: ' [\[email protected\]](https://orm.drizzle.team/cdn-cgi/l/email-protection)' })
        .where(eq(users.id, 1))
```

__

```
UPDATE users 
SET email = ' [\[email protected\]](https://orm.drizzle.team/cdn-cgi/l/email-protection)'
WHERE users.id = 1
```

__

```
await db.delete(users).where(eq(users.id, 1))
```

__

```
DELETE FROM users WHERE users.id = 1
```

## Why not SQL-like? [](#why-not-sql-like)

We’re always striving for a perfectly balanced solution. While SQL-like queries cover 100% of your needs, there are certain common scenarios where data can be queried more efficiently.

We’ve built the Queries API so you can fetch relational, nested data from the database in the most convenient and performant way, without worrying about joins or data mapping.

**Drizzle always outputs exactly one SQL query**. Feel free to use it with serverless databases, and never worry about performance or roundtrip costs!

__

```
const result = await db.query.users.findMany({
	with: {
		posts: true
	},
});
```

## Advanced [](#advanced)

With Drizzle, queries can be composed and partitioned in any way you want. You can compose filters independently from the main query, separate subqueries or conditional statements, and much more. Let’s check a few advanced examples:

#### Compose a WHERE statement and then use it in a query [](#compose-a-where-statement-and-then-use-it-in-a-query)

__

```
async function getProductsBy({
  name,
  category,
  maxPrice,
}: {
  name?: string;
  category?: string;
  maxPrice?: string;
}) {
  const filters: SQL[] = [];

  if (name) filters.push(ilike(products.name, name));
  if (category) filters.push(eq(products.category, category));
  if (maxPrice) filters.push(lte(products.price, maxPrice));

  return db
    .select()
    .from(products)
    .where(and(...filters));
}
```

#### Separate subqueries into different variables, and then use them in the main query [](#separate-subqueries-into-different-variables-and-then-use-them-in-the-main-query)

__

```
const subquery = db
	.select()
	.from(internalStaff)
	.leftJoin(customUser, eq(internalStaff.userId, customUser.id))
	.as('internal_staff');

const mainQuery = await db
	.select()
	.from(ticket)
	.leftJoin(subquery, eq(subquery.internal_staff.userId, ticket.staffId));
```

#### What’s next? [](#whats-next)

**Access your data**

Query  Select  Insert  Update  Delete  Filters  Joins  sql`` operator

**Zero to Hero**

Migrations