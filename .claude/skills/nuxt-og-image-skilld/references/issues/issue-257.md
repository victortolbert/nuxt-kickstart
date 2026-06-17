---
number: 257
title: "fix: Build error for cloudflare-pages: no such file or directory, open '@css-inline/css-inline-wasm/index_bg.wasm'"
type: bug
state: closed
created: 2024-08-18
url: "https://github.com/nuxt-modules/og-image/issues/257"
reactions: 2
comments: 5
resolvedIn: 3.0.0
labels: "[bug]"
---

# fix: Build error for cloudflare-pages: no such file or directory, open '@css-inline/css-inline-wasm/index_bg.wasm'

###  The bug

I upgraded to latest `@nuxtjs/seo` `2.0.0-rc.18` that uses `nuxt-og-image` `3.0.0-rc.64` and now I get the following error on build using `NITRO_PRESET=cloudflare-pages nuxt build`:

> ERROR  ENOENT: no such file or directory, open '/Users/mick/git/frau-dora/apps/website/@css-inline/css-inline-wasm/index_bg.wasm' 

I dont use  tags and do not have any inline styles. I just use Tailwind classes.

###  To reproduce

I made a minimal reproduction repo:
https://github.com/MickL/og-image-build-bug


---

## Top Comments

**@harlan-zw** [maintainer]:

Hey, thanks for reporting this. I've pushed up a fix in v3.0.0-rc.65.

**@harlan-zw** [maintainer]:

If your clear the lock file and re-install the deps it should install the latest og image with the fix.

**@modbender**:

Having this error on vercel build too.

```
nuxt build --preset=vercel_edge
```

https://stackblitz.com/edit/nuxt-starter-7mnzr1?file=nuxt.config.ts