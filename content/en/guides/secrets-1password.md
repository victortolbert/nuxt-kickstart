---
title: Secrets with 1Password
description: Keep secrets out of plaintext .env files by resolving op:// references at runtime
tags:
  - secrets
  - security
  - 1password
  - env
status: evergreen
visibility: internal
category: other
difficulty: intermediate
order: 7
created: '2026-06-11'
---

Keep secrets out of plaintext `.env` files by resolving 1Password references at runtime with `op run`.

## Why

Plaintext `.env` files are a common exfiltration target — any tool, editor extension, or AI agent with read access to the working directory can slurp them. The goal: **never have live secrets on disk in this repo**, even for local dev.

Solution: store secrets in 1Password; put `op://...` references in `.env.1password`; wrap the dev server in `op run`, which resolves references into environment variables **in-memory only**.

## Prerequisites

```bash
brew install 1password-cli
op signin                    # one-time device setup
op vault list                # confirm vault name
```

For Touch ID unlock (no password prompts), enable in the 1Password desktop app:
**Settings → Developer → Integrate with 1Password CLI**

## Reference syntax

```
op://<vault>/<item>/[section/]<field>
```

Examples:

- `op://Kickstart Local/kickstart-turso/credential` — item's default credential/password field
- `op://Kickstart Local/kickstart-github-oauth/username` — custom field by label
- `op://Kickstart Local/kickstart-twilio/API/account-sid` — field inside a named section

Field names are the lowercased labels visible in the 1Password UI. Use `op item get <item> --format=json` to inspect exact field IDs if a reference fails to resolve.

## Workflow

### 1. Create items in 1Password

Each secret becomes an item in the `Kickstart Local` vault. Typical item types:

- **API Credential** — for tokens (Turso, Resend, OG image secret, Twilio auth token)
- **Login** — for OAuth client ID + secret pairs (GitHub, Google)
- **Database** — for Turso URL + auth token bundle
- **Password** — for generated secrets (session password, Better Auth secret)

### 2. Populate `.env.1password`

The template lives at the project root. Values look like:

```bash
BETTER_AUTH_SECRET=op://Kickstart Local/kickstart-better-auth/password
TURSO_AUTH_TOKEN=op://Kickstart Local/kickstart-turso/credential
NUXT_OAUTH_GITHUB_CLIENT_SECRET=op://Kickstart Local/kickstart-github-oauth/credential
```

This file is **safe to commit** — it contains no plaintext secrets. It's whitelisted in `.gitignore` via `!.env.1password`.

### 3. Run commands under `op run`

Wrapper scripts in `package.json`:

```bash
pnpm dev:op      # op run --env-file=.env.1password -- nuxt dev --no-fork
pnpm build:op    # op run --env-file=.env.1password -- (8GB heap) nuxt build
```

For one-off scripts:

```bash
op run --env-file=.env.1password -- pnpm run db:migrate
```

First run prompts for biometric unlock; subsequent runs within the unlock window are silent.

### 4. Verify resolution

`op run` masks any stdout that matches a resolved secret, so `printenv TOKEN` will show `<concealed by 1Password>` — that's success, not failure. To confirm non-destructively, check the length or classify each var as resolved/unresolved/missing:

```bash
op run --env-file=.env.1password -- sh -c '
for k in TURSO_AUTH_TOKEN BETTER_AUTH_SECRET RESEND_API_KEY; do
  val=$(eval echo "\$$k")
  case "$val" in
    "") echo "MISSING  $k" ;;
    op://*) echo "UNRESOLVED  $k" ;;
    *) echo "OK       $k (${#val} chars)" ;;
  esac
done
'
```

To see the raw value for one-off debugging only:

```bash
op run --no-masking --env-file=.env.1password -- printenv TURSO_AUTH_TOKEN
```

Keep masking on (the default) for day-to-day dev — if a tool inside `op run` accidentally logs a secret, 1Password will redact it from stdout/stderr.

## How `op run` actually works

1. Reads `.env.1password` line by line
2. For each `KEY=op://...` line, calls the 1Password API to resolve the reference
3. Forks the child process with resolved values in its environment
4. The resolved values exist **only** in the child process memory — never written to disk, never in shell history, never in the parent shell

When the child exits, the secrets are gone.

## Caveats

**Child processes inherit, siblings don't.** Anything spawned *inside* the `op run` process tree gets the resolved env. Anything spawned in a separate terminal doesn't. Keep `op run --` as the outermost wrapper.

**dotenv re-reads can bypass resolution.** Tools that call `dotenv.config()` themselves will read `.env.1password` from disk and see the `op://` strings as literal values. Nuxt/Nitro reads `.env` (not `.env.1password`) at startup, so `op run` wrapping works cleanly — the resolved env vars take precedence over anything dotenv would load. If a tool insists on reading its own env file, point it elsewhere or pre-resolve.

**AI agents with shell access can still call `op read` themselves.** `op run` protects against *passive* exfiltration (file reads, editor indexes, backup tools) but not against an agent that actively invokes the 1Password CLI. Real guardrails:

- Use a 1Password **service account** scoped to only the `Kickstart Local` vault
- Don't grant agents unrestricted shell in sessions where production secrets are loaded
- Audit `op` usage via 1Password activity log

**Secret rotation is not automatic.** Rotating a value in 1Password updates resolution on the next `op run` invocation — but any long-running process already holding the old value keeps it until restart.

## CI / production

Different strategy per environment:

| Environment | Mechanism |
| --- | --- |
| Local dev | `op run` + biometric unlock |
| GitHub Actions | `1password/load-secrets-action@v2` with a **service account token** stored as `OP_SERVICE_ACCOUNT_TOKEN` secret |
| Vercel / Netlify | Sync secrets into the platform's env var store (manually, or via 1Password Connect) — **don't** run `op run` in the edge runtime |
| Production runtime | Platform env vars, or 1Password Secrets Automation / Connect for runtime fetching |

Service account setup:

```bash
# Create a service account scoped to the vault (web UI):
# 1Password → Developer → Service Accounts → Create
# Save the token. Export as OP_SERVICE_ACCOUNT_TOKEN in CI.

# Verify locally:
OP_SERVICE_ACCOUNT_TOKEN=ops_... op run --env-file=.env.1password -- printenv
```

## Initial migration (completed 2026-04-09)

- [x] Install `1password-cli` and sign in
- [x] Create the `Kickstart Local` vault
- [x] Create a 1Password item for each secret
- [x] Rotate all previously-plaintext secrets (old values burned)
- [x] Populate `.env.1password` with references and verify resolution
- [x] Switch dev workflow to `pnpm dev:op`
- [x] Trim `.env` to non-secret public config only
- [ ] Set up CI service account + `1password/load-secrets-action` (deferred)

## Files in this project

- `.env.1password` — reference template (committed)
- `.env` — plaintext fallback, gitignored, **should contain no live secrets**
- `package.json` — `dev:op` and `build:op` scripts
- `.gitignore` — whitelists `.env.1password`

## Further reading

- 1Password CLI docs: <https://developer.1password.com/docs/cli>
- `op run` reference: <https://developer.1password.com/docs/cli/reference/commands/run>
- Secret references: <https://developer.1password.com/docs/cli/secret-reference-syntax>
- GitHub Action: <https://github.com/1Password/load-secrets-action>
- Service accounts: <https://developer.1password.com/docs/service-accounts>
