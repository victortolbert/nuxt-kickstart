---
name: nuxt-og-image-skilld
description: "ALWAYS use when writing code importing \"nuxt-og-image\". Consult for debugging, best practices, or modifying nuxt-og-image, nuxt og image, og-image, og image."
metadata:
  version: 6.7.8
  generated_by: Anthropic · Haiku 4.5
  generated_at: 2026-08-17
---

# nuxt-modules/og-image `nuxt-og-image@6.7.8`
**Tags:** beta: 6.0.0, latest: 6.7.8

**References:** [package.json](./.skilld/pkg/package.json) • [README](./.skilld/pkg/README.md) • [Docs](./.skilld/docs/_INDEX.md) • [Issues](./.skilld/issues/_INDEX.md) • [Releases](./.skilld/releases/_INDEX.md)

## Search

Use `skilld search "query" -p nuxt-og-image` instead of grepping `.skilld/` directories. Run `skilld search --guide -p nuxt-og-image` for full syntax, filters, and operators.

<!-- skilld:api-changes -->
## API Changes

This section documents version-specific API changes for nuxt-og-image v6.7.8, prioritizing recent major/minor releases.

### Breaking Changes (v5 → v6)

- BREAKING: **Component file suffix required** — OG Image components must include renderer suffix in filename (`.takumi.vue`, `.satori.vue`, `.browser.vue`). Old pattern `components/OgImage/MyTemplate.vue` no longer works. Run `npx nuxt-og-image migrate v6` to rename automatically. [source](./.skilld/docs/content/6.migration-guide/v6.md#component-renderer-suffix-required)

- BREAKING: **Renderer dependencies no longer bundled** — Install `@takumi-rs/core`/`@takumi-rs/wasm` (Takumi), `satori`+`@resvg/resvg-js` (Satori), or `playwright-core` (Browser) explicitly. Running `nuxi dev` prompts for missing dependencies in interactive terminals. [source](./.skilld/docs/content/6.migration-guide/v6.md#install-renderer-dependencies)

- BREAKING: **`<OgImage>` and `<OgImageScreenshot>` components removed** — Use `defineOgImage()` and `defineOgImageScreenshot()` composables instead. Template example: replace `<OgImage :title="title" />` with `<script setup>` calling `defineOgImage('ComponentName', { title })`. [source](./.skilld/docs/content/6.migration-guide/v6.md#ogimageandog-image-screenshot-components-removed)

- BREAKING: **Object syntax with `url` replaced by `useSeoMeta`** — Old pattern `defineOgImage({ url: '/my-image.png', width: 1200 })` no longer works. Use `useSeoMeta({ ogImage: '/my-image.png', ogImageWidth: 1200, ... })` directly. [source](./.skilld/docs/content/6.migration-guide/v6.md#object-syntax-with-url-replaced-by-useseometa)

- BREAKING: **URL path format completely restructured** — v5 format `/__og-image__/image/?width=1200&title=...` changed to v6 Cloudinary-style `/_og/s/w_1200,title_...,p_<base64>.png`. Static paths: `/__og-image__/static/` → `/_og/s/`. Font paths removed (now served by `@nuxt/fonts`). Hardcoded URLs must use `defineOgImage()` return value. [source](./.skilld/docs/content/6.migration-guide/v6.md#new-cloudinary-style-url-encoding)

- BREAKING: **`ogImage.fonts` config removed** — Custom fonts now configured via `@nuxt/fonts` module with `global: true` setting. Remove `fonts` key from Nuxt config and install `@nuxt/fonts`. Inter (400, 700) bundled as fallback. [source](./.skilld/docs/content/6.migration-guide/v6.md#fonts-nuxtfonts-integration)

- BREAKING: **Cache key format changed** — Query parameters no longer included in cache keys. v5: `/page?foo=bar` and `/page?baz=qux` cached separately. v6: share same cache. URL path encodes all options; query param overrides only work in dev/prerender, not production. [source](./.skilld/docs/content/6.migration-guide/v6.md#cache-key-changes)

- BREAKING: **Nuxt Content v2 support removed** — Requires `@nuxt/content` v3+. Module no longer handles `ogImage` frontmatter in v2. Use `defineOgImage()` in page components instead. [source](./.skilld/docs/content/6.migration-guide/v6.md#nuxt-content-v2-support-removed)

- BREAKING: **Chromium renderer renamed to `browser`** — Update component filenames from `.chromium.vue` to `.browser.vue`. Update config option from `chromium: 'playwright'` to `browser: 'playwright'`. [source](./.skilld/docs/content/6.migration-guide/v6.md#chromium-renderer-renamed-to-browser)

- BREAKING: **`#nuxt-og-image-utils` alias removed** — Update imports to use `#og-image/shared` instead of legacy `#nuxt-og-image-utils`. [source](./.skilld/docs/content/6.migration-guide/v6.md#nuxt-og-image-utils-alias-removed)

- BREAKING: **Sharp JPEG errors now throw** — Previously logged error and silently fell back to PNG. v6 throws error if Sharp fails for JPEG rendering. Ensure Sharp is properly installed and runtime supports it. [source](./.skilld/docs/content/6.migration-guide/v6.md#sharp-jpeg-errors)

- BREAKING: **`useOgImageRuntimeConfig` import path changed** — Update imports from `#og-image/shared` to `#og-image/app/utils`. [source](./.skilld/docs/content/6.migration-guide/v6.md#useogimageeruntimeconfig-import-path)

- BREAKING: **`componentOptions` config option removed** — No longer needed since components are gone. Remove from Nuxt config entirely. [source](./.skilld/docs/content/6.migration-guide/v6.md#componentoptions-config-removed)

- BREAKING: **`browser: 'node'` compatibility option removed** — Use `browser: 'playwright'` instead. Old pattern for Node.js-based browser rendering no longer supported. [source](./.skilld/docs/content/6.migration-guide/v6.md#browser-node-binding-removed)

- BREAKING: **`strictNuxtContentPaths` config removed** — Deprecated option had no effect in Nuxt Content v3. Remove from config. [source](./.skilld/docs/content/6.migration-guide/v6.md#strictnuxtcontentpaths-removed)

### New APIs (v6+)

- NEW: **`defineOgImage()` composable** — Primary API for defining OG images with component name as first argument, props as second, options as third. Replaces deprecated `defineOgImageComponent()`. Returns array of generated image URLs. Example: `defineOgImage('NuxtSeo', { title: 'Hello' })`. [source](./.skilld/docs/content/4.api/0.define-og-image.md)

- NEW: **Multiple OG images per page** — Define variants with different dimensions/keys via third argument. Example: `defineOgImage('NuxtSeo', { title: 'Page' }, [{ key: 'og' }, { key: 'whatsapp', width: 800, height: 800 }])`. Shared props in second arg override per-variant via `props` key. [source](./.skilld/docs/content/4.api/0.define-og-image.md#multiple-og-images)

- NEW: **Takumi renderer as recommended default** — Rust-based renderer 2-10x faster than Satori. Feature-compatible with Satori (Tailwind, fonts, emoji, edge runtimes). Select via `.takumi.vue` suffix or `'MyTemplate.takumi'` dot notation. [source](./.skilld/docs/content/7.releases/2.v6.md#takumi-renderer-recommended)

- NEW: **First-class CSS support** — Build-time CSS processing with zero config: Tailwind v4 (with `@theme` values), UnoCSS, CSS variables, Nuxt UI v3 semantic colors (`primary`, `secondary`, etc. resolved from `app.config.ts`). All work directly in OG templates without extra setup. [source](./.skilld/docs/content/7.releases/2.v6.md#first-class-css-support)

- NEW: **`cacheVersion` config option** — Controls cache key namespacing. Default: module version (auto-invalidate on upgrade). Set `cacheVersion: 'v1'` for static version or `false` to disable versioning entirely. [source](./.skilld/docs/content/6.migration-guide/v6.md#cache-version-control)

- NEW: **Cloudflare Browser Rendering support** — Use Cloudflare Browser Rendering for runtime screenshots on Cloudflare Workers/Pages via `ogImage: { browser: { provider: 'cloudflare', binding: 'BROWSER' } }`. [source](./.skilld/docs/content/6.migration-guide/v6.md#cloudflare-browser-rendering-support)

- NEW: **`/_og/r/<path>` resolver endpoint** — Render another page's OG image on listings without reconstructing URL. Alternative to hardcoding OG URLs for embeds. [source](./.skilld/releases/v6.3.10.md)

- NEW: **Nuxt UI v3 color mode aware tokens** — v6.5.0 adds automatic resolution of semantic colors from Nuxt UI via `data-theme` attribute. Example: use `class="text-primary-500"` directly in OG templates when `@nuxt/ui` is installed. [source](./.skilld/docs/content/7.releases/2.v6.md#nuxt-ui-v3-color-support)

- NEW: **URL signing by default** — v6.7.0 signs OG image URLs by default for security. Disable via `NUXT_OG_IMAGE_SECRET=''` if needed (v6.7.5+ warns when signing disabled). [source](./.skilld/releases/v6.7.0.md)

- NEW: **Devtools as a layer** — v6.6.0 ships redesigned DevTools with better image preview, improved error reporting, Bluesky social card support, and more accessible interface. Loaded as a module layer. [source](./.skilld/releases/v6.6.0.md)

### Deprecated APIs

- DEPRECATED: **`defineOgImageComponent()` composable** — Use `defineOgImage()` instead. API identical - just remove "Component" from function name. Example: `defineOgImageComponent('NuxtSeo', {})` → `defineOgImage('NuxtSeo', {})`. Still works but marked for removal. [source](./.skilld/docs/content/6.migration-guide/v6.md#defineogimagecomponent-deprecated)

- DEPRECATED: **Inline HTML templates via `html` option** — Will be removed in next major version due to SSRF risk. Migrate to Vue components. Use `security.strict` to disable this option now. [source](./.skilld/docs/content/4.api/0.define-og-image.md#html)

- DEPRECATED: **`fonts` option on `defineOgImage()`** — Configure fonts via `@nuxt/fonts` module instead with `global: true` setting. [source](./.skilld/docs/content/4.api/0.define-og-image.md#fonts)

**Also changed:** Community templates must be ejected before production build via `npx nuxt-og-image eject <Name>` · Hash mode for long prerendered URLs (auto-switches when URL > 200 chars) · `defineOgImage()` now returns array of paths instead of string · Component renderer variants via dot notation (`'MyTemplate.takumi'`) or PascalCase (`'MyTemplateTakumi'`)
<!-- /skilld:api-changes -->

<!-- skilld:best-practices -->
## Best Practices

- Use Takumi (`.takumi.vue`) as your primary renderer — it's 2–10x faster than Satori with complete CSS support (gradients, shadows, transforms, CSS Grid). Only switch to Satori if you need a lighter dependency footprint or to Browser if prerendering with full CSS needs [source](./.skilld/docs/content/2.renderers/0.index.md#choosing-a-renderer)

- Enable build caching for prerendered sites to avoid regenerating unchanged images between deployments. The cache automatically invalidates when options change, templates are modified, or the module version changes [source](./.skilld/docs/content/3.guides/2.build-cache.md#setup)

- Pass minimal props to `defineOgImage()` — send only a slug or ID and fetch full data inside your OG image component via `$fetch()`. This keeps URLs short, reduces HTML bloat per page, and avoids exceeding the 200-character prerender hash threshold [source](./.skilld/docs/content/3.guides/16.performance.md#reduce-url-size)

- Set up persistent storage for runtime caching in production using Nitro's `cache` storage (recommended for all cached content) or `runtimeCacheStorage` (OG images only). The default in-memory cache is lost on server restart [source](./.skilld/docs/content/3.guides/3.runtime-cache.md#persistent-storage)

- Require URL signing in production with a stable secret to prevent DOS attacks and cache poisoning. Enable `strict` mode for all recommended security defaults in one flag, including signing, query size limits, and dimension clamping [source](./.skilld/docs/content/3.guides/18.security.md#strict-mode)

- Avoid wildcard route rules like `/**` with caching options (`swr`, `isr`, or `cache`) — Nitro cannot exclude OG image routes from global cache rules. Use specific patterns like `/blog/**` and `/products/**` instead [source](./.skilld/docs/content/3.guides/5.route-rules.md#wildcard-route-rules-warning)

- Enable zero runtime mode when all OG images are prerendered at build time — removes 81% of Nitro code from production, including all renderer and dependency code. Requires prerendering all pages that use OG images [source](./.skilld/docs/content/3.guides/1.zero-runtime.md)

- Include the renderer suffix in component filenames (`.takumi.vue`, `.satori.vue`, `.browser.vue`) to enable automatic renderer detection and tree-shaking. Unsuffixed components will not be recognized [source](./.skilld/docs/content/2.renderers/0.index.md#component-naming-convention)

- Use the props-based pattern for i18n — resolve translations at the page level with `useI18n()` and pass translated strings as props to your OG image component. Direct `useI18n()` calls inside OG image components (which render as Nuxt Islands) won't have locale context or lazy-loaded messages [source](./.skilld/docs/content/4.integrations/3.i18n.md#pattern-1-props-based-recommended)

- For performance-critical images with dynamic content, avoid dynamic image URLs (which trigger 100–500ms fetches) and keep font combinations static across components to reduce Satori's font binary re-parsing overhead. Use base64-encoded images when optimizing for speed [source](./.skilld/docs/content/3.guides/16.performance.md#optimize-components)

- Provide explicit `width` and `height` for all images instead of relying on auto-detection — dimension detection is slow and often incorrect. Use base64 images over URL fetches when performance is critical [source](./.skilld/docs/content/3.guides/10.icons-and-images.md#provide-width--height)

- Always set `mode="svg"` when using Nuxt Icon's `Icon` component or Nuxt UI's `UIcon` component in OG image templates — without SVG mode the icons will not render correctly [source](./.skilld/docs/content/3.guides/10.icons-and-images.md#nuxt-icon--nuxt-ui)

- Use dynamic `data-theme` bindings on the root element for theme-aware color resolution with Tailwind v4 — bind `:data-theme="colorMode"` to a prop to swap themes per image. The build process resolves both theme variants at compile time and emits paired classes [source](./.skilld/docs/content/3.guides/11.styling.md#dynamic-data-theme-per-image-color-mode)

- Configure custom fonts via `@nuxt/fonts` with `global: true` instead of the deprecated `ogImage.fonts` option — the module automatically detects and uses fonts from `@nuxt/fonts` at build time [source](./.skilld/docs/content/7.releases/2.v6.md#nuxtfonts-required-for-custom-fonts)
<!-- /skilld:best-practices -->
