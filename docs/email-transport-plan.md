# Email Transport Abstraction + Local Testing — Implementation Plan

> Status: **plan only** — not yet implemented. Picks up the idea of switching
> between Resend (production) and SMTP/Nodemailer (local + testing), and of
> capturing mail locally without a service provider.

## Goal

1. **Provider-agnostic sending.** Today `server/utils/email.ts` talks only to
   Resend. Refactor it behind a small `EmailTransport` interface so we can swap
   in an SMTP transport (Nodemailer) without changing any caller.
2. **No-service local testing.** In dev, send to a local SMTP capture server
   (Mailpit) and view mail in a web UI — no real provider, no real inboxes.
3. **Zero caller churn.** `sendEmail(options)` keeps its exact signature. Only
   the transport selection changes, driven by one env var.

This mirrors the existing **storage-adapter pattern**
(`server/utils/storage-adapter.ts` → `getStorageAdapter()` → `local | s3 |
cloudinary`). We copy that shape for email.

## Architecture

```
server/utils/
  email.ts                      # sendEmail() — unchanged signature, now delegates
  email-transport.ts            # EmailTransport interface + getEmailTransport() factory
  email/
    resend-adapter.ts           # wraps Resend (current behavior)
    smtp-adapter.ts             # wraps Nodemailer (Mailpit / Ethereal / Mailtrap / any SMTP)
```

### The interface (mirrors `StorageAdapter`)

```ts
// server/utils/email-transport.ts
export interface EmailTransport {
  send: (options: SendEmailOptions) => Promise<SendEmailResponse>
}

export interface EmailTransportConfig {
  provider: 'resend' | 'smtp'
  from: string
  // Resend
  resendApiKey?: string
  // SMTP (Nodemailer)
  smtpHost?: string
  smtpPort?: number
  smtpSecure?: boolean
  smtpUser?: string
  smtpPass?: string
}

export function getEmailTransport(): EmailTransport {
  const config = useRuntimeConfig()
  const provider = (config.emailProvider as EmailTransportConfig['provider']) || 'resend'

  switch (provider) {
    case 'smtp':
      return createSmtpAdapter({
        provider,
        from: config.emailFrom,
        smtpHost: config.smtpHost,
        smtpPort: Number(config.smtpPort) || 1025,
        smtpSecure: config.smtpSecure === 'true',
        smtpUser: config.smtpUser,
        smtpPass: config.smtpPass,
      })
    case 'resend':
    default:
      return createResendAdapter({
        provider: 'resend',
        from: config.emailFrom,
        resendApiKey: config.resendApiKey,
      })
  }
}
```

`SendEmailOptions` / `SendEmailResponse` stay where they are (move them into
`email-transport.ts` and re-export from `email.ts`, or keep in `email.ts` and
import — either is fine).

### `email.ts` becomes a thin delegator

```ts
// server/utils/email.ts
import { getEmailTransport } from './email-transport'

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResponse> {
  return getEmailTransport().send(options)
}
```

The current Resend logic moves verbatim into `resend-adapter.ts`. No caller of
`sendEmail` changes — Maizzle sends, magic-link auth, and the markdown campaign
admin all keep working.

### SMTP adapter (Nodemailer)

```ts
// server/utils/email/smtp-adapter.ts
import type { EmailTransport, EmailTransportConfig } from '../email-transport'
import nodemailer from 'nodemailer'

export function createSmtpAdapter(config: EmailTransportConfig): EmailTransport {
  const transporter = nodemailer.createTransport({
    host: config.smtpHost || 'localhost',
    port: config.smtpPort || 1025,
    secure: config.smtpSecure ?? false,
    // Mailpit/Ethereal need no auth; only set when provided
    auth: config.smtpUser ? { user: config.smtpUser, pass: config.smtpPass } : undefined,
  })

  return {
    async send(options) {
      try {
        const info = await transporter.sendMail({
          from: config.from,
          to: options.to,
          subject: options.subject,
          html: options.html,
          replyTo: options.replyTo,
        })
        return { success: true, messageId: info.messageId }
      }
      catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown SMTP error',
        }
      }
    },
  }
}
```

> Note: existing `email.ts` reads `process.env` directly (with an eslint
> disable). Per `CLAUDE.md` ("Use `useRuntimeConfig()` not `process.env`"), the
> new transport config should go through `runtimeConfig` like the storage
> adapter does. Wire the keys in `nuxt.config.ts` (see below).

## Local testing options

The point of the SMTP adapter is that **all four** of these are "just an SMTP
endpoint" — only host/port/auth change. Pick per environment via env vars.

