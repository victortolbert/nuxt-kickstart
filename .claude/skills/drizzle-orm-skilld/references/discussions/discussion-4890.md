---
number: 4890
title: Why drizzle db.query.<tbl>.findFirst does not return an optional value?
category: Q&A
created: 2025-08-30
url: "https://github.com/drizzle-team/drizzle-orm/discussions/4890"
upvotes: 1
comments: 0
answered: false
---

# Why drizzle db.query.<tbl>.findFirst does not return an optional value?

I picked drizzle orm considering it's strong type safety and just realized `db.query.<tbl>.findFirst` does not return an optional value while at runtime I can get undefined without error out. Is there a way to fix typing or do I have to manually type every repository function I have to include `Promise<ExpType | undefined>`? 