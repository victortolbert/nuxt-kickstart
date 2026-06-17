---
number: 5205
title: Does Drizzle auto rollbacks when I throw an error or do I need to call tx.rollback?
category: Q&A
created: 2026-01-02
url: "https://github.com/drizzle-team/drizzle-orm/discussions/5205"
upvotes: 1
comments: 2
answered: false
---

# Does Drizzle auto rollbacks when I throw an error or do I need to call tx.rollback?

No description needed, the title says it all.

---

## Top Comments

**@KeepALifeUS**:

## Answer: Drizzle Auto-Rollback Behavior

**Yes, Drizzle automatically rolls back when you throw an error inside a transaction.**

### Example:

```ts
await db.transaction(async (tx) => {
  await tx.insert(users).values({ name: "Alice" });
  
  throw new Error("Something went wrong");
  // ↑ Transaction is automatically rolled back here
  // The insert above will NOT be committed
});
```

### When to use explicit rollback:

You only need `tx.rollback()` for conditional rollbacks without throwing:

...

**@ademkilinc**:

Yes it rollbacks automatically when an error is thrown inside the transaction. In my experience, tx.rollback() is useful if you want to rollback cleanly in the case of invalid business rules inside the transaction. 
Btw it's pretty easy to test it yourself if you want to ensure it, just throw an error yourself inside the transaction and you will see your db is untouched.