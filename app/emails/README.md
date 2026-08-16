# Email templates (Maizzle)

Vue email templates compiled to inlined, email-client-safe HTML with
[Maizzle](https://maizzle.com) (Tailwind for email). **Each `.vue` file here is
one email** (e.g. `welcome.vue`).

## Authoring

```vue
<script setup>
// defineConfig() returns the merged config (these defaults + any data passed at
// send time). Read runtime values off `config`.
const config = defineConfig({
  subject: 'Welcome aboard!',
  preheader: 'Thanks for joining.',
})
</script>

<template>
  <Layout>
    <Container class="max-w-xl">
      <Heading>Hello, {{ config.user || 'there' }}!</Heading>
      <Button href="https://example.com">Verify</Button>
    </Container>
  </Layout>
</template>
```

- Maizzle components (`<Layout>`, `<Container>`, `<Heading>`, `<Text>`,
  `<Button>`, …) are **auto-imported** — no manual imports needed.
- Use Tailwind classes (`class="max-w-xl"`); Maizzle inlines + purges the CSS.
- **Component names are PascalCase here.** This folder overrides the app-wide
  kebab-case ESLint rule, and block order is `<script>` then `<template>`
  (see `eslint.config.mjs`).
- This folder has its own `tsconfig.json`.

## Personalization

Bare `{{ user }}` does **not** resolve. Read runtime values from the object
returned by `defineConfig`, with a fallback:

```vue
<Heading>Hello, {{ config.user || 'there' }}!</Heading>
```

Values come from the `data` passed to `render()` / the send API. Fields the
template hardcodes in `defineConfig` win over passed data, so leave
personalized fields (like `user`) out of the defaults.

## Preview & send — Server API (admin only)

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/email/maizzle` | List available templates |
| GET | `/api/email/maizzle/{name}` | Render a template to HTML (preview / iframe `src`) |
| POST | `/api/email/maizzle/send` | Render and send via Resend |

Send with per-recipient personalization (each recipient renders individually):

```json
POST /api/email/maizzle/send
{
  "template": "welcome",
  "recipients": [
    { "email": "alex@example.com", "data": { "user": "Alex" } },
    { "email": "sam@example.com",  "data": { "user": "Sam" } }
  ],
  "subject": "Welcome!"
}
```

`recipients` may also be plain email strings. `subject` falls back to the
template's `defineConfig` subject. The `recipient` email is always available in
the template data. Rendering lives in `server/utils/maizzle.ts` (via
`@maizzle/framework`'s `render()`).

## Dev preview & build

- `pnpm dev` runs Maizzle's own preview server on **<http://localhost:4321>**
  (provided by `@maizzle/nuxt`).
- `pnpm run build` compiles templates to `server/assets/emails/`.
- Runtime `render()` reads template sources via the working directory (works in
  dev). For serverless production, ship `app/emails/` sources or read the build
  output in `server/assets/emails`.

> Maizzle's content glob is restricted to `*.vue` in `nuxt.config.ts` so this
> README isn't compiled as an email. Add `*.md` there if you author Markdown
> emails.
