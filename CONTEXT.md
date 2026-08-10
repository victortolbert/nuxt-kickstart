# CONTEXT.md — Domain Language

Terms with a precise meaning in this codebase. Use these names in code,
docs, and commits; sharpen them here when they drift.

## Content

- **Collection** — a Nuxt Content collection defined under `schemas/` and
  registered in `schemas/index.ts`. All collections share the base schema
  (`status`, `visibility`, `tags`, …).
- **Localized Collection** — a collection whose sources include every locale
  with locale-prefixed paths (`/en/guides/x`, `/es/guides/x`). Registry,
  fallback ordering (locale → English), dedupe, and URL resolution live in
  the Localized Collection module (`app/composables/use-localized-collection.ts`
  over `app/utils/localized-collection.ts`). Currently: `guides`.
- **Authoring Locale** — the locale whose files the content editor writes
  (`en`). Translations live alongside and fall back to it.
- **Content Store** — the server-side module owning editable-collection
  validation, source/trash paths, frontmatter serialization, and the trash
  manifest (`server/utils/content-store.ts`). The `/api/content/*` routes
  are thin HTTP adapters over it.
- **Trash** — soft-deleted content under `content/_trash/<collection>/`,
  indexed by the manifest (`content/_trash/.manifest.json`, keyed
  `collection/slug`).
- **Visibility** — `private` (default) → `internal` → `public`. Dev mode
  bypasses checks.
- **Status** — content lifecycle: `seed` → `sprout` → `evergreen` → `wilted`.

## Identity & access

- **Session Identity** — the derived auth state (`loggedIn`, `user`,
  `userRole`, `isAdmin`). Client components use `useSessionState()`
  (`app/composables/use-session-state.ts`); route middleware awaits
  `fetchSessionIdentity()` (`app/utils/session-identity.ts`). Nothing else
  re-derives these from the raw session.
- **Scoreboard Admin** — the demo-grade PIN gate for scoreboard admin
  endpoints (`server/utils/scoreboard-auth.ts`). One seam to replace with
  real role-based auth.

## Presentation

- **Appearance** — the user's presentation preferences (icon set, icon
  variant), persisted client-side and read via `useAppearance()`. Distinct
  from **Theme** (color scheme).
- **Semantic icon** — a meaning-named icon key (`close`, `warning`,
  `chartLine`) resolved to a concrete icon per the active Appearance by
  `resolveIcon()`. The registry mapping each semantic name to all five
  icon collections lives in `app/utils/icon-sets.ts`. App UI never names
  a collection-prefixed icon directly, with a short documented exempt list
  (brand logos, theme identity icons).
- **Theme** — a named color scheme (System, Lyra, Nord, Dracula,
  Catppuccin, Carnival, Broadsheet) applied CSS-Zen-Garden-style via
  `data-theme`; managed by `useTheme()`.
- **UiColor / UiVariant / UiSize** — the canonical types for the Nuxt UI
  semantic sets (`color`, `variant`, `size`), in `shared/types/appearance.ts`,
  each sourced from a `COMPONENT_*` tuple. Used for any badge/button/status/
  chart/tech prop app-wide; the `Component*` names (appearance defaults) are
  aliases. Never re-declare these literal unions locally. (A component whose
  prop is a genuine *subset* — e.g. UBadge has no `ghost`/`link` variant —
  may cast to the narrower literal at that one call site.)

## Infrastructure

- **Email Transport** — the single module that talks to Resend
  (`server/utils/email.ts`, `sendEmail`). Templates are rendered separately
  in `server/utils/email-templates.ts`; callers (auth flows, campaign
  routes) render then send. No other module creates a Resend client. A
  provider-agnostic transport (Resend + SMTP/Nodemailer for local capture) is
  specced in `docs/email-transport-plan.md` but not yet built — the term means
  Resend-only today.
- **Storage Adapter** — a backend (`local`, `s3`, `cloudinary`) satisfying
  the 3-method upload interface in `server/utils/storage/`. The reference
  deep seam in this codebase.
- **Token Generator** — a `(tokens, options) => { ext, content }` function
  for one design-token export format, in `server/utils/token-generators/`
  (one module per format family, shared helpers in `shared.ts`, registry +
  `transformTokens` in `index.ts`). Helium-unwrap, the combined-section
  builder, and DTCG value formatting are shared, not per-generator. The
  `/api/tokens/transform` route is a thin adapter over the registry.
- **Navigation group** — a YAML file in `content/navigation/` served by
  `/api/navigation`; `useNavigationConfig()` translates labels by slug
  convention and localizes paths. Each group declares its sidebar
  placement via an optional `section` field (`main` default, or `footer`
  for bottom-pinned groups like Admin); sidebar and command palette derive
  from the same filtered set, so a new YAML group appears in both with no
  code change. Section placement is data, not a hardcoded id list.
