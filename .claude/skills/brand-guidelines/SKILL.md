---
name: brand-guidelines
description: Official brand colors and typography for the Kickstart design system. Use when brand colors, style guidelines, visual formatting, or design standards apply.
---

## Overview

Kickstart uses a CSS Zen Garden-style theming system with OKLCH color space for perceptually uniform colors across seven built-in themes (System default, Lyra, Nord, Dracula, Catppuccin, Carnival, Broadsheet).

**Keywords**: branding, visual identity, styling, brand colors, typography, visual formatting, visual design, theming, OKLCH

## Core Design Principles

- **Color Space**: OKLCH (perceptually uniform)
- **Typography**: JetBrains Mono Variable (monospace throughout)
- **Border Radius**: 0 (sharp, angular corners)
- **Light/Dark Mode**: All themes support both modes

## Typography

**Font Family**: JetBrains Mono Variable

```css
font-family: 'JetBrains Mono Variable', monospace;
```

All text uses JetBrains Mono - headings, body text, code, and UI elements. This creates a unified, technical aesthetic.

## Themes

### Lyra (Default)
- **ID**: `default`
- **Primary Hue**: ~264 (blue)
- **Description**: Default shadcn-inspired blue/slate theme

**Light Mode Colors**:
- Background: `oklch(1 0 0)` (pure white)
- Text: `oklch(0.13 0.028 261.692)` (deep slate)
- Primary-500: `oklch(0.623 0.214 259.815)` (vibrant blue)

**Dark Mode Colors**:
- Background: `oklch(0.13 0.028 261.692)` (deep slate)
- Text: `oklch(0.985 0.002 247.839)` (near white)
- Primary-500: `oklch(0.546 0.245 262.881)` (bright blue)

### Nord
- **ID**: `nord`
- **Primary Hue**: ~205 (cyan)
- **Description**: Arctic, north-bluish palette
- **Source**: [nordtheme.com](https://www.nordtheme.com/)

**Key Colors**:
- Polar Night (backgrounds): `oklch(0.23 0.02 240)` to `oklch(0.36 0.026 240)`
- Snow Storm (text/light bg): `oklch(0.88 0.01 240)` to `oklch(0.96 0.006 240)`
- Frost (primary): `oklch(0.65 0.11 205)`
- Aurora (charts): Green, Yellow, Orange, Red, Purple

### Dracula
- **ID**: `dracula`
- **Primary Hue**: ~320 (pink)
- **Description**: Dark purple/pink palette
- **Source**: [draculatheme.com](https://draculatheme.com/)

**Key Colors**:
- Background: `oklch(0.22 0.035 270)` (purple-tinged dark)
- Text: `oklch(0.95 0.01 275)` (soft white)
- Primary-500: `oklch(0.68 0.20 320)` (bright pink)
- Charts: Cyan, Green, Yellow, Orange, Pink

### Catppuccin
- **ID**: `catppuccin`
- **Primary Hue**: ~295 (mauve)
- **Description**: Warm pastel colors
- **Source**: [catppuccin.com](https://catppuccin.com/)

**Key Colors** (Mocha variant for dark):
- Background: `oklch(0.24 0.03 250)` (warm dark)
- Text: `oklch(0.92 0.015 250)` (warm white)
- Primary-500: `oklch(0.68 0.18 295)` (mauve)
- Charts: Teal, Green, Yellow, Peach, Flamingo

## CSS Variables

### Semantic Color Variables

Use these variables for consistent theming:

```css
/* Backgrounds */
--ui-bg           /* Main background */
--ui-bg-elevated  /* Cards, dialogs */
--ui-bg-muted     /* Subtle backgrounds */
--ui-bg-accented  /* Highlighted areas */
--ui-bg-inverted  /* Inverted (dark on light) */

/* Text */
--ui-text             /* Primary text */
--ui-text-muted       /* Secondary text */
--ui-text-dimmed      /* Tertiary text */
--ui-text-highlighted /* Emphasized text */
--ui-text-inverted    /* Inverted text */

/* Borders */
--ui-border          /* Default borders */
--ui-border-muted    /* Subtle borders */
--ui-border-accented /* Emphasized borders */
--ui-border-inverted /* Inverted borders */

/* Primary color scale */
--color-primary-50 through --color-primary-950

/* Chart/visualization colors */
--color-chart-1 through --color-chart-5
```

### Core Settings

```css
--ui-radius: 0;  /* Sharp corners throughout */
```

## Usage Guidelines

### When Creating Artifacts

1. **Always use sharp corners** - No rounded borders (`border-radius: 0`)
2. **Use JetBrains Mono** for all text
3. **Prefer semantic variables** (`--ui-bg`, `--ui-text`) over hardcoded colors
4. **Support dark mode** - Test in both light and dark modes
5. **Use OKLCH** when defining custom colors for consistency

### Color Application

```css
/* Good - uses semantic variables */
background-color: var(--ui-bg-elevated);
color: var(--ui-text);
border-color: var(--ui-border);

/* Good - uses primary scale */
background-color: var(--color-primary-500);
color: var(--color-primary-50);

/* Avoid - hardcoded hex values */
background-color: #3b82f6;
```

### Chart/Data Visualization

Use the chart color palette for graphs, charts, and data visualization:

```css
--color-chart-1  /* Primary data series */
--color-chart-2  /* Secondary data series */
--color-chart-3  /* Tertiary data series */
--color-chart-4  /* Quaternary data series */
--color-chart-5  /* Quinary data series */
```

## Theme Switching

Themes are applied via `data-theme` attribute on `<html>`:

```html
<html data-theme="default">    <!-- Lyra -->
<html data-theme="nord">       <!-- Nord -->
<html data-theme="dracula">    <!-- Dracula -->
<html data-theme="catppuccin"> <!-- Catppuccin -->
```

Dark mode is controlled by the `.dark` class:

```html
<html class="dark" data-theme="nord">  <!-- Nord dark mode -->
```

## Reference Files

- Theme CSS: `app/assets/css/themes/`
- Main styles: `app/assets/css/main.css`
- Theme types: `shared/types/theme.ts`
- Theme composable: `app/composables/use-theme.ts`
