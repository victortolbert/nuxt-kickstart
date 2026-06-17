---
number: 2705
title: "[BUG]: Cannot find module error when import includes '.js' file extension in TypeScript project"
type: bug
state: open
created: 2024-07-29
url: "https://github.com/drizzle-team/drizzle-orm/issues/2705"
reactions: 48
comments: 23
labels: "[bug, drizzle/kit, priority]"
---

# [BUG]: Cannot find module error when import includes '.js' file extension in TypeScript project

### What version of `drizzle-orm` are you using?

0.32.1

### What version of `drizzle-kit` are you using?

0.23.0

### Describe the Bug

Attempting to generate a migration script fails with 'cannot find module' when a module path includes the '.js' file extension in TypeScript project. Similar issue, if not the same, https://github.com/drizzle-team/drizzle-orm/issues/849

Sample project to recreate the issue
https://github.com/Skulltulla/drizzle-kit-mirror-fork/tree/issues/drizzle-issues-0000

### Expected behavior

Generating a migration completes successfully when the module import path includes a '.js' file extension.

### Environment & setup

    5.15.153.1-microsoft-standard-WSL2 #1 SMP Fri Mar 29 23:14:13 UTC 2024 x86_64 x86_64 x86_64 GNU/Linux

---

## Top Comments

**@suvanl** (+8):

I'm also experiencing this issue (drizzle-orm 0.33.0; drizzle-kit 0.24.0) - I ran into it while running the `drizzle-kit studio` command.

So far I've thought of two different workarounds:

1. **In your drizzle.config.ts file, set the `schema` path to start from the `outDir` from your tsconfig.**
    ```ts
    export default defineConfig({ 
      schema: "./dist/src/db/schema/*",  // replace 'dist' with whatever your outDir is called
      ...
    })
    ```
    This should work since the outDir will only contain `.js` files instead of  `.ts`  (it seems like the issue is that drizzl...

**@SaadFarooq-Dev** (+8):

I also encountered this issue. Any Idea when a potential fix will be shipped?   

**@denlahodnyi** (+3):

> Another workaround is to use different module settings in your tsconfig file.
> 
> ```
> {
>   "compilerOptions": {
>     // ...
>     "module": "Preserve",
>     "moduleResolution": "bundler",
>     // ...
>   }
> }
> ```
> 
> Then you should be able to take the file extension types off all your imports (or at least the relevant ones in your schema files for drizzle).
> 
> I don't think this has any negative side effects (besides needing to import cjs modules with a different syntax), but I'm no TS wizard. You'll have to ask Matt Pocock 

...