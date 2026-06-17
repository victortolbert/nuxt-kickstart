---
number: 5374
title: How i use pglite on docker by alpine image ?
category: Q&A
created: 2026-02-15
url: "https://github.com/drizzle-team/drizzle-orm/discussions/5374"
upvotes: 1
comments: 3
answered: false
---

# How i use pglite on docker by alpine image ?

I use `bun + elysia + drizzle-orm + pglite`, and i run direct `bun run src/index.ts`, it can auto create `pglite.data` dir.
```ts
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'

      const client = new PGlite('pglite.data')
      const db = drizzle({ client, schema, casing: 'snake_case' })
```
I use it on docker
```Dockerfile
FROM bun:alpine AS build
WORKDIR /work
COPY package.json bun.lock bunfig.toml tsconfig.json ./
RUN bun install
COPY ./src ./src
RUN bun run build

## js runtime, bun run build -js
FROM bun:alpine
WORKDIR /work
COPY --from=build /work/dist ./
COPY ./drizzle ./drizzle
ENTRYPOINT ["bun", "run", "index.js"]
```
I got error
...

---

## Top Comments

**@wesleysmyth**:

The `EISDIR` error typically happens because PGlite tries to initialize its data directory and something about the Alpine container's filesystem conflicts. Two main causes:

### 1. Alpine uses musl libc — PGlite can have issues

PGlite bundles a WASM build of PostgreSQL. While WASM itself is libc-agnostic, PGlite's Node.js bindings and filesystem operations can behave differently on musl (Alpine) vs glibc (Debian/Ubuntu).

**Fix: Switch to a Debian-based image:**

```dockerfile
# Instead of node:22-alpine or oven/bun:alpine
FROM oven/bun:latest
# or
FROM node:22-slim
```

...

**@seepine**:

## The minimum reproducing case.

```sh
bun init
bun add @electric-sql/pglite
```

Touch index.ts
```ts
import { PGlite } from '@electric-sql/pglite'

const client = new PGlite(process.env.DATABASE_URL)
client.exec('SELECT 1').then((res) => console.log(res))
```

## Dev
It can work.

```sh
$ bun run index.ts                
[
  {
    rows: [
      [Object ...]
    ],
    fields: [
      [Object ...]
    ],
    affectedRows: 0,
  }
]
```

## In docker

Create Dockerfile
```dockerfile
FROM oven/bun:alpine AS build
WORKDIR /work
COPY package.json tsconfig.json ./
RUN bun install
COPY index.ts index.ts
RUN bun build index.ts --outdir dist
ENTRYPOINT ["bun", "run", "dist/index.js"]
```...

**@seepine**:

I found some about this

[Bug] Bun bundle not work with PgLite
https://github.com/electric-sql/pglite/issues/414

Temporary solution
https://github.com/electric-sql/pglite/issues/478#issuecomment-3393442616