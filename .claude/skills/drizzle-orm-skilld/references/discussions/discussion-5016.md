---
number: 5016
title: Unable to infer nested return type from select() when using a DTO object in Drizzle ORM
category: Q&A
created: 2025-11-06
url: "https://github.com/drizzle-team/drizzle-orm/discussions/5016"
upvotes: 2
comments: 2
answered: true
---

# Unable to infer nested return type from select() when using a DTO object in Drizzle ORM

I’m creating a **generic CRUD wrapper** in Drizzle ORM, and I’m facing an issue with type inference when selecting custom DTOs that include nested objects.

Here’s a simplified version of my code:

```ts
export const staticPageDetailsDto = {
  id: staticPagesTable.id,
  title: staticPagesTable.title,
  description: staticPagesTable.description,
  slug: staticPagesTable.slug,
  isPublic: staticPagesTable.isPublic,
  createdAt: staticPagesTable.createdAt,
  updatedAt: staticPagesTable.updatedAt,
  sql: sql<number>`1`,
  nested: {
    updatedAt: staticPagesTable.updatedAt,
  },
} as const;

const findById: StaticPageService['findById'] = async (id) => {
  const [data] = await db
    .select(staticPageDetailsDto)
    .from(staticPagesTable)
    .where(eq(staticPagesTable.id, id))
    .limit(1);

  if (!data) return new AppError(messages.ID_NOT_FOUND);

  return data;
};
```...

---

## Accepted Answer

Resolved

```
import type { SQL } from 'drizzle-orm';
import type { PgColumn } from 'drizzle-orm/pg-core';

type Simplify<T> = {[KeyType in keyof T]: T[KeyType]} & {};

type SelectedDTOType = Record<string, SQL | PgColumn>;

export type DtoFields<
  DTO extends SelectedDTOType,
  IsNestedNullable extends boolean = true,
> = Simplify<{
  [Key in keyof DTO]: DTO[Key] extends {
    _: { brand: 'Column'; data: infer ColumnType; notNull: infer RequiredColumn };
  }
    ? RequiredColumn extends true
      ? ColumnType
      : ColumnType | null
    : DTO[Key] extends { _: { brand: 'SQL'; type: infer SQLType } }
      ? SQLType
      : DTO[Key] extends SelectedDTOType
        ? IsNestedNullable extends true
          ? DtoFields<DTO[Key]> | null
          : DtoFields<DTO[Key]>
        : never;
}>;
```