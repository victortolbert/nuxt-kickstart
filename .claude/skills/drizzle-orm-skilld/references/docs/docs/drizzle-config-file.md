Drizzle ORM - drizzle.config.ts

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

[Multiple configuration files](#multiple-configuration-files) [Migrations folder](#migrations-folder)

[dialect](#dialect) [schema](#schema) [out](#out) [driver](#driver)

[dbCredentials](#dbcredentials) [migrations](#migrations) [introspect](#introspect)

[tablesFilter](#tablesfilter) [schemaFilter](#schemafilter) [extensionsFilters](#extensionsfilters)

[entities](#entities)

[strict](#strict) [verbose](#verbose) [breakpoints](#breakpoints)

Seeding

 Overview Generators Versioning

Access your data

 Query Select Insert Update Delete Filters Utils Joins [Magic sql`` operator](https://orm.drizzle.team/docs/sql)

[\[OLD\] Query V1](https://orm.drizzle.team/docs/rqb)

Performance

[ Queries](https://orm.drizzle.team/docs/perf-queries) [Serverless](https://orm.drizzle.team/docs/perf-serverless)

Advanced

[ Set Operations](https://orm.drizzle.team/docs/set-operations) [Generated Columns](https://orm.drizzle.team/docs/generated-columns) [Transactions](https://orm.drizzle.team/docs/transactions) [Batch](https://orm.drizzle.team/docs/batch-api) [Cache](https://orm.drizzle.team/docs/cache) [Dynamic query building](https://orm.drizzle.team/docs/dynamic-query-building) [Read Replicas](https://orm.drizzle.team/docs/read-replicas) [Custom types](https://orm.drizzle.team/docs/custom-types) [Goodies](https://orm.drizzle.team/docs/goodies)

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

# Drizzle Kit configuration file

This guide assumes familiarity with:

- Get started with Drizzle and `drizzle-kit` - [read here](https://orm.drizzle.team/docs/get-started)
- Drizzle schema fundamentals - [read here](https://orm.drizzle.team/docs/sql-schema-declaration)
- Database connection basics - [read here](https://orm.drizzle.team/docs/connect-overview)
- Drizzle migrations fundamentals - [read here](https://orm.drizzle.team/docs/migrations)
- Drizzle Kit [overview](https://orm.drizzle.team/docs/kit-overview) and [config file](https://orm.drizzle.team/docs/drizzle-config-file)

Drizzle Kit lets you declare configuration options in `TypeScript` or `JavaScript` configuration files.

__

```
📦 <project root>
 ├ ...
 ├ 📂 drizzle
 ├ 📂 src
 ├ 📜 drizzle.config.ts
 └ 📜 package.json
```

drizzle.config.ts

drizzle.config.js

__

```
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
});
```

__

```
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
});
```

Example of an extended config file

__

```
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./src/schema.ts",

  driver: "pglite",
  dbCredentials: {
    url: "./database/",
  },

  extensionsFilters: ["postgis"],
  schemaFilter: "public",
  tablesFilter: "*",

  introspect: {
    casing: "camel",
  },

  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations__",
    schema: "public",
  },

  entities: {
    roles: {
      provider: '',
      exclude: [],
      include: []
    }
  },

  breakpoints: true,
  strict: true,
  verbose: true,
});
```

Expand

### Multiple configuration files [](#multiple-configuration-files)

You can have multiple config files in the project, it’s very useful when you have multiple database stages or multiple databases or different databases on the same project:

npm

yarn

pnpm

bun

__

```
npx drizzle-kit generate --config=drizzle-dev.config.ts
npx drizzle-kit generate --config=drizzle-prod.config.ts
```

__

```
yarn drizzle-kit generate --config=drizzle-dev.config.ts
yarn drizzle-kit generate --config=drizzle-prod.config.ts
```

__

```
pnpm drizzle-kit generate --config=drizzle-dev.config.ts
pnpm drizzle-kit generate --config=drizzle-prod.config.ts
```

__

```
bunx drizzle-kit generate --config=drizzle-dev.config.ts
bunx drizzle-kit generate --config=drizzle-prod.config.ts
```

__

```
📦 <project root>
 ├ 📂 drizzle
 ├ 📂 src
 ├ 📜 .env
 ├ 📜 drizzle-dev.config.ts
 ├ 📜 drizzle-prod.config.ts
 ├ 📜 package.json
 └ 📜 tsconfig.json
```

### Migrations folder [](#migrations-folder)

`out` param lets you define folder for your migrations, it’s optional and `drizzle` by default. It’s very useful since you can have many separate schemas for different databases in the same project and have different migration folders for them.

Migration folder contains folders with `.sql` migration files which is used by `drizzle-kit`

__

```
📦 <project root>
 ├ ...
 ├ 📂 drizzle
 │ ├ 📂 20242409125510_premium_mister_fear
 │ ├ 📜 user.ts 
 │ ├ 📜 post.ts 
 │ └ 📜 comment.ts 
 ├ 📂 src
 ├ 📜 drizzle.config.ts
 └ 📜 package.json
```

__

```
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql" | "turso" | "singlestore" | "mssql"
  schema: "./src/schema/*",
  out: "./drizzle",
});
```

## --- [](#---)

### `dialect`[](#dialect)

Dialect of the database you’re using

|  | |
| --- | --- |
| type | `postgresql` `mysql` `sqlite` `turso` `singlestore` `mssql` `cockroachdb` |
| default | — |
| commands | `generate` `migrate` `push` `pull` `check` `up` |

__

```
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "mysql", 
});
```

### `schema`[](#schema)

`glob` based path to drizzle schema file(s) or folder(s) contaning schema files.

|  | |
| --- | --- |
| type | `string` `string[]` |
| default | — |
| commands | `generate` `push` |

Example 1

Example 2

Example 3

Example 4

__

```
📦 <project root>
 ├ ...
 ├ 📂 drizzle
 ├ 📂 src
 │ ├ ...
 │ ├ 📜 index.ts
 │ └ 📜 schema.ts 
 ├ 📜 drizzle.config.ts
 └ 📜 package.json
```

__

```
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema.ts",
});
```

__

```
📦 <project root>
 ├ ...
 ├ 📂 drizzle
 ├ 📂 src
 │ ├ 📂 user
 │ │ ├ 📜 handler.ts 
 │ │ └ 📜 schema.ts 
 │ ├ 📂 posts
 │ │ ├ 📜 handler.ts 
 │ │ └ 📜 schema.ts 
 │ └ 📜 index.ts
 ├ 📜 drizzle.config.ts
 └ 📜 package.json
```

__

```
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/**/schema.ts",
  //or
  schema: ["./src/user/schema.ts", "./src/posts/schema.ts"]
});
```

__

```
📦 <project root>
 ├ ...
 ├ 📂 drizzle
 ├ 📂 src
 │ ├ 📂 schema
 │ │ ├ 📜 user.ts 
 │ │ ├ 📜 post.ts 
 │ │ └ 📜 comment.ts 
 │ └ 📜 index.ts
 ├ 📜 drizzle.config.ts
 └ 📜 package.json
```

__

```
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema/*",
});
```

__

```
📦 <project root>
 ├ ...
 ├ 📂 drizzle
 ├ 📂 src
 │ ├ 📜 userById.ts 
 │ ├ 📜 userByEmail.ts 
 │ ├ 📜 listUsers.ts 
 │ ├ 📜 user.sql.ts 
 │ ├ 📜 postById.ts 
 │ ├ 📜 listPosts.ts 
 │ └ 📜 post.sql.ts 
 │ 📜 index.ts
 ├ 📜 drizzle.config.ts
 └ 📜 package.json
```

__

```
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/**/*.sql.ts", // Dax's favourite
});
```

### `out`[](#out)

Defines output folder of your SQL migration files, json snapshots of your schema and `schema.ts` from `drizzle-kit pull` command.

|  | |
| --- | --- |
| type | `string` `string[]` |
| default | `drizzle` |
| commands | `generate` `migrate` `push` `pull` `check` `up` |

__

```
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle", 
});
```

### `driver`[](#driver)

Drizzle Kit automatically picks available database driver from your current project based on the provided `dialect`, yet some vendor specific databases require a different subset of connection params.

`driver` option let’s you explicitely pick those exceptions drivers.

|  | |
| --- | --- |
| type | `aws-data-api` `d1-http` `pglight` |
| default | — |
| commands | `migrate` `push` `pull` |

AWS Data API

PGLite

Cloudflare D1 HTTP

__

```
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  driver: "aws-data-api",
  dbCredentials: {
    database: "database",
    resourceArn: "resourceArn",
    secretArn: "secretArn",
  },
});
```

__

```
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  driver: "pglite",
  dbCredentials: {
    // inmemory
    url: ":memory:"
    
    // or database folder
    url: "./database/"
  },
});
```

__

```
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/schema.ts",
  driver: "d1-http",
  dbCredentials: {
    accountId: "accountId",
    databaseId: "databaseId",
    token: "token",
  },
});
```

## --- [](#----1)

### `dbCredentials`[](#dbcredentials)

Database connection credentials in a form of `url`, `user:password@host:port/db` params or exceptions drivers(`aws-data-api` `d1-http` `pglight` ) specific connection options.

|  | |
| --- | --- |
| type | union of drivers connection options |
| default | — |
| commands | `migrate` `push` `pull` |

PostgreSQL

MySQL

SQLite

Turso

Cloudflare D1

AWS Data API

PGLite

__

```
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: "postgres://user:password@host:port/db",
  }
});
```

__

```
import { defineConfig } from 'drizzle-kit'

// via connection params
export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    host: "host",
    port: 5432,
    user: "user",
    password: "password",
    database: "dbname",
    ssl: true, // can be boolean | "require" | "allow" | "prefer" | "verify-full" | options from node:tls
  }
});
```

__

```
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: "mysql",
  dbCredentials: {
    url: "mysql://user:password@host:port/db",
  }
});
```

__

```
import { defineConfig } from 'drizzle-kit'

// via connection params
export default defineConfig({
  dialect: "mysql",
  dbCredentials: {
    host: "host",
    port: 5432,
    user: "user",
    password: "password",
    database: "dbname",
    ssl: "...", // can be: string | SslOptions (ssl options from mysql2 package)
  }
});
```

__

```
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: "sqlite",
  dbCredentials: {
    url: ":memory:", // inmemory database
    // or
    url: "sqlite.db", 
    // or
    url: "file:sqlite.db" // file: prefix is required by libsql
  }
});
```

__

```
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: "turso",
  dbCredentials: {
    url: "libsql://acme.turso.io" // remote Turso database url
    authToken: "...",

    // or if you need local db

    url: ":memory:", // inmemory database
    // or
    url: "file:sqlite.db", // file: prefix is required by libsql
  }
});
```

__

```
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId: "",
    databaseId: "",
    token: "",
  }
});
```

__

```
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: "postgresql",
  driver: "aws-data-api",
  dbCredentials: {
    database: "database",
    resourceArn: "resourceArn",
    secretArn: "secretArn",
  },
});
```

__

```
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: "postgresql",
  driver: "pglite",
  dbCredentials: {
    url: "./database/", // database folder path
  }
});
```

### `migrations`[](#migrations)

When running `drizzle-kit migrate` - drizzle will records about successfully applied migrations in your database in log table named `__drizzle_migrations` in `public` schema(PostgreSQL only).

`migrations` config options lets you change both migrations log `table` name and `schema`.

|  | |
| --- | --- |
| type | `{ table: string, schema: string }` |
| default | `{ table: "__drizzle_migrations", schema: "drizzle" }` |
| commands | `migrate` |

__

```
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  migrations: {
    table: 'my-migrations-table', // \`__drizzle_migrations\` by default
    schema: 'public', // used in PostgreSQL only, \`drizzle\` by default
  },
});
```

### `introspect`[](#introspect)

Configuration for `drizzle-kit pull` command.

`casing` is responsible for in-code column keys casing

|  | |
| --- | --- |
| type | `{ casing: "preserve" \| "camel" }` |
| default | `{ casing: "camel" }` |
| commands | `pull` |

camel

preserve

__

```
import * as p from "drizzle-orm/pg-core"

export const users = p.pgTable("users", {
  id: p.serial(),
  firstName: p.text("first-name"),
  lastName: p.text("LastName"),
  email: p.text(),
  phoneNumber: p.text("phone_number"),
});
```

__

```
SELECT a.attname AS column_name, format_type(a.atttypid, a.atttypmod) as data_type FROM pg_catalog.pg_attribute a;
```

__

```
 column_name   | data_type        
---------------+------------------------
 id            | serial
 first-name    | text
 LastName      | text
 email         | text
 phone_number  | text
```

__

```
import * as p from "drizzle-orm/pg-core"

export const users = p.pgTable("users", {
  id: p.serial(),
  "first-name": p.text("first-name"),
  LastName: p.text("LastName"),
  email: p.text(),
  phone_number: p.text("phone_number"),
});
```

__

```
SELECT a.attname AS column_name, format_type(a.atttypid, a.atttypmod) as data_type FROM pg_catalog.pg_attribute a;
```

__

```
 column_name   | data_type        
---------------+------------------------
 id            | serial
 first-name    | text
 LastName      | text
 email         | text
 phone_number  | text
```

## --- [](#----2)

### `tablesFilter`[](#tablesfilter)

If you want to run multiple projects with one database - check out our guide.

`drizzle-kit push` and `drizzle-kit pull` will by default manage all tables in `public` schema. You can configure list of tables, schemas and extensions via `tablesFilters`, `schemaFilter` and `extensionFilters` options.

`tablesFilter` option lets you specify `glob` based table names filter, e.g. `["users", "user_info"]` or `"user*"`

|  | |
| --- | --- |
| type | `string` `string[]` |
| default | — |
| commands | `generate` `push` `pull` |

__

```
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  tablesFilter: ["users", "posts", "project1_*"],
});
```

### `schemaFilter`[](#schemafilter)

Was changed starting from `1.0.0-beta.1` version!

IMPORTANT

How it works in 0.x versions

`drizzle-kit push` and `drizzle-kit pull` will by default manage all tables in `public` schema. You can configure list of tables, schemas and extensions via `tablesFilters`, `schemaFilter` and `extensionFilters` options.

`schemaFilter` option lets you specify list of schemas for Drizzle Kit to manage

|  | |
| --- | --- |
| type | `string[]` |
| default | `["public"]` |
| commands | `push` `pull` |

If you want to run multiple projects with one database - check out our guide.

`drizzle-kit push` and `drizzle-kit pull` will by default manage all schemas.

`schemaFilter` option lets you specify `glob` based schema names filter, e.g. `["public", "auth"]` or `"tenant_*"`

|  | |
| --- | --- |
| type | `string[]` |
| commands | `push` `pull` |

__

```
export default defineConfig({
  dialect: "postgresql",
  schemaFilter: ["public", "schema1", "schema2"],
});
```

### `extensionsFilters`[](#extensionsfilters)

Some extensions like `postgis`, when installed on the database, create its own tables in public schema. Those tables have to be ignored by `drizzle-kit push` or `drizzle-kit pull`.

`extensionsFilters` option lets you declare list of installed extensions for drizzle kit to ignore their tables in the schema.

|  | |
| --- | --- |
| type | `["postgis"]` |
| default | `[]` |
| commands | `push` `pull` |

__

```
export default defineConfig({
  dialect: "postgresql",
  extensionsFilters: ["postgis"],
});
```

## --- [](#----3)

### `entities`[](#entities)

This configuration is created to set up management settings for specific `entities` in the database.

For now, it only includes `roles`, but eventually all database entities will migrate here, such as `tables`, `schemas`, `extensions`, `functions`, `triggers`, etc

#### `roles`[](#roles)

If you are using Drizzle Kit to manage your schema and especially the defined roles, there may be situations where you have some roles that are not defined in the Drizzle schema. In such cases, you may want Drizzle Kit to skip those `roles` without the need to write each role in your Drizzle schema and mark it with `.existing()`.

The `roles` option lets you:

- Enable or disable role management with Drizzle Kit.
- Exclude specific roles from management by Drizzle Kit.
- Include specific roles for management by Drizzle Kit.
- Enable modes for providers like `Neon` and `Supabase`, which do not manage their specific roles.
- Combine all the options above

|  | |
| --- | --- |
| type | `boolean \| { provider: "neon" \| "supabase", include: string[], exclude: string[]}` |
| default | `false` |
| commands | `push` `pull` `generate` |

By default, `drizzle-kit` won’t manage roles for you, so you will need to enable that. in `drizzle.config.ts`

__

```
export default defineConfig({
  dialect: "postgresql",
  entities: {
    roles: true
  }
});
```

**You have a role `admin` and want to exclude it from the list of manageable roles**

__

```
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  ...
  entities: {
    roles: {
      exclude: ['admin']
    }
  }
});
```

**You have a role `admin` and want to include to the list of manageable roles**

__

```
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  ...
  entities: {
    roles: {
      include: ['admin']
    }
  }
});
```

**If you are using `Neon` and want to exclude roles defined by `Neon`, you can use the provider option**

__

```
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  ...
  entities: {
    roles: {
      provider: 'neon'
    }
  }
});
```

**If you are using `Supabase` and want to exclude roles defined by `Supabase`, you can use the provider option**

__

```
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  ...
  entities: {
    roles: {
      provider: 'supabase'
    }
  }
});
```

important

You may encounter situations where Drizzle is slightly outdated compared to new roles specified by database providers, so you may need to use both the `provider` option and `exclude` additional roles. You can easily do this with Drizzle:

__

```
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  ...
  entities: {
    roles: {
      provider: 'supabase',
      exclude: ['new_supabase_role']
    }
  }
});
```

## --- [](#----4)

### `strict`[](#strict)

Prompts confirmation to run printed SQL statements when running `drizzle-kit push` command.

|  | |
| --- | --- |
| type | `boolean` |
| default | `false` |
| commands | `push` |

__

```
export default defineConfig({
  dialect: "postgresql",
  strict: false,
});
```

### `verbose`[](#verbose)

Print all SQL statements during `drizzle-kit push` command.

|  | |
| --- | --- |
| type | `boolean` |
| default | `true` |
| commands | `generate` `pull` |

__

```
export default defineConfig({
  dialect: "postgresql",
  verbose: false,
});
```

### `breakpoints`[](#breakpoints)

Drizzle Kit will automatically embed `--> statement-breakpoint` into generated SQL migration files, that’s necessary for databases that do not support multiple DDL alternation statements in one transaction(MySQL and SQLite).

`breakpoints` option flag lets you switch it on and off

|  | |
| --- | --- |
| type | `boolean` |
| default | `true` |
| commands | `generate` `pull` |

__

```
export default defineConfig({
  dialect: "postgresql",
  breakpoints: false,
});
```