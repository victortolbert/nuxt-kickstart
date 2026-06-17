Drizzle ORM - Generators

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

 Overview Generators

[default](#default) [valuesFromArray](#valuesfromarray) [intPrimaryKey](#intprimarykey) [number](#number) [int](#int) [boolean](#boolean) [date](#date) [time](#time) [timestamp](#timestamp) [datetime](#datetime) [year](#year) [json](#json) [interval](#interval) [string](#string) [uuid](#uuid) [firstName](#firstname) [lastName](#lastname) [fullName](#fullname) [email](#email) [phoneNumber](#phonenumber) [country](#country) [city](#city) [streetAddress](#streetaddress) [jobTitle](#jobtitle) [postcode](#postcode) [state](#state) [companyName](#companyname) [loremIpsum](#loremipsum) [point](#point) [line](#line) [bitString](#bitstring) [inet](#inet) [geometry](#geometry) [vector](#vector)

Versioning

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

# Generators

warning

For now, specifying `arraySize` along with `isUnique` in generators that support it will result in unique values being generated (not unique arrays), which will then be packed into arrays.

## --- [](#---)

### `default`[](#default)

Generates the same given value each time the generator is called.

|  | param | default | type |
| --- | --- | --- | --- |
|  | `defaultValue` | — | `any` |
|  | `arraySize` | — | `number` |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  posts: {
    columns: {
      content: funcs.default({
        // value you want to generate
        defaultValue: "post content",

        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3
      }),
    },
  },
}));
```

### `valuesFromArray`[](#valuesfromarray)

Generates values from given array

|  | param | default | type |
| --- | --- | --- | --- |
|  | `values` | — | `any[]` \| `{ weight: number; values: any[] }[]` |
|  | `isUnique` | `database column uniqueness` | `boolean` |
|  | `arraySize` | — | `number` |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  posts: {
    columns: {
      title: funcs.valuesFromArray({
        // Array of values you want to generate (can be an array of weighted values)
        values: ["Title1", "Title2", "Title3", "Title4", "Title5"],

        // Property that controls whether the generated values will be unique or not
        isUnique: true,
        
        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3
      }),
    },
  },
}));
```

### `intPrimaryKey`[](#intprimarykey)

Generates sequential integers starting from 1.

|  | param | default | type |
| --- | --- | --- | --- |
|  | — | — | — |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  posts: {
    columns: {
      id: funcs.intPrimaryKey(),
    },
  },
}));
```

### `number`[](#number)

Generates numbers with a floating point within the given range

|  | param | default | type |
| --- | --- | --- | --- |
|  | `isUnique` | `database column uniqueness` | `boolean` |
|  | `precision` | `100` | `number` |
|  | `maxValue` | `\`precision * 1000\` if isUnique equals false` `\`precision * count\` if isUnique equals true` | `number` |
|  | `minValue` | `-maxValue` | `number` |
|  | `arraySize` | — | `number` |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  products: {
    columns: {
      unitPrice: funcs.number({
        // lower border of range.
        minValue: 10,

        // upper border of range.
        maxValue: 120,
        
        // precision of generated number:
        // precision equals 10 means that values will be accurate to one tenth (1.2, 34.6);
        // precision equals 100 means that values will be accurate to one hundredth (1.23, 34.67).
        precision: 100,

        // property that controls if generated values gonna be unique or not.
        isUnique: false,

        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3
      }),
    },
  },
}));
```

### `int`[](#int)

Generates integers within the given range

|  | param | default | type |
| --- | --- | --- | --- |
|  | `isUnique` | `database column uniqueness` | `boolean` |
|  | `maxValue` | `\`1000\` if isUnique equals false` `\`count * 10\` if isUnique equals true` | `number \| bigint` |
|  | `minValue` | `-maxValue` | `number \| bigint` |
|  | `arraySize` | — | `number` |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  products: {
    columns: {
      unitsInStock: funcs.int({
        // lower border of range.
        minValue: 0,

        // lower border of range.
        maxValue: 100,

        // property that controls if generated values gonna be unique or not.
        isUnique: false,

        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3
      }),
    },
  },
}));
```

### `boolean`[](#boolean)

Generates boolean values (true or false)

|  | param | default | type |
| --- | --- | --- | --- |
|  | `arraySize` | — | `number` |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  users: {
    columns: {
      isAvailable: funcs.boolean({
        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3
      }),
    },
  },
}));
```

