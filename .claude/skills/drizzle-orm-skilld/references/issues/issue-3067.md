---
number: 3067
title: "[FEATURE]: Dependency to deprecated package `@esbuild-kit/esm-loader`"
type: other
state: closed
created: 2024-10-08
url: "https://github.com/drizzle-team/drizzle-orm/issues/3067"
reactions: 94
comments: 48
labels: "[drizzle/kit, improvement, priority, implemented-in-beta]"
---

# [FEATURE]: Dependency to deprecated package `@esbuild-kit/esm-loader`

### Describe what you want

`@esbuild-kit/esm-loader` was recently marked as deprecated. It might be a good time to update the dependencies to this library.

---

## Top Comments

**@BCsabaEngine** (+24):

esm-loader@2.6.5 depends on @esbuild-kit/core-utils and core-utils is deprecated too and add some critical vulnerability to dockerfile. It is reported by docker scout.

Should you change it to tsx?
```
npm warn deprecated @esbuild-kit/esm-loader@2.6.5: Merged into tsx: https://tsx.is
npm warn deprecated @esbuild-kit/core-utils@3.3.2: Merged into tsx: https://tsx.is
```

**@gurgelff** (+18):

> Hi! We are also using drizzle-kit in our project and would love to have this fixed!
> 
> Here's the related npm audit output:
> 
> ```
> esbuild  <=0.24.2
> Severity: moderate
> ...
> node_modules/drizzle-kit
> ```
> 
> I would prefer not downgrading drizzle-kit to v.0.19.1, as npm audit suggests :)

Hi @AnMW 
I solved that by adding in **package.json** the *overrides* section with esbuild set to the newest version in drizzle-kit and also in its sub-dependencies (esm-loader and core-utils):

...

**@AnMW** (+7):

Hi! We are also using drizzle-kit in our project and would love to have this fixed!

Here's the related npm audit output:

```
esbuild  <=0.24.2
Severity: moderate
esbuild enables any website to send any requests to the development server and read the response - https://github.com/advisories/GHSA-67mh-4wv8-2f99
fix available via `npm audit fix --force`
Will install drizzle-kit@0.19.1, which is a breaking change
node_modules/@esbuild-kit/core-utils/node_modules/esbuild
node_modules/drizzle-kit/node_modules/esbuild
  @esbuild-kit/core-utils  *
  Depends on vulnerable versions of esbuild
  node_modules/@esbuild-kit/core-utils
    @esbuild-kit/esm-loader  *
    Depends on vulnerable versions of @esbuild-kit/core-utils
    node_modules/@esbuild-kit/esm-loader
      drizzle-kit  0.9.1 - 0.9.54 || >=0.12.9
      Depends on vulnerable versions of @esbuild-kit/esm-loader
      Depends on vulnerable versions of esbuild
      node_modules/drizzle-kit
```...