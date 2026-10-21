# Migrations are the only way the schema changes, and a layer owns its tables

Until v1.1 the database schema came from `scripts/init-better-auth-db.ts`, a
script of `CREATE TABLE IF NOT EXISTS` statements run on install. It could
create a database. It could not change one. When Better Auth 1.7 needed
`session.impersonated_by`, every existing database lacked the column and every
sign-in failed. The fix (commit 2583aaa) taught the script an
`addColumnIfMissing` and listed the column twice, once in the `CREATE` and once
as a patch. Each further column would need the same, plus a hand-run
`scripts/add-*-columns.ts` against every deployed database. Optional modules
(the AI, MCP and planning layers) bring their own tables, which made the gap
permanent.

**Drizzle migrations are the only way the schema changes.** The Drizzle schema
is the single source of truth. `pnpm run db:generate` turns a change into a
migration under `server/db/migrations/`, which is committed. `pnpm run
db:migrate` (`scripts/migrate.ts` over `server/db/migrate.ts`) applies the
pending ones. It runs on install, and before the server starts in the Docker
image. The pending migrations apply in one batch, so a failure leaves the
database as it was and exits non-zero, and a deploy that migrates first never
serves a half-migrated schema. A database already current is a no-op, so a
retried deploy is safe. The init script and the `add-*-columns` scripts are
gone. `test/unit/db-schema-files.test.ts` fails when the schema files and the
newest migration snapshot disagree.

**A database the init script created is adopted, once, on its first migrate.**
Such a database has the auth tables and no migration journal. Running the
baseline over it would fail on its first `CREATE TABLE`. Instead, the migrator
records every migration whose snapshot the database already satisfies (every
table, every column) as applied without running it, then applies the rest
normally. The script existed in two shapes, before and after
`impersonated_by`. The older shape is adopted at `0000_baseline` and gets
`0001_session_impersonated_by` as a regular migration. The newer one is
adopted at `0001`. A database with some of the baseline tables but neither
shape is refused rather than guessed at. Nobody runs a step by hand on any
environment.

**A layer owns its tables.** A layer is a Nuxt layer folder,
`layers/<module>/`. If it keeps tables, it declares them in
`layers/<module>/server/db/schema.ts`. The migration tooling reads the base
schema plus every file matching that path (`server/db/schema-files.ts`), so
generating a migration needs no registration step, and the base schema never
mentions the module. All migrations stay in one chain in the base repo, so
ordering is global and a deploy applies a single sequence.

**Deleting a layer leaves its tables.** Removing the folder removes its schema
file from what drizzle-kit reads. drizzle-kit would then generate a migration
that drops the tables, and **that migration is not committed**. Opting out
never destroys data, and restoring the folder restores the module against its
existing rows. The leftover tables are inert. Nothing in the app reads them,
and the app boots normally with them present. A project that adopts the
template without a layer never has its tables at all.

## Considered

- **Keep the init script and add migrations beside it.** Rejected. It leaves
  two sources of schema truth, and the script would go on creating the shape
  of whichever day it was last edited.
- **`drizzle-kit push` on deploy.** Rejected. It diffs a live database against
  the schema and applies the result with no reviewed artifact, so a renamed
  column can be dropped and re-added. A committed migration is what a reviewer
  reads.
- **Run the baseline against legacy databases and ignore "already exists"
  errors.** Rejected. Errors are the signal that something is wrong, and
  swallowing them would hide a database that is genuinely different.
- **A migration chain per layer.** Rejected. Ordering across chains is
  undefined, and a layer's migration that references a base table would have
  no guarantee the table exists yet.

## Consequences

- A schema change is two steps: edit the schema, run `pnpm run db:generate`,
  and commit both. CI fails on the first without the second.
- A layer's migrations live in the base repo's chain, not in the layer folder.
  Adding a layer to a project means generating its migrations in that project.
- The enterprise repo is seeded from v1.1 and is on migrations from its first
  deploy, so it never needs adoption.
- A deleted layer's `CREATE TABLE` stays in the chain. A fresh database still
  creates those tables, empty. They are inert by the same argument as above.
