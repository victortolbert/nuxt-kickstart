---
title: Releasing
description: Generate changelogs and GitHub Releases from conventional commits with changelogithub
tags:
  - releasing
  - changelog
  - ci
status: evergreen
visibility: public
category: deployment
difficulty: intermediate
order: 9
created: '2026-06-11'
---

Kickstart uses [changelogithub](https://github.com/antfu/changelogithub) to generate changelogs from conventional commits and publish GitHub Releases automatically.

## Workflow

```
develop (day-to-day work)
  |
  |-- feature branches (optional, merge back to develop)
  |
  v
main (stable, tagged releases)
```

## How to release

1. Make sure `develop` is clean and ready:

```bash
pnpm run test
pnpm run typecheck
pnpm run lint
```

1. Merge `develop` into `main`:

```bash
git checkout main
git merge develop
```

1. Tag the release and push:

```bash
git tag v0.2.0
git push origin main --follow-tags
```

1. The GitHub Action (`.github/workflows/release.yml`) runs automatically on tag push, generates the changelog from conventional commits, and creates a GitHub Release.

2. Switch back to `develop`:

```bash
git checkout develop
```

## Preview changelog locally

```bash
pnpm run changelog
```

This runs `changelogithub --dry` and shows what the release notes would look like without publishing anything. No token needed.

## Versioning

This is an application template, not a library with an API contract. Use versions as milestones:

- **Patch** (v0.2.1) - bug fixes, small tweaks
- **Minor** (v0.3.0) - new feature area complete (e.g., email subsystem, i18n)
- **Major** (v1.0.0) - when you're ready to call it "v1"

## Conventional commits

changelogithub groups commits by type:

| Prefix | Section |
|--------|---------|
| `feat:` | Features |
| `fix:` | Bug Fixes |
| `perf:` | Performance |
| `docs:` | Documentation (excluded by default) |
| `chore:` | Excluded by default |
| `refactor:` | Excluded by default |

Scoped commits (e.g., `feat(auth):`) get grouped under their scope.

## No local token needed

The CI workflow uses the built-in `secrets.GITHUB_TOKEN` which requires no setup. If you ever want to run `pnpm run release` locally (not recommended), create a token at:

<https://github.com/settings/tokens/new?scopes=repo&description=changelogithub>

And add `GITHUB_TOKEN=ghp_...` to your `.env`.
