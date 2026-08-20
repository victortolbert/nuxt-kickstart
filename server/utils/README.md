# Utils

Server-side utilities, auto-imported in the Nitro server context.

## Key Files

| File                   | Purpose                                                |
| ---------------------- | ------------------------------------------------------ |
| `db.ts`                | libSQL/Drizzle client + shared DB helpers              |
| `session.ts`          | Better Auth session helpers for event handlers         |
| `email.ts`             | Email Transport: the single Resend client (`sendEmail`) |
| `email-templates.ts`   | HTML email template rendering (magic link, OTP, …)     |
| `upload.ts`            | `handleFileUpload()` entry point for uploads           |
| `storage-adapter.ts`   | Storage provider selection (local / s3 / cloudinary)   |
| `storage/`             | Per-provider storage adapter implementations           |

## File Uploads

```ts
import { handleFileUpload } from '#server/utils/upload'

const result = await handleFileUpload(event, {
  allowedTypes: ['image/png', 'image/jpeg', 'image/webp'],
  maxSizeBytes: 2_097_152, // 2MB
  pathPrefix: 'img/teams',
  filename: 'logo',
  imageOptions: { width: 256, height: 256, format: 'webp' },
})
// result.url → relative path (local) or full URL (cloud)
```

Provider is chosen via `NUXT_STORAGE_PROVIDER`. See `content/en/guides/file-storage.md`.

## Email

```ts
import { sendEmail } from '#server/utils/email'

await sendEmail({ to: 'user@example.com', subject: 'Hello', html: '<p>Hi</p>' })
```

`email.ts` is the only module that talks to Resend; everything else renders HTML
and calls `sendEmail`. Auth emails (magic link, OTP) follow the same path:
`server/auth.ts` renders via `email-templates.ts`, then sends via `sendEmail`.

## Learn More

- [Server Utils](https://nuxt.com/docs/guide/directory-structure/server#server-utilities)
