---
name: nuxt-og-image-skilld
description: "ALWAYS use when writing code importing \"nuxt-og-image\". Consult for debugging, best practices, or modifying nuxt-og-image, nuxt og image, og-image, og image."
metadata:
  version: 6.6.0
  generated_by: Anthropic · Haiku 4.5
  generated_at: 2026-06-12
---

# nuxt-modules/og-image `nuxt-og-image@6.6.0`
**Tags:** beta: 6.0.0, latest: 6.6.0

**References:** [package.json](./.skilld/pkg/package.json) • [README](./.skilld/pkg/README.md) • [Docs](./.skilld/docs/_INDEX.md) • [Issues](./.skilld/issues/_INDEX.md) • [Releases](./.skilld/releases/_INDEX.md)

## Search

Use `skilld search "query" -p nuxt-og-image` instead of grepping `.skilld/` directories. Run `skilld search --guide -p nuxt-og-image` for full syntax, filters, and operators.

<!-- skilld:api-changes -->
## API Changes

This section documents version-specific API changes — prioritize recent major/minor releases.

- BREAKING: `defineOgImageComponent()` → `defineOgImage()` — v6 changed the composable name, old function still works but is deprecated. Migration CLI auto-renames [source](./.skilld/docs/content/6.migration-guide/v6.md:L224:235)

- BREAKING: Component filenames require renderer suffix — v6 changed from `components/OgImage/MyTemplate.vue` to `components/OgImage/MyTemplate.takumi.vue` (or `.satori.vue`, `.browser.vue`). Components without suffix no longer load [source](./.skilld/docs/content/6.migration-guide/v6.md:L71:112)

- BREAKING: `<OgImage>` and `<OgImageScreenshot>` components removed — v6 removed Vue components entirely, use `defineOgImage()` and `defineOgImageScreenshot()` composables instead. Template references silently fail [source](./.skilld/docs/content/6.migration-guide/v6.md:L175:199)

- BREAKING: `ogImage.fonts` config removed — v6 delegates font management to `@nuxt/fonts` module with `global: true`. Config-based fonts no longer load [source](./.skilld/docs/content/6.migration-guide/v6.md:L140:167)

- BREAKING: Renderer dependencies no longer bundled — v6 requires explicit installation: `@takumi-rs/core` (Node.js) or `@takumi-rs/wasm` (Edge) for Takumi, `satori` + `@resvg/resvg-js` for Satori, `playwright-core` for Browser renderer [source](./.skilld/docs/content/6.migration-guide/v6.md:L35:69)

- BREAKING: URL path format changed — v6 shortened OG image endpoints: `/__og-image__/image/` → `/_og/d/`, `/__og-image__/static/` → `/_og/s/`. Hardcoded URL paths break [source](./.skilld/docs/content/6.migration-guide/v6.md:L322:355)

- BREAKING: `chromium` renderer renamed to `browser` — v6 renamed for clarity. Component files must use `.browser.vue` suffix and config references must update [source](./.skilld/docs/content/6.migration-guide/v6.md:L414:436)

- BREAKING: `#nuxt-og-image-utils` import alias removed — v6 removed legacy alias, import from `#og-image/shared` instead. Old imports fail [source](./.skilld/docs/content/6.migration-guide/v6.md:L476:483)

- BREAKING: `useOgImageRuntimeConfig` import path changed — v6 moved import from `#og-image/shared` to `#og-image/app/utils`. Old import path returns deprecated stub [source](./.skilld/docs/content/6.migration-guide/v6.md:L485:492)

- BREAKING: Nuxt Content v2 support removed — v6 requires Content v3+. Automatic frontmatter handling for v2 no longer works [source](./.skilld/docs/content/6.migration-guide/v6.md:L385:396)

- BREAKING: Cache key format changed — v6 excluded query parameters from cache keys and changed key structure for CDN compatibility. URL query params no longer affect cached images [source](./.skilld/docs/content/6.migration-guide/v6.md:L301:320)

- BREAKING: Object `url` syntax replaced by `useSeoMeta()` — v6 removed `defineOgImage({ url: '/image.png' })` pattern, use `useSeoMeta({ ogImage: '/image.png' })` instead [source](./.skilld/docs/content/6.migration-guide/v6.md:L213:222)

- BREAKING: `ogImage.componentOptions` config removed — v6 removed config option since components no longer exist [source](./.skilld/docs/content/6.migration-guide/v6.md:L205:211)

- BREAKING: `strictNuxtContentPaths` config removed — v6 removed deprecated option [source](./.skilld/docs/content/6.migration-guide/v6.md:L402:412)

- BREAKING: Browser `node` binding removed — v6 removed `browser: 'node'` option, use `'playwright'` instead [source](./.skilld/docs/content/6.migration-guide/v6.md:L438:453)

- BREAKING: UnoCSS runtime removed — v6 removed runtime transformer, UnoCSS now resolved at build time only [source](./.skilld/releases/v6.0.2.md)

- NEW: `defineOgImageSchema()` composable — v6.2.0 added new composable for defining OG image schemas with type safety [source](./.skilld/releases/v6.2.0.md:L11)

