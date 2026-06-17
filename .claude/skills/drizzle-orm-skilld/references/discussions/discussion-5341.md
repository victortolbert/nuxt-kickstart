---
number: 5341
title: Arbitrary table subquery
category: Q&A
created: 2026-02-05
url: "https://github.com/drizzle-team/drizzle-orm/discussions/5341"
upvotes: 1
comments: 1
answered: false
---

# Arbitrary table subquery

Hi everyone, I'm building a mildly complex query with postgres and one of the subqueries, looks like this:

```
WITH target_days AS (
  SELECT generate_series('2026-01-03'::date, '2026-01-18'::date, '1 day'::interval)::date AS date
)
```

This subquery creates a small table full of dates that then go and get fully outer joined with another existing table. However I haven't found any documentation on how to create this subquery for drizzle.

---

## Top Comments

**@sunnypatell**:

drizzle has first-class CTE support via `db.$with()`. for your `generate_series` case, you can pass raw SQL directly to the CTE definition.

this feature landed in v0.39.0 via PR #3976.

### your query in drizzle

```ts
import { sql, eq } from 'drizzle-orm';
import { db } from './db';
import { myTable } from './schema';

// define the CTE with typed columns
const targetDays = db.$with('target_days', {
  date: sql<string>`date`.as('date'),
}).as(
  sql`SELECT generate_series('2026-01-03'::date, '2026-01-18'::date, '1 day'::interval)::date AS date`
);

...