---
name: nuxt-skilld
description: "ALWAYS use when writing code importing \"nuxt\". Consult for debugging, best practices, or modifying nuxt."
metadata:
  version: 4.4.8
  generated_by: Anthropic · Haiku 4.5
  generated_at: 2026-06-11
---

# nuxt/nuxt `nuxt@4.4.8`
**Tags:** 1x: 1.4.5, 2x: 2.18.1, alpha: 4.0.0-alpha.4

**References:** [package.json](./.skilld/pkg/package.json) • [README](./.skilld/pkg/README.md) • [Docs](./.skilld/docs/_INDEX.md) • [Issues](./.skilld/issues/_INDEX.md) • [Discussions](./.skilld/discussions/_INDEX.md) • [Releases](./.skilld/releases/_INDEX.md)

## Search

Use `skilld search "query" -p nuxt` instead of grepping `.skilld/` directories. Run `skilld search --guide -p nuxt` for full syntax, filters, and operators.

<!-- skilld:api-changes -->
## API Changes

This section documents version-specific API changes — prioritize recent major/minor releases.

## Nuxt v4.4.x

- NEW: `createUseFetch()` and `createUseAsyncData()` — factory functions to create custom instances with default options, enabling reusable fetch patterns across your app [source](./.skilld/releases/v4.4.0.md:L14:L51)

- NEW: `useAnnouncer()` composable and `<NuxtAnnouncer>` component — announce dynamic in-page changes (form submissions, loading states) to screen readers via `polite()` and `assertive()` methods [source](./.skilld/releases/v4.4.0.md:L94:L128)

- NEW: Typed layout props in `definePageMeta` — pass props directly to layouts with full type checking and autocomplete [source](./.skilld/releases/v4.4.0.md:L63:L92)

- NEW: `refresh` option for `useCookie` — extend cookie expiration on every assignment without changing the value [source](./.skilld/releases/v4.4.0.md:L158:L172)

- NEW: `useState` reset to default — `clearNuxtState()` now resets to initial value instead of `undefined`, matching `useAsyncData` behavior [source](./.skilld/releases/v4.4.0.md:L174:L186)

- BREAKING: Vue Router v5 upgrade — removed `unplugin-vue-router` dependency; if you were using it directly, remove from your dependencies [source](./.skilld/releases/v4.4.0.md:L55:L61)

- NEW: View Transitions Types support — define view transition types for different navigation patterns (forwards vs. backwards) [source](./.skilld/releases/v4.4.0.md:L200:L204)

- NEW: `payloadExtraction: 'client'` (experimental) — inlines full payload in initial HTML response while still generating `_payload.json` for client-side navigation [source](./.skilld/releases/v4.4.0.md:L136:L156)

## Nuxt v4.3.x

- NEW: `appLayout` in route rules — set layouts declaratively at the route rule level without scattering `definePageMeta` calls [source](./.skilld/releases/v4.3.0.md:L33:L55)

- NEW: `#server` alias — clean imports within server directory (e.g. `import { helper } from '#server/utils/helper'`) with import protection [source](./.skilld/releases/v4.3.0.md:L138:L150)

- NEW: Layout props with `setPageLayout()` — second parameter now accepts props to pass to layouts from middleware [source](./.skilld/releases/v4.3.0.md:L116:L136)

- NEW: Route groups in page meta — folders wrapped in parentheses (e.g. `(protected)/`) now expose `meta.groups` array for authorization logic [source](./.skilld/releases/v4.3.0.md:L95:L114)

- NEW: ISR/SWR payload extraction — payload extraction now works with `isr`, `swr`, and cache route rules, enabling CDN caching of data payloads [source](./.skilld/releases/v4.3.0.md:L57:L74)

- DEPRECATED: `statusCode` → `status`, `statusMessage` → `statusText` — old properties still work but deprecated in advance of v5; use Web API naming conventions [source](./.skilld/releases/v4.3.0.md:L195:L204)

- BREAKING: `noUncheckedIndexedAccess` enabled by default in server TypeScript config — may surface new type errors in server code; can be disabled in config if needed [source](./.skilld/releases/v4.3.0.md:L220:L240)

## Nuxt v4.2.x

- NEW: Abort control for `useAsyncData` — pass `signal` parameter to handler or use `AbortController` with `refresh()` for fine-grained request cancellation [source](./.skilld/releases/v4.2.0.md:L15:L48)

- NEW: `extractAsyncDataHandlers` (experimental) — extracts async data handler functions into separate chunks, reducing client bundle by up to 39% for prerendered sites [source](./.skilld/releases/v4.2.0.md:L107:L145)

- NEW: `viteEnvironmentApi` (experimental) — opt into Vite 6's Environment API for improved dev server performance and reduced edge case bugs [source](./.skilld/releases/v4.2.0.md:L58:L74)

- NEW: Component `declarationPath` option — specify custom declaration path for components in `addComponent()` [source](./.skilld/releases/v4.2.0.md:L177:L179)

- NEW: `setGlobalHead` utility in kit — easier head management for module authors [source](./.skilld/releases/v4.2.0.md:L177:L182)

## Nuxt v4.0.0

