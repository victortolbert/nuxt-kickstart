---
number: 172
title: Error no such file or directory - debug.json
type: other
state: closed
created: 2024-03-09
url: "https://github.com/nuxt-modules/og-image/issues/172"
reactions: 3
comments: 15
---

# Error no such file or directory - debug.json

Just till recently (less than a week ago) I had no problem using `@nuxtjs/seo`, but suddenly using the package gives me error:

## Environment:
WSL Ubuntu (Windows 11)

------------------------------
- Operating System: Linux
- Node Version:     v21.7.1
- Nuxt Version:     3.10.3
- CLI Version:      3.10.1
- Nitro Version:    -
- Package Manager:  pnpm@8.15.4
- Builder:          -
- User Config:      devtools, modules, colorMode
- Runtime Modules:  @nuxtjs/color-mode@3.3.2, nuxt-bootstrap-css@1.1.0, @nuxtjs/seo@2.0.0-rc.8
- Build Modules:    -
------------------------------

```json
"devDependencies": {
    "@nuxtjs/color-mode": "^3.3.2",
    "@nuxtjs/seo": "2.0.0-rc.8",
    "nuxt-bootstrap-css": "^1.1.0",
    "nuxt": "^3.10.3",
    "vue": "^3.4.21",
    "vue-router": "^4.3.0"
}
```...

---

## Top Comments

**@dargmuesli** (+1):

> !!!!! +++,

relax a bit please

> then this error out of nowhere

without updating nitropack this issue should not occur

As you can see people are working on fixing that issue, please upvote the issue by giving it a :+1: instead of commenting without further information :pray: 

> where did you add this

To the `package.json`

**@dargmuesli**:

https://github.com/nuxt-modules/og-image/blob/6c8936d2d961571af64104c5abefba9bb7cf9291/src/module.ts#L341
Maybe it should be `debug.json.mjs` here?

**@modbender**:

Ok looks like it indeed is nitro problem.

## WORKAROUND AS BELOW

Add one of the below to `package.json`
```json
"resolutions": {
  "nitropack": "2.9.1"
}
```
**OR**

```json
"overrides": {
  "nitropack": "2.9.1"
}
```

Next, run `npm install` or whichever CLI you use.