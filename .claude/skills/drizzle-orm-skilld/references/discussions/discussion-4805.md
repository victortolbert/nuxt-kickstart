---
number: 4805
title: `enumValues.include()` accepts only values from the enum
category: Q&A
created: 2025-07-30
url: "https://github.com/drizzle-team/drizzle-orm/discussions/4805"
upvotes: 2
comments: 1
answered: false
---

# `enumValues.include()` accepts only values from the enum

So, I have been facing a problem and I can explain it with an example.

Let us say I have the following enum:

```ts
const supportTicketStatus = pgEnum("support_ticket_status", [
  "open",
  "closed",
  "resolved",
  "in_progress",
]);
```

and I want to check if a string is present in it:

```ts
const temp = "temp";
supportTicketStatus.enumValues.include(temp);
```

VS Code shows me the following message:

```plaintext
Argument of type 'string' is not assignable to parameter of type '"open" | "closed" | "resolved" | "in_progress"'
```

If I can only check values that are already a art of the enum, the `includes` method is redundant. Ideally, that message should not be shown

---

## Top Comments

**@Siddhesh-Agarwal**:

I can obviously do this to escape the problem:

```ts
const temp = "temp";
supportTicketStatus.enumValues.include(temp as any);
```

but that is a workaround