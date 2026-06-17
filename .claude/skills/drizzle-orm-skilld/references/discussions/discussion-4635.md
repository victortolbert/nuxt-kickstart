---
number: 4635
title: `drizzle-seed` relationship with existing table
category: Q&A
created: 2025-06-11
url: "https://github.com/drizzle-team/drizzle-orm/discussions/4635"
upvotes: 6
comments: 0
answered: false
---

# `drizzle-seed` relationship with existing table

I want to be able to use Drizzle Seed to automatically populate a relationship foreign key where the relationship is being made to a table that has already been seeded. 

As an example, imagine I have a table for posts, and a table for categories:
```typescript
// schema.ts
const post = pgTable('post', {
  id: uuid().defaultRandom().primaryKey(),
  title: varchar().notNull()
  category: uuid().references(() => category.id).notNull()
})

const postRelations = relations(post, ({ one }) => ({
  category: one(category, { 
    fields: [post.category],
    references: [category.id]
  }
}))

const category = pgTable('category', {
  id: uuid().defaultRandom().primaryKey(),
  title: varchar().notNull()
})
```

To my understanding the `with` property in the seeding refinement options would be generating new categories for every generated post:

```typescript
// seed.ts
await seed(db, { post, category }).refine((f) => {
  post: {
    count: 10,
    with: {
      category: 1
    }
  }
})
```

But my ideal seeding behaviour here would be to populate some dummy categories, then seed the posts by creating relationships to those *already existing* categories. As far as I can tell there isn't an idiomatic way to describe this within the seed config options. The best I've been able to come up with is:
* Do a seeding run on the category table.
* Query the database to get all the existing categories.
* Do a second seeding run on the posts table, using `va...