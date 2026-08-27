# Surfaces & Icons

Precise, non-negotiable values for the details that make nested surfaces and icons feel
deliberate instead of assembled. Where `spatial-design.md` and `motion-design.md` give
principles, this file gives the exact numbers.

## Concentric Border Radius

Nested rounded elements: `outerRadius = innerRadius + padding`.

```tsx
// Good — 16px outer = 8px inner + 8px padding
<div class="rounded-2xl p-2">
  <div class="rounded-lg">...</div>
</div>

// Bad — same radius on both, reads as a mistake
<div class="rounded-xl p-2">
  <div class="rounded-xl">...</div>
</div>
```

If the padding between layers exceeds `24px`, treat them as separate surfaces and pick
each radius independently instead of forcing the math.

## Optical Alignment

Geometric centering often looks wrong; adjust by eye, then encode the fix.

- **Text + icon buttons**: icon-side padding = text-side padding − `2px`.
  `ps-4 pe-3.5` for a trailing icon, not equal `px-4`.
- **Play triangles**: shift right, e.g. `translate-x-[2px]` on the glyph — a triangle's
  geometric center isn't its visual center.
- **Asymmetric icons** (stars, arrows, carets): fix the SVG path/viewBox directly when
  possible; a `translate-x-px` wrapper is the fallback.

## Shadow as Border (Elevation Without a Border)

For buttons, cards, and containers whose border exists only to signal depth — not
dividers or layout separators, which stay real borders.

```css
/* Light mode: layered ring + lift + ambient depth */
--shadow-border: 0px 0px 0px 1px oklch(0 0 0 / 0.06), 0px 1px 2px -1px oklch(0 0 0 / 0.06),
  0px 2px 4px 0px oklch(0 0 0 / 0.04);
--shadow-border-hover: 0px 0px 0px 1px oklch(0 0 0 / 0.08), 0px 1px 2px -1px oklch(0 0 0 / 0.08),
  0px 2px 4px 0px oklch(0 0 0 / 0.06);

/* Dark mode: a single ring, layered depth isn't visible on dark surfaces */
--shadow-border: 0 0 0 1px oklch(1 0 0 / 0.08);
--shadow-border-hover: 0 0 0 1px oklch(1 0 0 / 0.13);
```

Route through `--ui-*` tokens rather than hardcoding — alias these onto the theme
instead of inlining raw `oklch()` in components.

## Image Outlines

`1px` outline, low opacity, **never tinted**:

```tsx
<img class="outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10" />
```

Pure black in light mode, pure white in dark mode — never `outline-slate-*`,
`outline-zinc-*`, or any tinted neutral; a tinted outline picks up the surface color
underneath and reads as dirt on the image edge. `outline`, not `border`: it never
affects layout, and the negative offset hugs the image's own corner radius.

## Contextual Icon Animations (state swaps, not static icons)

Use exactly these values — no deviation:

- `scale`: `0.25` → `1` (never `0.5`/`0.6`)
- `opacity`: `0` → `1`
- `filter`: `blur(4px)` → `blur(0px)`
- Spring: `{ type: "spring", duration: 0.3, bounce: 0 }` — bounce is always `0`

If `motion`/`framer-motion` is in `package.json`, use `AnimatePresence` with those
values. Otherwise keep both icon states in the DOM (one absolutely positioned over the
other) and cross-fade with `transition-[opacity,filter,scale] duration-300
ease-[cubic-bezier(0.2,0,0,1)]` — this gets a real exit animation without adding a
dependency. Only animate icons that change contextually (hover-revealed actions, state
toggles like play/pause or like/liked); leave static navigation and decorative icons
alone.

## Scale on Press

Always `scale(0.96)`; never below `0.95` — it starts to feel exaggerated.

```tsx
<button class="transition-transform duration-150 ease-out active:scale-[0.96]">
```

Extract a `static` prop on the shared button component to disable it where the motion
would be distracting, rather than special-casing classes per call site.

## Icon Stroke Weight vs. Text Weight

| Adjacent text | Stroke width (24px grid) |
| --- | --- |
| Regular (400), 14–16px | `1.5px` |
| Medium/Semibold (500–600) | `2px` |
| Bold (700) or emphasized standalone | `2.5px` |

One optical strategy per surface — don't mix icon libraries with incompatible stroke
conventions on one toolbar. Size relative to the text's cap height, typically
`1em`–`1.25em` inline.

## One SVG, Recolored per State

Never ship separate assets per state. `currentColor` + CSS drives color:

```html
<button class="text-zinc-500 hover:text-zinc-900 aria-pressed:text-blue-600 disabled:opacity-40">
  <BookmarkIcon />
</button>
```

Outline is the default variant; fill marks the active/selected state only (the active
tab, a toggled bookmark) — never filled everywhere, or the active state loses its
signal.

## Icons in RTL

Flip only icons whose meaning is tied to reading direction:

| Flip | Don't flip |
| --- | --- |
| Back/forward arrows, nav chevrons | Logos, brand marks |
| Alignment/list/indent glyphs | Checkmarks |
| Volume waves | Physical objects (clocks, cups) |
| "Send" style directional glyphs | Media playback (play/rewind convention stays LTR) |

```html
<ChevronRightIcon class="rtl:-scale-x-100" />
```

## Hit Area (WCAG 2.5.8 baseline)

`24×24` CSS px is the Level AA floor (or an equivalent-control/spacing/inline/essential
exception). Aim higher when density allows: `44×44` touch, `40×40` desktop. Extend with
a pseudo-element (`::before { content: ''; position: absolute; inset: -Npx }`) to keep
the visible element smaller than its hit area — never let two extended hit areas
overlap.
