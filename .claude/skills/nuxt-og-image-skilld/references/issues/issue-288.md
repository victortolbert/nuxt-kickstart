---
number: 288
title: "fix: Pre-rendering issues with unocss version 0.65"
type: bug
state: closed
created: 2024-12-05
url: "https://github.com/nuxt-modules/og-image/issues/288"
reactions: 4
comments: 1
labels: "[bug]"
---

# fix: Pre-rendering issues with unocss version 0.65

###  The bug

When I run `npm run generate`, the following error occurs.

```
ERROR [nuxt] [request error] [unhandled] [500] uno.parseToken is not a function 15:29:18
at Object.transform (./.nuxt/prerender/chunks/_/renderer.mjs:304:37)
at walkSatoriTree (./.nuxt/prerender/chunks/_/renderer.mjs:82:32)
at walkSatoriTree (./.nuxt/prerender/chunks/_/renderer.mjs:85:12)
at createVNodes (./.nuxt/prerender/chunks/_/renderer.mjs:391:21)
at async Promise.all (index 1)
at async createSvg (./.nuxt/prerender/chunks/_/renderer.mjs:429:35)
at async createPng (./.nuxt/prerender/chunks/_/renderer.mjs:446:15)
at async Object.imageEventHandler [as handler] (./.nuxt/prerender/chunks/_/eventHandlers.mjs:336:13)
at async Object.eval [as handler] (./node_modules/h3/dist/index.mjs:2103:19)
at async toNodeHandle (./node_modules/h3/dist/index.mjs:2395:7)

├─ /**og-image**/static/og.png (446ms) nitro 15:29:18
│ ├── [500]
│ └── Linked from /

Errors prerendering:
├─ /**og-image**/static/og.png (446ms) nitro 15:29:18
│ ├── [500]
│ └── Linked from /

ERROR Exiting due to prerender errors.

at Module.prerender (node_modules/nitropack/dist/core/index.mjs:2090:11)
at async eval (node_modules/nuxt/dist/index.mjs:3754:5)

...

---

## Top Comments

**@harlan-zw** [maintainer] (+3):

Thanks for the issue. Looks like UnoCSS 0.65 introduced a breaking change which I've pushed up a fix for in 4.0.1