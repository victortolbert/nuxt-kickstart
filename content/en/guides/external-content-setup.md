---
title: External Content Repository Setup
description: Configure Kickstart to source content from an external GitHub repository with multi-environment support, caching, and health checks
category: deployment
difficulty: intermediate
visibility: internal
status: evergreen
---

# External Content Repository Setup

Kickstart supports sourcing content from an external GitHub repository, enabling you to maintain content separately from your application code. This guide covers configuration, authentication, and deployment strategies.

## Overview

By default, Kickstart loads content from the local `content/` directory. With external content enabled, collections can be sourced from a remote GitHub repository while maintaining a local-first development experience.

**Key capabilities**:

- Source collections from an external repository
- Private repository authentication via GitHub Personal Access Token
- Per-collection override (keep some collections local)
- Multi-environment configuration (local/dev/test/qa/preview/prod)
- Health check endpoint for monitoring

::note
**Only two collections are wired up today.** `createCollectionSource()` is
called by `meta` (`schemas/publishing/meta.ts`) and `tech`
(`schemas/registries/tech.ts`) only. Every other collection — `guides`,
`posts`, `apps`, `blocks`, `email*`, `examples*` — hardcodes a local source and
ignores these variables. To externalize one, route its `source` through
`createCollectionSource()` in its schema file.
::

## Environment Variables

Configure external content using these environment variables:

### NUXT_CONTENT_REPO_URL

**Required for external content**. Full GitHub repository URL.

```bash
# Format: https://github.com/{owner}/{repo}
NUXT_CONTENT_REPO_URL=https://github.com/your-org/kickstart-content
```

### NUXT_CONTENT_AUTH_TOKEN

**Required for private repositories**. GitHub Personal Access Token with `repo` scope.

```bash
NUXT_CONTENT_AUTH_TOKEN=ghp_YourPersonalAccessTokenHere
```

