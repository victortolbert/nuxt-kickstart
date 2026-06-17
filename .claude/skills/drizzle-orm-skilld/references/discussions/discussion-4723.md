---
number: 4723
title: Warning  '@neondatabase/serverless' can only connect to remote Neon/Vercel Postgres/Supabase instances through a websocket, but it still works?
category: Q&A
created: 2025-07-08
url: "https://github.com/drizzle-team/drizzle-orm/discussions/4723"
upvotes: 1
comments: 2
answered: true
---

# Warning  '@neondatabase/serverless' can only connect to remote Neon/Vercel Postgres/Supabase instances through a websocket, but it still works?

What is the point of this warning when the migrations are working when using `@neondatabase/serverless`?

I was able to get rid of this warning for drizzle-kit by installing `pg` but I'd rather not do that, even as a dev dependency, if I can help it.

The warning (src) conflicts with the advice given when no driver is installed (src):

> To connect to Postgres database - please install either of 'pg', 'postgres', '@neondatabase/serverless'...

Main question:

Can I simply ignore this warning, since my migration is stil...

---

## Accepted Answer

Thanks @WilliamIsted but I have removed `pg` from the project and I have confirmed that it's been removed from `node_modules` as well as from my `package-lock.json` file.

My question is about why this warning shows, but now I think that I understand it now. I believe that it exists to let the developer know that `drizzle-kit` is about to use some WebSockets to connect in order to do the migration.

I think it's a pre-emptive warning to say "Hey, if anything goes wrong, make sure your DB is accessible via WebSockets!"