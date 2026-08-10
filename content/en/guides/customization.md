---
title: Customization & Theming
description: Configure themes, color modes, and visual appearance of your site
tags:
  - theming
  - customization
  - css
  - design
status: evergreen
visibility: public
category: customization
difficulty: beginner
order: 4
prerequisites:
  - getting-started
created: '2026-01-23'
---

## Theme System

Kickstart uses a [CSS Zen Garden-style](https://daveshea.com/projects/zen/){target="_blank"} theming system where themes are purely CSS-based with no component changes required. Seven built-in themes are available — click a name below to apply it live:

::theme-showcase
::

### Switching Themes

Three ways to change themes:

1. **User menu** - Click the user menu → Appearance → pick a theme
2. **Command palette** - Press :kbd-keys{value="meta_k"} → Type "theme" → Select theme
3. **Settings page** - Visit [`/settings`](/settings) for visual theme picker

### Theme Persistence

- Themes persist in `localStorage['kickstart-theme']`
- Applied via `document.documentElement.dataset.theme`
- Works alongside color mode (light/dark/system)

## Color Modes

Kickstart supports three color modes via `@nuxtjs/color-mode`:

| Mode | Behavior |
|------|----------|
| **Light** | Force light appearance |
| **Dark** | Force dark appearance |
| **System** | Follow OS preference |

Access via header dropdown → Appearance, or the Settings page.

## Using the Theme Composable

```vue
<script setup lang="ts">
const { theme, themes, setTheme, cycleTheme, colorMode } = useTheme()
</script>

<template>
  <!-- Current theme ID -->
  <p>Current: {{ theme }}</p>

  <!-- Theme selector -->
  <button
    v-for="t in themes"
    :key="t.id"
    @click="setTheme(t.id)"
  >
    {{ t.label }}
  </button>

  <!-- Cycle through themes -->
  <button @click="cycleTheme()">Next Theme</button>
</template>
```

### Composable API

| Property | Type | Description |
|----------|------|-------------|
| `theme` | `Ref<ThemeId>` | Current theme ID |
| `themes` | `ThemeConfig[]` | All available themes |
| `currentTheme` | `ComputedRef<ThemeConfig>` | Current theme config |
| `setTheme(id)` | `(ThemeId) => void` | Set theme by ID |
| `cycleTheme()` | `() => void` | Rotate to next theme |
| `colorMode` | `ColorMode` | Access to color mode |

## CSS Variables

Each theme defines these CSS custom properties:

### Backgrounds

```css
--ui-bg           /* Main background */
--ui-bg-elevated  /* Cards, elevated surfaces */
--ui-bg-muted     /* Subtle backgrounds */
--ui-bg-accented  /* Highlighted areas */
--ui-bg-inverted  /* Inverted (dark on light, light on dark) */
```

### Text Colors

```css
--ui-text             /* Default text */
--ui-text-muted       /* Secondary text */
--ui-text-dimmed      /* Tertiary/disabled text */
--ui-text-highlighted /* Emphasized text */
--ui-text-inverted    /* Text on inverted backgrounds */
```

### Borders

```css
--ui-border          /* Default borders */
--ui-border-muted    /* Subtle borders */
--ui-border-accented /* Emphasized borders */
--ui-border-inverted /* Borders on inverted surfaces */
```

### Primary Color Scale

```css
--color-primary-50   /* Lightest */
--color-primary-100
--color-primary-200
--color-primary-300
--color-primary-400
--color-primary-500  /* Base */
--color-primary-600
--color-primary-700
--color-primary-800
--color-primary-900
--color-primary-950  /* Darkest */
```

### Chart Colors

```css
--color-chart-1  /* Data visualization color 1 */
--color-chart-2
--color-chart-3
--color-chart-4
--color-chart-5
```

## Creating Custom Themes

Create a new CSS file in `app/assets/css/themes/`:

```css
/* app/assets/css/themes/my-theme.css */

:root[data-theme="my-theme"] {
  --ui-bg: oklch(0.98 0.01 200);
  --ui-text: oklch(0.2 0.02 200);
  /* ... other light mode variables */

  --color-primary-500: oklch(0.6 0.2 200);
  /* ... other primary scale values */
}

.dark[data-theme="my-theme"] {
  --ui-bg: oklch(0.15 0.02 200);
  --ui-text: oklch(0.95 0.01 200);
  /* ... other dark mode variables */
}
```

Then register it:

1. Import in `app/assets/css/themes/index.css`:

```css
@import "./my-theme.css";
```

2. Add to `app/composables/use-theme.ts`:

```ts
export const themes: ThemeConfig[] = [
  // ... existing themes
  {
    id: 'my-theme',
    label: 'My Theme',
    icon: 'i-tabler-star',
    description: 'My custom theme',
  },
]
```

3. Update `shared/types/theme.ts`:

```ts
export type ThemeId = 'system' | 'lyra' | 'nord' | 'dracula' | 'catppuccin' | 'carnival' | 'broadsheet' | 'my-theme'
```

## Component Catalog

Access the component catalog to preview UI components with the active theme:

1. Open user menu (bottom of sidebar)
2. Click "Component Catalog"
3. Browse components by category
4. Use quick theme switch at the top

Categories include:
- **Layout** - Container, Card, Divider, Skeleton
- **Forms** - Button, Input, Textarea, Select, Checkbox, Radio, Switch
- **Data Display** - Table, Badge, Avatar, Icon, Progress
- **Navigation** - NavigationMenu, Tabs, Breadcrumb, Pagination
- **Overlay** - Modal, Slideover, DropdownMenu, Tooltip, Popover
- **Custom** - TechBadge, WorldClock, TimelineEventCard

## Design Tokens

### Font

JetBrains Mono Variable is used throughout:

```css
--font-sans: 'JetBrains Mono Variable', monospace;
```

### Border Radius

Sharp corners by default:

```css
--ui-radius: 0;
```

To enable rounded corners, modify `app/assets/css/main.css`:

```css
:root {
  --ui-radius: 0.375rem; /* or your preferred value */
}
```

## File Locations

| File | Purpose |
|------|---------|
| `app/assets/css/main.css` | Base styles, imports themes |
| `app/assets/css/themes/` | Theme CSS files |
| `app/composables/use-theme.ts` | Theme composable |
| `shared/types/theme.ts` | Type definitions |
| `app/pages/settings.vue` | Settings page UI |
| `app/components/component-catalog.vue` | Component browser |
| `app.config.ts` | Nuxt UI color configuration |
