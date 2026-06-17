---
number: 63
title: Custom images broken with CloudFlare Workers 
type: bug
state: closed
created: 2023-07-04
url: "https://github.com/nuxt-modules/og-image/issues/63"
reactions: 4
comments: 9
labels: "[bug]"
---

# Custom images broken with CloudFlare Workers 

### Describe the bug

Getting the following error on CloudFlare Workers:

```json
{
  "data": {
    "message": "Cannot perform I/O on behalf of a different request. I/O objects (such as streams, request/response bodies, and others) created in the context of one request handler cannot be accessed from a different request's handler. This is a limitation of Cloudflare Workers which allows us to improve overall performance. (https://fonts.googleapis.com/css2?family=Inter:wght@400)",
    "stack": "",
    "statusCode": 500,
    "statusMessage": "",
    "url": "/api/og-image-font?name=Inter&weight=400"
  },
  "message": " (500  (/api/og-image-font?name=Inter&weight=400))",
  "stack": "",
  "statusCode": 500,
  "statusMessage": "",
  "url": "/api/og-image-svg?path=%2F"
}
```

Us...

---

## Top Comments

**@kane50613** (+1):

> * moved to `takumi` and they're rendering but the some styles are broken (like flex or fontSize (it looks like there's a small different))


Love to help resolve in Takumi end if it's Takumi's issue, may I know what exactly "broken"? like the position are off or layout is wrong

**@harlan-zw** [maintainer]:

Thanks for the details, the font issue should be solved with v3.0.0-rc.36

In this version we implement Nitro server storage for the fonts. The only issue with doing this is it's going to fetch the fonts on every request which is going to slow down the render.

**@harlan-zw** [maintainer]:

Should also be fixed with https://github.com/nuxt-modules/og-image/pull/421 which inlines static images.