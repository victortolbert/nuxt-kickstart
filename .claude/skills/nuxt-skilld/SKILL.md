---
name: nuxt-skilld
description: "ALWAYS use when writing code importing \"nuxt\". Consult for debugging, best practices, or modifying nuxt."
metadata:
  version: 4.5.2
  generated_by: Anthropic · Haiku 4.5
  generated_at: 2026-08-17
---

# nuxt/nuxt `nuxt@4.5.2`
**Tags:** 1x: 1.4.5, 2x: 2.18.1, alpha: 4.0.0-alpha.4

**References:** [package.json](./.skilld/pkg/package.json) • [README](./.skilld/pkg/README.md) • [Docs](./.skilld/docs/_INDEX.md) • [Issues](./.skilld/issues/_INDEX.md) • [Discussions](./.skilld/discussions/_INDEX.md) • [Releases](./.skilld/releases/_INDEX.md)

## Search

Use `skilld search "query" -p nuxt` instead of grepping `.skilld/` directories. Run `skilld search --guide -p nuxt` for full syntax, filters, and operators.

<!-- skilld:api-changes -->
## API Changes (Nuxt v4.5.2)

This section documents version-specific API changes that affect code correctness — prioritizing recent major/minor releases where LLMs trained on older data will write wrong code.

## API Changes

**NEW:** `useLayout()` — returns current resolved layout as read-only computed ref, reactive to route/rules changes [source](./.skilld/releases/v4.5.0.md:L112-L129)

**NEW:** Named views via filename convention `child@sidebar.vue` — parent page with multiple `<NuxtPage>` outlets can render sibling files to each outlet using `<NuxtPage name="sidebar" />` [source](./.skilld/releases/v4.5.0.md:L131-L161)

**NEW:** `enabled` option for `useFetch()` and `useAsyncData()` — gate fetching with reactive boolean/getter, cancels in-flight requests when toggled false without clearing existing data [source](./.skilld/releases/v4.5.0.md:L163-L181)

**NEW:** Prefetch props on `NuxtLink` custom slot — exposes `prefetch()`, `prefetched`, `shouldPrefetch()` for custom link markup, replacing automatic prefetch behavior [source](./.skilld/releases/v4.5.0.md:L183-L209)

**NEW:** `import.meta.envName` — runtime access to resolved Nuxt environment name for branching on staging/prod behavior [source](./.skilld/releases/v4.5.0.md:L226-L236)

**BREAKING:** `unhead` v3 type narrowing for `useHead()` — looser v2 types now stricter; promise input (deprecated in v2) no longer supported. Runtime compat for most apps, but type errors are genuine tightening [source](./.skilld/releases/v4.5.0.md:L266-L271)

**BREAKING:** Vite 8 — major version bump with breaking changes. Custom Vite plugins, config, and ecosystem plugins must be compatible [source](./.skilld/releases/v4.5.0.md:L36-L43)

**BREAKING:** Rspack 2 with Rsbuild — major upgrade to builder internals via `@rsbuild/core`. Dev server now middleware-mode Rsbuild. Custom Rspack config may need review [source](./.skilld/releases/v4.5.0.md:L45-L64)

**NEW:** `createUseFetch()` and `createUseAsyncData()` — factory functions to create custom composable instances with default options, supporting both object and function-based merging [source](./.skilld/releases/v4.4.0.md:L14-L51)

**NEW:** `useAnnouncer()` composable with `<NuxtAnnouncer>` — announce dynamic in-page changes to screen readers via `polite()` and `assertive()` methods, complements `useRouteAnnouncer()` for page nav [source](./.skilld/releases/v4.4.0.md:L94-L128)

**BREAKING:** Vue Router v5 — major upgrade removes `unplugin-vue-router` dependency. Remove `unplugin-vue-router` from your dependencies if you were using it directly [source](./.skilld/releases/v4.4.0.md:L55-L60)

**NEW:** Typed layout props in `definePageMeta` — layouts can be passed props via `{ name: 'panel', props: { ... } }`, with full type-checking if layout defines props [source](./.skilld/releases/v4.4.0.md:L65-L92)

**NEW:** `appLayout` route rule property — set layouts centrally via route rules (`/admin/**: { appLayout: 'admin' }`) without scattering `definePageMeta` [source](./.skilld/releases/v4.3.0.md:L34-L56)

**NEW:** Route groups in page meta — parenthesized folders (e.g., `(protected)/`) now exposed as `route.meta.groups` array for middleware-based authorization [source](./.skilld/releases/v4.3.0.md:L94-L114)

**NEW:** `setPageLayout()` props parameter — pass layout props from middleware: `setPageLayout('admin', { sidebar: true })` [source](./.skilld/releases/v4.3.0.md:L116-L136)

**NEW:** `#server` alias for `server/` imports — clean server-only imports with import protection preventing accidental cross-boundary usage [source](./.skilld/releases/v4.3.0.md:L138-L150)

**NEW:** AbortController support for `useAsyncData()` — pass `signal` to handler and `refresh()`/`execute()` for fine-grained request cancellation [source](./.skilld/releases/v4.2.0.md:L15-L48)

