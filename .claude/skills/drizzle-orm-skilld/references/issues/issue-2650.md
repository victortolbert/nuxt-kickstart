---
number: 2650
title: "[FEATURE]: Support for ordering/filtering on relations in drizzle `findMany` query method"
type: other
state: open
created: 2024-07-18
url: "https://github.com/drizzle-team/drizzle-orm/issues/2650"
reactions: 62
comments: 14
labels: "[improvement, rqb, priority]"
---

# [FEATURE]: Support for ordering/filtering on relations in drizzle `findMany` query method

### Discussed in https://github.com/drizzle-team/drizzle-orm/discussions/2639

<div type='discussions-op-text'>

<sup>Originally posted by **marceloverdijk** July 15, 2024</sup>
From the drizzle docs `orderBy` could be used like:

```
import { desc, asc } from 'drizzle-orm';
await db.query.posts.findMany({
  orderBy: [asc(posts.id)],
});
```

but what if I want to order on the authors name in case `authors` is separate table which `posts` has a foreign key to? 
</div>

Prisma supports this cleanly using:

```
const posts = await prisma.post.findMany({
  orderBy: {
    author: {
      email: 'asc',
    },
  },
})
```

It would be very useful if Drizzle would support this as well.

Although the Drizzle docs state:

> ### Drizzle Queries
> 
> Drizzle ORM is designed to be a thin typed layer on top of SQL. We truly believe we’ve designed the best way to operate an SQL database from TypeScript and it’s time to make it better.
> 
> Relational queries are meant to provide you with a great developer experience for querying nested relational data from an SQL database, avoiding multiple joins and complex data mappings.

to implement (this quite simple and common use case) with Drizzle, we have to step away from the `findMany` query method and use the more low level query builder instead:

```
select({
     ...getTableColumns(posts),
})
.from(posts)
.leftJoin(authors, eq(authors.Id, posts.authorId)
.orderBy(asc(authors.name))
```

This will order on the author name (but this way also filtering on the author could be added), but only return the posts.

---

## Top Comments

**@AndriiSherman** [maintainer] (+2):

Hey everyone!

I've created this message to send in a batch to all opened issues we have, just because there are a lot of them and I want to update all of you with our current work, why issues are not responded to, and the amount of work that has been done by our team over ~8 months.

I saw a lot of issues with suggestions on how to fix something while we were not responding – so thanks everyone. Also, thanks to everyone patiently waiting for a response from us and continuing to use Drizzle!

...

**@grmkris** (+14):

any news on this

**@kubk** (+8):

Bump so it gets more attention