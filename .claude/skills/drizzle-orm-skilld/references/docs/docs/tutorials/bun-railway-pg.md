Drizzle ORM - Drizzle with Bun and PostgreSQL on Railway

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

# Drizzle with Bun and PostgreSQL on Railway

This tutorial demonstrates how to use Drizzle ORM with Bun runtime and a PostgreSQL database, all deployed on Railway.

This guide assumes familiarity with:

- You should have Bun installed. You can install it by following the official guide.
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

- You should have installed the `pg` package as the PostgreSQL driver.

npm

yarn

pnpm

bun

__

```
npm i pg
npm i -D @types/pg
```

__

```
yarn add pg
yarn add -D @types/pg
```

__

```
pnpm add pg
pnpm add -D @types/pg
```

__

```
bun add pg
bun add -D @types/pg
```

- You should have a Railway account.

## Setup Railway and Drizzle ORM [](#setup-railway-and-drizzle-orm)

#### Create a Railway project [](#create-a-railway-project)

Log in to your Railway dashboard and click the `New Project` button.



#### Provision a PostgreSQL database [](#provision-a-postgresql-database)

On the project canvas, click the `New` button in the top right corner and select `Database` → `PostgreSQL`. You can also use the command palette (`Cmd/Ctrl + K`) and search for PostgreSQL. Railway will provision a new PostgreSQL instance for you.



#### Get your connection string [](#get-your-connection-string)

Click on the PostgreSQL service in your project, go to the `Variables` tab, and find the `DATABASE_PUBLIC_URL` variable. Copy the value — it should look similar to this:

__

```
postgresql://postgres: [\[email protected\]](https://orm.drizzle.team/cdn-cgi/l/email-protection):port/railway
```



IMPORTANT

Railway provides two types of database connection URLs:

- **Public URL** — accessible from anywhere (your local machine, external services). Uses a TCP proxy and looks like `postgresql://postgres: [\[email protected\]](https://orm.drizzle.team/cdn-cgi/l/email-protection):port/railway`.
- **Private URL** — only accessible from services within the same Railway project via internal networking. Uses `*.railway.internal` hostname.

For **local development** (like running `drizzle-kit push` or `drizzle-kit studio`), you must use the **public URL**. The private `*.railway.internal` hostname will not resolve from your local machine.

#### Setup connection string variable [](#setup-connection-string-variable)

Create a `.env` file in the root of your project and add the `DATABASE_URL` environment variable. Use the **public** connection string from Railway:

__

```
DATABASE_URL=postgresql://postgres: [\[email protected\]](https://orm.drizzle.team/cdn-cgi/l/email-protection):port/railway
```

This `.env` file is for local development only. When deploying to Railway, you will configure the `DATABASE_URL` environment variable separately in the Railway dashboard using a service reference variable.

#### Connect Drizzle ORM to your database [](#connect-drizzle-orm-to-your-database)

Create a `db.ts` file and set up your database configuration:

_src/db.ts_

```
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(process.env.DATABASE_URL!);
```

#### Create tables [](#create-tables)

Create a `schema.ts` file and declare your tables:

_src/schema.ts_

```
import * as p from "drizzle-orm/pg-core";

export const usersTable = p.pgTable("users", {
  id: p.serial().primaryKey(),
  name: p.text().notNull(),
  age: p.integer().notNull(),
  email: p.text().notNull().unique(),
});

export const postsTable = p.pgTable("posts", {
  id: p.serial().primaryKey(),
  title: p.text().notNull(),
  content: p.text().notNull(),
  userId: p
    .integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: p.timestamp().notNull().defaultNow(),
  updatedAt: p
    .timestamp()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;
```

#### Setup Drizzle config file [](#setup-drizzle-config-file)

**Drizzle config** - a configuration file that is used by Drizzle Kit and contains all the information about your database connection, migration folder and schema files.

Create a `drizzle.config.ts` file in the root of your project and add the following content:

_drizzle.config.ts_

```
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

#### Applying changes to the database [](#applying-changes-to-the-database)

You can generate migrations using `drizzle-kit generate` command and then run them using the `drizzle-kit migrate` command.

Generate migrations:

__

```
bunx drizzle-kit generate
```

The `generate` command only creates migration SQL files based on your schema — it does **not** apply any changes to the database. These migrations are stored in the `migrations` directory, as specified in your `drizzle.config.ts`. This directory will contain the SQL files necessary to update your database schema and a `meta` folder for storing snapshots of the schema at different migration stages.

Example of a generated migration:

__

```
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"userId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"age" integer NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
```

Apply the generated migrations to the database:

__

```
bunx drizzle-kit migrate
```

In this tutorial, migrations are applied automatically on application startup using `migrate()` from `drizzle-orm/node-postgres/migrator`. You can also apply them manually with `drizzle-kit migrate` for local testing.

Alternatively, you can push changes directly to the database using Drizzle kit push command:

__

```
bunx drizzle-kit push
```

IMPORTANT

Push command is good for rapid prototyping in local development, allowing fast iterations without managing migration files. For production deployments, prefer the `generate` + `migrate` workflow to keep a versioned history of schema changes.

## Basic file structure [](#basic-file-structure)

This is the basic file structure of the project. In the `src` directory, we have database-related files including connection in `db.ts` and schema definitions in `schema.ts`.

__

```
📦 <project root>
 ├ 📂 src
 │  ├ 📜 db.ts
 │  ├ 📜 schema.ts
 │  └ 📜 index.ts
 ├ 📂 migrations
 │  ├ 📂 meta
 │  │  ├ 📜 _journal.json
 │  │  └ 📜 0000_snapshot.json
 │  └ 📜 0000_whole_nomad.sql
 ├ 📜 .env
 ├ 📜 drizzle.config.ts
 ├ 📜 package.json
 └ 📜 tsconfig.json