### `date`[](#date)

Generates a date within the given range

|  | param | default | type |
| --- | --- | --- | --- |
|  | `minDate` | `new Date('2020-05-08')` | `string \| Date` |
|  | `maxDate` | `new Date('2028-05-08')` | `string \| Date` |
|  | `arraySize` | — | `number` |

IMPORTANT

If only one of the parameters (`minDate` or `maxDate`) is provided, the unspecified parameter will be calculated by adding or subtracting 8 years to/from the specified one

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  users: {
    columns: {
      birthDate: funcs.date({
        // lower border of range.
        minDate: "1990-01-01",

        // upper border of range.
        maxDate: "2010-12-31",

        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3
      }),
    },
  },
}));
```

### `time`[](#time)

Generates time in 24-hour format

|  | param | default | type |
| --- | --- | --- | --- |
|  | `arraySize` | — | `number` |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  users: {
    columns: {
      birthTime: funcs.time({
        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3
      }),
    },
  },
}));
```

### `timestamp`[](#timestamp)

Generates timestamps

|  | param | default | type |
| --- | --- | --- | --- |
|  | `arraySize` | — | `number` |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  orders: {
    columns: {
      shippedDate: funcs.timestamp({
        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3
      }),
    },
  },
}));
```

### `datetime`[](#datetime)

Generates datetime objects

|  | param | default | type |
| --- | --- | --- | --- |
|  | `arraySize` | — | `number` |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  orders: {
    columns: {
      shippedDate: funcs.datetime({
        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3
      }),
    },
  },
}));
```

### `year`[](#year)

Generates years in `YYYY` format

|  | param | default | type |
| --- | --- | --- | --- |
|  | `arraySize` | — | `number` |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  users: {
    columns: {
      birthYear: funcs.year({
        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3
      }),
    },
  },
}));
```

### `json`[](#json)

Generates JSON objects with a fixed structure

__

```
{ email, name, isGraduated, hasJob, salary, startedWorking, visitedCountries}

// or

{ email, name, isGraduated, hasJob, visitedCountries }
```

> The JSON structure will be picked randomly

|  | param | default | type |
| --- | --- | --- | --- |
|  | `arraySize` | — | `number` |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  users: {
    columns: {
      metadata: funcs.json({
        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3
      }),
    },
  },
}));
```

### `interval`[](#interval)

Generates time intervals.

Example of a generated value: `1 year 12 days 5 minutes`

|  | param | default | type |
| --- | --- | --- | --- |
|  | `isUnique` | `database column uniqueness` | `boolean` |
|  | `arraySize` | — | `number` |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  users: {
    columns: {
      timeSpentOnWebsite: funcs.interval({
        // \`isUnique\` - property that controls whether the generated values will be unique or not
        isUnique: true,

        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3
      }),
    },
  },
}));
```

### `string`[](#string)

Generates random strings

|  | param | default | type |
| --- | --- | --- | --- |
|  | `isUnique` | `database column uniqueness` | `boolean` |
|  | `arraySize` | — | `number` |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  users: {
    columns: {
      hashedPassword: funcs.string({
        // \`isUnique\` - property that controls whether the generated values will be unique or not
        isUnique: false,
        
        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3
      }),
    },
  },
}));
```

### `uuid`[](#uuid)

Generates v4 UUID strings

|  | param | default | type |
| --- | --- | --- | --- |
|  | `arraySize` | — | `number` |

__

```
import { seed } from "drizzle-seed";
await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  products: {
    columns: {
      id: funcs.uuid({
        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3
      }),
    },
  },
}));
```

### `firstName`[](#firstname)

