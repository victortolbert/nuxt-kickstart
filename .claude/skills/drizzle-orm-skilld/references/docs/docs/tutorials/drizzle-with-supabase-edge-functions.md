Drizzle ORM - Drizzle with Supabase Edge Functions

We've merged alternation-engine into Beta release. Try it out!

 Documentation

33k+ 

Dark

System

meet drizzle

Get started Sustainability Why Drizzle? Guides Tutorials

Latest releases Gotchas

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

# Drizzle with Supabase Edge Functions

This tutorial demonstrates how to use Drizzle ORM with Supabase Edge Functions.

This guide assumes familiarity with:

- You should have the latest version of Supabase CLI installed.
- You should have installed Drizzle ORM and Drizzle kit. You can do this by running the following command:

npm

yarn

pnpm

bun

__

```
npm i drizzle-orm
npm i -D drizzle-kit
```

__

```
yarn add drizzle-orm
yarn add -D drizzle-kit
```

__

```
pnpm add drizzle-orm
pnpm add -D drizzle-kit
```

__

```
bun add drizzle-orm
bun add -D drizzle-kit
```

- You should have installed Docker Desktop. It is a prerequisite for local development. Follow the official docs to install.

To learn how to create a basic Edge Function on your local machine and then deploy it, see the Edge Functions Quickstart.

#### Create a table [](#create-a-table)

Create a `schema.ts` file in your `src` directory and declare a table schema:

_src/schema.ts_

```
import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull()
})
```

This file will be used to generate migrations for your database.

#### Setup Drizzle config file [](#setup-drizzle-config-file)

**Drizzle config** - a configuration file that is used by Drizzle Kit and contains all the information about your database connection, migration folder and schema files.

Create a `drizzle.config.ts` file in the root of your project and add the following content:

_drizzle.config.ts_

```
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./supabase/migrations",
  dialect: "postgresql",
});
```

In this tutorial we will use Drizzle kit to generate migrations for our schema.

#### Initialize a new Supabase project [](#initialize-a-new-supabase-project)

Create a new Supabase project in a folder on your local machine:

__

```
supabase init
```

It will create `supabase` folder with `config.toml` file:

__

```
└── supabase
    └── config.toml
```

If you are using Visual Studio Code, follow the Supabase documentation to setup settings for Deno.

#### Generate migrations [](#generate-migrations)

Run the `drizzle-kit generate` command to generate migrations:

__

```
npx drizzle-kit generate
```

It will create a new migration file in the `supabase/migrations` directory:

#### Apply migrations [](#apply-migrations)

To start the Supabase local development stack, run the following command:

__

```
supabase start
```

To apply migrations, run the following command:

__

```
supabase migration up
```

You can read more about Supabase migrations in the documentation.

IMPORTANT

Don’t forget to run Docker

Alternatively, you can apply migrations using the `drizzle-kit migrate` command. Learn more about this migration process in the documentation.

#### Create a new Edge Function [](#create-a-new-edge-function)

Run the `supabase functions new [FUNCTION_NAME]` command to create a new Edge Function:

__

```
supabase functions new drizzle-tutorial
```

It will create a new folder with the function name in the `supabase/functions` directory:

__

```
└── supabase
    └── functions
    │   └── drizzle-tutorial
    │   │   ├── .npmrc ## Function-specific npm configuration (if needed)
    │   │   ├── deno.json ## Function-specific Deno configuration
    │   │   └── index.ts ## Your function code
```

When you create a new Edge Function, it will use TypeScript by default. However, it is possible write Edge Function in JavaScript. Learn more about it in the documentation.

#### Setup imports [](#setup-imports)

Add the following imports to the `deno.json` file in the `supabase/functions/drizzle-tutorial` directory:

_supabase/functions/drizzle-tutorial/deno.json_

```
{
  "imports": {
    "drizzle-orm/": "npm:/drizzle-orm/",
    "postgres": "npm:postgres"
  }
}
```

You can read more about managing dependencies here.

#### Copy your schema to the functions directory [](#copy-your-schema-to-the-functions-directory)

Copy the code that you will use in your edge function from `src/schema.ts` file to the `supabase/functions/drizzle-tutorial/index.ts` file:

_supabase/functions/drizzle-tutorial/index.ts_

```
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull()
})

Deno.serve(async (req) => {
  const { name } = await req.json()
  const data = {
    message: \`Hello ${name}!\`,
  }

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})
```

IMPORTANT

In the Deno ecosystem, each function should be treated as an independent project with its own set of dependencies and configurations. For these reasons, Supabase recommend maintaining separate configuration files (`deno.json`, `.npmrc`, or `import_map.json`) within each function’s directory, even if it means duplicating some configurations. Read more here.

#### Connect Drizzle ORM to your database [](#connect-drizzle-orm-to-your-database)

Update your edge function code with your database configuration:

_supabase/functions/drizzle-tutorial/index.ts_

```
// Setup type definitions for built-in Supabase Runtime APIs
import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/postgres-js";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import postgres from "postgres";

const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull()
})

Deno.serve(async () => {
  const connectionString = Deno.env.get("SUPABASE_DB_URL")!;

  // Disable prefetch as it is not supported for "Transaction" pool mode
  const client = postgres(connectionString, { prepare: false });
  const db = drizzle({ client });

  await db.insert(usersTable).values({
    name: "Alice",
    age: 25
  })
  const data = await db.select().from(usersTable);

  return new Response(
    JSON.stringify(data)
  )
})
```

`SUPABASE_DB_URL` is default environment variable for the direct database connection. Learn more about managing environment variables in Supabase Edge Functions in the documentation.

#### Test your code locally [](#test-your-code-locally)

Run the following command to test your function locally:

__

```
supabase functions serve --no-verify-jwt
```

Navigate to the route `(e.g. /drizzle-tutorial)` in your browser:

__

```
[
  {
    "id": 1,
    "name": "Alice",
    "age": 25
  }
]
```

#### Link your local project to a hosted Supabase project [](#link-your-local-project-to-a-hosted-supabase-project)

You can create new Supabase project in the dashboard or by following this link.

Copy the `Reference ID` from project settings and use it to link your local development project to a hosted Supabase project by running the following command:

__

```
supabase link --project-ref=<REFERENCE_ID>
```

Push your schema changes to the hosted Supabase project by running the following command:

__

```
supabase db push
```

#### Setup environment variables [](#setup-environment-variables)

You can find `Project connect details` by clicking **Connect** in the top bar of the dashboard and copy the URI from the `Transaction pooler` section. Remember to replace the password placeholder with your actual database password.

Read more about Connection Pooler in the documentation.

Update your edge function code to use the `DATABASE_URL` environment variable instead of `SUPABASE_DB_URL`:

_supabase/functions/drizzle-tutorial/index.ts_

```
// imports

// const connectionString = Deno.env.get("SUPABASE_DB_URL")!;
const connectionString = Deno.env.get("DATABASE_URL")!;

// code
```

Run the following command to set the environment variable:

__

```
supabase secrets set DATABASE_URL=<CONNECTION_STRING>
```

Learn more about managing environment variables in Supabase Edge Functions in the documentation.

#### Deploy your function [](#deploy-your-function)

Deploy your function by running the following command:

__

```
supabase functions deploy drizzle-tutorial --no-verify-jwt
```

Finally, you can use URL of the deployed project and navigate to the route you created `(e.g. /drizzle-tutorial)` to access your edge function.