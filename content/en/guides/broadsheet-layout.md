---
title: Broadsheet Document Layout
description: An editorial layout for technical documentation — masthead, standfirst, sticky rail, and hairline panels
tags:
  - layout
  - documentation
  - theming
  - design
status: sprout
visibility: public
category: customization
difficulty: intermediate
order: 8
prerequisites:
  - customization
created: '2026-08-09'
---

Broadsheet applies newspaper structure to technical documentation. It ships as a
layout (`app/layouts/broadsheet.vue`), a scoped stylesheet, five MDC components for
markdown, and a selectable theme. See it running at
[/labs/broadsheet](/labs/broadsheet).

## The one rule

**Monospace for structure, sans for prose.** Mono goes on everything that labels,
numbers, or names — the eyebrow, headings, table headers, panel strips, step
counters, the footer. Sans is reserved for body paragraphs.

That inversion is most of the character. `--bs-mono` and `--bs-sans` deliberately do
*not* follow `--theme-font-sans`: that variable defaults to JetBrains Mono in this
project, so inheriting it would make body prose monospace and collapse the
distinction the layout depends on.

## Using the layout on a page

Passing props to a layout requires naming it explicitly, so set `layout: false` in
`definePageMeta` and render `<nuxt-layout>` yourself.

```vue
<script setup lang="ts">
definePageMeta({ layout: false })

const links = [
  { id: 'wide', label: 'The wide event' },
  { id: 'drain', label: 'Drains' },
]

const status = [
  { label: 'Package', value: '2.24.0', state: 'on' as const },
  { label: 'Drain', value: 'none yet', state: 'off' as const },
]
</script>

<template>
  <nuxt-layout
    name="broadsheet"
    eyebrow="Working guide · evlog 2.24.0 · Nuxt 4"
    title="What evlog gives you, and where to spend it"
    :links="links"
    :status="status"
    :footer="['evlog 2.24.0', 'Verified against the installed package']"
  >
    <template #standfirst>
      <p class="bs-standfirst">
        Two to four sentences carrying the <strong>entire thesis</strong>.
      </p>
    </template>

    <section id="wide">
      <h2><span class="num">A</span>The wide event</h2>
      <p>Lead with the idea, then the evidence.</p>
    </section>
  </nuxt-layout>
</template>
```

The rail highlights the section currently on screen via an `IntersectionObserver`, so
`links` only needs the heading ids you want listed.

### Layout props

| Prop | Type | Notes |
| --- | --- | --- |
| `eyebrow` | `string` | Dot-separated facts. Not a sentence |
| `title` | `string` | A claim or a question, not a noun phrase |
| `links` | `{ id, label, depth? }[]` | Sticky rail. Hidden below 1000px |
| `status` | `{ label, value, state? }[]` | `state` is `'on'` or `'off'` |
| `footer` | `string[]` | Provenance line |
| `railTitle` | `string` | Defaults to the translated "Contents" |

Slots: `eyebrow`, `title`, `standfirst`, `status`, `footer`, and the default slot.
The standfirst is a slot rather than a prop because it needs inline `<strong>` and
`<code>`.

## Using the components in markdown

Five MDC blocks are available in any content file.

::broadsheet-note{label="Scope"}
The stylesheet is scoped under `.bs-shell`. These components render unstyled outside
the broadsheet layout — they are markup, and the layout supplies the CSS.
::

```md
::broadsheet-panel{label="Emitted event" path="pretty mode · dev default"}
Anything — a code fence, a table, a diagram.
::

::broadsheet-note{label="The key habit" caution}
`caution` turns the label warn-colored.
::

::broadsheet-status
---
facts:
  - label: Package
    value: 2.24.0
    state: on
  - label: Drain
    value: none yet
    state: off
---
::

::broadsheet-steps
1. ### Register the module
   One line in `nuxt.config.ts`.
2. ### Add a drain
   Events print to the console until something catches them.
::
```

`broadsheet-compare` takes `now`/`next` slots for a before/after two-up — reach for it
instead of prose describing a difference.

## Theming

Tokens alias onto Nuxt UI's `--ui-*` variables, so the layout inherits all seven
themes plus light and dark automatically:

| Token | Aliases |
| --- | --- |
| `--bs-ground` / `--bs-panel` / `--bs-sunk` | `--ui-bg`, `--ui-bg-elevated`, `--ui-bg-muted` |
| `--bs-ink` / `--bs-ink-dim` / `--bs-ink-faint` | `--ui-text-highlighted`, `--ui-text-muted`, `--ui-text-dimmed` |
| `--bs-rule` / `--bs-rule-soft` | `--ui-border`, `--ui-border-muted` |
| `--bs-signal` | `--ui-primary` |
| `--bs-good` / `--bs-warn` / `--bs-bad` | `--ui-success`, `--ui-warning`, `--ui-error` |

For the exact palette of the original design — newsprint grays with a single teal
signal — select the **Broadsheet** theme. Its `--color-primary-*` ramp and neutral
scale are preserved verbatim in `app/assets/css/themes/broadsheet.css`.

## Measure

The reading length is designed, not incidental.

| Element | Max width |
| --- | --- |
| Body paragraphs, lists | `68ch` |
| Standfirst | `60ch` |
| Callout body | `62ch` |
| Shell | `1180px` |

## Non-negotiables

- `border-radius: 0` everywhere
- No `box-shadow`, no gradients, no blur
- Separation is hairlines and surface shifts, never elevation
- Callouts are labeled boxes, not left-stripe cards
- No hardcoded colors — every value routes through a token

## Outside this project

The style is also packaged as an agent skill at
`.claude/skills/technical-broadsheet/`, with a complete standalone HTML template. Ask
for a document "in the broadsheet style" and the skill supplies the structure,
tokens, and writing register.