Generates a person’s first name

|  | param | default | type |
| --- | --- | --- | --- |
|  | `isUnique` | `database column uniqueness` | `boolean` |
|  | `arraySize` | — | `number` |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  users: {
    columns: {
      firstName: funcs.firstName({
        // \`isUnique\` - property that controls whether the generated values will be unique or not
        isUnique: true,

        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3
      }),
    },
  },
}));
```

### `lastName`[](#lastname)

Generates a person’s last name

|  | param | default | type |
| --- | --- | --- | --- |
|  | `isUnique` | `database column uniqueness` | `boolean` |
|  | `arraySize` | — | `number` |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  users: {
    columns: {
      lastName: funcs.lastName({
        // \`isUnique\` - property that controls whether the generated values will be unique or not
        isUnique: false,
        
        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3
      }),
    },
  },
}));
```

### `fullName`[](#fullname)

Generates a person’s full name

|  | param | default | type |
| --- | --- | --- | --- |
|  | `isUnique` | `database column uniqueness` | `boolean` |
|  | `arraySize` | — | `number` |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  users: {
    columns: {
      fullName: funcs.fullName({
        // \`isUnique\` - property that controls whether the generated values will be unique or not
        isUnique: true,

        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3
      }),
    },
  },
}));
```

### `email`[](#email)

Generates unique email addresses

|  | param | default | type |
| --- | --- | --- | --- |
|  | `arraySize` | — | `number` |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  users: {
    columns: {
      email: funcs.email({
        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3
      }),
    },
  },
}));
```

### `phoneNumber`[](#phonenumber)

Generates unique phone numbers

|  | param | default | type |
| --- | --- | --- | --- |
|  | `template` | — | `string` |
|  | `prefixes` | Used dataset for prefixes | `string[]` |
|  | `generatedDigitsNumbers` | `7` - `if prefixes was defined` | `number \| number[]` |
|  | `arraySize` | — | `number` |

__

```
import { seed } from "drizzle-seed";

//generate phone number using template property
await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  users: {
    columns: {
      phoneNumber: funcs.phoneNumber({ 
        // \`template\` - phone number template, where all '#' symbols will be substituted with generated digits.
        template: "+(380) ###-####",

        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3
      }),
    },
  },
}));
```

__

```
import { seed } from "drizzle-seed";

//generate phone number using prefixes and generatedDigitsNumbers properties
await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  users: {
    columns: {
      phoneNumber: funcs.phoneNumber({
        // \`prefixes\` - array of any string you want to be your phone number prefixes.(not compatible with \`template\` property)
        prefixes: ["+380 99", "+380 67"],

        // \`generatedDigitsNumbers\` - number of digits that will be added at the end of prefixes.(not compatible with \`template\` property)
        generatedDigitsNumbers: 7,

        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3
      }),
    },
  },
}));
```

__

```
import { seed } from "drizzle-seed";

// generate phone number using prefixes and generatedDigitsNumbers properties but with different generatedDigitsNumbers for prefixes
await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  users: {
    columns: {
      phoneNumber: funcs.phoneNumber({
        // \`prefixes\` - array of any string you want to be your phone number prefixes.(not compatible with \`template\` property)
        prefixes: ["+380 99", "+380 67", "+1"],

        // \`generatedDigitsNumbers\` - number of digits that will be added at the end of prefixes.(not compatible with \`template\` property)
        generatedDigitsNumbers: [7, 7, 10],

        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3
      }),
    },
  },
}));
```

### `country`[](#country)

Generates country’s names

|  | param | default | type |
| --- | --- | --- | --- |
|  | `isUnique` | `database column uniqueness` | `boolean` |
|  | `arraySize` | — | `number` |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  users: {
    columns: {
      country: funcs.country({
        // \`isUnique\` - property that controls whether the generated values will be unique or not
        isUnique: false,
        
        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3
      }),
    },
  },
}));
```

### `city`[](#city)

Generates city’s names

|  | param | default | type |
| --- | --- | --- | --- |
|  | `isUnique` | `database column uniqueness` | `boolean` |
|  | `arraySize` | — | `number` |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  users: {
    columns: {
      city: funcs.city({
        // \`isUnique\` - property that controls whether the generated values will be unique or not
        isUnique: false,

        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3
      }),
    },
  },
}));
```

