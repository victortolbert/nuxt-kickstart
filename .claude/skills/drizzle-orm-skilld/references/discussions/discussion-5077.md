---
number: 5077
title: "generateMigrations in api does not work unless dialect is \"postgresql\""
category: Q&A
created: 2025-11-29
url: "https://github.com/drizzle-team/drizzle-orm/discussions/5077"
upvotes: 1
comments: 1
answered: false
---

# generateMigrations in api does not work unless dialect is "postgresql"

I am getting this error, while using https://github.com/drepkovsky/drizzle-migrations
```
_ZodError: [
  {
    "received": "mysql",
    "code": "invalid_literal",
    "expected": "postgresql",
    "path": [
      "dialect"
    ],
    "message": "Invalid literal value, expected \"postgresql\""
  }
]
```

and I checked for the source and it seems like it is coming from
https://github.com/drizzle-team/drizzle-orm/blob/378b0432d549441fa61de200589a790f1171b6fe/drizzle-kit/src/api.ts#L99-L100
which comes from
https://github.com/drizzle-team/drizzle-orm/blob/378b0432d549441fa61de200589a790f1171b6fe/drizzle-kit/src/serializer/pgSchema.ts#L439

is it a know and intentional issue? what can I do next?

---

## Top Comments

**@me-nkr**:

I don't believe there is an api documentation for drizzle-kit api, but I read the code and there is apis for different databases. Just putting it here if anyone wants to know :)