- DEPRECATED: `html` parameter — v6.3.0 deprecated `defineOgImage({ html: '...' })` due to SSRF risk, will be removed in next major version. Use Vue components instead [source](./.skilld/docs/content/4.api/0.define-og-image.md:L84:91)

- NEW: URL signing to prevent parameter tampering — v6.3.0 added security feature to sign URLs and prevent modification attacks [source](./.skilld/releases/v6.3.0.md:L11)

- NEW: Multiple OG images per page — v6 added support for different dimensions per platform via `defineOgImage(component, props, [{ key: 'og' }, { key: 'whatsapp', width: 800 }])` [source](./.skilld/docs/content/7.releases/2.v6.md:L50:59)

**Also changed:** First-class CSS support (Tailwind v4, UnoCSS, CSS variables, Nuxt UI v3 colors) in v6 · Takumi as recommended renderer in v6 · Redesigned DevTools with Bluesky support in v6 · CLI commands `create` and `switch` in v6.1.0 · Production preview toggle in devtools (v6.1.0) · Component creation from empty state in devtools (v6.1.0) · Cloudflare Browser Rendering support in v6 · Community templates must be ejected in v6
<!-- /skilld:api-changes -->

<!-- skilld:best-practices -->
## Best Practices

- Use Takumi as your default renderer — it's 2-10x faster than Satori with complete CSS support including gradients, shadows, CSS Grid, and 2D/3D transforms, making it the recommended choice for most use cases [source](./.skilld/docs/content/2.renderers/1.takumi.md#pros)

- Name OG Image components with the `.takumi.vue` suffix to enable automatic renderer detection and tree-shaking of unused code — no manual renderer configuration needed [source](./.skilld/docs/content/0.getting-started/5.getting-familiar-with-nuxt-og-image.md#part-3-creating-your-own-template:L113)

- Use the multiple OG image variants pattern with shared props to avoid duplication — pass shared props as the second argument and an array of size/key variants as the third [source](./.skilld/docs/content/4.api/0.define-og-image.md#shared-props-with-variants-recommended)

- Keep runtime OG image URLs short by passing only essential props (slug, ID) and fetching full data inside the component — encodes all props in the path, so long URLs add HTML bloat and hurt caching efficiency [source](./.skilld/docs/content/3.guides/11.performance.md#reduce-url-size)

- Prerender OG images for high-traffic pages using route rules — build-time rendering has zero runtime cost and automatically generates short hash-based URLs that persist across deployments [source](./.skilld/docs/content/3.guides/11.performance.md#prerender)

- Enable persistent cache storage for production (Redis, KV, or NuxtHub) — the default in-memory cache is lost on server restart, causing unnecessary regeneration; configure via `runtimeCacheStorage` option [source](./.skilld/docs/content/3.guides/3.runtime-cache.md#persistent-storage)

- Enable `buildCache` in CI environments to persist prerendered images across deployments — automatically invalidates when options, templates, or module versions change, reducing build times and avoiding unnecessary regeneration [source](./.skilld/docs/content/3.guides/3.build-cache.md)

- Use the `/_og/r/` resolver endpoint in listing pages and galleries instead of reconstructing image URLs — it fetches the target page's og:image meta tag and redirects to the current URL, surviving template edits without hardcoded URL breakage [source](./.skilld/docs/content/3.guides/4.resolve-og-images.md#introduction)

- Configure `@nuxt/fonts` with `global: true` for any custom font used in OG images — manual font loading, CSS @font-face, or CDN links do not work because font resolution happens in the server-side rendering context without DOM access [source](./.skilld/docs/content/3.guides/5.custom-fonts.md#setup)

- Use `:style` bindings for dynamic values (colors, sizes) and keep Tailwind class names static — the module processes CSS classes at build time and cannot resolve dynamic class names like `` `border-${color}` `` [source](./.skilld/docs/content/0.getting-started/5.getting-familiar-with-nuxt-og-image.md#part-3-creating-your-own-template:L157)

- Enable strict security mode (`security.strict: true`) in production to enforce URL signing, disable deprecated inline HTML, and restrict runtime generation to your origin — requires setting `NUXT_OG_IMAGE_SECRET` via environment variable or config [source](./.skilld/docs/content/3.guides/13.security.md#strict-mode)

- Use the `.key` option to generate multiple images per page with different dimensions — set `key: 'og'` (default, generates both og:image and twitter:image), `key: 'twitter'` (twitter:image only), or custom strings for additional variants [source](./.skilld/docs/content/4.api/0.define-og-image.md#key)

- Set `data-theme` on the root element when using Tailwind v4 to enable per-image theme switching — bind `:data-theme="colorMode"` to swap between light/dark semantic tokens like `bg-inverted` and `text-muted` [source](./.skilld/docs/content/3.guides/7.styling.md#dynamic-data-theme-per-image-color-mode)

- Avoid wildcard route rules with caching directives on `/**` as they break OG image routes due to a Nitro limitation — use specific route patterns like `/blog/**` or `/products/**` instead [source](./.skilld/docs/content/3.guides/2.route-rules.md#wildcard-route-rules-warning)
<!-- /skilld:best-practices -->