### `streetAddress`[](#streetaddress)

Generates street address

|  | param | default | type |
| --- | --- | --- | --- |
|  | `isUnique` | `database column uniqueness` | `boolean` |
|  | `arraySize` | — | `number` |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  users: {
    columns: {
      streetAddress: funcs.streetAddress({
        // \`isUnique\` - property that controls whether the generated values will be unique or not
        isUnique: false,
        
        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3 
      }),
    },
  },
}));
```

### `jobTitle`[](#jobtitle)

Generates job titles

|  | param | default | type |
| --- | --- | --- | --- |
|  | `arraySize` | — | `number` |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  users: {
    columns: {
      jobTitle: funcs.jobTitle({
        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3
      }),
    },
  },
}));
```

### `postcode`[](#postcode)

Generates postal codes

|  | param | default | type |
| --- | --- | --- | --- |
|  | `isUnique` | `database column uniqueness` | `boolean` |
|  | `arraySize` | — | `number` |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  users: {
    columns: {
      postcode: funcs.postcode({
        // \`isUnique\` - property that controls whether the generated values will be unique or not
        isUnique: true,

        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3
      }),
    },
  },
}));
```

### `state`[](#state)

Generates US states

|  | param | default | type |
| --- | --- | --- | --- |
|  | `arraySize` | — | `number` |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  users: {
    columns: {
      state: funcs.state({
        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3
      }),
    },
  },
}));
```

### `companyName`[](#companyname)

Generates random company’s names

|  | param | default | type |
| --- | --- | --- | --- |
|  | `isUnique` | `database column uniqueness` | `boolean` |
|  | `arraySize` | — | `number` |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  users: {
    columns: {
      company: funcs.companyName({ 
        // \`isUnique\` - property that controls whether the generated values will be unique or not
        isUnique: true,

        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3
      }),
    },
  },
}));
```

### `loremIpsum`[](#loremipsum)

Generates `lorem ipsum` text sentences.

|  | param | default | type |
| --- | --- | --- | --- |
|  | `sentencesCount` | 1 | `number` |
|  | `arraySize` | — | `number` |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  posts: {
    columns: {
      content: funcs.loremIpsum({
        // \`sentencesCount\` - number of sentences you want to generate as one generated value(string).
        sentencesCount: 2,

        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3
      }),
    },
  },
}));
```

### `point`[](#point)

Generates 2D points within specified ranges for x and y coordinates.

