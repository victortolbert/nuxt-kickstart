---
number: 193
title: Deploying on Cloudflare Pages, script_too_large?
type: other
state: closed
created: 2024-04-13
url: "https://github.com/nuxt-modules/og-image/issues/193"
reactions: 4
comments: 6
---

# Deploying on Cloudflare Pages, script_too_large?

Hi,

I think this may be misconfiguration or misunderstanding on my part rather than an issue, but just to check:

Tried deploying a branch with a simple template, it works well locally, but with the 1mb worker limit on Pages (free) I get the `workers.api.error.script_too_large` error as the compiled-wasm file is 2.4mb. 

Is there a way around this or is the package not usable with the 1mb limit?

Thanks!

---

## Top Comments

**@harlan-zw** [maintainer] (+2):

Please use the new Zero Runtime mode if you can prerender all of the images you need https://nuxtseo.com/og-image/guides/zero-runtime

**@harlan-zw** [maintainer] (+1):

If you want to generate runtime images with Satori on Cloudflare there isn't a way around this (for now). This is due to upstream dependency WASM sizes that I have no control over.

If you're happy to prerender all of your images then you can follow my comment.



**@ExEr7um**:

Same issue. OG Image adds `1.8MB` compressed.