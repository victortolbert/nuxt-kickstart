---
name: audit
description: Run a single-pass, evidence-cited interface review across accessibility, layout, writing, typography, and UI polish. Returns one severity-ranked findings table plus a Block / Needs changes / Approve verdict. Read-only unless the user also asks to implement fixes.
user-invokable: true
args:
  - name: area
    description: The screen, flow, feature, or repo scope to review (optional; defaults to the primary user path)
    required: false
  - name: mode
    description: "quick (primary path only, HIGH/MEDIUM findings, cap 5) or full (entire scope incl. empty/loading/error/narrow-width states, cap 15). Defaults to full."
    required: false
---

# Audit

A strong interface is one system, not five audits stapled together. Review the whole
experience in this order — accessibility, layout, writing, typography, UI polish — then
consolidate into **one** prioritized verdict. Foundational failures (accessibility,
layout) must not be hidden by polish findings.

This is a report, not a fix. Stay read-only unless the user also asked to implement —
use `/polish`, `/animate`, `/clarify`, `/normalize`, `/harden`, `/adapt`, `/optimize`,
`/colorize`, `/bolder`, `/quieter`, `/distill`, `/extract`, `/onboard`, `/delight`, or
`better-icons` for the fix pass, mapped from the Findings table below.

## Rule bodies live elsewhere — don't restate them here

This audit owns the *methodology and format*. The domain rules it checks against are
already written down; read the relevant one before judging that domain, don't re-derive
it from memory:

| Domain | Read |
| --- | --- |
| Accessibility (semantics, ARIA, labels, forms) | `modern-accessible-html-jsx` skill |
| Accessibility (focus rings, states, modals, keyboard patterns, hit areas) | `frontend-design/reference/interaction-design.md` |
| Layout (hierarchy, grids, spacing, container queries, squint test) | `frontend-design/reference/spatial-design.md` |
| Responsive (breakpoints, adaptation strategy) | `frontend-design/reference/responsive-design.md` |
| Writing (buttons, errors, empty states, tone, translation) | `frontend-design/reference/ux-writing.md` |
| Typography (scale, measure, line-height, OpenType features) | `frontend-design/reference/typography.md` |
| Motion (durations, easing, reduced motion) | `frontend-design/reference/motion-design.md` |
| Surfaces & icons (radius, optical alignment, shadow-as-border, icon animation values, stroke weight, RTL) | `frontend-design/reference/surfaces-and-icons.md` |
| General anti-patterns ("AI slop" tells) | `frontend-design` SKILL.md, "The AI Slop Test" |

Read only the files whose domain is actually in scope for this review — don't load all
of them for a `quick`-mode single-component check.

## Match this repo's styling system

Every finding and every proposed fix must be expressible in what this project already
uses. Never propose a second styling approach.

- Tailwind utility classes + Nuxt UI v4 components (`--ui-*` tokens), never hardcoded
  hex/rgb/oklch colors.
- Icons through `resolveIcon('semanticName')` from `useAppearance()` — never a literal
  `i-tabler-*` (or other) string in app UI. Flag any literal icon name as a finding.
- Before flagging a `U*` Nuxt UI component's behavior as wrong, confirm the v4
  API against the `nuxt-ui` skill or the generated `.nuxt/ui/<component>.ts` —
  v2 patterns break silently and read as false positives.
- Reka UI (which Nuxt UI wraps) already ships keyboard support, roving tabindex, and
  focus management for its primitives. Don't re-flag what Reka already provides —
  audit for *misuse*: a native `UButton`/`UInput` overridden with `outline: none` and
  no replacement, a `<div>` doing a button's job instead of `UButton`, a custom
  control bypassing an available Nuxt UI primitive.
- Filenames and component tags kebab-case; imports from `#shared`, never `~/shared`;
  no semicolons, single quotes, per this repo's conventions.

## Resolve scope and mode first

Infer scope from the request and workspace; state it in the output. Default to `full`
when no mode is given.

| Mode | Coverage | Finding cap |
| --- | --- | --- |
| `quick` | Primary user path and highest-traffic states; `HIGH`/`MEDIUM` only | 5 |
| `full` | Entire requested scope, incl. empty, loading, error, and narrow-width states | 15 |