|  | param | default | type |
| --- | --- | --- | --- |
|  | `isUnique` | `database column uniqueness` | `boolean` |
|  | `maxXValue` | `\`10 * 1000\` if isUnique equals false` `\`10 * count\` if isUnique equals true` | `number` |
|  | `minXValue` | `-maxXValue` | `number` |
|  | `maxYValue` | `\`10 * 1000\` if isUnique equals false` `\`10 * count\` if isUnique equals true` | `number` |
|  | `minYValue` | `-maxYValue` | `number` |
|  | `arraySize` | — | `number` |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  triangles: {
    columns: {
      pointCoords: funcs.point({
        // \`isUnique\` - property that controls if generated values gonna be unique or not.
        isUnique: true,

        // \`minXValue\` - lower bound of range for x coordinate.
        minXValue: -5,

        // \`maxXValue\` - upper bound of range for x coordinate.
        maxXValue: 20,

        // \`minYValue\` - lower bound of range for y coordinate.
        minYValue: 0,

        // \`maxYValue\` - upper bound of range for y coordinate.
        maxYValue: 30,

        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3
      }),
    },
  },
}));
```

### `line`[](#line)

Generates 2D lines within specified ranges for a, b and c parameters of line.

__

```
line equation: a*x + b*y + c = 0
```

|  | param | default | type |
| --- | --- | --- | --- |
|  | `isUnique` | `database column uniqueness` | `boolean` |
|  | `maxAValue` | `\`10 * 1000\` if isUnique equals false` `\`10 * count\` if isUnique equals true` | `number` |
|  | `minAValue` | `-maxAValue` | `number` |
|  | `maxBValue` | `\`10 * 1000\` if isUnique equals false` `\`10 * count\` if isUnique equals true` | `number` |
|  | `minBValue` | `-maxBValue` | `number` |
|  | `maxCValue` | `\`10 * 1000\` if isUnique equals false` `\`10 * count\` if isUnique equals true` | `number` |
|  | `minCValue` | `-maxCValue` | `number` |
|  | `arraySize` | — | `number` |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  lines: {
    columns: {
      lineParams: funcs.point({
        // \`isUnique\` - property that controls if generated values gonna be unique or not.
        isUnique: true,

        // \`minAValue\` - lower bound of range for a parameter.
        minAValue: -5,

        // \`maxAValue\` - upper bound of range for x parameter.
        maxAValue: 20,

        // \`minBValue\` - lower bound of range for y parameter.
        minBValue: 0,

        // \`maxBValue\` - upper bound of range for y parameter.
        maxBValue: 30,

        // \`minCValue\` - lower bound of range for y parameter.
        minCValue: 0,

        // \`maxCValue\` - upper bound of range for y parameter.
        maxCValue: 10,

        // number of elements in each one-dimensional array. 
        // (If specified, arrays will be generated.)
        arraySize: 3
      }),
    },
  },
}));
```

### `bitString`[](#bitstring)

Generates bit strings based on specified parameters.

|  | param | default | type |
| --- | --- | --- | --- |
|  | `isUnique` | `database column uniqueness` | `boolean` |
|  | `dimensions` | `database column bit-length` | `number` |
|  | `arraySize` | — | `number` |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  bitStringTable: {
    columns: {
      bit: funcs.bitString({
        // desired length of each bit string (e.g., \`dimensions = 3\` produces values like \`'010'\`).
        dimensions: 12,

        // property that controls if generated values gonna be unique or not;
        isUnique: true,

        // number of elements in each one-dimensional array (If specified, arrays will be generated);
        arraySize: 3,
      }),
    },
  },
}));
```

### `inet`[](#inet)

Generates ip addresses based on specified parameters.

|  | param | default | type |
| --- | --- | --- | --- |
|  | `isUnique` | `database column uniqueness` | `boolean` |
|  | `arraySize` | — | `number` |
|  | `ipAddress` | `'ipv4'` | `'ipv4' \| 'ipv6'` |
|  | `includeCidr` | `true` | `boolean` |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  inetTable: {
    columns: {
      inet: funcs.inet({
        // property that controls if generated values gonna be unique or not;
        isUnique: true,

        // number of elements in each one-dimensional array (If specified, arrays will be generated);
        arraySize: 3,

        // type of IP address to generate — either "ipv4" or "ipv6";
        ipAddress: "ipv4",

        // determines whether generated IPs include a CIDR suffix.
        includeCidr: true,
      }),
    },
  },
}));
```

### `geometry`[](#geometry)

Generates geometry objects based on the given parameters.

warnings

arraySize

srid

Currently, if you set arraySize to a value greater than 1 or try to insert more than one `geometry point` element into a `geometry(point, 0)[]` column in PostgreSQL or CockroachDB via drizzle-orm, you’ll encounter an error.

This bug is already in the backlog.



__

```
import { seed } from "drizzle-seed";
import { geometry, pgTable } from 'drizzle-orm/pg-core';

const geometryTable = pgTable('geometry_table', {
	geometryArray: geometry('geometry_array', { type: 'point', srid: 0 }).array(3),
});

