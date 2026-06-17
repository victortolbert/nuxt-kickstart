---
number: 4994
title: How do I check if a value in a table already exists?
category: Q&A
created: 2025-10-26
url: "https://github.com/drizzle-team/drizzle-orm/discussions/4994"
upvotes: 1
comments: 1
answered: false
---

# How do I check if a value in a table already exists?

Hi,

What's the best way to check if a table value already exists so that I can either select the value if it exists or insert a new entry into the table if it does not exist?

Thanks in advance

---

## Top Comments

**@wesleysmyth**:

Several ways to do this, from simplest to most efficient:

### 1. Simple select with `.limit(1)`

```typescript
import { eq } from 'drizzle-orm';

const existing = await db
  .select()
  .from(users)
  .where(eq(users.email, 'test@example.com'))
  .limit(1);

if (existing.length > 0) {
  console.log('User exists:', existing[0]);
}
```

### 2. Lightweight existence check (no row data returned)

```typescript
import { sql, eq } from 'drizzle-orm';

const [result] = await db
  .select({ exists: sql<boolean>`1` })
  .from(users)
  .where(eq(users.email, 'test@example.com'))
  .limit(1);

...