---
number: 2389
title: "[BUG]: drizzle-kit push is not detecting Postgres enum label already exists"
type: bug
state: closed
created: 2024-05-29
url: "https://github.com/drizzle-team/drizzle-orm/issues/2389"
reactions: 60
comments: 73
labels: "[bug]"
---

# [BUG]: drizzle-kit push is not detecting Postgres enum label already exists

### What version of `drizzle-orm` are you using?

0.30.9

### What version of `drizzle-kit` are you using?

0.21.2

### Describe the Bug

This bug happens every so often. Is there a work around?

pnpm drizzle-kit push
drizzle-kit: v0.21.2
drizzle-orm: v0.30.9

No config path provided, using default path

Using 'pg' driver for database querying

Warning  You are about to execute current statements:

ALTER TYPE "job_name" ADD VALUE 'SET_PCS_POWER_KW';

error: enum label "SET_PCS_POWER_KW" already exists
 
kit@0.21.2/node_modules/drizzle-kit/bin.cjs:113632:7) {
  length: 102,
  severity: 'ERROR',
  code: '42710',
  detail: undefined,
  hint: undefined,
  position: undefined,
  internalPosition: undefined,
  internalQuery: undefined,
  where: undefined,
  schema: undefined,
  table: undefined,
  column: undefined,
  dataType: undefined,
  constraint: undefined,
  file: 'pg_enum.c',
  line: '293',
  routine: 'AddEnumLabel'
}


### Expected behavior

_No response_

### Environment & setup

_No response_

---

## Top Comments

**@Lukem121** (+6):

I don't know how to fix it but I believe you can reproduce it by creating a Postgres enum, pushing it to the database, then if you add new items, or shuffle the tuple, then when you push again it will error.

**@JohnCido** (+1):

I have just upagraded `drizzle-kit` to latest. And this happens when I try to run push to my dev db.

**@mattiasbonte**:

+1 upgraded this morning because I needed the `geometry` type and now can't seem to do a migrate because of this. Has anyone found a solution/workaround?