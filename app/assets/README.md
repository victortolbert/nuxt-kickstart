# Assets

CSS and static assets processed by the bundler.

## Structure

```
assets/css/
├── main.css              # Base styles, Tailwind, typography
├── print.css             # Print-specific styles
├── broadsheet.css        # Broadsheet document layout (scoped to .bs-shell)
├── debug.css             # Layout debugging helpers
├── debug-grid.css        # Grid overlay for debugging
├── fonts/                # @font-face declarations
└── themes/
    ├── index.css         # Aggregates all theme files
    ├── lyra.css          # Lyra
    ├── nord.css          # Nord
    ├── dracula.css       # Dracula
    ├── catppuccin.css    # Catppuccin
    ├── carnival.css      # Carnival
    └── broadsheet.css    # Broadsheet
```

## Theme System

CSS Zen Garden-style theming using CSS variables. 7 user-facing themes (System/default, Lyra, Nord, Dracula, Catppuccin, Carnival, Broadsheet) — see `themes/` for the authoritative list and `shared/types/theme.ts` for the typed IDs.

- **Light mode**: `:root[data-theme="<id>"]`
- **Dark mode**: `.dark[data-theme="<id>"]`

### Color Scheme Property

Native form elements and scrollbars adapt to color mode:

```css
:root { color-scheme: light dark; }
.dark { color-scheme: dark; }
```

### Key Variables

| Variable            | Purpose                              |
| ------------------- | ------------------------------------ |
| `--ui-bg`           | Background colors                    |
| `--ui-text-*`       | Text colors (default, muted, dimmed) |
| `--ui-border-*`     | Border colors                        |
| `--color-primary-*` | Primary color scale (50-950)         |
| `--color-chart-*`   | Chart visualization colors           |

## Design Tokens

- **Color space**: OKLCH (perceptually uniform)
- **Font**: JetBrains Mono Variable
- **Border radius**: 0 (sharp corners)
- **No hardcoded colors** — always reference CSS variables

## Learn More

- [Assets Directory](https://nuxt.com/docs/guide/directory-structure/assets)
