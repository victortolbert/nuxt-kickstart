---
number: 3094
title: "[BUG]: Column name not being returned as snake_case "
type: bug
state: open
created: 2024-10-09
url: "https://github.com/drizzle-team/drizzle-orm/issues/3094"
reactions: 43
comments: 19
labels: "[bug, priority, has-pr]"
---

# [BUG]: Column name not being returned as snake_case 

### What version of `drizzle-orm` are you using?

0.34.1

### What version of `drizzle-kit` are you using?

0.25.0

### Describe the Bug

When using `casing: 'snake_case'` in the config and defining a column like so `firstName: t.text().notNull()`

And then when accessing the column name via `users.firstName.name` we get `firstName` instead of `first_name`

Same happens if we get the columns via `getTableConfig(users).columns` and `getTableColumns(users)`

### Expected behavior

_No response_

### Environment & setup

_No response_

---

## Top Comments

**@alexandernanberg** (+17):

You need to pass `casing` to `drizzle()` too, not only in the drizzle-kit config.

```ts
export const db = drizzle(client, { schema, casing: 'snake_case' })
```

**@kaelruland** (+13):

> You need to pass `casing` to `drizzle()` too, not only in the drizzle-kit config.
> 
> ```ts
> export const db = drizzle(client, { schema, casing: 'snake_case' })
> ```

I guess it's to be expected, but this doesn't affect the column name mappings for tables outside the context of a query. I've written a convenience method for `onConflictDoUpdate` and I'm still getting the camelCase column name:

```
export const excluded = (column: PgColumn) => {
	return sql.raw(`excluded.${column.name}`);
}; // excluded.firstName
```

**@kaelruland** (+13):

This is my current workaround. I've committed to snake_case for the project so not a huge deal, but would be nice to inherit casing from the config.
```ts
import { toSnakeCase } from 'drizzle-orm/casing';

export const excluded = (column: PgColumn) => {
	return sql.raw(`excluded.${toSnakeCase(column.name)}`);
};
```