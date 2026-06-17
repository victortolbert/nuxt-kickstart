---
number: 3493
title: "[BUG]: db.$count inside relational query \"extras\" generates SQL with incorrect table names"
type: bug
state: open
created: 2024-11-05
url: "https://github.com/drizzle-team/drizzle-orm/issues/3493"
reactions: 52
comments: 21
labels: "[bug, priority, qb/crud]"
---

# [BUG]: db.$count inside relational query "extras" generates SQL with incorrect table names

### Report hasn't been filed before.

- [X] I have verified that the bug I'm about to report hasn't been filed before.

### What version of `drizzle-orm` are you using?

0.36.0

### What version of `drizzle-kit` are you using?

0.27.1

### Other packages

_No response_

### Describe the Bug

Following the docs for the `db.$count` helper, I wanted to use it inside a relational query to also get a count of some related entity. E.g querying for users, and including a count of the posts related to them.

This is shows in the docs by using `db.$count` within the `extras` field of the query: https://orm.drizzle.team/docs/query-utils#count, https://orm.drizzle.team/docs/select#count. (The docs also forget to include that you need to chain `db.$count(...).as('countAlias')` for use in `extras`)

Minimal repro: https://stackblitz.com/edit/stackblitz-starters-oo7in9?file=index.mjs

Simple schema: users table with `id`, posts table with `id`, `user`.

Relational query:
```ts
var q = db.query.user.findMany({
  extras: {
    postCount: db.$count(post, eq(post.user, user.id)).as('postCount'), // Needed to add this `.as()` which wasn't in the docs
  },
});

console.log(q.toSQL()); // All table names in the query SQL are incorrectly aliased to the table alias of the table the relational query is being generated for, in this case "user". So the $count sql contains 'where "user"."user"' instead of 'where "post"."user"'
```

Resulting SQL: 
```sql
select "id", (select count(*) from "post" where "user"."user" = "user"."id") as "postCount" from "user"
```



---

## Top Comments

**@JonasDoesThings** (+3):

Maybe adding a link to this issue to the docs (at https://orm.drizzle.team/docs/query-utils#count) would be nice while it's not fixed 

**@vovataras** (+2):

+1
Also, the value is returned as a string, not a number, but the type is indicated as a number.

**@heybart**:

Can confirm, running into the same issue.