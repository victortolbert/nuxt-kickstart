---
name: zod-skilld
description: "ALWAYS use when writing code importing \"zod\". Consult for debugging, best practices, or modifying zod."
metadata:
  version: 4.4.3
  generated_by: Anthropic · Haiku 4.5
  generated_at: 2026-06-11
---

# colinhacks/zod `zod@4.4.3`
**Tags:** next: 3.25.0-beta.20250519T094321, alpha: 3.25.68-alpha.11, beta: 4.1.13-beta.0

**References:** [package.json](./.skilld/pkg/package.json) • [README](./.skilld/pkg/README.md) • [Docs](./.skilld/docs/_INDEX.md) • [Issues](./.skilld/issues/_INDEX.md) • [Discussions](./.skilld/discussions/_INDEX.md) • [Releases](./.skilld/releases/_INDEX.md)

## Search

Use `skilld search "query" -p zod` instead of grepping `.skilld/` directories. Run `skilld search --guide -p zod` for full syntax, filters, and operators.

<!-- skilld:api-changes -->
## API Changes

This section documents version-specific API changes — prioritize recent major/minor releases.

## Breaking Changes & Fixes (v4.4+)

- BREAKING: Tuple defaults now materialize output values — default values in tuple positions now correctly appear in parsed output. `z.tuple([z.string(), z.string().default("fallback")]).parse(["a"])` now returns `["a", "fallback"]` instead of `["a"]` [source](./.skilld/releases/v4.4.0.md:L15-L27)

- BREAKING: Required object properties with `z.undefined()` — a property whose schema is `z.undefined()` is now treated as required. The key must be present (but value may be `undefined`). Use `.optional()` to make the key itself absent [source](./.skilld/releases/v4.4.0.md:L63-L88)

- BREAKING: Safer `.merge()` behavior with refinements — `.merge()` now throws when the receiver has refinements instead of silently dropping them. Use `.extend()` or `.safeExtend()` for object composition instead [source](./.skilld/releases/v4.4.0.md:L92-L104)

- BREAKING: String validators are stricter — `z.base64()` now rejects whitespace (previously allowed `atob()`-style stripping), `z.httpUrl()` rejects malformed URLs like `"https:/example.com"`, and `z.cuid()` tightened with CUID v1 deprecated [source](./.skilld/releases/v4.4.0.md:L118-L143)

- BREAKING: `.pick()` and `.omit()` disallowed on schemas with refinements — previously silently dropped refinements; now throws. Migrate by using `z.object(schema.shape).pick(...)` [source](./.skilld/releases/v4.3.0.md:L237-L250)

- BREAKING: `.extend()` overwriting properties disallowed on schemas with refinements — use `.safeExtend()` instead, which statically ensures no pre-existing property types change [source](./.skilld/releases/v4.3.0.md:L258-L280)

- BREAKING: Stricter object masking methods — `.pick()` and `.omit()` now validate that provided keys actually exist in the schema [source](./.skilld/releases/v4.3.0.md:L283-L292)

- BREAKING: `z.preprocess()` defers optionality to inner schema — behavior change in how optionality is handled when preprocessing [source](./.skilld/releases/v4.4.2.md:L25)

- BREAKING: Union error paths fixed in formatted errors — nested union paths now preserved correctly in `z.treeifyError()` and `z.formatError()` output, may affect error snapshots [source](./.skilld/releases/v4.4.0.md:L145-L151)

## New APIs (v4.3+)

- NEW: `z.fromJSONSchema()` — convert JSON Schema to Zod schemas. Supports draft-2020-12, draft-7, draft-4, and OpenAPI 3.0. Considered experimental [source](./.skilld/releases/v4.3.0.md:L11-L42)

- NEW: `z.xor()` — exclusive union requiring exactly one option to match (unlike `z.union()` which passes if any matches). Converts to `oneOf` in JSON Schema [source](./.skilld/releases/v4.3.0.md:L43-L55)

- NEW: `z.looseRecord()` — partial record validation that only validates keys matching the key schema, passing through non-matching keys unchanged [source](./.skilld/releases/v4.3.0.md:L57-L67)

- NEW: `.exactOptional()` — strict optional property (key-optional but does not accept `undefined` as explicit value). Represents `exactOptionalPropertyTypes` in TypeScript [source](./.skilld/releases/v4.3.0.md:L69-L84)

- NEW: `.apply()` — utility method for applying arbitrary transformations to a schema, enabling cleaner schema composition [source](./.skilld/releases/v4.3.0.md:L86-L96)

- NEW: `.brand()` cardinality — second argument controls whether brand applies to input, output, or both: `.brand<"UserId", "out">()` (output), `"in"` (input), or `"inout"` (both) [source](./.skilld/releases/v4.3.0.md:L99-L108)

- NEW: Type predicates on `.refine()` — use `(s): s is "a"` syntax to narrow output type [source](./.skilld/releases/v4.3.0.md:L111-L119)

- NEW: `ZodMap` methods — `min()`, `max()`, `nonempty()`, and `size` property for parity with `ZodSet` and `ZodArray` [source](./.skilld/releases/v4.3.0.md:L121-L132)

- NEW: `z.invertCodec()` — invert a codec to swap encode/decode directions. Enables bidirectional transformation schemas [source](./.skilld/releases/v4.4.0.md:L178-L196)

