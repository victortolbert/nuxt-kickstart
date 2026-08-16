---
title: Settings & Preferences
description: Configure your Kickstart experience with appearance settings and component preview
tags:
  - settings
  - preferences
  - ui
status: evergreen
visibility: public
category: customization
difficulty: beginner
order: 5
prerequisites:
  - getting-started
created: '2026-01-23'
---

## Settings Page

Access application settings at `/settings` or via the command palette (:kbd-keys{value="meta_k"} → "Settings").

### Appearance Settings

#### Color Mode

Choose how Kickstart responds to system appearance:

| Option | Description |
|--------|-------------|
| **Light** | Always use light mode |
| **Dark** | Always use dark mode |
| **System** | Follow your OS preference |

#### Theme Selection

Select from four built-in themes:

| Theme | Icon | Style |
|-------|------|-------|
| **Lyra** | Palette | Default blue/slate (shadcn-inspired) |
| **Nord** | Snowflake | Arctic blues and cyans |
| **Dracula** | Ghost | Deep purples and pinks |
| **Catppuccin** | Coffee | Warm pastels (Mocha variant) |

Click any theme card to apply it immediately. The active theme shows a highlighted border.

### Preview Section

The settings page includes a live preview area showing:

- Button variants (Primary, Neutral, Outline, Ghost)
- Badge colors (Primary, Success, Warning, Error)
- Text colors (Default, Muted, Dimmed)

Use this to see how your selected theme affects common UI elements.

## Component Catalog

The component catalog is a slideover panel for browsing all available UI components.

### Opening the Catalog

1. Click the user menu (bottom of sidebar)
2. Select "Component Catalog"

Or use the keyboard: :kbd-keys{value="meta_k"} → "Component Catalog" (if added to commands).

### Features

#### Quick Theme Switch

At the top of the catalog, theme buttons let you quickly switch themes while browsing components.

#### Component Categories

Browse components organized by function:

| Category | Components |
|----------|------------|
| **Layout** | UContainer, UCard, USeparator, USkeleton |
| **Forms** | UButton, UInput, UTextarea, USelect, UCheckbox, URadio, USwitch |
| **Data Display** | UTable, UBadge, UAvatar, UIcon, UProgress |
| **Navigation** | UNavigationMenu, UTabs, UBreadcrumb, UPagination |
| **Overlay** | UModal, USlideover, UDropdownMenu, UTooltip, UPopover |
| **Custom** | TechBadge, WorldClock, TimelineEventCard |

Click category headers to expand/collapse component lists.

#### Live Preview

The bottom of the catalog shows a live preview with:

- Button styles
- Badge variants
- Form inputs
- Interactive elements

All previews update immediately when you switch themes.

## Quick Access Reference

| Action | Method |
|--------|--------|
| Open Settings | `/settings` or :kbd-keys{value="meta_k"} → "Settings" |
| Change Theme | User menu → Appearance → pick a theme |
| Toggle Color Mode | User menu → Appearance → Light/Dark/System |
| Open Component Catalog | User menu → "Component Catalog" |
| Open Site Map | User menu → "Site Map" or :kbd-keys{value="meta_k"} → "Open Site Map" |
| Search Everything | :kbd-keys{value="meta_k"} |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| :kbd-keys{value="meta_k"} | Open command palette |
| :kbd-keys{value="escape"} | Close modals/slideovers |

## Related Guides

- [Customization & Theming](/guides/customization) - Deep dive into CSS variables and custom themes