If the scope is too large to inspect credibly, narrow to the highest-traffic complete
flow and state the boundary. Never imply an uninspected surface was reviewed.

## Recon before judgment

Identify what's actually in play: relevant `app/`, `shared/`, `server/` files; which
Nuxt UI components and design tokens are used; available preview/test commands. For
copy, read nearby interface text and existing terminology before proposing a rewrite.

## Slow the interface down

Don't just scan the code — inspect the rendered state when runtime behavior or visual
judgment matters:

- Walk the primary flow keyboard-only first; every action must complete without a mouse.
- Squint (or blur a screenshot) to check hierarchy still reads.
- Resize the viewport and use real content lengths, not `lorem ipsum`, to catch bad
  wrapping and truncation.
- Replay motion at 10% speed in the browser's Animations panel. What's subtly wrong at
  10% is wrong at full speed.
- Walk every state per element: hover, focus, active, loading, empty, error.

## Require evidence

Every finding cites `path/to/file:line` and shows the current implementation. Never
report a code-level finding from visual appearance alone, or a visual finding from
source code alone when runtime behavior determines the result — mark it **Not
verified** instead of guessing.

## Output format

### Scope and Coverage

State mode, exact scope, and any boundary. Then, for the domains actually in scope:

| Domain | Evidence inspected | Result |
| --- | --- | --- |
| Accessibility | Files/components/states checked | Findings count or `Clear` |

`Clear` = inspected, no actionable finding. `Not reviewed` must say why.

### Findings

One table, ordered by severity, then by reach and leverage (a shared-component or
token fix outranks the same symptom in one leaf component). One root cause per row —
list every location it recurs at rather than repeating the row.

| # | Severity | Domain | Location | Before | After | Why |
| --- | --- | --- | --- | --- | --- | --- |

- `HIGH` — blocks a task, misleads the user, hides content/controls, data-loss risk,
  or a systemic repeated failure.
- `MEDIUM` — meaningfully harms comprehension, efficiency, adaptability, consistency.
- `LOW` — isolated polish, limited task impact. `full` mode only.

Respect the mode's cap; never pad to reach it. If there are no findings, omit the table
and state "No actionable interface findings."

### Considered but Rejected

1–3 candidates in `quick`, 2–5 in `full` — real candidates you inspected and rejected
because the rule permits the current implementation, evidence was insufficient, the
convention is intentional, or the change would add complexity without benefit.

| Location | Candidate | Rejected because |
| --- | --- | --- |

### Verification

List each check run and its result, using this repo's real commands where relevant —
`pnpm run lint:fix`, `pnpm exec vitest run`, `pnpm run typecheck`, `pnpm run test:e2e`
— plus any rendered-state inspection performed. Separate passed checks from **Not
verified**; never convert a verification gap into a finding.

### Suggested commands for fixes

Map Findings rows to the fixer skill that owns that domain, so the report ends in an
action, not just a list:

| Domain hit | Reach for |
| --- | --- |
| Accessibility / structure | `modern-accessible-html-jsx` fixes applied directly, or `harden` for edge cases |
| Layout / responsive | `adapt`, `normalize` |
| Writing / copy | `clarify` |
| Typography / visual consistency | `polish`, `normalize` |
| Motion / micro-interactions | `animate` |
| Icons | `better-icons`, `frontend-design/reference/surfaces-and-icons.md` |
| Visual intensity too flat / too loud | `bolder` / `quieter` |
| Missing color signal | `colorize` |
| Bloated or over-decorated | `distill` |
| Reusable pattern spotted | `extract` |
| First-run / empty-state experience | `onboard` |
| Functionally fine but joyless | `delight` |

### Verdict

Exactly one, at the very end:

- `Block` — one or more `HIGH` findings remain.
- `Needs changes` — only `MEDIUM`/`LOW` findings remain.
- `Approve` — no actionable findings, and claimed coverage was verified.

## Never

- Report an "Approve" with a pending actionable finding.
- Fix code during an audit unless implementation was explicitly requested — if it was,
  keep the consolidated Findings table as the change scope and re-run Verification
  afterward.
- Report a finding already covered by a native Reka UI/Nuxt UI behavior.
- Silently skip a domain — mark it `Not reviewed` with a reason instead.
- Invent a fixer command — only suggest skills confirmed installed in this repo.
