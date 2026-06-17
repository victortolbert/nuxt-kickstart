---
number: 2772
title: "[FEATURE]: Auto-Alias Columns in Subqueries"
type: other
state: open
created: 2024-08-09
url: "https://github.com/drizzle-team/drizzle-orm/issues/2772"
reactions: 43
comments: 6
labels: "[improvement, qb/crud]"
---

# [FEATURE]: Auto-Alias Columns in Subqueries

### Describe what you want

### Feature Request: Automatically Alias Columns in Subqueries to Avoid Ambiguity

**Issue**:
When using a custom select in a query that involves joins, and the query is used as a subquery with `.select()` (select all), an error like `column reference "column_name" is ambiguous` occurs. This is evident when inspecting the generated query via `.toSQL()`. 

**Example**:
Consider the following TypeScript code:

```ts
const tableOneDefaultSelect = {
	created_at: tableOne.createdAt,
	updated_at: tableOne.updatedAt,
	deleted_at: tableOne.deletedAt,
	created_by: tableOne.createdBy,
	updated_by: tableOne.updatedBy,
	deleted_by: tableOne.deletedBy,
	id: tableOne.id,
	key: tableOne.key,
	// ...
};
const tableTwoDefaultSelect = { id: tableTwo.id, title: tableTwo.title };
const tableThreeDefaultSelect = { /* similar structure */ };
const tableFourDefaultSelect = { /* similar structure */ };

const baseCriteria = and(
	isNull(tableOne.deletedAt),
	eq(tableFour.key, "published"),
	// ...
);
const aliasTableThree = alias(tableThree, "table_boo");
const baseQuery = db
	.select({
		...tableOneDefaultSelect,
		table_two: tableTwoDefaultSelect,
		table_three: {
			...tableThreeDefaultSelect,
			name: tableThree.title,
		},
		table_four: tableFourDefaultSelect,
	})
	.from(tableOne)
	.leftJoin(tableTwo, eq(tableTwo.id, tableOne.tableTwoId))
	.leftJoin(tableThree, eq(tableThree.id, tableOne.tableThreeId))
	.leftJoin(tableFour, eq(tableFour.id, tableOne.tableFourId))
	.leftJoin(tableOneTableAce, eq(tableOneTableAce.tableOneId, tableOne.id)) // Junction table
	.leftJoin(tableAce, eq(tableAce.id, tableOneTableAce.tableAceId))
	.leftJoin(tableOneTableBoo, eq(tableOneTableBoo.tableOneId, tableOne.id)) // Junction table
	.leftJoin(aliasTableThree, eq(aliasTableThree.id, tableOneTableBoo.tableThreeId))
	.orderBy(desc(tableOne.updatedAt))
	.where(baseCriteria);

const finalQuery = await db
	.select()
	.from(baseQuery)
	.where(...);
```...