---
number: 2463
title: "[BUG]: Cloudflare D1 transaction not supported"
type: bug
state: open
created: 2024-06-05
url: "https://github.com/drizzle-team/drizzle-orm/issues/2463"
reactions: 39
comments: 16
labels: "[bug, qb/transactions, priority, driver/d1]"
---

# [BUG]: Cloudflare D1 transaction not supported

### What version of `drizzle-orm` are you using?

0.31.1

### What version of `drizzle-kit` are you using?

0.22.2

### Describe the Bug

When trying to execute a transacction with cloudflare d1 adapter it throws the following error:

> To execute a transaction, please use the state.storage.transaction() API instead of the SQL BEGIN TRANSACTION or SAVEPOINT statements. The JavaScript API is safer because it will automatically roll back on exceptions, and because it interacts correctly with Durable Objects' automatic atomic write coalescing.

To reproduce create a project using c3

```js
import { drizzle } from 'drizzle-orm/d1';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const db = drizzle(env.DB);

		await db.transaction(async (tx) => {
			// Throws error
		});

		return new Response('OK');
	}
};
```


### Expected behavior

_No response_

### Environment & setup

_No response_