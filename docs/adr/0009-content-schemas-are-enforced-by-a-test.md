# Content schemas are enforced by a test, because Nuxt Content does not enforce them

The Zod schemas under `schemas/` look like validation, but they validate
nothing. Nuxt Content v3's `defineCollection` converts the schema to JSON
Schema, keeps that for the SQL column types and the generated TypeScript, and
discards the Zod object. The parse step then inserts whatever the frontmatter
said. A guide with `category: NOT_A_CATEGORY`, against a `z.enum([...])`, is
stored unchallenged and nothing is logged. Not even an enum is enforced at
parse time, and a `.refine()` cannot survive the conversion at all: it lints
and typechecks, and never runs.

This was measured in the project Kickstart was carved out of, where the first
run of the check found 134 documents that had been stored against their schema
for months. It is ported here so a project started from the template begins
with the check in place, rather than finding out the same way.

**Every document under `content/` is therefore parsed against its collection's
Zod schema by `test/unit/content-schema-validation.test.ts`, and that test is
the only place a constraint written in `schemas/` bites.** It mocks
`defineCollection` to hand back its argument (the real one throws outside the
Nuxt build), matches each file to a collection by the same source glob the
coverage check (`content-collection-coverage.test.ts`) uses, reads frontmatter
the way remark-mdc does, and fails on any `.safeParse()` that does not succeed.
A constraint you want enforced goes in the Zod schema as before; a constraint
that would only be a type, such as a `.refine()`, is now real too, because it
runs in the test.

## Considered

- **Strip the constraints down to what Nuxt Content honors**: rejected. It
  honors nothing, and the constraints are mostly right. They were never wrong,
  only unenforced.
- **Document the gap and leave it**: rejected. People read a schema as
  validation even when a note says it is not, and they write constraints that
  never fire.
- **Per-rule tests**: not the general answer. A rule that lives in a test and
  not in the schema is invisible to the generated types and to anyone reading
  `schemas/`.

## Consequences

- When a new constraint lands, documents that break it are findings. Fix the
  document. Loosen the schema only if it was wrong, never to make a red go
  away. The first run here found none.
- The test reads frontmatter as written. Nuxt Content also lifts a leading
  `# Heading` into `title` and derives one from the filename when both are
  absent. The test does not, because the schema says a document declares its
  title, and a fallback is not a declaration.
- `defineCollection` is still the only reader of the schema at build time, so
  `.refine()`, `.transform()` and anything else JSON Schema cannot express
  still contributes nothing to the column types or the generated `Collections`
  type. These constraints are enforced but not typed, so declare the narrow
  type separately if it matters.
- A collection whose source is a remote repository (`NUXT_CONTENT_REPO_URL`,
  via `createCollectionSource`) is outside this check, which reads the local
  tree. The test throws rather than passing vacuously when that variable is set.
