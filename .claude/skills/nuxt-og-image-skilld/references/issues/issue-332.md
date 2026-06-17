---
number: 332
title: "fix: dev server fails to start in nuxt `3.16.0` with og-image `5.0.0`"
type: bug
state: closed
created: 2025-03-08
url: "https://github.com/nuxt-modules/og-image/issues/332"
reactions: 10
comments: 2
labels: "[bug]"
---

# fix: dev server fails to start in nuxt `3.16.0` with og-image `5.0.0`

###  The bug

```
[nitro 12:40:30 PM]  ERROR  Error: Could not load /home/ztluwu/Dev/test/repros/og-image-repro/node_modules/unenv/dist/runtime/runtime/mock/empty.mjs (imported by node_modules/nuxt-og-image/dist/runtime/server/og-image/satori/instances.js): ENOENT: no such file or directory, open '/home/ztluwu/Dev/test/repros/og-image-repro/node_modules/unenv/dist/runtime/runtime/mock/empty.mjs'
```

This happens both to a fresh install and upgrading in existing projects via `nuxi upgrade --force`.

###  To reproduce

https://stackblitz.com/~/github.com/ZTL-UwU/og-image-repro

###  Expected behavior

no error

###  Additional context

Lockfile versions:
```
nuxt@3.16.0
nuxt-og-image@5.0.0
unenv@2.0.0-rc.12
```

---

## Top Comments

**@MFM-347** (+1):

@peoray You can manually update `nuxt-og-image` by changing its version in `package.json` to `5.0.2` and then running:  
  
```sh
npm install
```  

This should update the `nuxt-og-image` to the version `5.0.2` (latest).

**@peoray**:

@harlan-zw how do we rectify this? `npx nuxi upgrade` does not seem to update nuxt-og-image. It's still at v4.2.0