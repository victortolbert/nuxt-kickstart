---
number: 5100
title: What is the short way of getting back a complex record that was inserted or updated with ids included?
category: Q&A
created: 2025-12-04
url: "https://github.com/drizzle-team/drizzle-orm/discussions/5100"
upvotes: 1
comments: 0
answered: false
---

# What is the short way of getting back a complex record that was inserted or updated with ids included?

Sorry if the title is not clear

Suppose a main item has a 1-to-n or n-to-n relationship with 5-6 other tables


```javascript
const {
        genres,
        credits,
        similar,
        keywords,
        ...mainItem
      } = item
      ;
await db.transaction(async (tx: any) => {
        const insertedMainItem = await tx
          .insert(mainItemTable)
          .values(mainItem)
          .onConflictDoUpdate({
```

in the same transaction, i write to the other tables and joinTables with new methods. 

I currently call returning* to get back the primary key
```javascript
.returning({ id: mainItemTable.id });
```
\* (from the docs for sqlite driver. theres another callback called `output()` but i think that...