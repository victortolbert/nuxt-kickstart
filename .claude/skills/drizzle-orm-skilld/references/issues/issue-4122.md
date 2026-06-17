---
number: 4122
title: "[BUG]: Drizzle kit doesn't use bun sql driver for 'push' command"
type: bug
state: open
created: 2025-02-15
url: "https://github.com/drizzle-team/drizzle-orm/issues/4122"
reactions: 53
comments: 16
labels: "[bug, drizzle/kit, driver/bun-sql, bug/fixed-in-beta]"
---

# [BUG]: Drizzle kit doesn't use bun sql driver for 'push' command

### Report hasn't been filed before.

- [x] I have verified that the bug I'm about to report hasn't been filed before.

### What version of `drizzle-orm` are you using?

0.39.3

### What version of `drizzle-kit` are you using?

0.30.4

### Other packages

_No response_

### Describe the Bug

I've migrated to bun sql from `pg` driver (Using bun `1.2.2`). Since then, `bun drizzle-kit push` doesn't work:
```
No config path provided, using default 'drizzle.config.ts'
Reading config file '__PATH__/api/drizzle.config.ts'
To connect to Postgres database - please install either of 'pg', 'postgres', '@neondatabase/serverless' or '@vercel/postgres' drivers
error: "drizzle-kit" exited with code 1
```

My config file:
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema",
  out: "./src/db/migrations",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
```

Schema file:
```ts
import { drizzle } from "drizzle-orm/bun-sql";

import * as authSchema from "./schema/auth";

export const schema = {
  ...authSchema,
};

export const db = drizzle(Bun.env.POSTGRES_URL!, { schema });
```


---

## Top Comments

**@michaelhue** (+16):

@qimalan You need to add the `--bun` flag, i.e. `bun run --bun drizzle-kit push`.

That has nothing to do with this issue though, let's keep it on topic. :)

---

It seems that there already is a pull request that adresses this issue, but it hasn't been merged yet:

- https://github.com/drizzle-team/drizzle-orm/pull/4109

**@qimalan** (+3):

> > same issue. And drizzle-kit  v0.30.5 can not reading environment variables via Bun.env,only process.env
> 
> I'll check it later to confirm, but I'm pretty sure it works with Bun.env

 you can change

`dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
` 

to
 
`
  dbCredentials: {
    url: Bun.env.DATABASE_URL!,
  },
`
in drizzle.config.ts and bun drizzle-kit push,will got "Bun is not defined"

**@SohelIslamImran** (+6):

I'm facing the same issue...
