Drizzle ORM - Expo SQLite

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

Expo SQLite

OP SQLite React Native SQLite

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

# Drizzle <> Expo SQLite

According to the **official website**, Expo is an ecosystem of tools to develop, build and ship applications on React Native. It’s powered by Hermes JavaScript runtime and Metro bundler, Drizzle Expo driver is built to natively support both.

Drizzle ORM has the best in class toolkit for Expo SQLite:

- Native ORM driver for Expo SQLite 
- Drizzle Kit support for migration generation and bundling in application 
- Drizzle Studio dev tools plugin to browse on device database 
- Live Queries 

npm

yarn

pnpm

bun

__

```
npm i drizzle-orm expo-sqlite@next
npm i -D drizzle-kit
```

__

```
yarn add drizzle-orm expo-sqlite@next
yarn add -D drizzle-kit
```

__

```
pnpm add drizzle-orm expo-sqlite@next
pnpm add -D drizzle-kit
```

__

```
bun add drizzle-orm expo-sqlite@next
bun add -D drizzle-kit
```

__

```
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

const expo = openDatabaseSync("db.db");
const db = drizzle(expo);

await db.select().from(users);
```

#### Live Queries [](#live-queries)

With `useLiveQuery` hook you can make any Drizzle query reactive:

__

```
import { useLiveQuery, drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import { Text } from 'react-native';
import * as schema from './schema';

const expo = openDatabaseSync('db.db', { enableChangeListener: true }); // <-- enable change listeners
const db = drizzle(expo);

const App = () => {
  // Re-renders automatically when data changes
  const { data } = useLiveQuery(db.select().from(schema.users));
  return <Text>{JSON.stringify(data)}</Text>;
};

export default App;
```

#### Expo SQLite migrations with Drizzle Kit [](#expo-sqlite-migrations-with-drizzle-kit)

You can use Drizzle Kit for SQL migration generation. Please make sure to check how Drizzle migrations work before proceeding. Expo / React Native requires you to have SQL migrations bundled into the app and we’ve got you covered.

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
module.exports = function(api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [["inline-import", { "extensions": [".sql"] }]] // <-- add this
  };
};
```

_metro.config.js_

```
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('sql'); // <--- add this

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