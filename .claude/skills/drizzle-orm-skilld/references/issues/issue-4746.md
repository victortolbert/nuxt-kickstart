---
number: 4746
title: "[BUG]: Bump `drizzle-zod` to `zod` v4"
type: bug
state: open
created: 2025-07-15
url: "https://github.com/drizzle-team/drizzle-orm/issues/4746"
reactions: 37
comments: 18
labels: "[bug]"
---

# [BUG]: Bump `drizzle-zod` to `zod` v4

### Report hasn't been filed before.

- [x] I have verified that the bug I'm about to report hasn't been filed before.

### What version of `drizzle-orm` are you using?

0.44.3

### What version of `drizzle-kit` are you using?

0.31.4

### Other packages

drizzle-zod@0.8.2

### Describe the Bug

The Zod package version has now switched to v4 and the previous `zod/v4` is no longer used. The `drizzle-zod` package needs to be updated to accommodate these changes so that using `--legacy-peer-deps` isn't needed (which is the current workaround).

---

## Top Comments

**@fearnworks** (+8):

Also an issue here

**@MickL** (+7):

Might be something for @L-Mario564 maybe?

But actually, is Drizzle dead? Just a few commits per months, 1400 open issues of which 560 issues are labeled as priority, 250 open pull requests...

**@mschinis** (+6):

Would also love to see this fixed, we would also like to upgrade our projects to zod v4