```

## Deploy the App to Railway [](#deploy-the-app-to-railway)

#### Prepare your project for deployment [](#prepare-your-project-for-deployment)

Once you’ve [generated your migrations](#applying-changes-to-the-database), commit the `migrations` directory to your repository — these files will be applied automatically when your app starts.

Create an `index.ts` file as the entry point for your application. This example runs migrations on startup and then starts a simple HTTP server using Bun:

_src/index.ts_

```
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { usersTable } from "./schema";

const db = drizzle(process.env.DATABASE_URL!);

await migrate(db, { migrationsFolder: "./migrations" });

const server = Bun.serve({
  port: process.env.PORT || 3000,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/users") {
      const users = await db.select().from(usersTable);
      return new Response(JSON.stringify(users), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("OK");
  },
});

console.log(\`Server running on port ${server.port}\`);
```

The `migrate()` function reads the SQL files from your `migrations` directory and applies any unapplied migrations to the database. It is safe to run on every startup — already applied migrations are skipped.

Make sure your `package.json` has a start script:

_package.json_

```
{
  "scripts": {
    "start": "bun src/index.ts"
  }
}
```

#### Push your project to GitHub [](#push-your-project-to-github)

Railway deploys from a GitHub repository. Initialize a git repository and push your code:

__

```
git init
git add .
git commit -m "initial commit"
```

Create a new repository on GitHub and push your code to it.

#### Connect your GitHub repository to Railway [](#connect-your-github-repository-to-railway)

In your Railway project, click the `New` button in the top right corner of the canvas and select `GitHub Repo`. Connect your GitHub account if prompted, then select the repository you just pushed.





#### Configure environment variables [](#configure-environment-variables)

In the deployed service settings, go to the `Variables` tab. Add the `DATABASE_URL` variable by referencing the PostgreSQL service variable:

Click `Add Variable`, set the name to `DATABASE_URL`, and use the Railway variable reference `${{Postgres.DATABASE_URL}}` as the value.

The `${{Postgres.DATABASE_URL}}` reference variable automatically resolves to the **private** internal connection string at runtime, which is optimal for service-to-service communication within Railway. This is different from the public URL you use in your local `.env` file.



#### Deploy [](#deploy)

Railway will automatically deploy your application when you push to the connected branch. You can monitor the deployment in the `Deployments` tab.



#### Verify your setup [](#verify-your-setup)

Once deployed, navigate to the `Architecture` tab in your Railway project. You should see your application service connected to the PostgreSQL database.



Alternative: Zero-downtime migrations

This tutorial applies migrations at application startup using `migrate()`. This is the simplest approach and works well for most applications.

If you need **zero-downtime deployments**, you may want to run migrations as a **separate step** before the new version of your app starts receiving traffic. This way you can rollback the application independently from the database changes.

On Railway, you can achieve this using a pre-deploy command — it runs between the build and deploy phases, has access to your private network and environment variables, and if it fails, the deployment will not proceed.

In your service settings, scroll down to the **Deploy** section and click **Add pre-deploy step**:



Enter the following command:

__

```
bunx drizzle-kit migrate
```

With this approach, remove the `await migrate(db, { migrationsFolder: "./migrations" })` call from your `index.ts` — migrations are handled by the pre-deploy command instead.

For more details, see the Drizzle migrations fundamentals page.

## Deploy Drizzle Studio to Railway [](#deploy-drizzle-studio-to-railway)

You can deploy Drizzle Studio alongside your application on Railway to browse and manage your database directly from the browser. You can use the Drizzle Studio Railway template or follow the steps below.

#### Add a new service from a template [](#add-a-new-service-from-a-template)

In your Railway project, click the `New` button in the top right corner of the canvas and select `Template`.



#### Select the Drizzle Studio template [](#select-the-drizzle-studio-template)

Search for `drizzle studio` and select the **Drizzle Studio** template by Drizzle.



#### Configure environment variables and deploy [](#configure-environment-variables-and-deploy)

The template comes with two pre-configured environment variables:

- `PASSCODE` - the password for secure access to your Studio instance. It defaults to `${{secret()}}`, which generates a random secret.
- `DATABASE_URL` - the database connection string. Set it to `${{Postgres.DATABASE_URL}}` to reference your existing PostgreSQL service.

Click `Deploy Template` to deploy.



#### Find your Drizzle Studio URL [](#find-your-drizzle-studio-url)

Once deployed, click on the Drizzle Studio service in your project, go to the `Settings` tab, and scroll down to the `Networking` section. You will find your public domain under **Public Networking**.



#### Browse your database with Drizzle Studio [](#browse-your-database-with-drizzle-studio)

Open the Drizzle Studio URL in your browser. You should see your database tables and can browse, filter, and edit data directly.



#### Verify your setup [](#verify-your-setup-1)

Navigate to the `Architecture` tab in your Railway project. You should now see three services: your application, the PostgreSQL database, and Drizzle Studio.

