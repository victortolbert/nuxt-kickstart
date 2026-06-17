---
number: 5450
title: Why is prisma being installed?
category: Q&A
created: 2026-03-06
url: "https://github.com/drizzle-team/drizzle-orm/discussions/5450"
upvotes: 1
comments: 2
answered: false
---

# Why is prisma being installed?

Why is prisma being install in my pnpm monorepo? I have `drizzle-orm` installed in root but no reference to prisma. See:

```
pnpm why prisma
prisma@7.4.2
├─┬ @prisma/client@7.4.2
│ └─┬ drizzle-orm@0.44.7
│   └── @relevan/monorepo@0.1.0 (devDependencies)
└── drizzle-orm@0.44.7 [deduped]

Found 1 version of prisma
```

I see prisma is listed as optional peer dependency, but that shouldn't make it be installed, right?

---

## Top Comments

**@AndriiSherman** [maintainer]:

it should not install peer deps, unless pnpm is doing it by default
but we will remove prisma from peerDeps as well so there shouldn't by any issues

**@Felipeness**:

pnpm is being overly helpful here. Since v8, `auto-install-peers=true` is the default, and it doesn't distinguish between required and optional peer deps — so it pulls in `@prisma/client` because drizzle lists it as an optional peer (along with every other driver it supports).

Quickest fix — add to your `.npmrc`:

```ini
auto-install-peers=true
optional-peers=false
```

Or if you want something more surgical, tell pnpm to ignore that specific peer in `package.json`:

```json
"pnpm": {
  "peerDependencyRules": {
    "ignoreMissing": ["@prisma/client"]
  }
}
```

...