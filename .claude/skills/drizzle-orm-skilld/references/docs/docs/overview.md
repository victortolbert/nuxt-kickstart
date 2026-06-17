Drizzle ORM - Why Drizzle?

We've merged alternation-engine into Beta release. Try it out!

 Documentation

33k+ 

Dark

System

meet drizzle

Get started Sustainability Why Drizzle?

[Headless ORM?](#headless-orm) [Why SQL-like?](#why-sql-like) [Why not SQL-like?](#why-not-sql-like) [Serverless?](#serverless) [Welcome on board!](#welcome-on-board) [Video Showcase](#video-showcase)

Guides Tutorials Latest releases Gotchas

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

# Drizzle ORM

Drizzle ORM is a headless TypeScript ORM with a head. 

> Drizzle is a good friend who’s there for you when necessary and doesn’t bother when you need some space.

It looks and feels simple, performs on day _1000_ of your project, lets you do things your way, and is there when you need it.

**It’s the only ORM with both relational and SQL-like query APIs**, providing you the best of both worlds when it comes to accessing your relational data. Drizzle is lightweight, performant, typesafe, non-lactose, gluten-free, sober, flexible and **serverless-ready by design**. Drizzle is not just a library, it’s an experience. 



## Headless ORM? [](#headless-orm)

First and foremost, Drizzle is a library and a collection of complementary opt-in tools.

**ORM** stands for _object relational mapping_, and developers tend to call Django-like or Spring-like tools an ORM. We truly believe it’s a misconception based on legacy nomenclature, and we call them **data frameworks**.

WARNING

With data frameworks you have to build projects **around them** and not **with them**.

**Drizzle** lets you build your project the way you want, without interfering with your project or structure.

Using Drizzle you can define and manage database schemas in TypeScript, access your data in a SQL-like or relational way, and take advantage of opt-in tools to push your developer experience _through the roof_. 

## Why SQL-like? [](#why-sql-like)

**If you know SQL, you know Drizzle.**

Other ORMs and data frameworks tend to deviate/abstract you away from SQL, which leads to a double learning curve: needing to know both SQL and the framework’s API.

Drizzle is the opposite. We embrace SQL and built Drizzle to be SQL-like at its core, so you can have zero to no learning curve and access to the full power of SQL.

We bring all the familiar **SQL schema**, **queries**, **automatic migrations** and **one more thing**. 

index.ts

schema.ts

migration.sql

__

```
// Access your data
await db
	.select()
	.from(countries)
	.leftJoin(cities, eq(cities.countryId, countries.id))
	.where(eq(countries.id, 10))
```

__

```
// manage your schema
export const countries = pgTable('countries', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
});

export const cities = pgTable('cities', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  countryId: integer('country_id').references(() => countries.id),
});
```

__

```
-- generate migrations
CREATE TABLE IF NOT EXISTS "countries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256)
);

CREATE TABLE IF NOT EXISTS "cities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"country_id" integer
);

ALTER TABLE "cities" ADD CONSTRAINT "cities_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE no action ON UPDATE no action;
```

## Why not SQL-like? [](#why-not-sql-like)

We’re always striving for a perfectly balanced solution, and while SQL-like does cover 100% of the needs, there are certain common scenarios where you can query data in a better way.

We’ve built the **Queries API** for you, so you can fetch relational nested data from the database in the most convenient and performant way, and never think about joins and data mapping.

**Drizzle always outputs exactly 1 SQL query.** Feel free to use it with serverless databases and never worry about performance or roundtrip costs!

__

```
const result = await db.query.users.findMany({
	with: {
		posts: true
	},
});
```

## Serverless? [](#serverless)

The best part is no part. **Drizzle has exactly 0 dependencies!**



Drizzle ORM is dialect-specific, slim, performant and serverless-ready **by design**.

We’ve spent a lot of time to make sure you have best-in-class SQL dialect support, including Postgres, MySQL, and others.

Drizzle operates natively through industry-standard database drivers. We support all major **PostgreSQL**, **MySQL**, **SQLite** or **SingleStore** drivers out there, and we’re adding new ones **really fast**.

## Welcome on board! [](#welcome-on-board)

More and more companies are adopting Drizzle in production, experiencing immense benefits in both DX and performance.

**We’re always there to help, so don’t hesitate to reach out. We’ll gladly assist you in your Drizzle journey!**

We have an outstanding **Discord community** and welcome all builders to our **Twitter**.

Now go build something awesome with Drizzle and your **PostgreSQL**, **MySQL** or **SQLite** database. 

### Video Showcase [](#video-showcase)

1:37:39 Full Drizzle Course for Beginners Code Genix

56:09 Learn Drizzle In 60 Minutes Web Dev Simplified

2:55 Drizzle ORM in 100 Seconds Fireship

14:00 Learn Drizzle ORM in 13 mins (crash course) Neon

38:08 Easiest Database Setup in Next.js 14 with Turso & Drizzle Sam Meech-Ward

5:46:28 Next.js Project with Vercel, Neon, Drizzle, TailwindCSS, FlowBite and more! CodingEntrepreneurs

5:46 I Have A New Favorite Database Tool Theo - t3.gg

33:52 Drizzle ORM First impressions - migrations, relations, queries! Marius Espejo

9:00 I want to learn Drizzle ORM, so I'm starting another next14 project Web Dev Cody

5:18 Picking an ORM is Getting Harder... Ben Davis

8:49 This New Database Tool is a Game-Changer Josh tried coding

4:23 My Favorite Database Tool Just Got EVEN Better Josh tried coding

11:41:46 SaaS Notion Clone with Realtime cursors, Nextjs 13, Stripe, Drizzle ORM, Tailwind, Supabase, Sockets Web Prodigies

12:18 SvelteKit + Drizzle Code Breakdown Ben Davis

2:01:29 Build a Multi-Tenanted, Role-Based Access Control System TomDoesTech

5:42 The Prisma killer is finally here SST

1:07:41 Learning Drizzle ORM and working on a next14 project Web Dev Cody

6:01 This Trick Makes My Favorite Database Tool Even Better Josh tried coding

26:29 Effortless Auth in Next.js 14: Use Auth.js & Drizzle ORM for Secure Login Sam Meech-Ward