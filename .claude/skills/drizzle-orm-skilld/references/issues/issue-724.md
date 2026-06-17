---
number: 724
title: "[BUG]: jsonb always inserted as a json string when using postgres-js."
type: bug
state: closed
created: 2023-06-06
url: "https://github.com/drizzle-team/drizzle-orm/issues/724"
reactions: 54
comments: 42
labels: "[bug]"
---

# [BUG]: jsonb always inserted as a json string when using postgres-js.

### What version of `drizzle-orm` are you using?

0.26.5

### What version of `drizzle-kit` are you using?

0.18.1

### Describe the Bug

Inserting an object into a postgres jsonb field with db.insert only inserts a string when using the postgres-js.adapter.

### Expected behavior

With the pg package, an object is inserted using the code below, which is the expected behavior.

With the postgres-js package, a string is inserted into the table using the same code.

### Environment & setup

drizzle packages as above, and, "pg": "8.11.0" and "postgres": "3.3.5"

schema.ts:
import { pgTable, jsonb } from "drizzle-orm/pg-core";

export const logs = pgTable("log", {
  line: jsonb("line").$type(),
});

load.ts:

  let lines: { line: object }[] = [];
  let n = 0;

  for await (const line of rl) {
    const lineObj = JSON.parse(line);
    lines.push({ line: lineObj });

    if (++n > numLines) {
      await runFunction(lines);
      lines = [];
      n = 0;
    }
  }

  await runFunction(lines);

runFunction: async (lines) => {
      await db.insert(logs).values(lines);
    }
  
  