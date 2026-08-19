# Utils

Server-side utilities, auto-imported in the Nitro server context.

## Key Files

| File                   | Purpose                                                |
| ---------------------- | ------------------------------------------------------ |
| `db.ts`                | libSQL/Drizzle client + shared DB helpers              |
| `content-store.ts`     | Content Store: editable collections, paths, frontmatter serialization, trash manifest |
| `scoreboard-auth.ts`   | Scoreboard Admin PIN guard (`requireScoreboardAdmin`)  |
| `session.ts`          | Better Auth session helpers for event handlers         |
| `email.ts`             | Email Transport: the single Resend client (`sendEmail`) |
| `email-templates.ts`   | HTML email template rendering (magic link, OTP, …)     |
| `markdown-to-email.ts` | Markdown → inline-CSS email HTML                       |
| `maizzle.ts`           | Renders the `app/emails/*.vue` Maizzle templates (`renderMaizzleTemplate`) |
| `unsubscribe.ts`       | Email unsubscribe list management                      |
| `upload.ts`            | `handleFileUpload()` entry point for uploads           |
| `storage-adapter.ts`   | Storage provider selection (local / s3 / cloudinary)   |
| `storage/`             | Per-provider storage adapter implementations           |
| `scoreboard-db.ts`     | Scoreboard persistence                                  |
| `scoreboard-events.ts` | Scoreboard event bus feeding the `/_ws` stream          |
| `style-dictionary.ts`  | Server-side Style Dictionary token transforms          |
| `token-generators/`    | Token Generators: one module per export-format family + shared helpers + `transformTokens` registry (the `/api/tokens/transform` custom path) |
| `llm-optimizer/`       | LLM Visibility Optimizer server modules (fetching, scoring, providers) |

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