- NEW: `ctx.addIssue()` in transforms — transform callbacks now support adding custom issues via context [source](./.skilld/releases/v4.4.0.md:L198-L201)

- NEW: `.with()` alias for `.check()` — more readable alternative for check composition when not all operations are strictly "checks" [source](./.skilld/releases/v4.3.0.md:L134-L150)

- NEW: `z.slugify()` transform — converts strings to URL-friendly slugs [source](./.skilld/releases/v4.3.0.md:L152-L164)

## Additional Changes (v4.4+)

- BREAKING: Empty unions now construct — `z.union([])`, `z.xor([])`, and discriminated unions no longer crash at construction time; they fail at parse time instead [source](./.skilld/releases/v4.4.0.md:L220-L222)

- NEW: `.when()` option for `.superRefine()` — conditional refinement checks [source](./.skilld/releases/v4.4.0.md:L202-L204)

- BREAKING: Record key transforms now run — `z.record()` now applies transforms to record keys in addition to values [source](./.skilld/releases/v4.4.0.md:L154-L166)

- BREAKING: JSON Schema `$defs` entries no longer include redundant `id` — required for correctness in older JSON Schema dialects; may affect consumers reading internal `$id` fields [source](./.skilld/releases/v4.4.0.md:L106-L115)

- BREAKING: Defaults for `Map` and `Set` — now cloned per parse instead of shared, preventing state leaks across multiple parses [source](./.skilld/releases/v4.4.0.md:L206-L218)

**Also changed:** `.safeExtend()` introduced for safe property extensions · More ergonomic strict object intersections (v4.3) · Metadata in `fromJSONSchema()` (v4.4) · Codec encoding for discriminated unions (v4.4) · Improved floating-point multiples (v4.4) · Prototype pollution hardening with `__proto__` skipping (v4.4) · Global config sharing via `globalThis` (v4.4) · Lazy-bound builder methods for reduced memory (v4.4) · Pure annotations for tree-shaking (v4.4) · New locales: Armenian, Uzbek, Croatian, Greek, Romanian (v4.3-v4.4)
<!-- /skilld:api-changes -->

<!-- skilld:best-practices -->
## Best Practices

- Prefer `.safeParse()` over `.parse()` to avoid throwing exceptions — returns a discriminated union result object making error handling more explicit and composable [source](./.skilld/docs/content/basics.mdx:L112:130)

- Use `.pipe()` for chaining transformations in string schemas instead of deprecated chaining methods like `.trim().toLowerCase()` — offers cleaner, more readable schema composition [source](./.skilld/discussions/discussion-5512.md:L40:47)

- Use star imports (`import * as z from "zod"`) rather than named imports — enables better tree-shaking and reduces bundle size across most bundlers including Webpack, esbuild, and Next.js [source](./.skilld/discussions/discussion-5401.md:L36:38)

- Use `.meta()` instead of `.describe()` for schema metadata — allows attaching structured metadata beyond descriptions and enables custom metadata registration via declaration merging [source](./.skilld/docs/content/metadata.mdx:L122:156)

- Library authors should import from `zod/v4/core` (not `zod` directly) and declare zod as a peer dependency — ensures compatibility with both Zod Classic and Zod Mini while supporting both Zod 3 and 4 [source](./.skilld/docs/content/library-authors.mdx:L75:100)

- Use `.apply()` for cleaner schema composition with reusable validation functions — enables higher-order function patterns without requiring chained method calls [source](./.skilld/releases/v4.3.0.md:L86:96)

- Use `z.xor()` for exclusive unions instead of `z.union()` when exactly one option must match — produces `oneOf` in JSON Schema and provides stricter validation semantics [source](./.skilld/releases/v4.3.0.md:L43:55)

- Use `.exactOptional()` on object properties when the key can be omitted but `undefined` should be rejected as a value — accurately represents `exactOptionalPropertyTypes` TypeScript behavior [source](./.skilld/releases/v4.3.0.md:L69:84)

- Use `z.codec()` and `.encode()/.decode()` for bidirectional transformations at network boundaries — enables sharing a single Zod schema between client and server with automatic serialization/deserialization [source](./.skilld/docs/content/codecs.mdx:L49:87)

- Use registries with `.register()` and `.meta()` to associate schemas with metadata for JSON Schema generation and form validation — enables type-safe metadata attachment with proper TypeScript inference [source](./.skilld/docs/content/metadata.mdx:L44:76)

- Prefer `.extend()` or `.safeExtend()` over `.merge()` for object composition — `.merge()` has ambiguous semantics around overlapping keys and refinement handling [source](./.skilld/releases/v4.4.0.md:L103:104)

- Use `z.fromJSONSchema()` to convert JSON Schema definitions directly into Zod schemas — supports multiple JSON Schema drafts (2020-12, 7, 4) and OpenAPI 3.0 with experimental round-trip conversion [source](./.skilld/releases/v4.3.0.md:L11:41)

- Clone `Map` and `Set` defaults instead of reusing instances — default values are now cloned per parse to prevent state leakage across multiple parse calls [source](./.skilld/releases/v4.4.0.md:L206:218)

- Use custom error maps in `.parse()` or `z.config()` with code-based discrimination to customize validation messages contextually — pass an error map function that inspects the `code` property to handle different validation failures [source](./.skilld/docs/content/error-customization.mdx:L218:233)
<!-- /skilld:best-practices -->
