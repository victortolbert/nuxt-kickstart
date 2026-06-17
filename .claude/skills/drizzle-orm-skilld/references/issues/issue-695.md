---
number: 695
title: Implement infering table model with relations
type: feature
state: open
created: 2023-06-02
url: "https://github.com/drizzle-team/drizzle-orm/issues/695"
reactions: 194
comments: 48
labels: "[enhancement, rqb, priority]"
---

# Implement infering table model with relations

Prisma API:

```ts
import { Prisma } from '@prisma/client'

// 1: Define a type that includes the relation to `Post`
const userWithPosts = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: { posts: true },
})

// 2: Define a type that only contains a subset of the scalar fields
const userPersonalData = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: { email: true, name: true },
})

// 3: This type will include a user and all their posts
type UserWithPosts = Prisma.UserGetPayload<typeof userWithPosts>
```

---

## Top Comments

**@BearToCode** (+146):

For queries using `with` I made these simple helper types:
```ts
import type { BuildQueryResult, DBQueryConfig, ExtractTablesWithRelations } from 'drizzle-orm';
import * as schema from './path/to/schema';

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
  'one' | 'many',
  boolean,
  TSchema,
  TSchema[TableName]
>['with'];

export type InferResultType<
  TableName extends keyof TSchema,
  With extends IncludeRelation<TableName> | undefined = undefined
> = BuildQueryResult<
  TSchema,
  TSchema[TableName],
  {
    with: With;
  }
>;
```...

**@Lukasz17git** (+22):

You can also use the type [BearToCode](https://github.com/BearToCode) provided in https://github.com/drizzle-team/drizzle-orm/issues/695#issuecomment-1891811082 to achieve that:
```typescript
type UserWithPostsWithUser = InferResultType<'user', { posts: { with: user: true } }>
```
I ll also post an alternative using unions if nested relations or filtering fields/columns aren't needed.

Somewhere in your app:
```typescript
import type { db } from '@/path-to-db';

type DB = typeof db
type DbSchemas = NonNullable<DB['_']['schema']>

export type SchemaRelations<
   TTableName extends keyof DbSchemas,
   TExcludeRelations extends keyof NonNullable<DbSchemas[TTableName]['relations']> = never,
> = Exclude<keyof NonNullable<DbSchemas[TTableName]['relations']>, TExcludeRelations>

export type SchemaWithRelations<
   TTableName extends keyof DbSchemas,
   TInclude extends SchemaRelations<TTableName> = never
> = BuildQueryResult<DbSchemas, DbSchemas[TTableName], { with: { [Key in TInclude]: true } }>
```...

**@amjed-ali-k** (+18):

> For queries using `with` I made these simple helper types:
> 
> ```ts
> import type { BuildQueryResult, DBQueryConfig, ExtractTablesWithRelations } from 'drizzle-orm';
> import * as schema from './path/to/schema';
> 
> type Schema = typeof schema;
> type TSchema = ExtractTablesWithRelations<Schema>;
> 
> export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
>   'one' | 'many',
>   boolean,
>   TSchema,
>   TSchema[TableName]
> >['with'];
> 
> export type InferResultType<
>   TableName extends keyof TSchema,
>   With extends IncludeRelation<TableName> | undefined = undefined
> > = BuildQueryResult<
>   TSchema,
>   TSchema[TableName],
>   {
>     with: With;
>   }
> >;
> ```...