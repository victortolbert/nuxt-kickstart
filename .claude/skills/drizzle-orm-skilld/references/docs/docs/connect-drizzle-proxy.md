Drizzle ORM - Drizzle Proxy

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

# Drizzle HTTP proxy

This guide assumes familiarity with:

- Database connection basics with Drizzle

How an HTTP Proxy works and why you might need it

Drizzle Proxy is used when you need to implement your own driver communication with the database. It can be used in several cases, such as adding custom logic at the query stage with existing drivers. The most common use is with an HTTP driver, which sends queries to your server with the database, executes the query on your database, and responds with raw data that Drizzle ORM can then map to results

How it works under the hood?

__

```
┌───────────────────────────┐                 ┌─────────────────────────────┐              
│       Drizzle ORM         │                 │  HTTP Server with Database  │             
└─┬─────────────────────────┘                 └─────────────────────────┬───┘             
  │                                                ^                    │
  │-- 1. Build query         2. Send built query --│                    │
  │                                                │                    │
  │              ┌───────────────────────────┐     │                    │
  └─────────────>│                           │─────┘                    │ 
                 │      HTTP Proxy Driver    │                          │
  ┌──────────────│                           │<─────────────┬───────────┘
  │              └───────────────────────────┘              │
  │                                                  3. Execute a query + send raw results back
  │-- 4. Map data and return        
  │                   
  v
```

Drizzle ORM also supports simply using asynchronous callback function for executing SQL.

- `sql` is a query string with placeholders.
- `params` is an array of parameters.
- One of the following values will set for `method` depending on the SQL statement - `run`, `all`, `values` or `get`.

Drizzle always waits for `{rows: string[][]}` or `{rows: string[]}` for the return value.

- When the `method` is `get`, you should return a value as `{rows: string[]}`.
- Otherwise, you should return `{rows: string[][]}`.

PostgreSQL

MySQL

SQLite

__

```
// Example of driver implementation
import { drizzle } from 'drizzle-orm/pg-proxy';

const db = drizzle(async (sql, params, method) => {
  try {
    const rows = await axios.post('http://localhost:3000/query', { sql, params, method });

    return { rows: rows.data };
  } catch (e: any) {
    console.error('Error from pg proxy server: ', e.response.data)
    return { rows: [] };
  }
});
```

__

```
// Example of server implementation
import { Client } from 'pg';
import express from 'express';

const app = express();

app.use(express.json());
const port = 3000;

const client = new Client('postgres://postgres:postgres@localhost:5432/postgres');

app.post('/query', async (req, res) => {
  const { sql, params, method } = req.body;

  // prevent multiple queries
  const sqlBody = sql.replace(/;/g, '');

  try {
    const result = await client.query({
      text: sqlBody,
      values: params,
      rowMode: method === 'all' ? 'array': undefined,
    });
    res.send(result.rows);
  } catch (e: any) {
    res.status(500).json({ error: e });
  }

  res.status(500).json({ error: 'Unknown method value' });
});

app.listen(port, () => {
  console.log(\`Example app listening on port ${port}\`);
});
```

__

```
// Example of driver implementation
import { drizzle } from 'drizzle-orm/mysql-proxy';

const db = drizzle(async (sql, params, method) => {
  try {
    const rows = await axios.post('http://localhost:3000/query', { sql, params, method });

    return { rows: rows.data };
  } catch (e: any) {
    console.error('Error from mysql proxy server: ', e.response.data)
    return { rows: [] };
  }
});
```

__

```
// Example of server implementation
import * as mysql from 'mysql2/promise';
import express from 'express';

const app = express();

app.use(express.json());
const port = 3000;

const main = async () => {
    const connection = await mysql.createConnection('mysql://root: [\[email protected\]](https://orm.drizzle.team/cdn-cgi/l/email-protection):5432/drizzle');

    app.post('/query', async (req, res) => {
      const { sql, params, method } = req.body;

      // prevent multiple queries
      const sqlBody = sql.replace(/;/g, '');

      try {
            const result = await connection.query({
                sql: sqlBody,
                values: params,
                rowsAsArray: method === 'all',
                typeCast: function(field: any, next: any) {
                    if (field.type === 'TIMESTAMP' || field.type === 'DATETIME' || field.type === 'DATE') {
                        return field.string();
                    }
                    return next();
                },
            });
      } catch (e: any) {
        res.status(500).json({ error: e });
      }

      if (method === 'all') {
        res.send(result[0]);
      } else if (method === 'execute') {
        res.send(result);
      }
      res.status(500).json({ error: 'Unknown method value' });
    });

    app.listen(port, () => {
      console.log(\`Example app listening on port ${port}\`);
    });
}

main();
```

__

```
import { drizzle } from 'drizzle-orm/sqlite-proxy';

const db = drizzle(async (sql, params, method) => {
  try {
    const rows = await axios.post('http://localhost:3000/query', { sql, params, method });

    return { rows: rows.data };
  } catch (e: any) {
    console.error('Error from sqlite proxy server: ', e.response.data)
    return { rows: [] };
  }
});
```

**Batch support**

Sqlite Proxy supports batch requests, the same as it’s done for all other drivers. Check full docs

You will need to specify a specific callback for batch queries and handle requests to proxy server:

__

```
import { drizzle } from 'drizzle-orm/sqlite-proxy';

type ResponseType = { rows: any[][] | any[] }[];

const db = drizzle(async (sql, params, method) => {
  // single queries logic. Same as in code above
}, async (queries: { sql: string, params: any[], method: 'all' | 'run' | 'get' | 'values'}[]) => {
    try {
      const result: ResponseType = await axios.post('http://localhost:3000/batch', { queries });

      return result;
    } catch (e: any) {
      console.error('Error from sqlite proxy server:', e);
      throw e;
    }
  });
```

And then you can use `db.batch([])` method, that will proxy all queries

Response from the batch should be an array of raw values (an array within an array), in the same order as they were sent to the proxy server

Unless you plan on writing every SQL query by hand, a table declaration is helpful:

__

```
import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

const users = sqliteTable('users', {
  id: text('id'),
  textModifiers: text('text_modifiers').notNull().default(sql\`CURRENT_TIMESTAMP\`),
  intModifiers: integer('int_modifiers', { mode: 'boolean' }).notNull().default(false),
});
```

For more details about column types, see the **SQLite column types in Drizzle.**