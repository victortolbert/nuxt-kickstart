---
number: 69
title: "vm2@3.9.19: The library contains critical security issues and should not be used for production!"
type: other
state: closed
created: 2023-08-09
url: "https://github.com/nuxt-modules/og-image/issues/69"
reactions: 4
comments: 5
resolvedIn: 2.0.27
---

# vm2@3.9.19: The library contains critical security issues and should not be used for production!

### Describe the bug

When installing `nuxt-og-image` I get this error because of some insane chain of dependencies. I don't know where in the chain the issue should be added, but considering nuxt-og-image is the actual library I care about I'm putting here.

```
 WARN  deprecated vm2@3.9.19: The library contains critical security issues and should not be used for production! The maintenance of the project has been discontinued. Consider migrating your code to isolated-vm.
```

### Reproduction

_No response_

### System / Nuxt Info

```Shell
I'm using pnpm to install
```

...

---

## Top Comments

**@harlan-zw** [maintainer] (+1):

To give some context on this error, this is from inline-css dependency which is used to inline styles.

The inline-css implementation won't process fetch's so the `vm2` code should never run.

I'd like to replace this dependency with something else but I don't have the capacity at the moment.

**@harlan-zw** [maintainer] (+1):

Fixed in 2.0.27 thanks to the great work of @aoor9 :raised_hands: 

**@aoor9** (+2):

I took care of it once, and I can contribute by doing the same to this package.