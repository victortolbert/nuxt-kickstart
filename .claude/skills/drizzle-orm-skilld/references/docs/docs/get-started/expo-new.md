Drizzle ORM - Native SQLite

We've merged alternation-engine into Beta release. Try it out!

 Documentation

33k+ 

Dark

System

meet drizzle

Get started

Sustainability Why Drizzle? Guides Tutorials Latest releases Gotchas

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

Expo SQLite

New database

Meet Drizzle

Get started

New database Existing database

PostgreSQL Neon Vercel Postgres Supabase Xata PGLite Nile Bun SQL Effect PlanetScale Postgres Gel MySQL PlanetScale TiDB SingleStore SQLite Turso Cloud SQLite Cloud Turso Database Cloudflare D1 Bun SQLite Cloudflare Durable Objects MSSQL CockroachDB Expo SQLite OP SQLite

# Get Started with Drizzle and Expo

This guide assumes familiarity with:

- **Expo SQLite** - A library that provides access to a database that can be queried through a SQLite API - read here

#### Step 1 - Setup a project from Expo Template [](#step-1---setup-a-project-from-expo-template)

npm

yarn

pnpm

bun

__

```
npx create expo-app --template blank-typescript
```

__

```
yarn create expo-app --template blank-typescript
```

__

```
pnpm create expo-app --template blank-typescript
```

__

```
bunx create expo-app --template blank-typescript
```

You can read more about this template here.

#### Basic file structure [](#basic-file-structure)

After installing the template and adding the `db` folder, you’ll find the following content: In the `db/schema.ts` file with drizzle table definitions. The `drizzle` folder contains SQL migration files and snapshots

__

```
📦 <project root>
 ├ 📂 assets
 ├ 📂 drizzle
 ├ 📂 db
 │  └ 📜 schema.ts
 ├ 📜 .gitignore
 ├ 📜 .npmrc
 ├ 📜 app.json
 ├ 📜 App.tsx
 ├ 📜 babel.config.ts
 ├ 📜 drizzle.config.ts
 ├ 📜 package.json
 └ 📜 tsconfig.json
```

#### Step 2 - Install expo-sqlite package [](#step-2---install-expo-sqlite-package)

npm

yarn

pnpm

bun

__

```
npx expo install expo-sqlite
```

__

```
yarn expo install expo-sqlite
```

__

```
pnpm expo install expo-sqlite
```

__

```
bunx expo install expo-sqlite
```

#### Step 3 - Install required packages [](#step-3---install-required-packages)

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

#### Step 4 - Connect Drizzle ORM to the database [](#step-4---connect-drizzle-orm-to-the-database)

Create a `App.tsx` file in the root directory and initialize the connection:

__

```
import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

const expo = SQLite.openDatabaseSync('db.db');

const db = drizzle(expo);
```

#### Step 4 - Create a table [](#step-4---create-a-table)

Create a `schema.ts` file in the `db` directory and declare your table:

_src/db/schema.ts_

```
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  age: int().notNull(),
  email: text().notNull().unique(),
});
```

#### Step 5 - Setup Drizzle config file [](#step-5---setup-drizzle-config-file)

**Drizzle config** - a configuration file that is used by Drizzle Kit and contains all the information about your database connection, migration folder and schema files.

Create a `drizzle.config.ts` file in the root of your project and add the following content:

__

```
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  driver: 'expo',
  schema: './db/schema.ts',
  out: './drizzle',
});
```

#### Step 6 - Setup `metro` config [](#step-6---setup-metro-config)

Create a file `metro.config.js` in root folder and add this code inside:

_metro.config.js_

```
const { getDefaultConfig } = require('expo/metro-config');
/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('sql');
module.exports = config;
```

#### Step 7 - Update `babel` config [](#step-7---update-babel-config)

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

#### Step 8 - Applying changes to the database [](#step-8---applying-changes-to-the-database)

With Expo, you would need to generate migrations using the `drizzle-kit generate` command and then apply them at runtime using the `drizzle-orm` `migrate()` function

Generate migrations:

__

```
npx drizzle-kit generate
```

#### Step 9 - Apply migrations and query your db: [](#step-9---apply-migrations-and-query-your-db)

Let’s **App.tsx** file with migrations and queries to create, read, update, and delete users

__

```
import { Text, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { usersTable } from './db/schema';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './drizzle/migrations';

const expo = SQLite.openDatabaseSync('db.db');

const db = drizzle(expo);

export default function App() {
  const { success, error } = useMigrations(db, migrations);
  const [items, setItems] = useState<typeof usersTable.$inferSelect[] | null>(null);

  useEffect(() => {
    if (!success) return;

    (async () => {
      await db.delete(usersTable);

      await db.insert(usersTable).values([
        {
            name: 'John',
            age: 30,
            email: ' [\[email protected\]](https://orm.drizzle.team/cdn-cgi/l/email-protection)',
        },
      ]);

      const users = await db.select().from(usersTable);
      setItems(users);
    })();
  }, [success]);

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

  if (items === null || items.length === 0) {
    return (
      <View>
        <Text>Empty</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
      }}
    >
      {items.map((item) => (
        <Text key={item.id}>{item.email}</Text>
      ))}
    </View>
  );
}
```

#### Step 10 - Prebuild and run expo app [](#step-10---prebuild-and-run-expo-app)

npm

yarn

pnpm

bun

__

```
npx expo run:ios
```

__

```
yarn expo run:ios
```

__

```
pnpm expo run:ios
```

__

```
bun expo run:ios
```