---
number: 843
title: "[FEATURE]: `CREATE TRIGGER` functions"
type: feature
state: open
created: 2023-07-02
url: "https://github.com/drizzle-team/drizzle-orm/issues/843"
reactions: 475
comments: 21
labels: "[enhancement, drizzle/kit, db/sqlite, db/mysql, db/postgres]"
---

# [FEATURE]: `CREATE TRIGGER` functions

### Describe what you want

Expected behavior:
```ts
export const users = pgTable('users', {
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    // Feature request:
    .triggerBeforeUpdate('set_updated_at', sql`set_updated_at()`),
});
```
```sql
-- Inserted manually in a previous migration file
CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';
```
```sql
CREATE TABLE IF NOT EXISTS "users" (
  "updated_at" timestamp DEFAULT now() NOT NULL,
);

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON "users"
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();
```

---

## Top Comments

**@ItayTamary** (+467):

is there an update on the timeline/prioritization for arbitrarily defining triggers within the schema?

**strength to you and thank you :)**

**@millette** (+128):

@1mono2 @dudubernardino @sh-k-l @adfdev @Raveen2001 @mianala @Khosraw @ghyath5 Your messages are counterproductive. If you're interested and want to share the sentiment, add a reaction to this comment: <https://github.com/drizzle-team/drizzle-orm/issues/843#issuecomment-1885771513>

That said, I'm also sorry for contributing to the noise since everyone here will get a notification for my comment.

**@ghyath5** (+19):

any updates here ?