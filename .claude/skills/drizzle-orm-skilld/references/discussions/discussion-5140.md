---
number: 5140
title: How to set up Drizzle for testing? (vitest)
category: Q&A
created: 2025-12-14
url: "https://github.com/drizzle-team/drizzle-orm/discussions/5140"
upvotes: 1
comments: 3
answered: false
---

# How to set up Drizzle for testing? (vitest)

I would like to use drizzle with PG. I want to run tests with vitest.

What is the recommended setup?

I have a local PG. I have concerns that tests can't be run in parallel when connecting to one DB.

---

## Top Comments

**@KeepALifeUS** (+1):

## Drizzle + Vitest Testing Setup

Here are the recommended approaches for parallel test isolation:

### Option 1: Schema-per-test (Recommended for PG)

```ts
// test/setup.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { randomUUID } from "crypto";

export async function createTestDb() {
  const schemaName = `test_${randomUUID().slice(0, 8)}`;
  
  const pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
  await pool.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
  await pool.query(`SET search_path TO "${schemaName}"`);
  
  const db = drizzle(pool);
  await migrate(db, { migrationsFolder: "./drizzle" });
  
  return {
    db,
    cleanup: async () => {
      await pool.query(`DROP SCHEMA "${schemaName}" CASCADE`);
      await pool.end();
    }
  };
}
```...

**@lirbank**:

If you're using Neon, take a look at Neon Testing (I'm the author) — each test file gets its own isolated Postgres database via Neon branching. No mocks, no boilerplate, no Docker, parallel-safe out of the box with automatic teardown. Works great with Drizzle.

**@guettli**:

@lirbank does this work with a "normal" PG db (non serverless)? 