| Option | What it is | How it maps to the SMTP adapter | Best for |
| --- | --- | --- | --- |
| **Mailpit** (recommended) | Maintained MailHog replacement; local SMTP + web UI | `host=localhost port=1025`, UI at `:8025`, no auth | Day-to-day local dev |
| **Ethereal** | Nodemailer's disposable cloud test accounts | `nodemailer.createTestAccount()` returns host/port/auth; preview URL per message | Quick throwaway, CI without a container |
| **Mailtrap** | Hosted sandbox inbox | Their SMTP host/port + API token as user/pass | Shared staging/CI review |
| **Resend** | Real provider | the `resend` adapter (not SMTP) | Production |

### Recommended default: Mailpit

Drop-in, fast, zero deps, same API as MailHog. Run it via Docker (or the binary):

```yaml
# docker-compose.dev.yml (or add to existing compose)
services:
  mailpit:
    image: axllent/mailpit:latest
    ports:
      - "1025:1025"   # SMTP
      - "8025:8025"   # Web UI → http://localhost:8025
```

Then dev env:

```bash
NUXT_EMAIL_PROVIDER=smtp
NUXT_SMTP_HOST=localhost
NUXT_SMTP_PORT=1025
# no NUXT_SMTP_USER / NUXT_SMTP_PASS needed for Mailpit
```

Send any email from the app → it appears at `http://localhost:8025`.

### Ethereal variant (no container)

If you don't want Docker, the SMTP adapter can self-provision an Ethereal
account when `NUXT_SMTP_HOST` is unset and provider is `smtp`:
`nodemailer.createTestAccount()` → use the returned creds → log
`nodemailer.getTestMessageUrl(info)` after each send so the preview link shows
in the dev console. (Optional enhancement; Mailpit is the simpler default.)

## Config wiring

`nuxt.config.ts` `runtimeConfig` additions (private — server only):

```ts
runtimeConfig: {
  emailProvider: process.env.NUXT_EMAIL_PROVIDER || 'resend',
  emailFrom: process.env.NUXT_EMAIL_FROM || 'Kickstart <noreply@resend.dev>',
  resendApiKey: process.env.NUXT_RESEND_API_KEY,
  smtpHost: process.env.NUXT_SMTP_HOST,
  smtpPort: process.env.NUXT_SMTP_PORT,
  smtpSecure: process.env.NUXT_SMTP_SECURE,
  smtpUser: process.env.NUXT_SMTP_USER,
  smtpPass: process.env.NUXT_SMTP_PASS,
  // ...existing keys
}
```

`.env` (non-secret) defaults for local dev point at Mailpit; real Resend key
stays in 1Password (`.env.1password`).

## Dependencies to add back

```bash
pnpm add nodemailer
pnpm add -D @types/nodemailer
```

(`nodemailer` was removed during a dependency-prune pass since nothing imported
it yet — re-add when starting Phase 2. Note it's still present transitively via
`@maizzle/framework`, but a direct import warrants a direct dependency.)

## Implementation phases

1. **Extract, no behavior change.** Create `email-transport.ts` +
   `email/resend-adapter.ts`, move current Resend logic there, make `sendEmail`
   delegate. Existing tests stay green. Provider defaults to `resend`.
2. **Add SMTP adapter.** Re-add `nodemailer`, implement `smtp-adapter.ts`, wire
   `runtimeConfig`. Add Mailpit to dev compose. Verify a magic-link email lands
   in the Mailpit UI with `NUXT_EMAIL_PROVIDER=smtp`.
3. **Docs + DX.** Add a `/guides/email-testing` content guide (mirrors the
   File Storage guide), document the env matrix, optionally add an
   `pnpm mail:dev` script that boots Mailpit.
4. **(Optional) Ethereal fallback** for contributors without Docker, and a
   `dev`-only "open last email" devtools link.

## Testing strategy

- **Unit (`test/unit/`)**: mock the transport — assert `sendEmail` calls
  `getEmailTransport().send` with the right options. Test the factory's
  provider selection (`resend` vs `smtp`, default fallback).
- **Adapter unit**: inject a fake Nodemailer transporter into `smtp-adapter`
  (accept an optional transporter for testability) and assert mapping of
  `to/subject/html/replyTo`.
- **Integration (optional)**: in CI, boot Mailpit, send, then assert via
  Mailpit's REST API (`GET http://localhost:8025/api/v1/messages`) that the
  message arrived — this is the "automated testing via API" Mailpit advertises.

## Open questions

- Per-email provider override (e.g. force `smtp` for a specific test send)?
  Could add `options.provider?` to `SendEmailOptions` and let `sendEmail`
  pick a transport per call. Defer unless needed.
- Attachments / multiple recipients — both Resend and Nodemailer support them;
  extend `SendEmailOptions` when a caller needs it.
