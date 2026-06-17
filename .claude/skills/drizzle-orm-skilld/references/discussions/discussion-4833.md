---
number: 4833
title: What's the best way to push schema updates to production?
category: Q&A
created: 2025-08-06
url: "https://github.com/drizzle-team/drizzle-orm/discussions/4833"
upvotes: 1
comments: 1
answered: true
---

# What's the best way to push schema updates to production?

I use drizzle with supabase and Next.js 15 all deployed on Vercel... It has been over a year since I have touched my DB so I kind of forgot the _best_ way to push changes to my production DB as I have done everything locally. I vaguely remember updating my `.env` file to point to my production DB and I _think_ doing `drizzle-kit generate` followed by `drizzle-kit migrate` and then `drizzle-kit push`.

Is that still the only way of getting my changes to my prod DB? I have a PR open and tried to view the preview but things failed due to the DB not being updated (obviously)... I just want to make sure I do things _properly_.

---

## Accepted Answer

Looks like the _solution_ is to add `drizzle-kit migrate` to the build command.