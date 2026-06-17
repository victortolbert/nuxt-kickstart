---
number: 3728
title: "[BUG] Cloudflare D1: drizzle-kit push is not working (error 7500 SQLITE_AUTH)"
type: bug
state: closed
created: 2024-12-09
url: "https://github.com/drizzle-team/drizzle-orm/issues/3728"
reactions: 44
comments: 23
labels: "[bug, db/sqlite]"
---

# [BUG] Cloudflare D1: drizzle-kit push is not working (error 7500 SQLITE_AUTH)

### Report hasn't been filed before.

- [X] I have verified that the bug I'm about to report hasn't been filed before.

### What version of `drizzle-orm` are you using?

0.38.0

### What version of `drizzle-kit` are you using?

0.30.0

### Other packages

_No response_

### Describe the Bug

I followed the docs (btw: driver ist missing in the example) but `drizzle-kit push` gives an error:

```
Error: 7500: not authorized: SQLITE_AUTH
    at remoteCallback (/Users/mick/git/.../node_modules/drizzle-kit/bin.cjs:78956:21)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async Object.query (/Users/mick/git/.../node_modules/drizzle-kit/bin.cjs:78980:27)
    at async logSuggestionsAndReturn (/Users/mick/git/.../node_modules/drizzle-kit/bin.cjs:45182:23)
    at async sqlitePush (/Users/mick/git/.../node_modules/drizzle-kit/bin.cjs:82108:13)
    at async Object.handler (/Users/mick/git/.../node_modules/drizzle-kit/bin.cjs:92040:9)
    at async run (/Users/mick/git/.../node_modules/drizzle-kit/bin.cjs:90337:7)
```

In contrast `drizzle-kit studio` is working fine, I can create tables and items as well as `drizzle-kit generated` and `drizzle-kit migrate`.

---

## Top Comments

**@MickL** (+32):

If you have the same experience guys, please upvote the issue

**@MickL** (+8):

Your answer is not even related to this issue. Is this AI generated?

How to set up Drizzle with Wrangler is already shown in the docs. `generate` and `migrate`, as you show there, both work fine. This issue is about `push` not working.

**@kholisrag** (+4):

have same issue when using `drizzle-kit push` with Cloudflare D1 too

```bash
❯ bunx drizzle-kit push
No config path provided, using default 'drizzle.config.ts'
Reading config file '/Users/petrukngantuk/oprek/labs/drizzle.config.ts'
[✓] Pulling schema from database...
Error: 7500: not authorized: SQLITE_AUTH
    at remoteCallback (/Users/petrukngantuk/oprek/labs/node_modules/drizzle-kit/bin.cjs:79120:21)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async Object.query (/Users/petrukngantuk/oprek/labs/node_modules/drizzle-kit/bin.cjs:79144:27)
    at async logSuggestionsAndReturn (/Users/petrukngantuk/oprek/labs/node_modules/drizzle-kit/bin.cjs:45204:23)
    at async sqlitePush (/Users/petrukngantuk/oprek/labs/node_modules/drizzle-kit/bin.cjs:82272:13)
    at async Object.handler (/Users/petrukngantuk/oprek/labs/node_modules/drizzle-kit/bin.cjs:92204:9)
    at async run (/Users/petrukngantuk/oprek/labs/node_modules/drizzle-kit/bin.cjs:90501:7)
```...