**Creating a GitHub PAT**:

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope (full control of private repositories)
3. Copy the token immediately (you won't see it again)
4. Store securely in your environment configuration

### NUXT_CONTENT_BRANCH

Target branch in the external repository. Defaults to `main`.

```bash
NUXT_CONTENT_BRANCH=main
```

Use different branches per environment:

- `main` for production
- `develop` for staging
- `preview` for preview deployments

::note
The branch is passed to `@nuxt/content` as `repository.branch`. The flat
`repository: '<url>'` string form cannot carry one — the module derives the ref
by parsing the URL and falls back to `main` — so `createCollectionSource()`
returns the object form instead.
::

### NUXT_CONTENT_LOCAL_COLLECTIONS

Comma-separated list of collections to keep local even when external content is configured.

```bash
# Keep notes and logs local-only
NUXT_CONTENT_LOCAL_COLLECTIONS=notes,logs
```

**Common use cases**:

- `notes` - Keep personal notes private
- `logs` - Environment-specific logs
- `templates` - Application-specific templates

### NUXT_CONTENT_REQUIRE_EXTERNAL

Force external content to be configured. Application fails to start if `NUXT_CONTENT_REPO_URL` is not set.

```bash
# Enforce external content in production
NUXT_CONTENT_REQUIRE_EXTERNAL=true
```

Use in production environments to prevent accidental fallback to local content.

## GitHub Repository Structure

Your external content repository must mirror the local `content/` directory structure:

```
your-org/kickstart-content/
├── _meta/
│   └── landing.md
└── tech/
    ├── nuxt.md
    └── vue.md
```

Those are the two collections currently wired to `createCollectionSource()`.
Mirror the local `content/` layout for any collection you add support for.

**Requirements**:

- Directory names must match collection names in `content.config.ts`
- Frontmatter schema must match collection definitions
- File paths relative to repository root

## Configuration Examples

### Local Development (Default)

No environment variables needed. All content loads from local `content/` directory.

```bash
# .env.local (or no .env file)
# No external content variables = local-only mode
```

### Development with External Content

```bash
# .env.development
NUXT_CONTENT_REPO_URL=https://github.com/your-org/kickstart-content
NUXT_CONTENT_AUTH_TOKEN=ghp_DevTokenHere
NUXT_CONTENT_BRANCH=develop
NUXT_CONTENT_LOCAL_COLLECTIONS=notes,logs
```

### Staging Environment

```bash
# .env.staging
NUXT_CONTENT_REPO_URL=https://github.com/your-org/kickstart-content
NUXT_CONTENT_AUTH_TOKEN=ghp_StagingTokenHere
NUXT_CONTENT_BRANCH=staging
NUXT_CONTENT_LOCAL_COLLECTIONS=logs
```

### Production Environment

```bash
# .env.production
NUXT_CONTENT_REPO_URL=https://github.com/your-org/kickstart-content
NUXT_CONTENT_AUTH_TOKEN=ghp_ProductionTokenHere
NUXT_CONTENT_BRANCH=main
NUXT_CONTENT_REQUIRE_EXTERNAL=true
```

## Environment Matrix

| Environment | Branch | Auth Required | Local Collections | Require External |
|-------------|--------|---------------|-------------------|------------------|
| **local** | - | No | All | No |
| **dev** | `develop` | Yes (private) | `notes,logs` | No |
| **test** | `develop` | Yes (private) | `logs` | No |
| **qa** | `staging` | Yes (private) | `logs` | Yes |
| **preview** | `preview` | Yes (private) | - | Yes |
| **prod** | `main` | Yes (private) | - | Yes |

## CLI Commands

Manage the content cache directly:

### Refresh external content

Content is cloned on server start — restart the dev server (or redeploy) to
pull the latest from the external repository.

### Clear the cache

Remove the content cache directory:

```bash
pnpm run clean:content   # rm -rf .data/content
```

Useful when:

- Switching branches in external repository
- Debugging content loading issues
- Clearing stale cached content

## Health Check Endpoint

Monitor content source status via the health check endpoint:

```bash
GET /api/health/content
```

**Response format**:

```json
{
  "status": "ok",
  "source": "external",
  "repoUrl": "https://github.com/your-org/kickstart-content",
  "branch": "main"
}
```

**Status values**:

- `ok` - Content source configured and accessible
- `error` - Configuration error or connectivity issue

**HTTP status codes**:

- `200` - Healthy
- `503` - Error (external configured but repository URL missing)

## Troubleshooting

### "External content required but not configured"

**Cause**: `NUXT_CONTENT_REQUIRE_EXTERNAL=true` but `NUXT_CONTENT_REPO_URL` is empty.

**Solution**: Set `NUXT_CONTENT_REPO_URL` or disable `NUXT_CONTENT_REQUIRE_EXTERNAL`.

### "Failed to fetch external content"

**Cause**: Invalid GitHub token or repository URL.

**Solutions**:

1. Verify `NUXT_CONTENT_AUTH_TOKEN` has `repo` scope
2. Check token hasn't expired
3. Confirm `NUXT_CONTENT_REPO_URL` format: `https://github.com/{owner}/{repo}`
4. Ensure repository exists and token has access

### Content not updating

**Cause**: Cached content not refreshing.

**Solution**:

```bash
pnpm run clean:content
pnpm dev
```

### Mixed local/external collections

**Cause**: Some collections should remain local.

**Solution**: Add collection names to `NUXT_CONTENT_LOCAL_COLLECTIONS`:

```bash
NUXT_CONTENT_LOCAL_COLLECTIONS=notes,logs,templates
```

## Security Best Practices

1. **Never commit tokens**: Add `.env*` to `.gitignore`
2. **Use environment-specific tokens**: Separate tokens per environment
3. **Rotate tokens regularly**: Update PATs every 90 days
4. **Minimum permissions**: Use `repo` scope only, avoid broader scopes
5. **Secret management**: Store tokens in platform secret stores (Vercel Env Vars, AWS Secrets Manager, etc.)
6. **Audit access**: Review repository access logs periodically

## Next Steps

- Configure your external content repository
- Set up environment-specific `.env` files
- Test with `pnpm dev` and verify content loads
- Deploy to staging and validate health check endpoint
- Set up monitoring alerts for `/api/health/content`