**NEW:** `payloadExtraction: 'client'` mode — inline payload in initial HTML while still generating `_payload.json` for nav (becomes default in v5) [source](./.skilld/releases/v4.4.0.md:L136-L156)

**NEW:** `refresh` option for `useCookie()` — extend expiration without changing value by resetting: `session.value = session.value` [source](./.skilld/releases/v4.4.0.md:L158-L172)

**NEW:** `clearNuxtState()` reset to default — optionally reset `useState` to initial value instead of `undefined` [source](./.skilld/releases/v4.4.0.md:L174-L186)

**NEW:** Stable error codes (NUXT_E1001, etc.) — build/runtime errors now carry stable, greppable codes with why/fix inline and docs link [source](./.skilld/releases/v4.5.0.md:L102-L110)

**DEPRECATED:** `installModule()` function — use `addModuleEntry()` instead for module dependency resolution with version constraints [source](./.skilld/releases/v4.1.0.md#TODO)

**NEW:** `experimental.ssrStreaming` — enable SSR streaming for faster TTFB, automatically disabled for crawlers; inline payloads for cached routes avoid double-render [source](./.skilld/releases/v4.5.0.md:L66-L100)

**Also changed:** `unctx` v3 async context fixes · `unrouting` trie-based route generation · `shared-watcher` builder option for dev efficiency · Named layout slots via `dxup` · ESR inline styles for lazy components · `vue.optionsApi` opt-in disabling · Lean precompiled renderer deps · Module load error transparency
<!-- /skilld:api-changes -->

<!-- skilld:best-practices -->
## Best Practices

- Use `useFetch` or `useAsyncData` instead of direct `$fetch` calls in component setup — prevents double-fetching on server and client by serializing data to the payload, and avoids hydration mismatches [source](./.skilld/docs/1.getting-started/10.data-fetching.md#the-need-for-usefetch-and-useAsyncData)

- Create custom fetchers with `createUseFetch` to enforce baseURL, headers, and error handling — better than defining the same config in every composable and ensures consistency across the app [source](./.skilld/docs/3.guide/5.recipes/3.custom-usefetch.md#recipe-api-client-with-auth)

- Use `useState` for reactive, SSR-friendly shared state — data is serialized to the hydration payload, making it safe for both server and client without manual sync [source](./.skilld/docs/4.api/2.composables/use-state.md#usage)

- Never use `shallowRef` for deeply nested state, but do use it with `useState` for large objects that don't need deep reactivity — this improves performance when state contains massive arrays or objects [source](./.skilld/docs/4.api/2.composables/use-state.md#using-shallowref)

- Fix hydration mismatches immediately during development — they are not just warnings but indicators of broken interactivity, increased time-to-interactive, and SEO indexing problems [source](./.skilld/docs/3.guide/2.best-practices/hydration.md#why-is-it-important-to-fix-them)

- Use `useCookie` instead of `localStorage` in component setup for SSR-safe user preferences — cookies work on both server and client, avoiding hydration mismatches [source](./.skilld/docs/3.guide/2.best-practices/hydration.md#browser-only-apis-in-server-context)

- Wrap browser-only libraries in `onMounted` rather than the root of `<script setup>` — plugins and side effects that run during hydration block rendering and cause performance degradation [source](./.skilld/docs/3.guide/2.best-practices/hydration.md#third-party-libraries-with-side-effects)

- Favor composition over plugins for lightweight utilities — most code can be implemented as composables or utils without the hydration and initialization overhead of plugins [source](./.skilld/docs/3.guide/2.best-practices/plugins.md#use-composition-whenever-possible)

- Set `parallel: true` on async plugins to allow multiple plugins to load concurrently — prevents blocking operations from serializing plugin startup and slowing hydration [source](./.skilld/docs/3.guide/2.best-practices/plugins.md#if-async-enable-parallel)

- Use the `Lazy` prefix or `defineLazyHydrationComponent` for components that are not immediately needed — defers both download and hydration of component code, improving time-to-interactive [source](./.skilld/docs/3.guide/2.best-practices/performance.md#lazy-hydration)

- Use `.server.vue` suffix for content-heavy, static components (markdown, syntax highlighting, CMS output) — eliminates wasted hydration work and keeps parser/highlighter dependencies off the client [source](./.skilld/docs/3.guide/1.concepts/6.server-components.md#.server.vue-components)

- Use route rules with hybrid rendering (`prerender`, `isr`, `swr`) to optimize different page types — prevents over-rendering content that doesn't change and reduces server load [source](./.skilld/docs/3.guide/2.best-practices/performance.md#hybrid-rendering)

- Use `<ClientOnly>` with a `#fallback` slot for time-dependent content (current time, user-specific data) — renders a safe fallback on the server and client-only content after hydration, avoiding mismatches [source](./.skilld/docs/3.guide/2.best-practices/hydration.md#dynamic-content-based-on-time)

- Use `import.meta.server` and `import.meta.client` guards in middleware and composables to split environment-specific logic — ensures the right code runs where needed without shipping unnecessary browser APIs to the server [source](./.skilld/docs/3.guide/1.concepts/1.rendering.md#what-s-server-rendered-and-what-s-client-rendered)
<!-- /skilld:best-practices -->

Related: vue-skilld
