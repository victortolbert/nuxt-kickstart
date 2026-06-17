# Layouts

Page wrappers providing consistent UI structure.

## Available Layouts

| Layout         | Purpose                                                       |
| -------------- | ------------------------------------------------------------- |
| `default.vue`  | Main dashboard: sidebar, command palette, theme + user menus  |
| `landing.vue`  | Marketing/landing chrome with top navigation menu             |
| `blank.vue`    | Bare `<slot />` with no chrome                                 |

## Default Layout Features

- **Sidebar navigation**: Collapsible menu groups
- **Command palette**: `Cmd+K` search across all collections
- **Theme switcher**: 6 themes (System/default, Lyra, Nord, Dracula, Catppuccin, Carnival)
- **User menu**: Profile dropdown driven by Better Auth (`authClient.useSession()`)
- **Site map / component catalog**: Page hierarchy + UI component browser

### Mobile (<768px)

On mobile, UDashboardNavbar renders a built-in toggle that opens UDashboardSidebar as a slideover (Nuxt UI handles state and auto-close on navigation).

## Usage

Pages use the `default` layout unless they opt out:

```ts
definePageMeta({
  layout: 'landing',
})
```

## Learn More

- [Layouts Directory](https://nuxt.com/docs/guide/directory-structure/layouts)
