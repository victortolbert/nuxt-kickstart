Drizzle ORM - Set Operations

We've merged alternation-engine into Beta release. Try it out!

 Documentation

33k+ 

Dark

System

meet drizzle

Get started Sustainability Why Drizzle? Guides Tutorials Latest releases Gotchas

Upgrade to v1.0 RC

 How to upgrade? Relational Queries v1 to v2

Fundamentals

 Schema Relations Database connection Query Data Migrations

Connect

PostgreSQL Gel MySQL SQLite MSSQL CockroachDB SingleStore

PlanetScale Postgres Neon Vercel Postgres Prisma Postgres Supabase Xata PGLite Nile Bun SQL Effect Postgres

PlanetScale MySQL TiDB

Turso Cloud Turso Database SQLite Cloud Cloudflare D1 Bun SQLite Node SQLite Cloudflare Durable Objects

Expo SQLite OP SQLite React Native SQLite

AWS Data API Postgres AWS Data API MySQL

Drizzle Proxy

Expand

Manage schema

 Data types Indexes & Constraints Sequences Views Schemas Drizzle Relations Row-Level Security (RLS)Extensions

[\[OLD\] Drizzle Relations](https://orm.drizzle.team/docs/relations)

Migrations

 Overview `generate` `migrate` `push` `pull` `export` `check` `up` `studio` Custom migrations Migrations for teams Web and mobile drizzle.config.ts

Seeding

 Overview Generators Versioning

Access your data

 Query Select Insert Update Delete Filters Utils Joins [Magic sql`` operator](https://orm.drizzle.team/docs/sql)

[\[OLD\] Query V1](https://orm.drizzle.team/docs/rqb)

Performance

[ Queries](https://orm.drizzle.team/docs/perf-queries) [Serverless](https://orm.drizzle.team/docs/perf-serverless)

Advanced

[ Set Operations](https://orm.drizzle.team/docs/set-operations)

[Union](#union) [Union All](#union-all) [Intersect](#intersect) [Intersect All](#intersect-all) [Except](#except) [Except All](#except-all)

[Generated Columns](https://orm.drizzle.team/docs/generated-columns) [Transactions](https://orm.drizzle.team/docs/transactions) [Batch](https://orm.drizzle.team/docs/batch-api) [Cache](https://orm.drizzle.team/docs/cache) [Dynamic query building](https://orm.drizzle.team/docs/dynamic-query-building) [Read Replicas](https://orm.drizzle.team/docs/read-replicas) [Custom types](https://orm.drizzle.team/docs/custom-types) [Goodies](https://orm.drizzle.team/docs/goodies)

Validations

[ zod](https://orm.drizzle.team/docs/zod) [valibot](https://orm.drizzle.team/docs/valibot) [typebox](https://orm.drizzle.team/docs/typebox) [arktype](https://orm.drizzle.team/docs/arktype) [typebox-legacy](https://orm.drizzle.team/docs/typebox-legacy) [effect-schema](https://orm.drizzle.team/docs/effect-schema)

Extensions

[ Prisma](https://orm.drizzle.team/docs/prisma) [ESLint Plugin](https://orm.drizzle.team/docs/eslint-plugin) [drizzle-graphql](https://orm.drizzle.team/docs/graphql)

System Light Dark

[Become a Sponsor](https://driz.link/sponsor) [Twitter](https://mobile.twitter.com/DrizzleORM) [Discord](https://discord.gg/yfjTbVXMW4)

[v1.0 98%](https://orm.drizzle.team/roadmap)

[Benchmarks](https://orm.drizzle.team/benchmarks)

[Extension](https://driz.link/extension)

[Studio](https://orm.drizzle.team/drizzle-studio/overview)

[Studio Package](https://github.com/drizzle-team/drizzle-studio-npm)

[Gateway](https://gateway.drizzle.team)

[Drizzle Run](https://drizzle.run)

Our goodies!

[Our Primary backer![](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==)![PlanetScale](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==)](https://driz.link/planetscale) [Our Cloud Partner![](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==)![Railway](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==)](https://driz.link/railway)

[![](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==)![GibsonAI](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==)](https://driz.link/gibsonai) [![](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==)![Clerk](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==)](https://clerk.com) [![](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==)![Warp](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==)](https://driz.link/warp) [![](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==)![Turso](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==) 🚀 Drizzle is giving you 10% off Turso Scaler and Pro for 1 Year 🚀](https://driz.link/turso) [![](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==)![Payload](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==)](https://driz.link/payload) [![](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xMDU0LjM1IDM3OS4xNEMxMDU0LjI0IDQ2OS4xMzcgMTAxOC4zNSA1NTUuNDA4IDk1NC41NiA2MTguOTcxVjYxOC45NjRMNzI4LjI3MyA4NDQuNDVDNzIwLjQzMiA4NTIuMjcgNzA3LjY5MyA4NTIuMjkgNzAwLjM0NiA4NDQuMDFDNjQ1LjMzMSA3ODIuMDE4IDYxNC43NTggNzAxLjgzOCA2MTQuODU2IDYxOC41MzVDNjE0Ljk2MSA1MjguNTM4IDY1MC44NTYgNDQyLjI2OCA3MTQuNjQzIDM3OC43MDVMNzE0LjY1IDM3OC43MTFMOTIxLjM5IDE3Mi42OTdDOTQwLjAyIDE1NC4xMjggOTcwLjUxIDE1My45OTYgOTg2LjMxIDE3NS4wMjJDMTAzMC4zIDIzMy41NDcgMTA1NC40NCAzMDUuMTEgMTA1NC4zNSAzNzkuMTRaIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMjAyXzcxKSIvPjxwYXRoIGQ9Ik0yNDQuNzg2IDYyMC4zNDVDMTgwLjk5OSA1NTYuNzgyIDE0NS4xMDUgNDcwLjUxMiAxNDUgMzgwLjUxNUMxNDQuOTEzIDMwNi40ODUgMTY5LjA0OCAyMzQuOTIxIDIxMy4wMzUgMTc2LjM5NkMyMjguODM4IDE1NS4zNyAyNTkuMzI4IDE1NS41MDMgMjc3Ljk2MyAxNzQuMDcyTDQ4NC43MDMgMzgwLjA4OEw0ODQuNzEgMzgwLjA4MUM1NDguNDk3IDQ0My42NDUgNTg0LjM5MSA1MjkuOTE0IDU4NC40OTcgNjE5LjkxMkM1ODQuNTk0IDcwMy4yMTQgNTU0LjAyMiA3ODMuMzk1IDQ5OS4wMDcgODQ1LjM4QzQ5MS42NTkgODUzLjY2IDQ3OC45MiA4NTMuNjQgNDcxLjA4IDg0NS44M0wyNDQuNzkzIDYyMC4zMzlMMjQ0Ljc4NiA2MjAuMzQ1WiIgZmlsbD0idXJsKCNwYWludDFfbGluZWFyXzIwMl83MSkiLz48cGF0aCBkPSJNOTQ2LjA1IDEwMjMuODNDOTI5LjQyIDEwNDQuMjIgODk5LjAyIDEwNDQuMDQgODgwLjQyIDEwMjUuNDJMNzUyLjcyNyA4OTcuNThDNzQ0Ljg5MSA4ODkuNzMgNzQ0LjkwNiA4NzcuMDIgNzUyLjc2IDg2OS4xOUw5NjQuODUgNjU3Ljg0OEM5NzIuNjkgNjUwLjAzNSA5ODUuNDggNjQ5Ljk4OSA5OTIuMzkgNjU4LjYzMkMxMDI5LjIgNzA0LjYyOCAxMDQzLjY4IDc2OC4xOTggMTAzMi43NCA4MzguMThDMTAyMi43MiA5MDIuMjQgOTkyLjA4IDk2Ny4zNyA5NDYuMDUgMTAyMy44M1oiIGZpbGw9InVybCgjcGFpbnQyX2xpbmVhcl8yMDJfNzEpIi8+PHBhdGggZD0iTTMxOC45MzEgMTAyNi44QzMwMC4zMzcgMTA0NS40MSAyNjkuOTI5IDEwNDUuNTkgMjUzLjMwNSAxMDI1LjJDMjA3LjI2OSA5NjguNzQgMTc2LjYzMyA5MDMuNjIgMTY2LjYxNyA4MzkuNTZDMTU1LjY3NSA3NjkuNTcxIDE3MC4xNDkgNzA2LjAwMSAyMDYuOTU5IDY2MC4wMDVDMjEzLjg3NiA2NTEuMzYzIDIyNi42NjMgNjUxLjQwOCAyMzQuNTA0IDY1OS4yMjFMNDQ2LjU5NSA4NzAuNTdDNDU0LjQ0OSA4NzguMzkgNDU0LjQ2NCA4OTEuMTEgNDQ2LjYyOSA4OTguOTVMMzE4LjkzMSAxMDI2LjhaIiBmaWxsPSJ1cmwoI3BhaW50M19saW5lYXJfMjAyXzcxKSIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl8yMDJfNzEiIHgxPSI1OTkuNjc2IiB5MT0iMTU4Ljk5OSIgeDI9IjU5OS42NzYiIHkyPSI4NTkuNCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM5Rjg3RkYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4NTY2RkYiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQxX2xpbmVhcl8yMDJfNzEiIHgxPSI1OTkuNjc2IiB5MT0iMTU5IiB4Mj0iNTk5LjY3NiIgeTI9Ijg1OS40IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzlGODdGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzg1NjZGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJwYWludDJfbGluZWFyXzIwMl83MSIgeDE9IjU5OS42NzYiIHkxPSI2NDMuNzY2IiB4Mj0iNTk5LjY3NiIgeTI9IjEwMzkuOTMiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjREU5OUY2Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRDY2OUZDIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9InBhaW50M19saW5lYXJfMjAyXzcxIiB4MT0iNTk5LjY3NiIgeTE9IjY0My43NjYiIHgyPSI1OTkuNjc2IiB5Mj0iMTAzOS45MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiNERTk5RjYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNENjY5RkMiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4=)![Xata](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xMDU0LjM1IDM3OS4xNEMxMDU0LjI0IDQ2OS4xMzcgMTAxOC4zNSA1NTUuNDA4IDk1NC41NiA2MTguOTcxVjYxOC45NjRMNzI4LjI3MyA4NDQuNDVDNzIwLjQzMiA4NTIuMjcgNzA3LjY5MyA4NTIuMjkgNzAwLjM0NiA4NDQuMDFDNjQ1LjMzMSA3ODIuMDE4IDYxNC43NTggNzAxLjgzOCA2MTQuODU2IDYxOC41MzVDNjE0Ljk2MSA1MjguNTM4IDY1MC44NTYgNDQyLjI2OCA3MTQuNjQzIDM3OC43MDVMNzE0LjY1IDM3OC43MTFMOTIxLjM5IDE3Mi42OTdDOTQwLjAyIDE1NC4xMjggOTcwLjUxIDE1My45OTYgOTg2LjMxIDE3NS4wMjJDMTAzMC4zIDIzMy41NDcgMTA1NC40NCAzMDUuMTEgMTA1NC4zNSAzNzkuMTRaIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMjAyXzcxKSIvPjxwYXRoIGQ9Ik0yNDQuNzg2IDYyMC4zNDVDMTgwLjk5OSA1NTYuNzgyIDE0NS4xMDUgNDcwLjUxMiAxNDUgMzgwLjUxNUMxNDQuOTEzIDMwNi40ODUgMTY5LjA0OCAyMzQuOTIxIDIxMy4wMzUgMTc2LjM5NkMyMjguODM4IDE1NS4zNyAyNTkuMzI4IDE1NS41MDMgMjc3Ljk2MyAxNzQuMDcyTDQ4NC43MDMgMzgwLjA4OEw0ODQuNzEgMzgwLjA4MUM1NDguNDk3IDQ0My42NDUgNTg0LjM5MSA1MjkuOTE0IDU4NC40OTcgNjE5LjkxMkM1ODQuNTk0IDcwMy4yMTQgNTU0LjAyMiA3ODMuMzk1IDQ5OS4wMDcgODQ1LjM4QzQ5MS42NTkgODUzLjY2IDQ3OC45MiA4NTMuNjQgNDcxLjA4IDg0NS44M0wyNDQuNzkzIDYyMC4zMzlMMjQ0Ljc4NiA2MjAuMzQ1WiIgZmlsbD0idXJsKCNwYWludDFfbGluZWFyXzIwMl83MSkiLz48cGF0aCBkPSJNOTQ2LjA1IDEwMjMuODNDOTI5LjQyIDEwNDQuMjIgODk5LjAyIDEwNDQuMDQgODgwLjQyIDEwMjUuNDJMNzUyLjcyNyA4OTcuNThDNzQ0Ljg5MSA4ODkuNzMgNzQ0LjkwNiA4NzcuMDIgNzUyLjc2IDg2OS4xOUw5NjQuODUgNjU3Ljg0OEM5NzIuNjkgNjUwLjAzNSA5ODUuNDggNjQ5Ljk4OSA5OTIuMzkgNjU4LjYzMkMxMDI5LjIgNzA0LjYyOCAxMDQzLjY4IDc2OC4xOTggMTAzMi43NCA4MzguMThDMTAyMi43MiA5MDIuMjQgOTkyLjA4IDk2Ny4zNyA5NDYuMDUgMTAyMy44M1oiIGZpbGw9InVybCgjcGFpbnQyX2xpbmVhcl8yMDJfNzEpIi8+PHBhdGggZD0iTTMxOC45MzEgMTAyNi44QzMwMC4zMzcgMTA0NS40MSAyNjkuOTI5IDEwNDUuNTkgMjUzLjMwNSAxMDI1LjJDMjA3LjI2OSA5NjguNzQgMTc2LjYzMyA5MDMuNjIgMTY2LjYxNyA4MzkuNTZDMTU1LjY3NSA3NjkuNTcxIDE3MC4xNDkgNzA2LjAwMSAyMDYuOTU5IDY2MC4wMDVDMjEzLjg3NiA2NTEuMzYzIDIyNi42NjMgNjUxLjQwOCAyMzQuNTA0IDY1OS4yMjFMNDQ2LjU5NSA4NzAuNTdDNDU0LjQ0OSA4NzguMzkgNDU0LjQ2NCA4OTEuMTEgNDQ2LjYyOSA4OTguOTVMMzE4LjkzMSAxMDI2LjhaIiBmaWxsPSJ1cmwoI3BhaW50M19saW5lYXJfMjAyXzcxKSIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl8yMDJfNzEiIHgxPSI1OTkuNjc2IiB5MT0iMTU4Ljk5OSIgeDI9IjU5OS42NzYiIHkyPSI4NTkuNCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM5Rjg3RkYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4NTY2RkYiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQxX2xpbmVhcl8yMDJfNzEiIHgxPSI1OTkuNjc2IiB5MT0iMTU5IiB4Mj0iNTk5LjY3NiIgeTI9Ijg1OS40IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzlGODdGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzg1NjZGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJwYWludDJfbGluZWFyXzIwMl83MSIgeDE9IjU5OS42NzYiIHkxPSI2NDMuNzY2IiB4Mj0iNTk5LjY3NiIgeTI9IjEwMzkuOTMiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjREU5OUY2Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRDY2OUZDIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9InBhaW50M19saW5lYXJfMjAyXzcxIiB4MT0iNTk5LjY3NiIgeTE9IjY0My43NjYiIHgyPSI1OTkuNjc2IiB5Mj0iMTAzOS45MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiNERTk5RjYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNENjY5RkMiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4=)](https://driz.link/xataio) [![](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==)![Neon](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==)](https://driz.link/neon) [![](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTQiIGhlaWdodD0iNTQiIHZpZXdCb3g9IjAgMCA1NCA1NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQ4LjQ2MDggMjdDNDguNDYwOCAzOC44Nzc5IDM4Ljg0IDQ4LjUgMjYuOTgwNCA0OC41QzE1LjEyMDkgNDguNSA1LjUgMzguODc3OSA1LjUgMjdDNS41IDE1LjEyMjEgMTUuMTIwOSA1LjUgMjYuOTgwNCA1LjVDMzguODQgNS41IDQ4LjQ2MDggMTUuMTIyMSA0OC40NjA4IDI3WiIgZmlsbD0iI0NGRTJGOCIgc3Ryb2tlPSIjQ0ZFMkY4IiBzdHJva2Utd2lkdGg9IjExIj48L3BhdGg+CjxwYXRoIGQ9Ik0yNC42Nzk2IDEyLjQ3NzVDMjcuMTkxNiA4LjM0MDQ5IDMyLjU3OTEgNy4wMjQ1NSAzNi43MTI4IDkuNTM4MjFDNDAuODQ2NiAxMi4wNTE5IDQyLjE2MTIgMTcuNDQzMyAzOS42NDkyIDIxLjU4MDNMMzEuNjcyNCAzNC43MTY5QzI5LjE2MDMgMzguODUzOCAyMy43NzI4IDQwLjE2OTggMTkuNjM5MSAzNy42NTYxQzE1LjUwNTMgMzUuMTQyNSAxNC4xOTA3IDI5Ljc1MSAxNi43MDI3IDI1LjYxNDFMMjQuNjc5NiAxMi40Nzc1WiIgZmlsbD0id2hpdGUiPjwvcGF0aD4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zMC4yODkyIDMzLjg3NThMMzguMjY2IDIwLjczOTJDNDAuMzEzOCAxNy4zNjY3IDM5LjI0MjEgMTIuOTcxNiAzNS44NzIzIDEwLjkyMjVDMzIuNTAyNSA4Ljg3MzM1IDI4LjExMDYgOS45NDYxMSAyNi4wNjI3IDEzLjMxODZMMTguMDg1OSAyNi40NTUyQzE2LjAzODEgMjkuODI3NiAxNy4xMDk4IDM0LjIyMjcgMjAuNDc5NiAzNi4yNzE4QzIzLjg0OTUgMzguMzIxIDI4LjI0MTQgMzcuMjQ4MiAzMC4yODkyIDMzLjg3NThaTTM2LjcxMjggOS41MzgyMUMzMi41NzkxIDcuMDI0NTUgMjcuMTkxNiA4LjM0MDQ5IDI0LjY3OTYgMTIuNDc3NUwxNi43MDI3IDI1LjYxNDFDMTQuMTkwNyAyOS43NTEgMTUuNTA1MyAzNS4xNDI1IDE5LjYzOTEgMzcuNjU2MUMyMy43NzI4IDQwLjE2OTggMjkuMTYwMyAzOC44NTM4IDMxLjY3MjQgMzQuNzE2OUwzOS42NDkyIDIxLjU4MDNDNDIuMTYxMiAxNy40NDMzIDQwLjg0NjYgMTIuMDUxOSAzNi43MTI4IDkuNTM4MjFaIiBmaWxsPSJibGFjayI+PC9wYXRoPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMxLjQzODkgMTkuNjczN0MzMS44MTcgMTkuOTEyMiAzMS45MzA0IDIwLjQxMjIgMzEuNjkyMSAyMC43OTA3TDE2LjExOTIgNDUuNTIzMkMxNS44ODEgNDUuOTAxNyAxNS4zODEzIDQ2LjAxNTEgMTUuMDAzMSA0NS43NzY3QzE0LjYyNSA0NS41MzgzIDE0LjUxMTYgNDUuMDM4MiAxNC43NDk5IDQ0LjY1OThMMzAuMzIyOCAxOS45MjcyQzMwLjU2MSAxOS41NDg4IDMxLjA2MDcgMTkuNDM1MyAzMS40Mzg5IDE5LjY3MzdaIiBmaWxsPSJibGFjayI+PC9wYXRoPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMzLjEwNTEgMzAuOTk0OUMzMy4xNzc1IDMxLjM2MDYgMzIuOTQgMzEuNzE1OCAzMi41NzQ2IDMxLjc4ODJDMjcuNzM0NyAzMi43NDc4IDI1LjMxMyAzMi4xMzk0IDI0LjI2ODcgMzEuNDA0NEMyMy45NjQxIDMxLjE5IDIzLjg5MDggMzAuNzY4OSAyNC4xMDUgMzAuNDY0QzI0LjMxOTMgMzAuMTU5IDI0Ljc0IDMwLjA4NTcgMjUuMDQ0NyAzMC4zMDAxQzI1LjYyNzEgMzAuNzEgMjcuNTgxMSAzMS40MDIxIDMyLjMxMjYgMzAuNDY0QzMyLjY3NzkgMzAuMzkxNSAzMy4wMzI4IDMwLjYyOTIgMzMuMTA1MSAzMC45OTQ5WiIgZmlsbD0iYmxhY2siPjwvcGF0aD4KPC9zdmc+)![SQLite Cloud](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTQiIGhlaWdodD0iNTQiIHZpZXdCb3g9IjAgMCA1NCA1NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQ4LjQ2MDggMjdDNDguNDYwOCAzOC44Nzc5IDM4Ljg0IDQ4LjUgMjYuOTgwNCA0OC41QzE1LjEyMDkgNDguNSA1LjUgMzguODc3OSA1LjUgMjdDNS41IDE1LjEyMjEgMTUuMTIwOSA1LjUgMjYuOTgwNCA1LjVDMzguODQgNS41IDQ4LjQ2MDggMTUuMTIyMSA0OC40NjA4IDI3WiIgZmlsbD0iI0NGRTJGOCIgc3Ryb2tlPSIjQ0ZFMkY4IiBzdHJva2Utd2lkdGg9IjExIj48L3BhdGg+CjxwYXRoIGQ9Ik0yNC42Nzk2IDEyLjQ3NzVDMjcuMTkxNiA4LjM0MDQ5IDMyLjU3OTEgNy4wMjQ1NSAzNi43MTI4IDkuNTM4MjFDNDAuODQ2NiAxMi4wNTE5IDQyLjE2MTIgMTcuNDQzMyAzOS42NDkyIDIxLjU4MDNMMzEuNjcyNCAzNC43MTY5QzI5LjE2MDMgMzguODUzOCAyMy43NzI4IDQwLjE2OTggMTkuNjM5MSAzNy42NTYxQzE1LjUwNTMgMzUuMTQyNSAxNC4xOTA3IDI5Ljc1MSAxNi43MDI3IDI1LjYxNDFMMjQuNjc5NiAxMi40Nzc1WiIgZmlsbD0id2hpdGUiPjwvcGF0aD4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zMC4yODkyIDMzLjg3NThMMzguMjY2IDIwLjczOTJDNDAuMzEzOCAxNy4zNjY3IDM5LjI0MjEgMTIuOTcxNiAzNS44NzIzIDEwLjkyMjVDMzIuNTAyNSA4Ljg3MzM1IDI4LjExMDYgOS45NDYxMSAyNi4wNjI3IDEzLjMxODZMMTguMDg1OSAyNi40NTUyQzE2LjAzODEgMjkuODI3NiAxNy4xMDk4IDM0LjIyMjcgMjAuNDc5NiAzNi4yNzE4QzIzLjg0OTUgMzguMzIxIDI4LjI0MTQgMzcuMjQ4MiAzMC4yODkyIDMzLjg3NThaTTM2LjcxMjggOS41MzgyMUMzMi41NzkxIDcuMDI0NTUgMjcuMTkxNiA4LjM0MDQ5IDI0LjY3OTYgMTIuNDc3NUwxNi43MDI3IDI1LjYxNDFDMTQuMTkwNyAyOS43NTEgMTUuNTA1MyAzNS4xNDI1IDE5LjYzOTEgMzcuNjU2MUMyMy43NzI4IDQwLjE2OTggMjkuMTYwMyAzOC44NTM4IDMxLjY3MjQgMzQuNzE2OUwzOS42NDkyIDIxLjU4MDNDNDIuMTYxMiAxNy40NDMzIDQwLjg0NjYgMTIuMDUxOSAzNi43MTI4IDkuNTM4MjFaIiBmaWxsPSJibGFjayI+PC9wYXRoPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMxLjQzODkgMTkuNjczN0MzMS44MTcgMTkuOTEyMiAzMS45MzA0IDIwLjQxMjIgMzEuNjkyMSAyMC43OTA3TDE2LjExOTIgNDUuNTIzMkMxNS44ODEgNDUuOTAxNyAxNS4zODEzIDQ2LjAxNTEgMTUuMDAzMSA0NS43NzY3QzE0LjYyNSA0NS41MzgzIDE0LjUxMTYgNDUuMDM4MiAxNC43NDk5IDQ0LjY1OThMMzAuMzIyOCAxOS45MjcyQzMwLjU2MSAxOS41NDg4IDMxLjA2MDcgMTkuNDM1MyAzMS40Mzg5IDE5LjY3MzdaIiBmaWxsPSJibGFjayI+PC9wYXRoPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMzLjEwNTEgMzAuOTk0OUMzMy4xNzc1IDMxLjM2MDYgMzIuOTQgMzEuNzE1OCAzMi41NzQ2IDMxLjc4ODJDMjcuNzM0NyAzMi43NDc4IDI1LjMxMyAzMi4xMzk0IDI0LjI2ODcgMzEuNDA0NEMyMy45NjQxIDMxLjE5IDIzLjg5MDggMzAuNzY4OSAyNC4xMDUgMzAuNDY0QzI0LjMxOTMgMzAuMTU5IDI0Ljc0IDMwLjA4NTcgMjUuMDQ0NyAzMC4zMDAxQzI1LjYyNzEgMzAuNzEgMjcuNTgxMSAzMS40MDIxIDMyLjMxMjYgMzAuNDY0QzMyLjY3NzkgMzAuMzkxNSAzMy4wMzI4IDMwLjYyOTIgMzMuMTA1MSAzMC45OTQ5WiIgZmlsbD0iYmxhY2siPjwvcGF0aD4KPC9zdmc+)](https://driz.link/sqlitecloud) [![](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==)![Upstash](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==)](https://driz.link/upstash) [![](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==)![Lokalise](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==)](https://driz.link/lokalise) [![](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJBcnR3b3JrIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgNzkzLjggODcxLjUiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDc5My44IDg3MS41OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6I0Y1NjQwQzt9Cjwvc3R5bGU+CjxnPgoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTM5Ni45LDM1Ni4xSDIyNy4yYy0xNi42LDAtMzAtMTMuNC0zMC0zMHYtOTkuOGMwLTE2LjYsMTMuNC0zMCwzMC0zMGgxMzkuN2MxNi42LDAsMzAsMTMuNCwzMCwzMFYzNTYuMXoiLz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01NjYuNiw1MTUuOEgzOTYuOVYzNTYuMWgxNjkuN2MxNi41LDAsMjkuOSwxMy40LDI5LjksMjkuOXY5OS44QzU5Ni41LDUwMi40LDU4My4xLDUxNS44LDU2Ni42LDUxNS44eiIvPgoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTM2Ni45LDY3NS42SDIyNy4yYy0xNi41LDAtMjkuOS0xMy40LTI5LjktMjkuOXYtOTkuOGMwLTE2LjUsMTMuNC0yOS45LDI5LjktMjkuOWgxNjkuN3YxMjkuOAoJCUMzOTYuOSw2NjIuMSwzODMuNSw2NzUuNiwzNjYuOSw2NzUuNnoiLz4KPC9nPgo8L3N2Zz4=)![Replit](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJBcnR3b3JrIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgNzkzLjggODcxLjUiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDc5My44IDg3MS41OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6I0Y1NjQwQzt9Cjwvc3R5bGU+CjxnPgoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTM5Ni45LDM1Ni4xSDIyNy4yYy0xNi42LDAtMzAtMTMuNC0zMC0zMHYtOTkuOGMwLTE2LjYsMTMuNC0zMCwzMC0zMGgxMzkuN2MxNi42LDAsMzAsMTMuNCwzMCwzMFYzNTYuMXoiLz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01NjYuNiw1MTUuOEgzOTYuOVYzNTYuMWgxNjkuN2MxNi41LDAsMjkuOSwxMy40LDI5LjksMjkuOXY5OS44QzU5Ni41LDUwMi40LDU4My4xLDUxNS44LDU2Ni42LDUxNS44eiIvPgoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTM2Ni45LDY3NS42SDIyNy4yYy0xNi41LDAtMjkuOS0xMy40LTI5LjktMjkuOXYtOTkuOGMwLTE2LjUsMTMuNC0yOS45LDI5LjktMjkuOWgxNjkuN3YxMjkuOAoJCUMzOTYuOSw2NjIuMSwzODMuNSw2NzUuNiwzNjYuOSw2NzUuNnoiLz4KPC9nPgo8L3N2Zz4=)](https://driz.link/replit) [![](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==)![Sentry](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==)](https://driz.link/sentry) [![](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTQuNzIwNDcgMEMyLjExMzQ0IDAgMCAyLjExMzQ0IDAgNC43MjA0N1YxOS4yNzk1QzAgMjEuODg2NiAyLjExMzQ0IDI0IDQuNzIwNDcgMjRIMTkuMjc5NUMyMS44ODY2IDI0IDI0IDIxLjg4NjYgMjQgMTkuMjc5NVY0LjcyMDQ3QzI0IDIuMTEzNDQgMjEuODg2NiAwIDE5LjI3OTUgMEg0LjcyMDQ3Wk05LjMwMjA0IDUuMDE1NjNWNy44NDM2N0g2Ljc0OTk4VjEwLjMyNjhDNi43NDk5OCAxMC44NDg3IDYuOTQzNzMgMTEuMDEzNCA3LjA2OTUxIDExLjEyMDRDNy4xMDI4NSAxMS4xNDg3IDcuMTMxMzkgMTEuMTczIDcuMTUwMzEgMTEuMTk4OEw5LjI3NzAyIDEzLjM4MTRINi43NDk5OFYxNi4xNzk4SDkuMjc3MDJWMTkuMDA3OEgxNC43MDYzVjE2LjE3OThIOS4yNzcwMlYxMy4zODE0SDE0LjAzNUMxNC42OTM4IDEzLjM4MTQgMTQuNjkzOCAxNC4xNzk1IDE0LjY5MzggMTQuNTQ0MVYxNi4xNzk4SDE3LjI0NThWMTMuNjk2N0MxNy4yNDU4IDEzLjE3NDggMTcuMDUyMSAxMy4wMTAxIDE2LjkyNjMgMTIuOTAzMUMxNi44OTMgMTIuODc0NyAxNi44NjQ0IDEyLjg1MDUgMTYuODQ1NSAxMi44MjQ3TDE0LjY5MzggMTAuNjQyMUgxNy4yNUwxNy4yNDU4IDcuODQzNjdIMTQuNzA2M0wxNC42OTM4IDEwLjY0MjFIOS45NjA4OEM5LjMwMjA0IDEwLjY0MjEgOS4zMDIwNCA5Ljg0Mzk1IDkuMzAyMDQgOS40NzkzNVY3Ljg0MzY3SDE0LjcwNjNWNS4wMTU2M0g5LjMwMjA0WiIgZmlsbD0iI0Y5NzMxNiIvPjwvc3ZnPg==)![Sevalla](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTQuNzIwNDcgMEMyLjExMzQ0IDAgMCAyLjExMzQ0IDAgNC43MjA0N1YxOS4yNzk1QzAgMjEuODg2NiAyLjExMzQ0IDI0IDQuNzIwNDcgMjRIMTkuMjc5NUMyMS44ODY2IDI0IDI0IDIxLjg4NjYgMjQgMTkuMjc5NVY0LjcyMDQ3QzI0IDIuMTEzNDQgMjEuODg2NiAwIDE5LjI3OTUgMEg0LjcyMDQ3Wk05LjMwMjA0IDUuMDE1NjNWNy44NDM2N0g2Ljc0OTk4VjEwLjMyNjhDNi43NDk5OCAxMC44NDg3IDYuOTQzNzMgMTEuMDEzNCA3LjA2OTUxIDExLjEyMDRDNy4xMDI4NSAxMS4xNDg3IDcuMTMxMzkgMTEuMTczIDcuMTUwMzEgMTEuMTk4OEw5LjI3NzAyIDEzLjM4MTRINi43NDk5OFYxNi4xNzk4SDkuMjc3MDJWMTkuMDA3OEgxNC43MDYzVjE2LjE3OThIOS4yNzcwMlYxMy4zODE0SDE0LjAzNUMxNC42OTM4IDEzLjM4MTQgMTQuNjkzOCAxNC4xNzk1IDE0LjY5MzggMTQuNTQ0MVYxNi4xNzk4SDE3LjI0NThWMTMuNjk2N0MxNy4yNDU4IDEzLjE3NDggMTcuMDUyMSAxMy4wMTAxIDE2LjkyNjMgMTIuOTAzMUMxNi44OTMgMTIuODc0NyAxNi44NjQ0IDEyLjg1MDUgMTYuODQ1NSAxMi44MjQ3TDE0LjY5MzggMTAuNjQyMUgxNy4yNUwxNy4yNDU4IDcuODQzNjdIMTQuNzA2M0wxNC42OTM4IDEwLjY0MjFIOS45NjA4OEM5LjMwMjA0IDEwLjY0MjEgOS4zMDIwNCA5Ljg0Mzk1IDkuMzAyMDQgOS40NzkzNVY3Ljg0MzY3SDE0LjcwNjNWNS4wMTU2M0g5LjMwMjA0WiIgZmlsbD0iI0Y5NzMxNiIvPjwvc3ZnPg==)](https://driz.link/sevalla) [![](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==)![Sponsor](https://orm.drizzle.team/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==)](https://driz.link/sponsor)

Product by Drizzle Team

[One Dollar Stats $1 per mo web analytics christmas  deal](https://driz.link/onedollarstats)

# Set Operations

SQL set operations combine the results of multiple query blocks into a single result. The SQL standard defines the following three set operations: `UNION`, `INTERSECT`, `EXCEPT`, `UNION ALL`, `INTERSECT ALL`, `EXCEPT ALL`.

### Union [](#union)

Combine all results from two query blocks into a single result, omitting any duplicates.

Get all names from customers and users tables without duplicates.

PostgreSQL

MySQL

SQLite

SingleStore

MSSQL

CockroachDB

import-pattern

builder-pattern

schema.ts

__

```
import { union } from 'drizzle-orm/pg-core'
import { users, customers } from './schema'

const allNamesForUserQuery = db.select({ name: users.name }).from(users);

const result = await union(
	allNamesForUserQuery,
	db.select({ name: customers.name }).from(customers)
).limit(10);
```

__

```
(select "name" from "sellers")
union
(select "name" from "customers")
limit $1
```

__

```
import { users, customers } from './schema'

const result = await db
  .select({ name: users.name })
  .from(users)
  .union(db.select({ name: customers.name }).from(customers))
  .limit(10);
```

__

```
(select "name" from "sellers")
union
(select "name" from "customers")
limit $1
```

__

```
import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

const users = pgTable('sellers', {
    id: integer('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    address: text('address'),
});

const customers = pgTable('customers', {
    id: integer('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    city: text('city'),
    email: varchar('email', { length: 256 }).notNull()
});
```

import-pattern

builder-pattern

schema.ts

__

```
import { union } from 'drizzle-orm/mysql-core'
import { users, customers } from './schema'

const allNamesForUserQuery = db.select({ name: users.name }).from(users);

const result = await union(
	allNamesForUserQuery,
	db.select({ name: customers.name }).from(customers)
).limit(10);
```

__

```
(select \`name\` from \`sellers\`)
union
(select \`name\` from \`customers\`)
limit ?
```

__

```
import { users, customers } from './schema'

const result = await db
  .select({ name: users.name })
  .from(users)
  .union(db.select({ name: customers.name }).from(customers))
  .limit(10);
```

__

```
(select \`name\` from \`sellers\`)
union
(select \`name\` from \`customers\`)
limit ?
```

__

```
import { int, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

const users = mysqlTable('sellers', {
    id: int('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    address: text('address'),
});

const customers = mysqlTable('customers', {
    id: int('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    city: text('city'),
    email: varchar('email', { length: 256 }).notNull()
});
```

import-pattern

builder-pattern

schema.ts

__

```
import { union } from 'drizzle-orm/sqlite-core'
import { users, customers } from './schema'

const allNamesForUserQuery = db.select({ name: users.name }).from(users);

const result = await union(
	allNamesForUserQuery,
	db.select({ name: customers.name }).from(customers)
).limit(10);
```

__

```
(select "name" from "sellers")
union 
(select "name" from "customers")
limit ?
```

__

```
import { users, customers } from './schema'

const result = await db
  .select({ name: users.name })
  .from(users)
  .union(db.select({ name: customers.name }).from(customers))
  .limit(10);
```

__

```
select "name" from "sellers" union select "name" from "customers" limit ?
```

__

```
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

const users = sqliteTable('sellers', {
    id: int('id').primaryKey(),
    name: text('name').notNull(),
    address: text('address'),
});

const customers = sqliteTable('customers', {
    id: int('id').primaryKey(),
    name: text('name').notNull(),
    city: text('city'),
    email: text('email').notNull()
});
```

import-pattern

builder-pattern

schema.ts

__

```
import { union } from 'drizzle-orm/singlestore-core'
import { users, customers } from './schema'

const allNamesForUserQuery = db.select({ name: users.name }).from(users);

const result = await union(
	allNamesForUserQuery,
	db.select({ name: customers.name }).from(customers)
).limit(10);
```

__

```
(select \`name\` from \`sellers\`)
union
(select \`name\` from \`customers\`)
limit ?
```

__

```
import { users, customers } from './schema'

const result = await db
  .select({ name: users.name })
  .from(users)
  .union(db.select({ name: customers.name }).from(customers))
  .limit(10);
```

__

```
(select \`name\` from \`sellers\`)
union
(select \`name\` from \`customers\`)
limit ?
```

__

```
import { int, mysqlTable, text, varchar } from "drizzle-orm/singlestore-core";

const users = mysqlTable('sellers', {
    id: int('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    address: text('address'),
});

const customers = mysqlTable('customers', {
    id: int('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    city: text('city'),
    email: varchar('email', { length: 256 }).notNull()
});
```

import-pattern

builder-pattern

schema.ts

__

```
import { union } from 'drizzle-orm/mssql-core'
import { users, customers } from './schema'

const allNamesForUserQuery = db.select({ name: users.name }).from(users);

const result = await union(
	allNamesForUserQuery,
	db.select({ name: customers.name }).from(customers)
).limit(10);
```

__

```
(select [name] from [sellers])
union
(select [name] from [customers])
limit @limit
```

__

```
import { users, customers } from './schema'

const result = await db
  .select({ name: users.name })
  .from(users)
  .union(db.select({ name: customers.name }).from(customers))
  .limit(10);
```

__

```
(select [name] from [sellers])
union
(select [name] from [customers])
limit @limit
```

__

```
import { int, mssqlTable, ntext, nvarchar } from "drizzle-orm/mssql-core";

const users = mssqlTable('sellers', {
    id: int().primaryKey(),
    name: nvarchar({ length: 256 }).notNull(),
    address: ntext(),
});

const customers = mssqlTable('customers', {
    id: int().primaryKey(),
    name: nvarchar({ length: 256 }).notNull(),
    city: ntext(),
    email: nvarchar({ length: 256 }).notNull()
});
```

import-pattern

builder-pattern

schema.ts

__

```
import { union } from 'drizzle-orm/cockroach-core'
import { users, customers } from './schema'

const allNamesForUserQuery = db.select({ name: users.name }).from(users);

const result = await union(
	allNamesForUserQuery,
	db.select({ name: customers.name }).from(customers)
).limit(10);
```

__

```
(select "name" from "sellers")
union
(select "name" from "customers")
limit $1
```

__

```
import { users, customers } from './schema'

const result = await db
  .select({ name: users.name })
  .from(users)
  .union(db.select({ name: customers.name }).from(customers))
  .limit(10);
```

__

```
(select "name" from "sellers")
union
(select "name" from "customers")
limit $1
```

__

```
import { int4, cockroachTable, text, varchar } from "drizzle-orm/cockroach-core";

const users = cockroachTable('sellers', {
    id: int4().primaryKey(),
    name: varchar({ length: 256 }).notNull(),
    address: text(),
});

const customers = cockroachTable('customers', {
    id: int4().primaryKey(),
    name: varchar({ length: 256 }).notNull(),
    city: text(),
    email: varchar({ length: 256 }).notNull()
});
```

### Union All [](#union-all)

Combine all results from two query blocks into a single result, with duplicates.

Let’s consider a scenario where you have two tables, one representing online sales and the other representing in-store sales. In this case, you want to combine the data from both tables into a single result set. Since there might be duplicate transactions, you want to keep all the records and not eliminate duplicates.

PostgreSQL

MySQL

SQLite

SingleStore

MSSQL

CockroachDB

import-pattern

builder-pattern

schema.ts

__

```
import { unionAll } from 'drizzle-orm/pg-core'
import { onlineSales, inStoreSales } from './schema'

const onlineTransactions = db.select({ transaction: onlineSales.transactionId }).from(onlineSales);
const inStoreTransactions = db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales);

const result = await unionAll(onlineTransactions, inStoreTransactions);
```

__

```
select "transaction_id" from "online_sales"
union all
select "transaction_id" from "in_store_sales"
```

__

```
import { onlineSales, inStoreSales } from './schema'

const result = await db
  .select({ transaction: onlineSales.transactionId })
  .from(onlineSales)
  .unionAll(
    db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
  );
```

__

```
select "transaction_id" from "online_sales"
union all
select "transaction_id" from "in_store_sales"
```

__

```
import { integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

const onlineSales = pgTable('online_sales', {
    transactionId: integer('transaction_id').primaryKey(),
    productId: integer('product_id').unique(),
    quantitySold: integer('quantity_sold'),
    saleDate: timestamp('sale_date', { mode: 'date' }),
});

const inStoreSales = pgTable('in_store_sales', {
    transactionId: integer('transaction_id').primaryKey(),
    productId: integer('product_id').unique(),
    quantitySold: integer('quantity_sold'),
    saleDate: timestamp('sale_date', { mode: 'date' }),
});
```

import-pattern

builder-pattern

schema.ts

__

```
import { unionAll } from 'drizzle-orm/mysql-core'
import { onlineSales, inStoreSales } from './schema'

const onlineTransactions = db.select({ transaction: onlineSales.transactionId }).from(onlineSales);
const inStoreTransactions = db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales);

const result = await unionAll(onlineTransactions, inStoreTransactions);
```

__

```
select \`transaction_id\` from \`online_sales\`
union all
select \`transaction_id\` from \`in_store_sales\`
```

__

```
import { onlineSales, inStoreSales } from './schema'

const result = await db
  .select({ transaction: onlineSales.transactionId })
  .from(onlineSales)
  .unionAll(
    db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
  );
```

__

```
(select \`transaction_id\` from \`online_sales\`)
union all 
(select \`transaction_id\` from \`in_store_sales\`)
```

__

```
import { int, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

const onlineSales = mysqlTable('online_sales', {
    transactionId: int('transaction_id').primaryKey(),
    productId: int('product_id').unique(),
    quantitySold: int('quantity_sold'),
    saleDate: timestamp('sale_date', { mode: 'date' }),
});

const inStoreSales = mysqlTable('in_store_sales', {
    transactionId: int('transaction_id').primaryKey(),
    productId: int('product_id').unique(),
    quantitySold: int('quantity_sold'),
    saleDate: timestamp('sale_date', { mode: 'date' }),
});
```

import-pattern

builder-pattern

schema.ts

__

```
import { unionAll } from 'drizzle-orm/sqlite-core'
import { onlineSales, inStoreSales } from './schema'

const onlineTransactions = db.select({ transaction: onlineSales.transactionId }).from(onlineSales);
const inStoreTransactions = db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales);

const result = await unionAll(onlineTransactions, inStoreTransactions);
```

__

```
select "transaction_id" from "online_sales" 
union all 
select "transaction_id" from "in_store_sales"
```

__

```
import { onlineSales, inStoreSales } from './schema'

const result = await db
  .select({ transaction: onlineSales.transactionId })
  .from(onlineSales)
  .unionAll(
    db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
  );
```

__

```
select "transaction_id" from "online_sales" 
union all 
select "transaction_id" from "in_store_sales"
```

__

```
import { int, sqliteTable } from "drizzle-orm/sqlite-core";

const onlineSales = sqliteTable('online_sales', {
    transactionId: int('transaction_id').primaryKey(),
    productId: int('product_id').unique(),
    quantitySold: int('quantity_sold'),
    saleDate: int('sale_date', { mode: 'timestamp' }),
});

const inStoreSales = sqliteTable('in_store_sales', {
    transactionId: int('transaction_id').primaryKey(),
    productId: int('product_id').unique(),
    quantitySold: int('quantity_sold'),
    saleDate: int('sale_date', { mode: 'timestamp' }),
});
```

IMPORTANT

UNION ALL with ORDER BY behavior inconsistent with MySQL: SingleStore parses UNION ALL followed by ORDER BY commands differently from MySQL. In SingleStore, the following query is valid. In MySQL, it is invalid.

import-pattern

builder-pattern

schema.ts

__

```
import { unionAll } from 'drizzle-orm/singlestore-core'
import { onlineSales, inStoreSales } from './schema'

const onlineTransactions = db.select({ transaction: onlineSales.transactionId }).from(onlineSales);
const inStoreTransactions = db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales);

const result = await unionAll(onlineTransactions, inStoreTransactions);
```

__

```
select \`transaction_id\` from \`online_sales\`
union all
select \`transaction_id\` from \`in_store_sales\`
```

__

```
import { onlineSales, inStoreSales } from './schema'

const result = await db
  .select({ transaction: onlineSales.transactionId })
  .from(onlineSales)
  .unionAll(
    db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
  );
```

__

```
(select \`transaction_id\` from \`online_sales\`)
union all 
(select \`transaction_id\` from \`in_store_sales\`)
```

__

```
import { int, mysqlTable, text, timestamp, varchar } from "drizzle-orm/singlestore-core";

const onlineSales = mysqlTable('online_sales', {
    transactionId: int('transaction_id').primaryKey(),
    productId: int('product_id').unique(),
    quantitySold: int('quantity_sold'),
    saleDate: timestamp('sale_date', { mode: 'date' }),
});

const inStoreSales = mysqlTable('in_store_sales', {
    transactionId: int('transaction_id').primaryKey(),
    productId: int('product_id').unique(),
    quantitySold: int('quantity_sold'),
    saleDate: timestamp('sale_date', { mode: 'date' }),
});
```

import-pattern

builder-pattern

schema.ts

__

```
import { unionAll } from 'drizzle-orm/mssql-core'
import { onlineSales, inStoreSales } from './schema'

const onlineTransactions = db.select({ transaction: onlineSales.transactionId }).from(onlineSales);
const inStoreTransactions = db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales);

const result = await unionAll(onlineTransactions, inStoreTransactions);
```

__

```
(select [transaction_id] from [online_sales])
union all
(select [transaction_id] from [in_store_sales])
```

__

```
import { onlineSales, inStoreSales } from './schema'

const result = await db
  .select({ transaction: onlineSales.transactionId })
  .from(onlineSales)
  .unionAll(
    db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
  );
```

__

```
(select [transaction_id] from [online_sales])
union all
(select [transaction_id] from [in_store_sales])
```

__

```
import { int, mssqlTable, timestamp } from "drizzle-orm/mssql-core";

const onlineSales = mysqlTable('online_sales', {
    transactionId: int('transaction_id').primaryKey(),
    productId: int('product_id').unique(),
    quantitySold: int('quantity_sold'),
    saleDate: timestamp('sale_date', { mode: 'date' }),
});

const inStoreSales = mysqlTable('in_store_sales', {
    transactionId: int('transaction_id').primaryKey(),
    productId: int('product_id').unique(),
    quantitySold: int('quantity_sold'),
    saleDate: timestamp('sale_date', { mode: 'date' }),
});
```

import-pattern

builder-pattern

schema.ts

__

```
import { unionAll } from 'drizzle-orm/cockroach-core'
import { onlineSales, inStoreSales } from './schema'

const onlineTransactions = db.select({ transaction: onlineSales.transactionId }).from(onlineSales);
const inStoreTransactions = db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales);

const result = await unionAll(onlineTransactions, inStoreTransactions);
```

__

```
select "transaction_id" from "online_sales"
union all
select "transaction_id" from "in_store_sales"
```

__

```
import { onlineSales, inStoreSales } from './schema'

const result = await db
  .select({ transaction: onlineSales.transactionId })
  .from(onlineSales)
  .unionAll(
    db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
  );
```

__

```
select "transaction_id" from "online_sales"
union all
select "transaction_id" from "in_store_sales"
```

__

```
import { int4, cockroachTable, text, timestamp, varchar } from "drizzle-orm/cockroach-core";

const onlineSales = cockroachTable('online_sales', {
    transactionId: int4('transaction_id').primaryKey(),
    productId: int4('product_id').unique(),
    quantitySold: int4('quantity_sold'),
    saleDate: timestamp('sale_date', { mode: 'date' }),
});

const inStoreSales = cockroachTable('in_store_sales', {
    transactionId: int4('transaction_id').primaryKey(),
    productId: int4('product_id').unique(),
    quantitySold: int4('quantity_sold'),
    saleDate: timestamp('sale_date', { mode: 'date' }),
});
```

### Intersect [](#intersect)

Combine only those rows which the results of two query blocks have in common, omitting any duplicates.

Suppose you have two tables that store information about students’ course enrollments. You want to find the courses that are common between two different departments, but you want distinct course names, and you’re not interested in counting multiple enrollments of the same course by the same student.

In this scenario, you want to find courses that are common between the two departments but don’t want to count the same course multiple times even if multiple students from the same department are enrolled in it.

PostgreSQL

MySQL

SQLite

SingleStore

MSSQL

CockroachDB

import-pattern

builder-pattern

schema.ts

__

```
import { intersect } from 'drizzle-orm/pg-core'
import { depA, depB } from './schema'

const departmentACourses = db.select({ courseName: depA.courseName }).from(depA);
const departmentBCourses = db.select({ courseName: depB.courseName }).from(depB);

const result = await intersect(departmentACourses, departmentBCourses);
```

__

```
select "course_name" from "department_a_courses"
intersect
select "course_name" from "department_b_courses"
```

__

```
import { depA, depB } from './schema'

const result = await db
  .select({ courseName: depA.courseName })
  .from(depA)
  .intersect(db.select({ courseName: depB.courseName }).from(depB));
```

__

```
select "course_name" from "department_a_courses"
intersect
select "course_name" from "department_b_courses"
```

__

```
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

const depA = pgTable('department_a_courses', {
    studentId: integer('student_id'),
    courseName: varchar('course_name').notNull(),
});

const depB = pgTable('department_b_courses', {
    studentId: integer('student_id'),
    courseName: varchar('course_name').notNull(),
});
```

import-pattern

builder-pattern

schema.ts

__

```
import { intersect } from 'drizzle-orm/mysql-core'
import { depA, depB } from './schema'

const departmentACourses = db.select({ courseName: depA.courseName }).from(depA);
const departmentBCourses = db.select({ courseName: depB.courseName }).from(depB);

const result = await intersect(departmentACourses, departmentBCourses);
```

__

```
select \`projects_name\` from \`department_a_projects\`
intersect
select \`projects_name\` from \`department_b_projects\`
```

__

```
import { depA, depB } from './schema'

const result = await db
  .select({ courseName: depA.courseName })
  .from(depA)
  .intersect(db.select({ courseName: depB.courseName }).from(depB));
```

__

```
select \`projects_name\` from \`department_a_projects\`
intersect
select \`projects_name\` from \`department_b_projects\`
```

__

```
import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

const depA = mysqlTable('department_a_courses', {
    studentId: int('student_id'),
    courseName: varchar('course_name', { length: 256 }).notNull(),
});

const depB = mysqlTable('department_b_courses', {
    studentId: int('student_id'),
    courseName: varchar('course_name', { length: 256 }).notNull(),
});
```

import-pattern

builder-pattern

schema.ts

__

```
import { intersect } from 'drizzle-orm/sqlite-core'
import { depA, depB } from './schema'

const departmentACourses = db.select({ courseName: depA.courseName }).from(depA);
const departmentBCourses = db.select({ courseName: depB.courseName }).from(depB);

const result = await intersect(departmentACourses, departmentBCourses);
```

__

```
select "course_name" from "department_a_courses"
intersect
select "course_name" from "department_b_courses"
```

__

```
import { depA, depB } from './schema'

const result = await db
  .select({ courseName: depA.courseName })
  .from(depA)
  .intersect(db.select({ courseName: depB.courseName }).from(depB));
```

__

```
select "course_name" from "department_a_courses" 
intersect 
select "course_name" from "department_b_courses"
```

__

```
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

const depA = sqliteTable('department_a_courses', {
    studentId: int('student_id'),
    courseName: text('course_name').notNull(),
});

const depB = sqliteTable('department_b_courses', {
    studentId: int('student_id'),
    courseName: text('course_name').notNull(),
});
```

import-pattern

builder-pattern

schema.ts

__

```
import { intersect } from 'drizzle-orm/singlestore-core'
import { depA, depB } from './schema'

const departmentACourses = db.select({ courseName: depA.courseName }).from(depA);
const departmentBCourses = db.select({ courseName: depB.courseName }).from(depB);

const result = await intersect(departmentACourses, departmentBCourses);
```

__

```
select \`projects_name\` from \`department_a_projects\`
intersect
select \`projects_name\` from \`department_b_projects\`
```

__

```
import { depA, depB } from './schema'

const result = await db
  .select({ courseName: depA.courseName })
  .from(depA)
  .intersect(db.select({ courseName: depB.courseName }).from(depB));
```

__

```
select \`projects_name\` from \`department_a_projects\`
intersect
select \`projects_name\` from \`department_b_projects\`
```

__

```
import { int, singlestoreTable, varchar } from "drizzle-orm/singlestore-core";

const depA = singlestoreTable('department_a_courses', {
    studentId: int('student_id'),
    courseName: varchar('course_name', { length: 256 }).notNull(),
});

const depB = singlestoreTable('department_b_courses', {
    studentId: int('student_id'),
    courseName: varchar('course_name', { length: 256 }).notNull(),
});
```

import-pattern

builder-pattern

schema.ts

__

```
import { intersect } from 'drizzle-orm/mssql-core'
import { depA, depB } from './schema'

const departmentACourses = db.select({ courseName: depA.courseName }).from(depA);
const departmentBCourses = db.select({ courseName: depB.courseName }).from(depB);

const result = await intersect(departmentACourses, departmentBCourses);
```

__

```
(select \`projects_name\` from \`department_a_projects\`)
intersect
(select \`projects_name\` from \`department_b_projects\`)
```

__

```
import { depA, depB } from './schema'

const result = await db
  .select({ courseName: depA.courseName })
  .from(depA)
  .intersect(db.select({ courseName: depB.courseName }).from(depB));
```

__

```
(select \`projects_name\` from \`department_a_projects\`)
intersect
(select \`projects_name\` from \`department_b_projects\`)
```

__

```
import { int, mssqlTable, varchar } from "drizzle-orm/mssqlTable-core";

const depA = mssqlTable('department_a_courses', {
    studentId: int('student_id'),
    courseName: varchar('course_name', { length: 256 }).notNull(),
});

const depB = mssqlTable('department_b_courses', {
    studentId: int('student_id'),
    courseName: varchar('course_name', { length: 256 }).notNull(),
});
```

import-pattern

builder-pattern

schema.ts

__

```
import { intersect } from 'drizzle-orm/cockroach-core'
import { depA, depB } from './schema'

const departmentACourses = db.select({ courseName: depA.courseName }).from(depA);
const departmentBCourses = db.select({ courseName: depB.courseName }).from(depB);

const result = await intersect(departmentACourses, departmentBCourses);
```

__

```
select "course_name" from "department_a_courses"
intersect
select "course_name" from "department_b_courses"
```

__

```
import { depA, depB } from './schema'

const result = await db
  .select({ courseName: depA.courseName })
  .from(depA)
  .intersect(db.select({ courseName: depB.courseName }).from(depB));
```

__

```
select "course_name" from "department_a_courses"
intersect
select "course_name" from "department_b_courses"
```

__

```
import { int4, cockroachTable, varchar } from "drizzle-orm/cockroach-core";

const depA = cockroachTable('department_a_courses', {
    studentId: int4('student_id'),
    courseName: varchar('course_name').notNull(),
});

const depB = cockroachTable('department_b_courses', {
    studentId: int4('student_id'),
    courseName: varchar('course_name').notNull(),
});
```

### Intersect All [](#intersect-all)

Combine only those rows which the results of two query blocks have in common, with duplicates.

Let’s consider a scenario where you have two tables containing data about customer orders, and you want to identify products that are ordered by both regular customers and VIP customers. In this case, you want to keep track of the quantity of each product, even if it’s ordered multiple times by different customers.

In this scenario, you want to find products that are ordered by both regular customers and VIP customers, but you want to retain the quantity information, even if the same product is ordered multiple times by different customers.

PostgreSQL

MySQL

SQLlite

SingleStore

MSSQL

CockroachDB

import-pattern

builder-pattern

schema.ts

__

```
import { intersectAll } from 'drizzle-orm/pg-core'
import { regularCustomerOrders, vipCustomerOrders } from './schema'

const regularOrders = db.select({ 
    productId: regularCustomerOrders.productId,
    quantityOrdered: regularCustomerOrders.quantityOrdered }
).from(regularCustomerOrders);

const vipOrders = db.select({ 
    productId: vipCustomerOrders.productId,
    quantityOrdered: vipCustomerOrders.quantityOrdered }
).from(vipCustomerOrders);

const result = await intersectAll(regularOrders, vipOrders);
```

__

```
select "product_id", "quantity_ordered" from "regular_customer_orders"
intersect all
select "product_id", "quantity_ordered" from "vip_customer_orders"
```

__

```
import { regularCustomerOrders, vipCustomerOrders } from './schema'

const result = await db
    .select({
      productId: regularCustomerOrders.productId,
      quantityOrdered: regularCustomerOrders.quantityOrdered,
    })
    .from(regularCustomerOrders)
    .intersectAll(
      db
        .select({
          productId: vipCustomerOrders.productId,
          quantityOrdered: vipCustomerOrders.quantityOrdered,
        })
        .from(vipCustomerOrders)
    );
```

__

```
select "product_id", "quantity_ordered" from "regular_customer_orders"
intersect all
select "product_id", "quantity_ordered" from "vip_customer_orders"
```

__

```
import { integer, pgTable } from "drizzle-orm/pg-core";

const regularCustomerOrders = pgTable('regular_customer_orders', {
    customerId: integer('customer_id').primaryKey(),
    productId: integer('product_id').notNull(),
    quantityOrdered: integer('quantity_ordered').notNull(),
});

const vipCustomerOrders = pgTable('vip_customer_orders', {
    customerId: integer('customer_id').primaryKey(),
    productId: integer('product_id').notNull(),
    quantityOrdered: integer('quantity_ordered').notNull(),
});
```

import-pattern

builder-pattern

schema.ts

__

```
import { intersectAll } from 'drizzle-orm/mysql-core'
import { regularCustomerOrders, vipCustomerOrders } from './schema'

const regularOrders = db.select({ 
    productId: regularCustomerOrders.productId,
    quantityOrdered: regularCustomerOrders.quantityOrdered }
).from(regularCustomerOrders);

const vipOrders = db.select({ 
    productId: vipCustomerOrders.productId,
    quantityOrdered: vipCustomerOrders.quantityOrdered }
).from(vipCustomerOrders);

const result = await intersectAll(regularOrders, vipOrders);
```

__

```
select \`product_id\`, \`quantity_ordered\` from \`regular_customer_orders\`
intersect all
select \`product_id\`, \`quantity_ordered\` from \`vip_customer_orders\`
```

__

```
import { regularCustomerOrders, vipCustomerOrders } from './schema'

const result = await db
    .select({
      productId: regularCustomerOrders.productId,
      quantityOrdered: regularCustomerOrders.quantityOrdered,
    })
    .from(regularCustomerOrders)
    .intersectAll(
      db
        .select({
          productId: vipCustomerOrders.productId,
          quantityOrdered: vipCustomerOrders.quantityOrdered,
        })
        .from(vipCustomerOrders)
    );
```

__

```
select \`product_id\`, \`quantity_ordered\` from \`regular_customer_orders\`
intersect all 
select \`product_id\`, \`quantity_ordered\` from \`vip_customer_orders\`
```

__

```
import { int, mysqlTable } from "drizzle-orm/mysql-core";

const regularCustomerOrders = mysqlTable('regular_customer_orders', {
    customerId: int('customer_id').primaryKey(),
    productId: int('product_id').notNull(),
    quantityOrdered: int('quantity_ordered').notNull(),
});

const vipCustomerOrders = mysqlTable('vip_customer_orders', {
    customerId: int('customer_id').primaryKey(),
    productId: int('product_id').notNull(),
    quantityOrdered: int('quantity_ordered').notNull(),
});
```

Not supported by SQLite

Not supported by SingleStore

Not supported by MSSQL

import-pattern

builder-pattern

schema.ts

__

```
import { intersectAll } from 'drizzle-orm/cockroach-core'
import { regularCustomerOrders, vipCustomerOrders } from './schema'

const regularOrders = db.select({ 
    productId: regularCustomerOrders.productId,
    quantityOrdered: regularCustomerOrders.quantityOrdered }
).from(regularCustomerOrders);

const vipOrders = db.select({ 
    productId: vipCustomerOrders.productId,
    quantityOrdered: vipCustomerOrders.quantityOrdered }
).from(vipCustomerOrders);

const result = await intersectAll(regularOrders, vipOrders);
```

__

```
select "product_id", "quantity_ordered" from "regular_customer_orders"
intersect all
select "product_id", "quantity_ordered" from "vip_customer_orders"
```

__

```
import { regularCustomerOrders, vipCustomerOrders } from './schema'

const result = await db
    .select({
      productId: regularCustomerOrders.productId,
      quantityOrdered: regularCustomerOrders.quantityOrdered,
    })
    .from(regularCustomerOrders)
    .intersectAll(
      db
        .select({
          productId: vipCustomerOrders.productId,
          quantityOrdered: vipCustomerOrders.quantityOrdered,
        })
        .from(vipCustomerOrders)
    );
```

__

```
select "product_id", "quantity_ordered" from "regular_customer_orders"
intersect all
select "product_id", "quantity_ordered" from "vip_customer_orders"
```

__

```
import { int4, cockroachTable } from "drizzle-orm/cockroach-core";

const regularCustomerOrders = cockroachTable('regular_customer_orders', {
    customerId: int4('customer_id').primaryKey(),
    productId: int4('product_id').notNull(),
    quantityOrdered: int4('quantity_ordered').notNull(),
});

const vipCustomerOrders = cockroachTable('vip_customer_orders', {
    customerId: int4('customer_id').primaryKey(),
    productId: int4('product_id').notNull(),
    quantityOrdered: int4('quantity_ordered').notNull(),
});
```

### Except [](#except)

For two query blocks A and B, return all results from A which are not also present in B, omitting any duplicates.

Suppose you have two tables that store information about employees’ project assignments. You want to find the projects that are unique to one department and not shared with another department, excluding duplicates.

In this scenario, you want to identify the projects that are exclusive to one department and not shared with the other department. You don’t want to count the same project multiple times, even if multiple employees from the same department are assigned to it.

PostgreSQL

MySQL

SQLite

SingleStore

MSSQL

CockroachDB

import-pattern

builder-pattern

schema.ts

__

```
import { except } from 'drizzle-orm/pg-core'
import { depA, depB } from './schema'

const departmentACourses = db.select({ courseName: depA.projectsName }).from(depA);
const departmentBCourses = db.select({ courseName: depB.projectsName }).from(depB);

const result = await except(departmentACourses, departmentBCourses);
```

__

```
select "projects_name" from "department_a_projects"
except
select "projects_name" from "department_b_projects"
```

__

```
import { depA, depB } from './schema'

const result = await db
    .select({ courseName: depA.projectsName })
    .from(depA)
    .except(db.select({ courseName: depB.projectsName }).from(depB));
```

__

```
select "projects_name" from "department_a_projects"
except
select "projects_name" from "department_b_projects"
```

__

```
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

const depA = pgTable('department_a_projects', {
    employeeId: integer('employee_id'),
    projectsName: varchar('projects_name').notNull(),
});

const depB = pgTable('department_b_projects', {
    employeeId: integer('employee_id'),
    projectsName: varchar('projects_name').notNull(),
});
```

import-pattern

builder-pattern

schema.ts

__

```
import { except } from 'drizzle-orm/mysql-core'
import { depA, depB } from './schema'

const departmentACourses = db.select({ courseName: depA.projectsName }).from(depA);
const departmentBCourses = db.select({ courseName: depB.projectsName }).from(depB);

const result = await except(departmentACourses, departmentBCourses);
```

__

```
select \`projects_name\` from \`department_a_projects\`
except
select \`projects_name\` from \`department_b_projects\`
```

__

```
import { depA, depB } from './schema'

const result = await db
    .select({ courseName: depA.projectsName })
    .from(depA)
    .except(db.select({ courseName: depB.projectsName }).from(depB));
```

__

```
select \`projects_name\` from \`department_a_projects\`
except
select \`projects_name\` from \`department_b_projects\`
```

__

```
import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

const depA = mysqlTable('department_a_projects', {
    employeeId: int('employee_id'),
    projectsName: varchar('projects_name', { length: 256 }).notNull(),
});

const depB = mysqlTable('department_b_projects', {
    employeeId: int('employee_id'),
    projectsName: varchar('projects_name', { length: 256 }).notNull(),
});
```

import-pattern

builder-pattern

schema.ts

__

```
import { except } from 'drizzle-orm/sqlite-core'
import { depA, depB } from './schema'

const departmentACourses = db.select({ courseName: depA.projectsName }).from(depA);
const departmentBCourses = db.select({ courseName: depB.projectsName }).from(depB);

const result = await except(departmentACourses, departmentBCourses);
```

__

```
select "projects_name" from "department_a_projects" 
except 
select "projects_name" from "department_b_projects"
```

__

```
import { depA, depB } from './schema'

const result = await db
    .select({ courseName: depA.projectsName })
    .from(depA)
    .except(db.select({ courseName: depB.projectsName }).from(depB));
```

__

```
select "projects_name" from "department_a_projects" 
except 
select "projects_name" from "department_b_projects"
```

__

```
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

const depA = sqliteTable('department_a_projects', {
    employeeId: int('employee_id'),
    projectsName: text('projects_name').notNull(),
});

const depB = sqliteTable('department_b_projects', {
    employeeId: int('employee_id'),
    projectsName: text('projects_name').notNull(),
});
```

import-pattern

builder-pattern

schema.ts

__

```
import { except } from 'drizzle-orm/singlestore-core'
import { depA, depB } from './schema'

const departmentACourses = db.select({ courseName: depA.projectsName }).from(depA);
const departmentBCourses = db.select({ courseName: depB.projectsName }).from(depB);

const result = await except(departmentACourses, departmentBCourses);
```

__

```
select \`projects_name\` from \`department_a_projects\`
except
select \`projects_name\` from \`department_b_projects\`
```

__

```
import { depA, depB } from './schema'

const result = await db
    .select({ courseName: depA.projectsName })
    .from(depA)
    .except(db.select({ courseName: depB.projectsName }).from(depB));
```

__

```
select \`projects_name\` from \`department_a_projects\`
except
select \`projects_name\` from \`department_b_projects\`
```

__

```
import { int, singlestoreTable, varchar } from "drizzle-orm/singlestore-core";

const depA = singlestoreTable('department_a_projects', {
    employeeId: int('employee_id'),
    projectsName: varchar('projects_name', { length: 256 }).notNull(),
});

const depB = singlestoreTable('department_b_projects', {
    employeeId: int('employee_id'),
    projectsName: varchar('projects_name', { length: 256 }).notNull(),
});
```

import-pattern

builder-pattern

schema.ts

__

```
import { except } from 'drizzle-orm/mssql-core'
import { depA, depB } from './schema'

const departmentACourses = db.select({ courseName: depA.projectsName }).from(depA);
const departmentBCourses = db.select({ courseName: depB.projectsName }).from(depB);

const result = await except(departmentACourses, departmentBCourses);
```

__

```
(select \`projects_name\` from \`department_a_projects\`)
except
(select \`projects_name\` from \`department_b_projects\`)
```

__

```
import { depA, depB } from './schema'

const result = await db
    .select({ courseName: depA.projectsName })
    .from(depA)
    .except(db.select({ courseName: depB.projectsName }).from(depB));
```

__

```
(select \`projects_name\` from \`department_a_projects\`)
except
(select \`projects_name\` from \`department_b_projects\`)
```

__

```
import { int, mssqlTable, nvarchar } from "drizzle-orm/mssql-core";

const depA = mssqlTable('department_a_projects', {
    employeeId: int('employee_id'),
    projectsName: nvarchar('projects_name', { length: 256 }).notNull(),
});

const depB = mssqlTable('department_b_projects', {
    employeeId: int('employee_id'),
    projectsName: nvarchar('projects_name', { length: 256 }).notNull(),
});
```

import-pattern

builder-pattern

schema.ts

__

```
import { except } from 'drizzle-orm/cockroach-core'
import { depA, depB } from './schema'

const departmentACourses = db.select({ courseName: depA.projectsName }).from(depA);
const departmentBCourses = db.select({ courseName: depB.projectsName }).from(depB);

const result = await except(departmentACourses, departmentBCourses);
```

__

```
select "projects_name" from "department_a_projects"
except
select "projects_name" from "department_b_projects"
```

__

```
import { depA, depB } from './schema'

const result = await db
    .select({ courseName: depA.projectsName })
    .from(depA)
    .except(db.select({ courseName: depB.projectsName }).from(depB));
```

__

```
select "projects_name" from "department_a_projects"
except
select "projects_name" from "department_b_projects"
```

__

```
import { int4, cockroachTable, varchar } from "drizzle-orm/cockroach-core";

const depA = cockroachTable('department_a_projects', {
    employeeId: int4('employee_id'),
    projectsName: varchar('projects_name').notNull(),
});

const depB = cockroachTable('department_b_projects', {
    employeeId: int4('employee_id'),
    projectsName: varchar('projects_name').notNull(),
});
```

### Except All [](#except-all)

For two query blocks A and B, return all results from A which are not also present in B, with duplicates.

Let’s consider a scenario where you have two tables containing data about customer orders, and you want to identify products that are exclusively ordered by regular customers (without VIP customers). In this case, you want to keep track of the quantity of each product, even if it’s ordered multiple times by different regular customers.

In this scenario, you want to find products that are exclusively ordered by regular customers and not ordered by VIP customers. You want to retain the quantity information, even if the same product is ordered multiple times by different regular customers.

PostgreSQL

MySQL

SQLite

SingleStore

MSSQL

CockroachDB

import-pattern

builder-pattern

schema.ts

__

```
import { exceptAll } from 'drizzle-orm/pg-core'
import { regularCustomerOrders, vipCustomerOrders } from './schema'

const regularOrders = db.select({ 
    productId: regularCustomerOrders.productId,
    quantityOrdered: regularCustomerOrders.quantityOrdered }
).from(regularCustomerOrders);

const vipOrders = db.select({ 
    productId: vipCustomerOrders.productId,
    quantityOrdered: vipCustomerOrders.quantityOrdered }
).from(vipCustomerOrders);

const result = await exceptAll(regularOrders, vipOrders);
```

__

```
select "product_id", "quantity_ordered" from "regular_customer_orders"
except all
select "product_id", "quantity_ordered" from "vip_customer_orders"
```

__

```
import { regularCustomerOrders, vipCustomerOrders } from './schema'

const result = await db
    .select({
      productId: regularCustomerOrders.productId,
      quantityOrdered: regularCustomerOrders.quantityOrdered,
    })
    .from(regularCustomerOrders)
    .exceptAll(
      db
        .select({
          productId: vipCustomerOrders.productId,
          quantityOrdered: vipCustomerOrders.quantityOrdered,
        })
        .from(vipCustomerOrders)
    );
```

__

```
select "product_id", "quantity_ordered" from "regular_customer_orders"
except all
select "product_id", "quantity_ordered" from "vip_customer_orders"
```

__

```
import { integer, pgTable } from "drizzle-orm/pg-core";

const regularCustomerOrders = pgTable('regular_customer_orders', {
    customerId: integer('customer_id').primaryKey(),
    productId: integer('product_id').notNull(),
    quantityOrdered: integer('quantity_ordered').notNull(),
});

const vipCustomerOrders = pgTable('vip_customer_orders', {
    customerId: integer('customer_id').primaryKey(),
    productId: integer('product_id').notNull(),
    quantityOrdered: integer('quantity_ordered').notNull(),
});
```

import-pattern

builder-pattern

schema.ts

__

```
import { exceptAll } from 'drizzle-orm/mysql-core'
import { regularCustomerOrders, vipCustomerOrders } from './schema'

const regularOrders = db.select({ 
    productId: regularCustomerOrders.productId,
    quantityOrdered: regularCustomerOrders.quantityOrdered }
).from(regularCustomerOrders);

const vipOrders = db.select({ 
    productId: vipCustomerOrders.productId,
    quantityOrdered: vipCustomerOrders.quantityOrdered }
).from(vipCustomerOrders);

const result = await exceptAll(regularOrders, vipOrders);
```

__

```
select \`product_id\`, \`quantity_ordered\` from \`regular_customer_orders\`
except all
select \`product_id\`, \`quantity_ordered\` from \`vip_customer_orders\`
```

__

```
import { regularCustomerOrders, vipCustomerOrders } from './schema'

const result = await db
    .select({
      productId: regularCustomerOrders.productId,
      quantityOrdered: regularCustomerOrders.quantityOrdered,
    })
    .from(regularCustomerOrders)
    .exceptAll(
      db
        .select({
          productId: vipCustomerOrders.productId,
          quantityOrdered: vipCustomerOrders.quantityOrdered,
        })
        .from(vipCustomerOrders)
    );
```

__

```
select \`product_id\`, \`quantity_ordered\` from \`regular_customer_orders\`
except all
select \`product_id\`, \`quantity_ordered\` from \`vip_customer_orders\`
```

__

```
const regularCustomerOrders = mysqlTable('regular_customer_orders', {
    customerId: int('customer_id').primaryKey(),
    productId: int('product_id').notNull(),
    quantityOrdered: int('quantity_ordered').notNull(),
});

const vipCustomerOrders = mysqlTable('vip_customer_orders', {
    customerId: int('customer_id').primaryKey(),
    productId: int('product_id').notNull(),
    quantityOrdered: int('quantity_ordered').notNull(),
});
```

Not supported by SQLite

Not supported by SingleStore

Not supported by MSSQL

import-pattern

builder-pattern

schema.ts

__

```
import { exceptAll } from 'drizzle-orm/cockroach-core'
import { regularCustomerOrders, vipCustomerOrders } from './schema'

const regularOrders = db.select({ 
    productId: regularCustomerOrders.productId,
    quantityOrdered: regularCustomerOrders.quantityOrdered }
).from(regularCustomerOrders);

const vipOrders = db.select({ 
    productId: vipCustomerOrders.productId,
    quantityOrdered: vipCustomerOrders.quantityOrdered }
).from(vipCustomerOrders);

const result = await exceptAll(regularOrders, vipOrders);
```

__

```
select "product_id", "quantity_ordered" from "regular_customer_orders"
except all
select "product_id", "quantity_ordered" from "vip_customer_orders"
```

__

```
import { regularCustomerOrders, vipCustomerOrders } from './schema'

const result = await db
    .select({
      productId: regularCustomerOrders.productId,
      quantityOrdered: regularCustomerOrders.quantityOrdered,
    })
    .from(regularCustomerOrders)
    .exceptAll(
      db
        .select({
          productId: vipCustomerOrders.productId,
          quantityOrdered: vipCustomerOrders.quantityOrdered,
        })
        .from(vipCustomerOrders)
    );
```

__

```
select "product_id", "quantity_ordered" from "regular_customer_orders"
except all
select "product_id", "quantity_ordered" from "vip_customer_orders"
```

__

```
import { int4, cockroachTable } from "drizzle-orm/cockroach-core";

const regularCustomerOrders = cockroachTable('regular_customer_orders', {
    customerId: int4('customer_id').primaryKey(),
    productId: int4('product_id').notNull(),
    quantityOrdered: int4('quantity_ordered').notNull(),
});

const vipCustomerOrders = cockroachTable('vip_customer_orders', {
    customerId: int4('customer_id').primaryKey(),
    productId: int4('product_id').notNull(),
    quantityOrdered: int4('quantity_ordered').notNull(),
});
```