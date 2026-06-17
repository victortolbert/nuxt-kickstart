---
title: Email Campaigns
description: 'Compose, send, and track email campaigns with drafts, recipient lists, and open/click analytics — powered by Resend'
tags:
  - email
  - resend
  - campaigns
  - newsletter
status: sprout
visibility: public
category: content
difficulty: intermediate
order: 32
created: '2026-06-13'
---

Kickstart ships a small but real email-campaign subsystem: compose Markdown emails, send them through [Resend](https://resend.com), manage recipient lists, and track opens and clicks. It reuses the same Resend integration that powers passwordless auth (magic links and OTP), so once email works for sign-in, campaigns work too.

It lives in the admin area under **Settings → Email** (`/app/admin/email/*`) and is gated by the `admin` role — sign in with an account listed in `ADMIN_EMAILS` to see it.

::note
This is an honest starting point, not a full marketing platform. It's well-suited to internal newsletters and announcements to known audiences. See [Limitations & extending it](#limitations--extending-it) before relying on it for high-volume or transactional mail.
::

## Setup

Sending needs two environment variables:

```bash
# .env
RESEND_API_KEY="re_..."                          # from resend.com/api-keys
EMAIL_FROM_ADDRESS="Kickstart <noreply@yourdomain.com>"  # a verified Resend sender
```

The from-address domain must be verified in Resend. Without `RESEND_API_KEY`, sends fail (auth emails included) — in development you can still compose and preview, you just can't send.

## The admin pages

| Page | Route | What it does |
| --- | --- | --- |
| **Compose** | `/app/admin/email/compose` | Markdown editor with live HTML preview, templates, recipient selection, auto-save, send, and schedule |
| **Drafts** | `/app/admin/email/drafts` | All emails by lifecycle — Draft, Scheduled, Sent — click any to re-open in the composer |
| **Lists** | `/app/admin/email/lists` | Recipient lists; open one to add, bulk-import, or remove contacts |
| **Analytics** | `/app/admin/email/analytics` | Per-campaign open/click rates; drill into one for per-recipient detail |

### Composing

The composer (`/app/admin/email/compose`) is the heart of it:

- **Markdown body** with a live preview (debounced) showing the rendered, email-styled HTML.
- **Templates** — `newsletter`, `announcement`, or `personal` — change the wrapper styling.
- **Recipients** — either type addresses manually or pick a saved list.
- **Auto-save** every 30 seconds to a draft, plus a manual save.
- **Send now** (with a confirmation dialog) or **Schedule** for a future time.
- Pre-fill via query params: `?subject=...&body=...` or `?draft=<id>`.

### Recipient lists

Lists are Markdown files in `content/email-lists/`. Each is a small frontmatter document:

```md
---
name: Team Members
contacts:
  - email: alex@example.com
    name: Alex
  - email: alice@example.com
    name: Alice
---
```

A sample `team.md` ships in the repo. Open a list in the admin UI to add a single contact, bulk-import addresses (one per line), or remove contacts — edits are validated (RFC 5322), de-duplicated, and written back to the file via `PUT /api/email/lists/[slug]`.

## How sending works

When you send, the body travels through a short pipeline before Resend delivers it:

1. **Markdown → email HTML** (`server/utils/markdown-to-email.ts`) converts GitHub-flavored Markdown and applies **inline CSS** to every element — email clients ignore `<style>` blocks, so styles must be inline.
2. **Link rewriting** turns each link into a tracked redirect through `/api/email/track/click`, so clicks are counted before the user lands on the real URL.
3. **Template wrap** (`server/utils/email-templates.ts`) adds the footer (with an unsubscribe link) and embeds a 1×1 **open-tracking pixel** that pings `/api/email/track/open`.
4. **Unsubscribe filtering** removes any address that previously unsubscribed before handing the batch to Resend (`server/utils/email.ts`).

Unsubscribes are handled by `GET /api/email/unsubscribe` (the token is the base64-encoded address) and stored in `content/email-unsubscribes/`.

## Analytics

The Analytics dashboard computes open rate, click rate, unique opens, and total clicks per campaign, and lets you drill into a single send to see which recipients opened and which links were clicked.

::warning
**Engagement only — not delivery.** Analytics are derived entirely from the open pixel and click redirects (stored in `content/email-analytics/`). There is no Resend **delivery/bounce/complaint** data — those would require wiring up [Resend webhooks](https://resend.com/docs/dashboard/webhooks/introduction), which this starter does not do yet.
::

## Scheduling

Scheduling a draft sets `status: scheduled` and a `scheduledAt` timestamp. Due drafts are sent by `POST /api/email/process-scheduled` — but **nothing calls that endpoint automatically.** Wire it to a scheduler, e.g. a [Vercel Cron](https://vercel.com/docs/cron-jobs):

```json
// vercel.json
{ "crons": [{ "path": "/api/email/process-scheduled", "schedule": "*/5 * * * *" }] }
```

Until you do, scheduled emails simply wait.

## Architecture

Everything is **filesystem-backed Nuxt Content**, not a database:

- `content/email-drafts/`, `content/email-lists/`, `content/email-analytics/`, `content/email-unsubscribes/`
- Schemas live in `schemas/systems/email/` and are registered in `schemas/index.ts`.

::warning
**Persistence on serverless.** Drafts, analytics, and list edits are written to the content directory at runtime. On a writable host (a VM or container with a volume) these persist; on ephemeral serverless filesystems (e.g. Vercel's `/tmp`) **they are lost on redeploy.** For durable campaign state on serverless, move this content to a database or object store.
::

## Maizzle templates (designed & transactional emails)

The Markdown composer above is for newsletters and announcements. For **designed or transactional** emails (welcome, verification, receipts) Kickstart also ships [Maizzle](https://maizzle.com) — author emails as Vue SFCs with Tailwind, compiled to inlined, client-safe HTML. The two systems are complementary and share the same Resend transport.

Templates live in `app/emails/*.vue` (see `app/emails/README.md`) and use Maizzle's auto-imported components:

```vue
<script setup>
// defineConfig() returns the merged config (defaults + data passed at send time)
const config = defineConfig({ subject: 'Welcome aboard!' })
</script>

<template>
  <Layout>
    <Container class="max-w-xl">
      <Heading>Hello, {{ config.user || 'there' }}!</Heading>
    </Container>
  </Layout>
</template>
```

**Server API** (admin-only):

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/email/maizzle` | List templates |
| GET | `/api/email/maizzle/{name}` | Render to HTML (preview / iframe) |
| POST | `/api/email/maizzle/send` | Render + send via Resend |

**Personalization** — read runtime values from the object returned by `defineConfig` (`{{ config.user }}`, never bare `{{ user }}`), and pass per-recipient data when sending. Each recipient is rendered individually:

```json
POST /api/email/maizzle/send
{
  "template": "welcome",
  "recipients": [
    { "email": "alex@example.com", "data": { "user": "Alex" } },
    { "email": "sam@example.com",  "data": { "user": "Sam" } }
  ]
}
```

`recipients` may also be plain strings; `subject` falls back to the template's `defineConfig` subject. Rendering lives in `server/utils/maizzle.ts`.

::note
Maizzle's `render()` reads template sources via the working directory (fine in dev). For serverless production, ship `app/emails/` or read the build output in `server/assets/emails`.
::

## Limitations & extending it

This subsystem is intentionally a foundation. Known gaps, roughly in priority order:

- **Create-list UI is missing** — the "Create New List" button links to a `/lists/new` route that doesn't exist yet. For now, add a list by creating a file in `content/email-lists/`.
- **No delivery tracking** — add Resend webhooks to capture bounces/complaints/delivery.
- **Scheduling needs an external trigger** — see [Scheduling](#scheduling).
- **No segmentation or personalization in the Markdown composer** — recipients are manual or static lists, with no audience querying. (For per-recipient `{{ config.* }}` data, use the [Maizzle templates](#maizzle-templates-designed--transactional-emails) above.)
- **Filesystem storage** — fine for hundreds of sends to thousands of contacts; not for high volume or concurrent editors. Swap to a database for scale.
- **No rate limiting** — large sends hit the Resend API in a loop; add throttling/batching for big lists.

If you don't need email at all, it's self-contained: delete `app/pages/app/admin/email/`, `server/api/email/`, the `schemas/systems/email/` collections, and the `content/email-*` folders.
