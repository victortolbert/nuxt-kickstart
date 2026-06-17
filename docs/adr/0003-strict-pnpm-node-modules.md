# Strict pnpm node_modules (no shamefully-hoist)

pnpm settings live in `pnpm-workspace.yaml` (pnpm 11's preferred location);
`.npmrc` is reserved for registry/auth config. We dropped
`shamefully-hoist=true`: it flattened `node_modules` and silently satisfied
**phantom dependencies** — packages imported but never declared — so code
worked by accident on a developer's machine and could break under a stricter
layout (CI, serverless). Instead, each phantom dependency is declared
directly. The two real cases were `h3` (imported by server routes/utils) and
`vitest-environment-nuxt` (used by `vitest.config.ts`); `autoInstallPeers`
(pnpm's default since v8) resolves peer dependencies without listing them, so
peers never need a manual entry. We also pruned direct dependencies that were
only present transitively (`@shikijs/langs`, `gray-matter`, `nodemailer`) or
entirely unused (`date-fns`).

The payoff: a future undeclared import now fails loudly at install/build
instead of hiding behind a flat tree — exactly the class of bug an
enterprise-template should not ship. We considered keeping `shamefully-hoist`
(zero churn, but masks that bug class) and adding a narrow `publicHoistPattern`
(needed by nothing once the deps were declared). Revisit only if a dependency
genuinely cannot declare a required peer and needs targeted hoisting — add a
scoped `publicHoistPattern` for that package then, never blanket hoisting.
