/**
 * Commit message policy, owned by Preflight.
 *
 * Consumed through commitlint's own `extends` rather than by spreading the
 * preset. A commitlint config carries references — its `parserPreset` and
 * nested `extends` — that commitlint resolves relative to the config's own
 * location, so they have to stay anchored in the package that can resolve
 * them. See ADR-0007 in @victortolbert/preflight.
 *
 * The preset is `@commitlint/config-conventional` with two measured changes:
 * `content` added to `type-enum`, and `subject-case` lowered to a warning so
 * acronym-initial subjects ("ci: SHA-pin every GitHub Action") do not block a
 * commit. Rationale and the commit history behind both is in the preset.
 *
 * Deliberately untyped: `@commitlint/types` is not a declared dependency here,
 * and this repo runs a strict pnpm layout (docs/adr/0003) that would make
 * importing it a phantom dependency.
 */
export default {
  extends: ['@victortolbert/preflight/commitlint'],
}
