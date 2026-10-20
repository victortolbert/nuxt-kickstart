# Confidentiality is enforced by location, not by a visibility field

`visibility` is an **editorial** field. It decides who sees a document on the
site, and its value may ship to the browser. **Confidentiality is enforced by
location**: anything genuinely sensitive is not a Nuxt Content collection at
all. It lives where only the server can read it (a database, or a directory
under `server/` read by an authenticated route).

`visibility: private` was never a security boundary. Nuxt Content has no
per-document or per-collection authorization, and `visibility` is an ordinary
schema field the module does not read.

## What a production build ships

`@nuxt/content` writes each collection to
`.output/public/__nuxt_content/<collection>/sql_dump.txt`, a base64+gzip SQL
dump served as a static file, so the client-side database can answer
`queryCollection()` in the browser. It holds **every row**, whatever its
`visibility`. Decoding this template's build output finds the 39 `private`
`tech` entries in `tech/sql_dump.txt`. They are harmless placeholders, but a
real project's private rows would be sitting in the same file.

The visibility rules (`shared/utils/content-visibility.ts`) keep those rows out
of listings, detail pages, navigation and the sitemap. That is the job they can
do. Withholding data from someone who requests the dump directly is a job they
cannot do.

## Considered options

- **Disable the client-side content database.** Not available: `@nuxt/content`
  has no `clientDB` switch, and the resolved collection's `private` flag is
  hardcoded and not exposed to `defineCollection`.
- **Un-prerender the dump routes.** Stops the static file being written, but the
  node preset still registers a live handler at the same route. It removes the
  file, not the exposure.
- **Assert "no non-public row in any build artifact".** Rejected: drafts are
  legitimately non-public, so the assertion fails on day one with no secrets
  among the violations. An assertion that has to be muted is worse than none.
- **Split the content tree into public and private repositories.** Rejected: it
  fights the model where a document graduates from private to public in place.

## Consequences

- The `visibility` default stays `private`, because a field whose default means
  "unset" trains you to ignore it. A collection whose contents are inherently
  publishable may take a public default in its own schema.
- Records about real people (contact details, reporting lines) and anything
  under a confidentiality obligation do not go in `content/`. Put them behind a
  server route that resolves the session with `getRequestViewer` and filters with
  `canViewContent`, the same pair the pages use, so there is still one rule set.
- Prefer controls that can be checked against the artifact that actually ships.
  The dump exposure is invisible in dev and appears only in a production build.
  It is found by decoding the build output, not by reading the code.
