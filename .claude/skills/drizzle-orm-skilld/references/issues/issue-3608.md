---
number: 3608
title: "[BUG]: \"Insert into ... select\" expects all columns"
type: bug
state: open
created: 2024-11-25
url: "https://github.com/drizzle-team/drizzle-orm/issues/3608"
reactions: 40
comments: 8
labels: "[bug, priority, qb/crud, has-pr]"
---

# [BUG]: "Insert into ... select" expects all columns

### Report hasn't been filed before.

- [X] I have verified that the bug I'm about to report hasn't been filed before.

### What version of `drizzle-orm` are you using?

0.36.4

### What version of `drizzle-kit` are you using?

N/A

### Other packages

_No response_

### Describe the Bug

Using the new "Insert into... select" feature, the implementation seems to expect all table columns to be present in the select. Here is the relevant part in the source code. In SQL, this is not required and honestly in many cases undesirable. I am not sure if the current implementation would work for any real-life example...

Here is a reproduction repo: <https://stackblitz.com/edit/stackblitz-starters-ll4899?file=index.js>

If you run this, it will fail with the following:

```
Error: Insert select error: selected fields are not the same or are in a different order compared to the table definition
    at PgInsertBuilder.select (/home/projects/stackblitz-starters-ll4899/node_modules/drizzle-orm/pg-core/query-builders/insert.cjs:86:13)
```

I believe the corresponding SQL statement is valid and executable. You don't really want to explicitly supply `id` in this use case.

```sql
insert into transaction (type, user_id)
select 'Stuff' as type, user_id
from user
where user.name = 'Bob';
```

I think this is an issue across all supported dialects.

PS. The documentation examples seem to be inserting 1-2 columns at most so that's kinda misleading given the above.

_I raised this on Discord but I think it got lost amongst all the messages._ 

---

## Top Comments

**@AndriiSherman** [maintainer] (+3):

Hey everyone!

I've created this message to send in a batch to all opened issues we have, just because there are a lot of them and I want to update all of you with our current work, why issues are not responded to, and the amount of work that has been done by our team over ~8 months.

I saw a lot of issues with suggestions on how to fix something while we were not responding – so thanks everyone. Also, thanks to everyone patiently waiting for a response from us and continuing to use Drizzle!

...

**@czystyl** (+3):

I was looking for `id` workaround and this is what was working for me: 
```ts
id: sql<number>`nextval('TABLE_NAME_id_seq'::regclass)`.as("id"),
```

**@WilcoKruijer** (+2):

@sohrab- 

> I am not sure what dialect you are using but in PostgreSQL, you can do something like this:
> 
> id: sql`default`
> 
> Drizzle actually does this on other interactions internally coz it likes to enumerate all of the columns. I am not sure why this was not implemented for "insert into ... select" specifically and forcing the consumer to do the column enumeration.

Your workaround doesn't really work because we're dealing with a construct like ` INSERT INTO "my_table" SELECT DEFAULT, 'bla';`. The "DEFAULT" does not refer to the my_table here because it's in a select statement.