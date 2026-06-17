Drizzle ORM - DrizzleORM v0.29.2 release

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

DrizzleORM v0.29.2 release

Dec 25, 2023

## Fixes: [](#fixes)

- Added improvements to the planescale relational tests (#1579)
- FIX: correct string escaping for empty PgArrays (#1640)
- Fix wrong syntax for exists fn in sqlite (#1647)
- Properly handle dates in AWS Data API
- Fix Hermes mixins constructor issue

## ESLint Drizzle Plugin, v0.2.3 [](#eslint-drizzle-plugin-v023)

__

```
npm i [\[email protected\]](https://orm.drizzle.team/cdn-cgi/l/email-protection)
```

 [ESLint] Add support for functions and improve error messages

- Allowed Drizzle object to be or to be retrieved from a function, e.g.
- Added better context to the suggestion in the error message.

For more info you can check docs

## New Drivers [](#new-drivers)

** Expo SQLite Driver is available**

For starting with Expo SQLite Driver, you need to install `expo-sqlite` and `drizzle-orm` packages.

__

```
npm install drizzle-orm expo-sqlite@next
```

Then, you can use it like this:

__

```
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

const expoDb = openDatabaseSync("db.db");

const db = drizzle(expoDb);

await db.select().from(...)...

// or

db.select().from(...).then(...);

// or

db.select().from(...).all();
```

If you want to use Drizzle Migrations, you need to update babel and metro configuration files.

1. Install `babel-plugin-inline-import` package.

__

```
npm install babel-plugin-inline-import
```

1. Update `babel.config.js` and `metro.config.js` files.

_babel.config.js_

```
module.exports = function(api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
+   plugins: [["inline-import", { "extensions": [".sql"] }]]
  };
};
```

_metro.config.js_

```
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

+config.resolver.sourceExts.push('sql');

module.exports = config;
```

1. Create `drizzle.config.ts` file in your project root folder.

__

```
import type { Config } from 'drizzle-kit';

export default {
	schema: './db/schema.ts',
	out: './drizzle',
    dialect: 'sqlite',
	driver: 'expo',
} satisfies Config;
```

After creating schema file and drizzle.config.ts file, you can generate migrations like this:

__

```
npx drizzle-kit generate
```

Then you need to import `migrations.js` file in your `App.tsx` file from `./drizzle` folder and use hook `useMigrations` or `migrate` function.

__

```
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './drizzle/migrations';

const expoDb = openDatabaseSync("db.db");

const db = drizzle(expoDb);

export default function App() {
    const { success, error } = useMigrations(db, migrations);

    if (error) {
        return (
            <View>
                <Text>Migration error: {error.message}</Text>
            </View>
        );
    }

    if (!success) {
        return (
            <View>
                <Text>Migration is in progress...</Text>
            </View>
        );
    }

    return ...your application component;
}
```