---
number: 2066
title: "[BUG]: Deeply nested queries fail due to table name length"
type: bug
state: closed
created: 2024-03-26
url: "https://github.com/drizzle-team/drizzle-orm/issues/2066"
reactions: 55
comments: 42
labels: "[bug, rqb, priority, bug/fixed-in-beta]"
---

# [BUG]: Deeply nested queries fail due to table name length

### What version of `drizzle-orm` are you using?

0.30.1

### What version of `drizzle-kit` are you using?

0.20.14

### Describe the Bug

When creating a query with deeply nested data, the sql generated uses names based on the relation names that have been set up, with more text being appended to the name for each level of depth.
"table1"
"table1_table2"
"table1_table2_table3"
etc...

If this reaches the limit for the length of a table name, the database will truncate the names to the number of allowed characters, and fail with the error `error: table name "documentVersions_workflowStep_workflow_contract_entities_userEn" specified more than once` because there were multiple more tables in the name that are cut off. They instead all get truncated to the same string which causes an error.

### Expected behavior

Drizzle should either use shorter names upon reaching the limit for a table name, or use aliases within the request that get turned back into the correct names upon response. This ideally should not be something the drizzle user has to worry about, as the query builder should preferably work without having to manually set table names for all the joins.

### Environment & setup

This occurs using postgresql

---

## Top Comments

**@jonatandorozco** (+11):

I'm experiencing a similar issue, where the query says the column does not exist due name truncating

**@nick-kang** (+5):

This is because Postgres has a default max table name length of 63 characters (https://www.postgresql.org/docs/current/sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS) which is set by `NAMEDATALEN`. Any table name (or table alias) that is longer than 63 characters will get truncated to 63 characters. Updating `NAMEDATALEN` is not recommended.

Being able to set a table alias in drizzle queries would be helpful.

**@jonatandorozco** (+6):

@EamonHeffernan I believe we can still have good debugging even with hashed names, if they're kept in memory in a map whenever a warning/error occurs we can fallback to that map to retrieve the original names and show the query accordingly 