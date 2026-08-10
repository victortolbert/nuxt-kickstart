---
name: technical-broadsheet
description: Build technical documentation in the "technical broadsheet" style — editorial newspaper structure (mono eyebrow, balanced headline, standfirst, status strip, sticky rail, hairline panels) applied to engineering docs. Use when writing a working guide, architecture note, migration doc, review write-up, or runbook that should read like a well-set document rather than a wiki page. Also use when asked to match the look of an existing broadsheet-style doc.
---

A layout system for documents that explain a technical thing to a reader who has to
act on it. The register is a broadsheet newspaper: a masthead that states what this
is, a standfirst that gives you the whole idea before you commit, then lettered
sections with hairline rules and bordered panels.

It is deliberately **not** a card-and-shadow UI. Nothing floats, nothing rounds,
nothing glows.

## The one rule that carries the style

**Monospace for structure, sans for prose.**

Mono goes on everything that labels, numbers, or names: eyebrow, `h1`–`h3`, table
headers, panel labels, status strip, step counters, footer, code. Sans is reserved
for body paragraphs and list items — the text a person actually reads at length.

That inversion is most of the character. If you get only one thing right, get this.

## Structure

Build in this order. Each part earns its place; drop the ones you have no content for
rather than padding them.

1. **Eyebrow** — mono, uppercase, letter-spaced, accent-colored. Middle-dot separated
   facts that situate the doc: `Working guide · evlog 2.24.0 · Nuxt 4`. Never a
   sentence.
2. **Headline** — `clamp(30px, 5.2vw, 44px)`, mono, `text-wrap: balance`. Write a claim
   or a question, not a noun phrase. "What evlog gives you, and where to spend it"
   beats "evlog Overview".
3. **Standfirst** — 18.5px, dimmed ink, capped at 60ch. Two to four sentences that
   deliver the entire thesis, with the two or three load-bearing words in `<strong>`.
   A reader who stops here should still have learned the main point.
4. **Status strip** — a `<dl>` of 3–6 hard facts with on/off states. Version, wiring,
   what is not turned on yet. This is where a doc becomes *situated* rather than
   generic. Skip it if you have no real state to report.
5. **Rail** — sticky table of contents, 196px, appears at ≥1000px only.
6. **Sections** — lettered `A`, `B`, `C` in a dimmed `.num` span, `h2` with a bottom
   rule.
7. **Footer** — mono, dimmed, a few provenance facts. Say what the doc was verified
   against.

## Measure

The reading length is designed, not incidental. Do not let these drift:

| Element | Max width |
| --- | --- |
| Body paragraphs, lists | `68ch` |
| Standfirst | `60ch` |
| Callout body | `62ch` |
| Shell | `1180px` |

Paragraphs get `text-wrap: pretty`; headings get `text-wrap: balance`.

## Surfaces and color

Three surfaces, three inks, two rules, one accent:

- `--bs-ground` (page) → `--bs-panel` (raised box) → `--bs-sunk` (label strips, inline code)
- `--bs-ink` → `--bs-ink-dim` (standfirst, secondary) → `--bs-ink-faint` (paths, comments, counters)
- `--bs-rule` (structural) → `--bs-rule-soft` (row separators inside tables)
- `--bs-signal` — one accent, used for the eyebrow, links, step numbers, emphasis
  nodes, and syntax keywords. Nothing else competes with it.
- `--bs-good` / `--bs-warn` / `--bs-bad` — semantic only. Never decorative.

Full token values: `references/tokens.css`.

**Never** hardcode a color. Every value routes through a token so the doc inverts
cleanly in dark mode.

## Non-negotiables

- `border-radius: 0` everywhere.
- No `box-shadow`, no gradients, no blur.
- Separation is done by 1px hairlines and surface shifts, never by elevation.
- Bordered panels get a `.bs-panel-head` label strip — an uppercase mono label on the
  left, a dimmed file path or qualifier on the right.
- Callouts are **labeled boxes**, not left-stripe cards. The label sits in its own
  header strip.
- Step lists use `counter(s, decimal-leading-zero)` in a bordered square, accent-colored.
- Tables live inside an `overflow-x: auto` wrapper with the border on the wrapper.

## Components

Markup for every component — panel, before/after two-up, event tree, fan-out diagram,
status strip, labeled note, steps, table — is in `references/components.html`. Copy from
there rather than reinventing; the class names are the contract.

`assets/template.html` is a complete standalone document shell with tokens, dark mode,
and one of each component. For a one-off HTML doc, copy it and replace the content.

## Writing register

The layout only works if the prose matches it.

- Lead each section with the *idea*, then the evidence. State the inversion plainly
  ("A wide event inverts that") before showing code.
- Prefer a before/after two-up over prose describing a difference.
- Annotate examples with real values from the actual system, not `foo`/`bar`.
- Close a code example with the sentence that says what the reader now knows from it.
- The footer should be able to say what the doc was checked against. Make that true.

## In this repo (Nuxt Kickstart)

The style ships as a live layout, not just guidance:

- Layout: `app/layouts/broadsheet.vue` — masthead, rail, footer, `#standfirst`/`#status` slots.
- Styles: `app/assets/css/broadsheet.css` — tokens alias onto `--ui-*`, so the layout
  inherits all seven Kickstart themes and light/dark automatically.
- Theme: `app/assets/css/themes/broadsheet.css` — the original OKLCH palette as a
  selectable seventh theme (`data-theme="broadsheet"`) when you want the exact source look.
- MDC components for markdown: `broadsheet-panel`, `broadsheet-note`,
  `broadsheet-status`, `broadsheet-steps`, `broadsheet-compare`.
- Live reference of every component: `/labs/broadsheet`.

The event tree **must** be a `<pre>` element in an SFC — Vue's template compiler
condenses whitespace everywhere else and will collapse the tree onto one line.

Follow the repo's own rules while working here: kebab-case filenames, kebab-case
component tags in templates, no semicolons, single quotes, and `resolveIcon()` for any
icon rather than a hardcoded collection name.
