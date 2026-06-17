Drizzle ORM - [OLD] Query V1

We've merged alternation-engine into Beta release. Try it out!

 Documentation

33k+ 

Dark

System

meet drizzle

Get started Sustainability Why Drizzle? Guides Tutorials Latest releases Gotchas

Upgrade to v1.0 RC

 How to upgrade? Relational Queries v1 to v2

Fundamentals

 Schema Relations Database connection Query Data Migrations

Connect

PostgreSQL Gel MySQL SQLite MSSQL CockroachDB SingleStore

PlanetScale Postgres Neon Vercel Postgres Prisma Postgres Supabase Xata PGLite Nile Bun SQL Effect Postgres

PlanetScale MySQL TiDB

Turso Cloud Turso Database SQLite Cloud Cloudflare D1 Bun SQLite Node SQLite Cloudflare Durable Objects

Expo SQLite OP SQLite React Native SQLite

AWS Data API Postgres AWS Data API MySQL

Drizzle Proxy

Expand

Manage schema

 Data types Indexes & Constraints Sequences Views Schemas Drizzle Relations Row-Level Security (RLS)Extensions

[\[OLD\] Drizzle Relations](https://orm.drizzle.team/docs/relations)

Migrations

 Overview `generate` `migrate` `push` `pull` `export` `check` `up` `studio` Custom migrations Migrations for teams Web and mobile drizzle.config.ts

Seeding

 Overview Generators Versioning

Access your data

 Query Select Insert Update Delete Filters Utils Joins Magic sql`` operator

[\[OLD\] Query V1](https://orm.drizzle.team/docs/rqb)

[Modes](#modes) [Querying](#querying) [Find many](#find-many) [Find first](#find-first) [Include relations](#include-relations) [Partial fields select](#partial-fields-select) [Nested partial fields select](#nested-partial-fields-select) [Select filters](#select-filters) [Limit & Offset](#limit--offset) [Order By](#order-by) [Include custom fields](#include-custom-fields) [Prepared statements](#prepared-statements)

Performance

 Queries Serverless

Advanced

 Set Operations Generated Columns Transactions Batch Cache Dynamic query building Read Replicas Custom types Goodies

Validations

 zod valibot typebox arktype typebox-legacy effect-schema

Extensions

 Prisma ESLint Plugin drizzle-graphql

System Light Dark

Become a Sponsor Twitter Discord

v1.0 98%

Benchmarks

Extension

Studio

Studio Package

Gateway

Drizzle Run

Our goodies!

Our Primary backer Our Cloud Partner

     Drizzle is giving you 10% off Turso Scaler and Pro for 1 Year           

Product by Drizzle Team

One Dollar Stats $1 per mo web analytics christmas  deal

# Drizzle Queries

PostgreSQL

SQLite

MySQL

SingleStore

Drizzle ORM is designed to be a thin typed layer on top of SQL. We truly believe we’ve designed the best way to operate an SQL database from TypeScript and it’s time to make it better.

Relational queries are meant to provide you with a great developer experience for querying nested relational data from an SQL database, avoiding multiple joins and complex data mappings.

It is an extension to the existing schema definition and query builder. You can opt-in to use it based on your needs. We’ve made sure you have both the best-in-class developer experience and performance.

index.ts

schema.ts

__

```
import * as schema from './schema';
import { drizzle } from 'drizzle-orm/...';

const db = drizzle({ schema });

const result = await db._query.users.findMany({
	with: {
		posts: true			
	},
});
```

__

```
[{
	id: 10,
	name: "Dan",
	posts: [
		{
			id: 1,
			content: "SQL is awesome",
			authorId: 10,
		},
		{
			id: 2,
			content: "But check relational queries",
			authorId: 10,
		}
	]
}]
```

__

```
import { integer, serial, text, pgTable } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts),
}));

export const posts = pgTable('posts', {
	id: serial('id').primaryKey(),
	content: text('content').notNull(),
	authorId: integer('author_id').notNull(),
});

export const postsRelations = relations(posts, ({ one }) => ({
	author: one(users, { fields: [posts.authorId], references: [users.id] }),
}));
```

 If you have SQL schema declared in multiple files you can do it like that

index.ts

schema1.ts

schema2.ts

__

```
import * as schema1 from './schema1';
import * as schema2 from './schema2';
import { drizzle } from 'drizzle-orm/...';

const db = drizzle({ schema: { ...schema1, ...schema2 } });

const result = await db._query.users.findMany({
	with: {
		posts: true			
	},
});
```

__

```
// schema declaration in the first file
```

__

```
// schema declaration in the second file
```

## Modes [](#modes)

Drizzle relational queries always generate exactly one SQL statement to run on the database and it has certain caveats. To have best in class support for every database out there we’ve introduced **`modes`**.

Drizzle relational queries use lateral joins of subqueries under the hood and for now PlanetScale does not support them.

When using **mysql2** driver with regular **MySQL** database — you should specify `mode: "default"` When using **mysql2** driver with **PlanetScale** — you need to specify `mode: "planetscale"`

__

```
import * as schema from './schema';
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  uri: process.env.PLANETSCALE_DATABASE_URL,
});

const db = drizzle({ client: connection, schema, mode: 'planetscale' });
```

## Querying [](#querying)

Relational queries are an extension to Drizzle’s original **query builder**. You need to provide all `tables` and `relations` from your schema file/files upon `drizzle()` initialization and then just use the `db._query` API.

`drizzle` import path depends on the **database driver** you’re using.

index.ts

schema.ts

__

```
import * as schema from './schema';
import { drizzle } from 'drizzle-orm/...';

const db = drizzle({ schema });

await db._query.users.findMany(...);
```

__

```
// if you have schema in multiple files
import * as schema1 from './schema1';
import * as schema2 from './schema2';
import { drizzle } from 'drizzle-orm/...';

const db = drizzle({ schema: { ...schema1, ...schema2 } });

await db._query.users.findMany(...);
```

__

```
	import { type AnyPgColumn, boolean, integer, pgTable, primaryKey, serial, text, timestamp } from 'drizzle-orm/pg-core';

	import { relations } from 'drizzle-orm';

	export const users = pgTable('users', {
		id: serial('id').primaryKey(),
		name: text('name').notNull(),
		verified: boolean('verified').notNull(),
		invitedBy: integer('invited_by').references((): AnyPgColumn => users.id),
	});

	export const usersRelations = relations(users, ({ one, many }) => ({
		invitee: one(users, { fields: [users.invitedBy], references: [users.id] }),
		usersToGroups: many(usersToGroups),
		posts: many(posts),
	}));

	export const groups = pgTable('groups', {
		id: serial('id').primaryKey(),
		name: text('name').notNull(),
		description: text('description'),
	});

	export const groupsRelations = relations(groups, ({ many }) => ({
		usersToGroups: many(usersToGroups),
	}));

	export const usersToGroups = pgTable('users_to_groups', {
		id: serial('id').primaryKey(),
		userId: integer('user_id').notNull().references(() => users.id),
		groupId: integer('group_id').notNull().references(() => groups.id),
	}, (t) => [
		primaryKey({ columns: [t.userId, t.groupId] })
	]);

	export const usersToGroupsRelations = relations(usersToGroups, ({ one }) => ({
		group: one(groups, { fields: [usersToGroups.groupId], references: [groups.id] }),
		user: one(users, { fields: [usersToGroups.userId], references: [users.id] }),
	}));

	export const posts = pgTable('posts', {
		id: serial('id').primaryKey(),
		content: text('content').notNull(),
		authorId: integer('author_id').references(() => users.id),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	});

	export const postsRelations = relations(posts, ({ one, many }) => ({
		author: one(users, { fields: [posts.authorId], references: [users.id] }),
		comments: many(comments),
	}));

	export const comments = pgTable('comments', {
		id: serial('id').primaryKey(),
		content: text('content').notNull(),
		creator: integer('creator').references(() => users.id),
		postId: integer('post_id').references(() => posts.id),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	});

	export const commentsRelations = relations(comments, ({ one, many }) => ({
		post: one(posts, { fields: [comments.postId], references: [posts.id] }),
		author: one(users, { fields: [comments.creator], references: [users.id] }),
		likes: many(commentLikes),
	}));

	export const commentLikes = pgTable('comment_likes', {
		id: serial('id').primaryKey(),
		creator: integer('creator').references(() => users.id),
		commentId: integer('comment_id').references(() => comments.id),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	});

	export const commentLikesRelations = relations(commentLikes, ({ one }) => ({
		comment: one(comments, { fields: [commentLikes.commentId], references: [comments.id] }),
		author: one(users, { fields: [commentLikes.creator], references: [users.id] }),
	}));
```

Drizzle provides `.findMany()` and `.findFirst()` APIs.

### Find many [](#find-many)

__

```
const users = await db._query.users.findMany();
```

__

```
// result type
const result: {
	id: number;
	name: string;
	verified: boolean;
	invitedBy: number | null;
}[];
```

### Find first [](#find-first)

`.findFirst()` will add `limit 1` to the query.

__

```
const user = await db._query.users.findFirst();
```

__

```
// result type
const result: {
	id: number;
	name: string;
	verified: boolean;
	invitedBy: number | null;
};
```

### Include relations [](#include-relations)

`With` operator lets you combine data from multiple related tables and properly aggregate results.

**Getting all posts with comments:**

__

```
const posts = await db._query.posts.findMany({
	with: {
		comments: true,
	},
});
```

**Getting first post with comments:**

__

```
const post = await db._query.posts.findFirst({
	with: {
		comments: true,
	},
});
```

You can chain nested with statements as much as necessary. For any nested `with` queries Drizzle will infer types using Core Type API.

**Get all users with posts. Each post should contain a list of comments:**

__

```
const users = await db._query.users.findMany({
	with: {
		posts: {
			with: {
				comments: true,
			},
		},
	},
});
```

### Partial fields select [](#partial-fields-select)

`columns` parameter lets you include or omit columns you want to get from the database.

Drizzle performs partial selects on the query level, no additional data is transferred from the database.

Keep in mind that **a single SQL statement is outputted by Drizzle.**

**Get all posts with just `id`, `content` and include `comments`:**

__

```
const posts = await db._query.posts.findMany({
	columns: {
		id: true,
		content: true,
	},
	with: {
		comments: true,
	}
});
```

**Get all posts without `content`:**

__

```
const posts = await db._query.posts.findMany({
	columns: {
		content: false,
	},
});
```

When both `true` and `false` select options are present, all `false` options are ignored.

If you include the `name` field and exclude the `id` field, `id` exclusion will be redundant, all fields apart from `name` would be excluded anyways.

**Exclude and Include fields in the same query:**

__

```
const users = await db._query.users.findMany({
	columns: {
		name: true,
		id: false //ignored
	},
});
```

__

```
// result type
const users: {
	name: string;
};
```

**Only include columns from nested relations:**

__

```
const res = await db._query.users.findMany({
	columns: {},
	with: {
		posts: true
	}
});
```

__

```
// result type
const res: {
	posts: {
		id: number,
		text: string
	}
}[];
```

### Nested partial fields select [](#nested-partial-fields-select)

Just like with **[`partial select`](#partial-select)**, you can include or exclude columns of nested relations:

__

```
const posts = await db._query.posts.findMany({
	columns: {
		id: true,
		content: true,
	},
	with: {
		comments: {
			columns: {
				authorId: false
			}
		}
	}
});
```

### Select filters [](#select-filters)

Just like in our SQL-like query builder, relational queries API lets you define filters and conditions with the list of our **`operators`**.

You can either import them from `drizzle-orm` or use from the callback syntax:

__

```
import { eq } from 'drizzle-orm';

const users = await db._query.users.findMany({
	where: eq(users.id, 1)
})
```

__

```
const users = await db._query.users.findMany({
	where: (users, { eq }) => eq(users.id, 1),
})
```

Find post with `id=1` and comments that were created before particular date:

__

```
await db._query.posts.findMany({
	where: (posts, { eq }) => (eq(posts.id, 1)),
	with: {
		comments: {
			where: (comments, { lt }) => lt(comments.createdAt, new Date()),
		},
	},
});
```

### Limit & Offset [](#limit--offset)

Drizzle ORM provides `limit` & `offset` API for queries and for the nested entities.

**Find 5 posts:**

__

```
await db._query.posts.findMany({
	limit: 5,
});
```

**Find posts and get 3 comments at most:**

__

```
await db._query.posts.findMany({
	with: {
		comments: {
			limit: 3,
		},
	},
});
```

IMPORTANT

`offset` is only available for top level query.

__

```
await db._query.posts.findMany({
	limit: 5,
	offset: 2, // correct ✅
	with: {
		comments: {
			offset: 3, // incorrect ❌
			limit: 3,
		},
	},
});
```

Find posts with comments from the 5th to the 10th post:

__

```
await db._query.posts.findMany({
	limit: 5,
  offset: 5,
	with: {
		comments: true,
	},
});
```

### Order By [](#order-by)

Drizzle provides API for ordering in the relational query builder.

You can use same ordering **core API** or use `order by` operator from the callback with no imports.

__

```
import { desc, asc } from 'drizzle-orm';

await db._query.posts.findMany({
	orderBy: [asc(posts.id)],
});
```

__

```
await db._query.posts.findMany({
	orderBy: (posts, { asc }) => [asc(posts.id)],
});
```

**Order by `asc` + `desc`:**

__

```
await db._query.posts.findMany({
	orderBy: (posts, { asc }) => [asc(posts.id)],
	with: {
		comments: {
			orderBy: (comments, { desc }) => [desc(comments.id)],
		},
	},
});
```

### Include custom fields [](#include-custom-fields)

Relational query API lets you add custom additional fields. It’s useful when you need to retrieve data and apply additional functions to it.

IMPORTANT

As of now aggregations are not supported in `extras`, please use **`core queries`** for that.

__

```
import { sql } from 'drizzle-orm';

await db._query.users.findMany({
	extras: {
		loweredName: sql\`lower(${users.name})\`.as('lowered_name'),
	},
})
```

__

```
await db._query.users.findMany({
	extras: {
		loweredName: (users, { sql }) => sql\`lower(${users.name})\`.as('lowered_name'),
	},
})
```

`lowerName` as a key will be included to all fields in returned object.

IMPORTANT

You have to explicitly specify `.as("<name_for_column>")`

To retrieve all users with groups, but with the fullName field included (which is a concatenation of firstName and lastName), you can use the following query with the Drizzle relational query builder.

__

```
const res = await db._query.users.findMany({
	extras: {
		fullName: sql<string>\`concat(${users.name}, " ", ${users.name})\`.as('full_name'),
	},
	with: {
		usersToGroups: {
			with: {
				group: true,
			},
		},
	},
});
```

__

```
// result type
const res: {
	id: number;
	name: string;
	verified: boolean;
	invitedBy: number | null;
	fullName: string;
	usersToGroups: {
			group: {
					id: number;
					name: string;
					description: string | null;
			};
	}[];
}[];
```

To retrieve all posts with comments and add an additional field to calculate the size of the post content and the size of each comment content:

__

```
const res = await db._query.posts.findMany({
	extras: (table, { sql }) => ({
		contentLength: (sql<number>\`length(${table.content})\`).as('content_length'),
	}),
	with: {
		comments: {
			extras: {
				commentSize: sql<number>\`length(${comments.content})\`.as('comment_size'),
			},
		},
	},
});
```

__

```
// result type
const res: {
	id: number;
	createdAt: Date;
	content: string;
	authorId: number | null;
	contentLength: number;
	comments: {
			id: number;
			createdAt: Date;
			content: string;
			creator: number | null;
			postId: number | null;
			commentSize: number;
	}[];
};
```

### Prepared statements [](#prepared-statements)

Prepared statements are designed to massively improve query performance — see here.

In this section, you can learn how to define placeholders and execute prepared statements using the Drizzle relational query builder.

##### **Placeholder in `where`**[](#placeholder-in-where)

PostgreSQL

MySQL

SQLite

__

```
const prepared = db._query.users.findMany({
	where: ((users, { eq }) => eq(users.id, placeholder('id'))),
	with: {
		posts: {
			where: ((users, { eq }) => eq(users.id, placeholder('pid'))),
		},
	},
}).prepare('query_name');

const usersWithPosts = await prepared.execute({ id: 1 });
```

__

```
const prepared = db._query.users.findMany({
	where: ((users, { eq }) => eq(users.id, placeholder('id'))),
	with: {
		posts: {
			where: ((users, { eq }) => eq(users.id, placeholder('pid'))),
		},
	},
}).prepare();

const usersWithPosts = await prepared.execute({ id: 1 });
```

__

```
const prepared = db._query.users.findMany({
	where: ((users, { eq }) => eq(users.id, placeholder('id'))),
	with: {
		posts: {
			where: ((users, { eq }) => eq(users.id, placeholder('pid'))),
		},
	},
}).prepare();

const usersWithPosts = await prepared.execute({ id: 1 });
```

##### **Placeholder in `limit`**[](#placeholder-in-limit)

PostgreSQL

MySQL

SQLite

__

```
const prepared = db._query.users.findMany({
	with: {
		posts: {
			limit: placeholder('limit'),
		},
	},
}).prepare('query_name');

const usersWithPosts = await prepared.execute({ limit: 1 });
```

__

```
const prepared = db._query.users.findMany({
	with: {
		posts: {
			limit: placeholder('limit'),
		},
	},
}).prepare();

const usersWithPosts = await prepared.execute({ limit: 1 });
```

__

```
const prepared = db._query.users.findMany({
	with: {
		posts: {
			limit: placeholder('limit'),
		},
	},
}).prepare();

const usersWithPosts = await prepared.execute({ limit: 1 });
```

##### **Placeholder in `offset`**[](#placeholder-in-offset)

PostgreSQL

MySQL

SQLite

__

```
const prepared = db._query.users.findMany({
	offset: placeholder('offset'),
	with: {
		posts: true,
	},
}).prepare('query_name');

const usersWithPosts = await prepared.execute({ offset: 1 });
```

__

```
const prepared = db._query.users.findMany({
	offset: placeholder('offset'),
	with: {
		posts: true,
	},
}).prepare();

const usersWithPosts = await prepared.execute({ offset: 1 });
```

__

```
const prepared = db._query.users.findMany({
	offset: placeholder('offset'),
	with: {
		posts: true,
	},
}).prepare();

const usersWithPosts = await prepared.execute({ offset: 1 });
```

##### **Multiple placeholders**[](#multiple-placeholders)

PostgreSQL

MySQL

SQLite

__

```
const prepared = db._query.users.findMany({
	limit: placeholder('uLimit'),
	offset: placeholder('uOffset'),
	where: ((users, { eq, or }) => or(eq(users.id, placeholder('id')), eq(users.id, 3))),
	with: {
		posts: {
			where: ((users, { eq }) => eq(users.id, placeholder('pid'))),
			limit: placeholder('pLimit'),
		},
	},
}).prepare('query_name');

const usersWithPosts = await prepared.execute({ pLimit: 1, uLimit: 3, uOffset: 1, id: 2, pid: 6 });
```

__

```
const prepared = db._query.users.findMany({
	limit: placeholder('uLimit'),
	offset: placeholder('uOffset'),
	where: ((users, { eq, or }) => or(eq(users.id, placeholder('id')), eq(users.id, 3))),
	with: {
		posts: {
			where: ((users, { eq }) => eq(users.id, placeholder('pid'))),
			limit: placeholder('pLimit'),
		},
	},
}).prepare();

const usersWithPosts = await prepared.execute({ pLimit: 1, uLimit: 3, uOffset: 1, id: 2, pid: 6 });
```

__

```
const prepared = db._query.users.findMany({
	limit: placeholder('uLimit'),
	offset: placeholder('uOffset'),
	where: ((users, { eq, or }) => or(eq(users.id, placeholder('id')), eq(users.id, 3))),
	with: {
		posts: {
			where: ((users, { eq }) => eq(users.id, placeholder('pid'))),
			limit: placeholder('pLimit'),
		},
	},
}).prepare();

const usersWithPosts = await prepared.execute({ pLimit: 1, uLimit: 3, uOffset: 1, id: 2, pid: 6 });
```