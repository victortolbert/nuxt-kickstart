# Maizzle's compiled email HTML is committed, and not linted

> **Superseded.** The Maizzle email templates were removed when the template was
> stripped back to documentation plus one lab (#18), taking `app/emails/`,
> `server/assets/emails/` and the `@maizzle/nuxt` module with them. The decision
> below is kept as the record of why the build output was committed while the
> subsystem existed; the ESLint ignore it describes is no longer needed.

`pnpm run build` compiles the Vue email templates in `app/emails/` to inlined
HTML in `server/assets/emails/`, and that output is committed rather than
gitignored. The reason is that `renderMaizzleTemplate()` calls Maizzle's
`render()` on a path resolved against `process.cwd()`, which holds in dev but
not under a bundled Nitro serverless preset, where the `.vue` sources are not
part of the deployment. The output lives under `server/assets/` specifically
because Nitro bundles that directory into the server build, so the compiled
HTML is reachable at runtime on every target. The template pins no preset and
ships a `Dockerfile`, a `netlify.toml` and a `vercel.json`, so it cannot assume
a long-running Node process — committing the output is what keeps email working
across all three.

The same files are excluded from ESLint (`server/assets/emails/**`). They
produced 58 `format/prettier` errors — the repo's only standing lint failures —
over long inlined `style` attributes and duplicated declarations, which is
precisely what Maizzle's Tailwind inlining emits. Running `eslint --fix` there
would have been undone by the next build and the errors would have returned, so
the generated tree is ignored and the `.vue` sources carry the linting instead.

We considered gitignoring the output (a cleaner tree, but it removes the
serverless fallback and makes email depend on a deploy target we have not
chosen) and configuring Nitro to bundle the `app/emails/` sources instead (the
better end state, but it needs config nobody has written or verified). Revisit
once the deploy target is actually settled: if it becomes a long-running server,
or if the sources are bundled deliberately, drop the committed output and the
ESLint ignore entry together — they justify each other and neither should
outlive the constraint on its own.
