# .claude/skills is a curated template feature

The template ships agent skills as a deliberate feature ("agentic-ready"),
curated to three groups: stack skills (Nuxt/Vue/Nuxt UI/Tailwind/Drizzle/
Zod/Better Auth/web security/testing), an agentic workflow core (grilling,
architecture review, TDD, diagnosis, planning, issue workflows), and the
design-verb family (audit, harden, optimize, polish, …). Skills for foreign
stacks (.NET, Next.js/React, Bun), office-document formats, art/media
generation, and personal tooling are deliberately excluded — shipping them
would contradict the template's own conventions (e.g. `bun-first` vs the
pnpm-only rule) and dilute the set's credibility. We considered shipping
everything (zero curation, but noisy and self-contradicting) and shipping
nothing (clean, but loses the feature). `.claude/skills/` is the single
canonical tree; the parallel `.agents/skills/` copy was deleted because the
two had already drifted and nothing enforced sync.
