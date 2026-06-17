# No typed queryCollection facade

Nuxt Content v3's `queryCollection()` typing doesn't compose well with dynamic
collection names, so a few call sites cast. We decided **not** to wrap
`queryCollection` in a typed facade: after the Localized Collection module
absorbed the locale-aware call sites, only two casts remain in the whole app,
a facade would have an interface as wide as the thing it wraps (every caller
still needs collection names, where-clauses, and ordering), and it fails the
deletion test — deleting it would just move the same two casts back to their
call sites. Revisit (and prune this ADR) if upstream Nuxt Content typing
improves enough that the casts can simply be deleted, or if the cast count
grows past a handful.
