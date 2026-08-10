# Layouts

Page wrappers providing consistent UI structure.

## Available Layouts

| Layout            | Purpose                                                        |
| ----------------- | -------------------------------------------------------------- |
| `default.vue`     | Main dashboard: sidebar, command palette, theme + user menus   |
| `landing.vue`     | Marketing/landing chrome with top navigation menu              |
| `blank.vue`       | Bare `<slot />` with no chrome                                  |
| `broadsheet.vue`  | Editorial document layout for technical docs (see below)       |

## Default Layout Features

- **Sidebar navigation**: Collapsible menu groups
- **Command palette**: `Cmd+K` search across all collections
- **Theme switcher**: 7 themes (System/default, Lyra, Nord, Dracula, Catppuccin, Carnival, Broadsheet)
- **User menu**: Profile dropdown driven by Better Auth (`authClient.useSession()`)
- **Site map / component catalog**: Page hierarchy + UI component browser

### Mobile (<768px)

On mobile, UDashboardNavbar renders a built-in toggle that opens UDashboardSidebar as a slideover (Nuxt UI handles state and auto-close on navigation).

## Broadsheet Layout

Newspaper structure for technical documentation: mono eyebrow, balanced headline,
standfirst, status strip, sticky rail, hairline panels. Zero radius, no shadows.

Styles live in `app/assets/css/broadsheet.css`, scoped under `.bs-shell`, with tokens
aliased onto `--ui-*` so it inherits all seven themes and light/dark. Markdown gets
five MDC blocks (`broadsheet-panel`, `broadsheet-note`, `broadsheet-status`,
`broadsheet-steps`, `broadsheet-compare`).

Because it takes props, use `layout: false` and render `<nuxt-layout>` explicitly:

```vue
<script setup lang="ts">
definePageMeta({ layout: false })
</script>

<template>
  <nuxt-layout
    name="broadsheet"
    eyebrow="Working guide · evlog 2.24.0"
    title="What evlog gives you, and where to spend it"
    :links="links"
    :status="status"
  >
    <template #standfirst>
      <p class="bs-standfirst">The whole thesis, in two to four sentences.</p>
    </template>
    <section id="wide">…</section>
  </nuxt-layout>
</template>
```

Live reference: `/labs/broadsheet`. Full guide: `/guides/broadsheet-layout`.
Portable version (other projects, standalone HTML): the `technical-broadsheet` skill.

## Usage

Pages use the `default` layout unless they opt out:

```ts
definePageMeta({
  layout: 'landing',
})
```

## Learn More

- [Layouts Directory](https://nuxt.com/docs/guide/directory-structure/layouts)