- BREAKING: `app/` directory is now default structure — application code moves to `app/` folder; old structure still detected automatically but new projects use this layout [source](./.skilld/releases/v4.0.0.md:L32:L53)

- BREAKING: Separate TypeScript projects for contexts — Nuxt now creates separate tsconfigs for app, server, shared, and builder code; better type inference and autocompletion [source](./.skilld/releases/v4.0.0.md:L64:L71)

- BREAKING: `#app/components/layout` → `#app/components/nuxt-layout` — internal layout component import path changed [source](./.skilld/releases/v4.0.0.md:L217:L219)

- BREAKING: `public` and `assets` aliases removed — migrate to `~/public/` and standard asset imports [source](./.skilld/releases/v4.0.0.md:L199:L200)

- BREAKING: Removed top-level `generate` option — use `routeRules` or prerender config instead [source](./.skilld/releases/v4.0.0.md:L201:L202)

- BREAKING: Improved default `asyncData` behavior — `useAsyncData` no longer reruns with existing data; may affect data refresh patterns [source](./.skilld/releases/v4.0.0.md:L196:L197)

- NEW: Route announcer integration — `<NuxtRouteAnnouncer>` auto-added to default app.vue for better accessibility [source](./.skilld/releases/v4.0.0.md:L153:L154)

**Also changed:** `devtools` integration for Chrome workspaces · `onWatcherCleanup` added to auto-imports · `NuxtTime` relative time props · Lazy hydration macros · `@nuxt/nitro-server` extracted to separate package · Module disabling with `false` option
<!-- /skilld:api-changes -->

<!-- skilld:best-practices -->
## Best Practices

- Use `useFetch` or `useAsyncData` instead of `$fetch` in component setup — prevents double-fetching by sharing the payload from server to client, improving performance and preventing hydration mismatches [source](./.skilld/docs/1.getting-started/10.data-fetching.md#the-need-for-usefetch-and-useasyncdata)

- Fix hydration mismatches immediately — use SSR-friendly composables like `useCookie`, `useState`, and `NuxtTime` instead of browser-only APIs like `localStorage` in setup [source](./.skilld/docs/3.guide/2.best-practices/hydration.md#common-reasons)

- Never define `const state = ref()` outside of `<script setup>` or setup functions — shared refs in module scope leak across requests on the server, causing memory leaks and state pollution [source](./.skilld/docs/1.getting-started/11.state-management.md#best-practices)

- Define shared state as composables returning `useState` — use `const useX = () => useState('x')` to ensure SSR safety and enable proper state sharing [source](./.skilld/docs/1.getting-started/11.state-management.md#best-practices)

- Call composables only in the right lifecycle context — Vue tracks component context via global state, so composables must be called synchronously in setup, plugins, route middleware, or `<script setup>` blocks, never in async functions outside these contexts [source](./.skilld/docs/3.guide/1.concepts/3.auto-imports.md#vue-and-nuxt-composables)

- Use the `Lazy` prefix to dynamically load components only when needed — reduces initial bundle size by delaying component import until it's actually rendered [source](./.skilld/docs/3.guide/2.best-practices/performance.md#lazy-loading-components)

- Enable lazy hydration with `hydrate-on-visible` to delay component interactivity — improves time-to-interactive by hydrating offscreen components only when they become visible [source](./.skilld/docs/3.guide/2.best-practices/performance.md#lazy-hydration)

- Use `<NuxtLink>` over `<a>` tags for internal navigation — provides smart prefetching, detects link visibility automatically, and respects custom prefetch configuration [source](./.skilld/docs/3.guide/2.best-practices/performance.md#links)

- Avoid expensive logic in plugin setup — if setup takes more than 1 second, Nuxt will warn; defer time-consuming tasks like API calls to Nuxt lifecycle hooks instead [source](./.skilld/docs/3.guide/2.best-practices/plugins.md#avoid-costly-plugin-setup)

- Enable `parallel: true` for async plugins — prevents blocking other plugins and the dev server start by loading multiple async plugins concurrently [source](./.skilld/docs/3.guide/2.best-practices/plugins.md#if-async-enable-parallel)

- Prefix module exports with module name to avoid conflicts — use `FooButton`, `useFooData`, `/api/_foo/track` instead of generic names that collide with other modules or application code [source](./.skilld/docs/3.guide/4.modules/7.best-practices.md#prefix-your-exports)

- Use module lifecycle hooks (`onInstall`, `onUpgrade`) for one-time setup — handles database schema generation, migrations, and config file creation without running on every build [source](./.skilld/docs/3.guide/4.modules/7.best-practices.md#use-lifecycle-hooks)

- Use `import.meta.client` and `import.meta.server` for isomorphic code — safely conditions code execution without blocking server rendering or client interactivity [source](./.skilld/docs/3.guide/1.concepts/1.rendering.md#universal-rendering)

- Move browser-dependent code to `onMounted` hooks, not component root scope — avoids timer leaks and side effect cleanup issues during SSR where unmount hooks never fire [source](./.skilld/docs/3.guide/1.concepts/2.nuxt-lifecycle.md#page-and-components)
<!-- /skilld:best-practices -->

Related: vue-skilld
