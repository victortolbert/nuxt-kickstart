Drizzle ORM - OP SQLite

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

Expo SQLite OP SQLite

React Native SQLite

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

# Drizzle <> OP SQLite

According to the **official github page**, OP-SQLite embeds the latest version of SQLite and provides a low-level API to execute SQL queries.

npm

yarn

pnpm

bun

__

```
npm i drizzle-orm @op-engineering/op-sqlite
npm i -D drizzle-kit
```

__

```
yarn add drizzle-orm @op-engineering/op-sqlite
yarn add -D drizzle-kit
```

__

```
pnpm add drizzle-orm @op-engineering/op-sqlite
pnpm add -D drizzle-kit
```

__

```
bun add drizzle-orm @op-engineering/op-sqlite
bun add -D drizzle-kit
```

__

```
import { drizzle } from "drizzle-orm/op-sqlite";
import { open } from '@op-engineering/op-sqlite';

const opsqlite = open({
  name: 'myDB',
});
const db = drizzle(opsqlite);

await db.select().from(users);
```

You can use Drizzle Kit for SQL migration generation. Please make sure to check how Drizzle Kit migrations work before proceeding. OP SQLite requires you to have SQL migrations bundled into the app and we’ve got you covered.

#### Install babel plugin [](#install-babel-plugin)

It’s necessary to bundle SQL migration files as string directly to your bundle.

__

```
npm install babel-plugin-inline-import
```

#### Update config files. [](#update-config-files)

You will need to update `babel.config.js`, `metro.config.js` and `drizzle.config.ts` files

_babel.config.js_

```
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'inline-import',
      {
        extensions: ['.sql'],
      },
    ],
  ],
};
```

_metro.config.js_

```
const { getDefaultConfig } = require('@react-native/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('sql');

module.exports = config;
```

Make sure to have `dialect: 'sqlite'` and `driver: 'expo'` in Drizzle Kit config

_drizzle.config.ts_

```
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './db/schema.ts',
	out: './drizzle',
  dialect: 'sqlite',
	driver: 'expo', // <--- very important
});
```

#### Generate migrations [](#generate-migrations)

After creating SQL schema file and drizzle.config.ts file, you can generate migrations

__

```
npx drizzle-kit generate
```

#### Add migrations to your app [](#add-migrations-to-your-app)

Now you need to import `migrations.js` file into your Expo/React Native app from `./drizzle` folder. You can run migrations on application startup using our custom `useMigrations` migrations hook on in `useEffect` hook manually as you want.

_App.tsx_

```
import { drizzle } from "drizzle-orm/op-sqlite";
import { open } from '@op-engineering/op-sqlite';
import { useMigrations } from 'drizzle-orm/op-sqlite/migrator';
import migrations from './drizzle/migrations';

const opsqliteDb = open({
  name: 'myDB',
});

const db = drizzle(opsqliteDb);

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