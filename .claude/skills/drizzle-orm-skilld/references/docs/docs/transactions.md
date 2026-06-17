Drizzle ORM - Transactions

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

 Set Operations Generated Columns Transactions

Batch Cache Dynamic query building Read Replicas Custom types Goodies

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

# Transactions

SQL transaction is a grouping of one or more SQL statements that interact with a database. A transaction in its entirety can commit to a database as a single logical unit or rollback (become undone) as a single logical unit.

Drizzle ORM provides APIs to run SQL statements in transactions:

__

```
const db = drizzle(...)

await db.transaction(async (tx) => {
  await tx.update(accounts).set({ balance: sql\`${accounts.balance} - 100.00\` }).where(eq(users.name, 'Dan'));
  await tx.update(accounts).set({ balance: sql\`${accounts.balance} + 100.00\` }).where(eq(users.name, 'Andrew'));
});
```

Drizzle ORM supports `savepoints` with nested transactions API:

__

```
const db = drizzle(...)

await db.transaction(async (tx) => {
  await tx.update(accounts).set({ balance: sql\`${accounts.balance} - 100.00\` }).where(eq(users.name, 'Dan'));
  await tx.update(accounts).set({ balance: sql\`${accounts.balance} + 100.00\` }).where(eq(users.name, 'Andrew'));

  await tx.transaction(async (tx2) => {
    await tx2.update(users).set({ name: "Mr. Dan" }).where(eq(users.name, "Dan"));
  });
});
```

You can embed business logic to the transaction and rollback whenever needed:

__

```
const db = drizzle(...)

await db.transaction(async (tx) => {
  const [account] = await tx.select({ balance: accounts.balance }).from(accounts).where(eq(users.name, 'Dan'));
  if (account.balance < 100) {
    // This throws an exception that rollbacks the transaction.
    tx.rollback()
  }

  await tx.update(accounts).set({ balance: sql\`${accounts.balance} - 100.00\` }).where(eq(users.name, 'Dan'));
  await tx.update(accounts).set({ balance: sql\`${accounts.balance} + 100.00\` }).where(eq(users.name, 'Andrew'));
});
```

You can return values from the transaction:

__

```
const db = drizzle(...)

const newBalance: number = await db.transaction(async (tx) => {
  await tx.update(accounts).set({ balance: sql\`${accounts.balance} - 100.00\` }).where(eq(users.name, 'Dan'));
  await tx.update(accounts).set({ balance: sql\`${accounts.balance} + 100.00\` }).where(eq(users.name, 'Andrew'));

  const [account] = await tx.select({ balance: accounts.balance }).from(accounts).where(eq(users.name, 'Dan'));
  return account.balance;
});
```

You can use transactions with **relational queries**:

__

```
const db = drizzle({ schema })

await db.transaction(async (tx) => {
  await tx.query.users.findMany({
    with: {
      accounts: true
    }
  });
});
```

We provide dialect-specific transaction configuration APIs:

PostgreSQL

MySQL

SQLite

SingleStore

MSSQL

CockroachDB

__

```
await db.transaction(
  async (tx) => {
    await tx.update(accounts).set({ balance: sql\`${accounts.balance} - 100.00\` }).where(eq(users.name, "Dan"));
    await tx.update(accounts).set({ balance: sql\`${accounts.balance} + 100.00\` }).where(eq(users.name, "Andrew"));
  }, {
    isolationLevel: "read committed",
    accessMode: "read write",
    deferrable: true,
  }
);

interface PgTransactionConfig {
  isolationLevel?:
    | "read uncommitted"
    | "read committed"
    | "repeatable read"
    | "serializable";
  accessMode?: "read only" | "read write";
  deferrable?: boolean;
}
```

__

```
await db.transaction(
  async (tx) => {
    await tx.update(accounts).set({ balance: sql\`${accounts.balance} - 100.00\` }).where(eq(users.name, "Dan"));
    await tx.update(accounts).set({ balance: sql\`${accounts.balance} + 100.00\` }).where(eq(users.name, "Andrew"));
  }, {
    isolationLevel: "read committed",
    accessMode: "read write",
    withConsistentSnapshot: true,
  }
);

interface MySqlTransactionConfig {
  isolationLevel?:
    | "read uncommitted"
    | "read committed"
    | "repeatable read"
    | "serializable";
  accessMode?: "read only" | "read write";
  withConsistentSnapshot?: boolean;
}
```

__

```
await db.transaction(
  async (tx) => {
    await tx.update(accounts).set({ balance: sql\`${accounts.balance} - 100.00\` }).where(eq(users.name, "Dan"));
    await tx.update(accounts).set({ balance: sql\`${accounts.balance} + 100.00\` }).where(eq(users.name, "Andrew"));
  }, {
    behavior: "deferred",
  }
);

interface SQLiteTransactionConfig {
    behavior?: 'deferred' | 'immediate' | 'exclusive';
}
```

__

```
await db.transaction(
  async (tx) => {
    await tx.update(accounts).set({ balance: sql\`${accounts.balance} - 100.00\` }).where(eq(users.name, "Dan"));
    await tx.update(accounts).set({ balance: sql\`${accounts.balance} + 100.00\` }).where(eq(users.name, "Andrew"));
  }, {
    isolationLevel: "read committed",
    accessMode: "read write",
    withConsistentSnapshot: true,
  }
);

interface SingleStoreTransactionConfig {
  isolationLevel?:
    | "read uncommitted"
    | "read committed"
    | "repeatable read"
    | "serializable";
  accessMode?: "read only" | "read write";
  withConsistentSnapshot?: boolean;
}
```

__

```
await db.transaction(
  async (tx) => {
    await tx.update(accounts).set({ balance: sql\`${accounts.balance} - 100.00\` }).where(eq(users.name, "Dan"));
    await tx.update(accounts).set({ balance: sql\`${accounts.balance} + 100.00\` }).where(eq(users.name, "Andrew"));
  }, {
    isolationLevel: "read committed",
  }
);

interface MsSqlTransactionConfig {
  isolationLevel?: 'read uncommitted' | 'read committed' | 'repeatable read' | 'serializable' | 'snapshot';
}
```

__

```
await db.transaction(
  async (tx) => {
    await tx.update(accounts).set({ balance: sql\`${accounts.balance} - 100.00\` }).where(eq(users.name, "Dan"));
    await tx.update(accounts).set({ balance: sql\`${accounts.balance} + 100.00\` }).where(eq(users.name, "Andrew"));
  }, {
    isolationLevel: "read committed",
    accessMode: "read write",
    deferrable: true,
  }
);

interface CockroachTransactionConfig {
  isolationLevel?:
    | "read uncommitted"
    | "read committed"
    | "repeatable read"
    | "serializable";
  accessMode?: "read only" | "read write";
  deferrable?: boolean;
}
```