await seed(db, { geometryTable }, { count: 1000 }).refine((funcs) => ({
  geometryTable: {
    columns: {
      geometryArray: funcs.geometry({
        // currently arraySize with values > 1 are not supported
        arraySize: 3,
      }),
    },
  },
}));
```



__

```
import { seed } from "drizzle-seed";
import { geometry, pgTable } from 'drizzle-orm/pg-core';

const geometryTable = pgTable('geometry_table', {
	geometryArray: geometry('geometry_array', { type: 'point', srid: 0 }).array(1),
});

await seed(db, { geometryTable }, { count: 1000 }).refine((funcs) => ({
  geometryTable: {
    columns: {
      geometryArray: funcs.geometry({
        // will work as expected
        arraySize: 1,
      }),
    },
  },
}));
```

Currently, if you set the SRID of a `geometry(point)` column to anything other than 0 (for example, 4326) in your drizzle-orm table declaration, you’ll encounter an error during the seeding process.

This bug is already in the backlog.



__

```
import { seed } from "drizzle-seed";
import { geometry, pgTable } from 'drizzle-orm/pg-core';

const geometryTable = pgTable('geometry_table', {
	geometryColumn: geometry('geometry_column', { type: 'point', srid: 4326 }),
});

await seed(db, { geometryTable }, { count: 1000 }).refine((funcs) => ({
  geometryTable: {
    columns: {
      geometryColumn: funcs.geometry({
        srid: 4326,
      }),
    },
  },
}));
```



__

```
import { seed } from "drizzle-seed";
import { geometry, pgTable } from 'drizzle-orm/pg-core';

const geometryTable = pgTable('geometry_table', {
	geometryColumn: geometry('geometry_column', { type: 'point', srid: 0 }),
});

await seed(db, { geometryTable }, { count: 1000 }).refine((funcs) => ({
  geometryTable: {
    columns: {
      geometryColumn: funcs.geometry({
        srid: 4326,
      }),
    },
  },
}));
```

|  | param | default | type |
| --- | --- | --- | --- |
|  | `isUnique` | `database column uniqueness` | `boolean` |
|  | `arraySize` | — | `number` |
|  | `type` | `'point'` | `'point'` |
|  | `srid` | `4326` | `4326 \| 3857` |
|  | `decimalPlaces` | `6` | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7` |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  geometryTable: {
    columns: {
      geometryPointTuple: funcs.geometry({
        // property that controls if generated values gonna be unique or not;
        isUnique: true,

        // number of elements in each one-dimensional array (If specified, arrays will be generated);
        arraySize: 1,

        // geometry type to generate; currently only \`'point'\` is supported;
        type: "point",

        // Spatial Reference System Identifier: determines what type of point will be generated - either \`4326\` or \`3857\`;
        srid: 4326,

        // number of decimal places for points when \`srid\` is \`4326\` (e.g., \`decimalPlaces = 3\` produces values like \`'point(30.723 46.482)'\`).
        decimalPlaces: 5,
      }),
    },
  },
}));
```

### `vector`[](#vector)

Generates vectors based on the provided parameters.

|  | param | default | type |
| --- | --- | --- | --- |
|  | `isUnique` | `database column uniqueness` | `boolean` |
|  | `arraySize` | — | `number` |
|  | `decimalPlaces` | `2` | `number` |
|  | `dimensions` | `database column’s dimensions` | `number` |
|  | `minValue` | `-1000` | `number` |
|  | `maxValue` | `1000` | `number` |

__

```
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  vectorTable: {
    columns: {
      vector: funcs.vector({
        // property that controls if generated values gonna be unique or not;
        isUnique: true,

        // number of elements in each one-dimensional array (If specified, arrays will be generated);
        arraySize: 3,

        // number of decimal places for each vector element (e.g., \`decimalPlaces = 3\` produces values like \`1.123\`);
        decimalPlaces: 5,

        // number of elements in each generated vector (e.g., \`dimensions = 3\` produces values like \`[1,2,3]\`);
        dimensions: 12,

        // minimum allowed value for each vector element;
        minValue: -100,

        // maximum allowed value for each vector element.
        maxValue: 100,
      }),
    },
  },
}));
```