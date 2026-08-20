# nuxt-kickstart

An opinionated, content-first **Nuxt starter** — Nuxt 4 + Nuxt Content v3 with passwordless auth, an admin panel, 7 themes, and i18n already wired up. Deliberately minimal: documentation, the core platform, and one example lab.

Start new projects with the foundations decided: use this repo as a GitHub template, rename the `nuxt-kickstart` / `Kickstart` / `kickstart-*` tokens to your project name, and build.

## Quick Start

### Local (pnpm)

```bash
pnpm install
pnpm run init          # one-time: rename the template tokens to your project
pnpm dev               # http://localhost:3000
```

`pnpm install` prepares Nuxt types and creates the local SQLite database, so the
app runs immediately — **no `.env` is needed to browse it**. Content, themes,
i18n, and the docs all work on a bare clone.

You need environment variables once you want to *sign in*:

```bash
cp .env.example .env
# BETTER_AUTH_SECRET (32+ chars) — generate with: openssl rand -base64 32
# RESEND_API_KEY for magic link / email OTP; NUXT_OAUTH_GITHUB_* for GitHub sign-in
```

Without them the server logs `[Better Auth]: Social provider github is missing
clientId or clientSecret` and sign-in is unavailable — everything else still runs.

### Dev Container (Docker)

Open this repo in VS Code with the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension, or in [GitHub Codespaces](https://codespaces.new). The container handles everything:

- Node 24 + pnpm (via corepack)
- Native deps for sharp
- `.env` copied from `.env.example` with auto-generated `BETTER_AUTH_SECRET`
- `pnpm install` runs automatically (which prepares Nuxt types and the local DB)

Once the container is ready:

```bash
pnpm dev
```

Visit `http://localhost:3000`. Auth features (magic link, OAuth) require additional env vars — see [Authentication Setup](#authentication-setup).

---

## Features

- 🔐 **Passwordless auth** — magic link, email OTP, phone OTP, and GitHub OAuth via Better Auth
- 🛡️ **Role-based access** — viewer, editor, and admin roles with content visibility levels
- 📝 **Markdown-first content** — docs, posts, and registry collections powered by Nuxt Content v3
- 🎨 **7 switchable themes** — Lyra, Nord, Dracula, Catppuccin, Carnival, Broadsheet, and System defaults
- 🌍 **i18n ready** — English + Spanish wired up with `prefix_except_default` routing; add locales in one config block
- 🧩 **Reusable Vue components** — landing sections, content renderers, and app shell
- ⌘ **Command palette** — fuzzy search across pages, actions, and settings
- 🌙 **Dark mode** — every theme supports light and dark with zero flash (FOUC-free)
- 🎯 **Nuxt UI v4** — latest components, Tailwind CSS v4, and OKLCH color space
- 👤 **Admin panel** — user search, role editing, session management, and ban controls
- 🐳 **Dev container ready** — one-click setup for VS Code or GitHub Codespaces
- 🧪 **Vitest + Playwright** — unit, component, and e2e smoke testing with coverage
- 📦 **TypeScript strict mode** — end-to-end type safety with auto-imports

| Category | Feature | Benefit |
|----------|---------|---------|
| **Auth** | Better Auth with 4 sign-in methods | No passwords to manage, users pick their preferred method |
| **Content** | Docs, posts, and registry collections | Markdown-first content that scales with your team |
| **Theming** | 7 CSS Zen Garden themes, OKLCH colors | Ship a polished product, let users choose their vibe |
| **i18n** | en + es with prefix routing | Reach a global audience without rearchitecting |
| **Admin** | User management with role assignment | Control access without touching the database |
| **DX** | Dev container with pnpm + Node | Clone and run — zero local setup for contributors |
| **Testing** | Vitest unit + component, Playwright E2E | Confidence on every commit across the full stack |

---

## First-Time Setup

### 1. Install & Configure

```bash
pnpm install
cp .env.example .env
```

### 2. Set Auth Secret (Required)

Edit `.env` and set a secret (minimum 32 characters):

```bash
BETTER_AUTH_SECRET=your-secret-here  # openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3000
```

### 3. Initialize Database

```bash
pnpm run db:init
```

This creates the Better Auth tables (user, session, account, verification) in `.data/auth.db`. Only needed on first setup or after deleting `.data/`.

### 4. Start Development

```bash
pnpm dev
```

Visit `http://localhost:3000`. The app runs with local SQLite (`file:.data/auth.db`) by default — no external database needed for development.

---

## Authentication Setup

Auth is handled by [Better Auth](https://www.better-auth.com/) with Drizzle ORM + Turso/libSQL.

| Method | Env Vars Needed | Notes |
|--------|----------------|-------|
| **Magic Link** | `RESEND_API_KEY`, `EMAIL_FROM_ADDRESS` | 15 min expiry |
| **Email OTP** | `RESEND_API_KEY`, `EMAIL_FROM_ADDRESS` | 6-digit code, 10 min expiry |
| **Phone OTP** | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` | SMS via Twilio |
| **GitHub OAuth** | `NUXT_OAUTH_GITHUB_CLIENT_ID`, `NUXT_OAUTH_GITHUB_CLIENT_SECRET` | Callback: `/api/auth/callback/github` |

<details>
<summary><strong>Magic Link / Email OTP (Resend)</strong></summary>

1. Create account at [resend.com](https://resend.com)
2. Generate API key at [resend.com/api-keys](https://resend.com/api-keys)
3. Add to `.env`:

```bash
RESEND_API_KEY=re_xxxx
EMAIL_FROM_ADDRESS=Kickstart <onboarding@resend.dev>
```

`onboarding@resend.dev` is Resend's zero-setup test sender (delivers only to your own Resend-account email). For production, verify a domain and use an address on it.

</details>

<details>
<summary><strong>GitHub OAuth</strong></summary>

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create new OAuth App
3. Set callback URL: `http://localhost:3000/api/auth/callback/github`
4. Add to `.env`:

```bash
NUXT_OAUTH_GITHUB_CLIENT_ID=Iv1.xxxxx
NUXT_OAUTH_GITHUB_CLIENT_SECRET=xxxxx
```

</details>

<details>
<summary><strong>Phone OTP (Twilio)</strong></summary>

1. Create account at [twilio.com](https://www.twilio.com)
2. Get Account SID, Auth Token, and a phone number with SMS capability
3. Add to `.env`:

```bash
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+1234567890
```

</details>

---

## Authorization

### Content Visibility

```yaml
---
visibility: internal  # public | internal | private
---
```

| Level | Who Can View |
|-------|-------------|
| `public` | Everyone |
| `internal` | Logged-in users |
| `private` | Author or admin only |

### User Roles

| Role | Permissions |
|------|-------------|
| `viewer` | View public/internal content (default) |
| `editor` | Create and edit content |
| `admin` | Full access, user management |

Auto-assign admin role by adding emails to `ADMIN_EMAILS` env var (comma-separated).

### Protecting Routes

```vue
<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })
</script>
```

---

## Theme System

7 themes via CSS Zen Garden approach with OKLCH color space.

| Theme | ID | Style |
|-------|----|-------|
| System | `system` | Default Nuxt UI colors |
| Lyra | `lyra` | Blue/slate, shadcn-inspired |
| Nord | `nord` | Arctic north-bluish |
| Dracula | `dracula` | Dark purple/pink |
| Catppuccin | `catppuccin` | Warm pastel |
| Carnival | `carnival` | Warm, playful |
| Broadsheet | `broadsheet` | Newsprint greys, teal signal |

Use `useTheme()` composable. Persists to `localStorage['kickstart-theme']`. Blocking script prevents FOUC.

---

## Project Structure

```
app/
  assets/css/themes/  # Theme CSS files
  components/         # Vue components (app/, content/, landing/, og-image/)
  composables/        # 15 composables (useTheme, useAppearance, etc.)
  layouts/            # Page layouts
  middleware/         # Route guards (admin, auth, guest)
  pages/              # Routes
    app/admin/        #   Admin panel (user management)
    labs/             #   Broadsheet layout reference
  utils/              # Client utilities (tech-config, etc.)
content/              # Markdown content (docs, posts, registries, i18n)
i18n/locales/         # en, es
server/
  api/                # API routes (admin/, health/, navigation, auth)
  db/                 # Drizzle schema (drizzle-kit has generated no migrations yet)
  routes/
    api/auth/         # Better Auth handler
  utils/              # Server utilities (db, email, storage adapter)
shared/
  types/              # Shared TypeScript types
  utils/              # Abilities, case utils, schemas
test/
  unit/               # Unit tests (vitest)
  nuxt/               # Component tests (vitest + nuxt env)
  e2e/                # Playwright smoke tests
```

## Content Architecture

| Folder | Purpose |
|--------|---------|
| `content/en/guides/` | App documentation, how-tos (the in-app docs) |
| `content/en/posts/` | Posts (blog pattern) |
| `content/tech/` | Tech stack registry (slug-reference pattern + TechBadge) |
| `content/en/apps/`, `content/en/blocks/` | App blocks showcase (blocks grouped by parent app) |
| `content/_meta/` | Landing/system pages |
| `content/navigation/` | Sidebar navigation groups (YAML, served by `/api/navigation`) |

Collection schemas live in `schemas/`, grouped by area, registered in `schemas/index.ts`. All collections share the base conventions: `status` (seed → sprout → evergreen → wilted) and `visibility` (private → internal → public).

---

## Commands

```bash
pnpm dev              # Dev server
pnpm run preview      # Preview the production build
pnpm run build        # Production build
pnpm run test         # All tests (vitest — watch mode)
pnpm exec vitest run  # All tests, one shot
pnpm run test:unit    # Unit tests only (watch)
pnpm run test:nuxt    # Component tests (watch)
pnpm run test:coverage # Coverage report
pnpm run test:e2e     # Playwright E2E tests
pnpm run lint:fix     # Lint + auto-fix
pnpm run lint:md:fix  # Markdown lint + auto-fix
pnpm run typecheck    # TypeScript checks
pnpm run init         # One-time template rename
pnpm run changelog    # Preview release notes
pnpm run up           # Interactive major-version dependency upgrade (taze)
```

First `test:e2e` run needs the browser binary: `pnpm exec playwright install chromium`.

Run `pnpm nuxi prepare` after clone to generate `.nuxt/` types.

## Deployment

Update OAuth callback URLs to your production domain. Set `BETTER_AUTH_URL` to your production URL.

For production databases, configure `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` (local SQLite is dev-only).

### Vercel

Import from GitHub, add environment variables, deploy.

### Netlify

Import from GitHub, build command: `pnpm run build`, add environment variables, deploy.

### Docker

A production `Dockerfile` is included (multi-stage build → Nitro `node-server` output on Node 24, listening on port 3000).

```bash
docker build -t kickstart .
docker run -p 3000:3000 --env-file .env kickstart
```

Then visit `http://localhost:3000`. With no database configured the container boots with an **ephemeral local SQLite** DB (tables auto-created on first request) — handy for a quick try, but it resets on restart. For production, configure Turso (below).

**Required env vars** (pass with `--env-file .env` or individual `-e` flags):

| Variable | Purpose |
| --- | --- |
| `BETTER_AUTH_SECRET` | Session signing key (32+ chars — `openssl rand -base64 32`) |
| `BETTER_AUTH_URL` / `NUXT_PUBLIC_SITE_URL` | Your public URL (auth callbacks, absolute links) |
| `TURSO_DATABASE_URL` **and** `TURSO_AUTH_TOKEN` | Persistent database — **both** are required to use Turso; if either is missing the app falls back to the ephemeral local SQLite |
| `ADMIN_EMAILS` | Comma-separated emails auto-assigned the admin role |

Optional, per feature: `RESEND_API_KEY` (magic link / email OTP), `NUXT_OAUTH_GITHUB_CLIENT_ID` + `NUXT_OAUTH_GITHUB_CLIENT_SECRET` (GitHub sign-in), `TWILIO_*` (phone OTP). See `.env.example` for the full list.

> **Build memory:** the production build needs roughly an 8 GB Node heap. If your Docker builder has less RAM (Docker Desktop defaults to ~8 GB), the build can be OOM-killed — either raise Docker's memory (Settings → Resources), or lower the heap with `--build-arg NODE_BUILD_HEAP_MB=7168`.

<!-- -->

> **Database schema:** the image does not run `db:init`. The local fallback auto-creates its tables, but a Turso database must be provisioned separately before first boot — run `TURSO_DATABASE_URL=… TURSO_AUTH_TOKEN=… pnpm run db:init` from your machine (both variables in the same command; `scripts/init-better-auth-db.ts` falls back to local SQLite without them). Column-adding migrations are the `scripts/add-*-columns.ts` scripts, run the same way.

<!-- -->

> **File uploads:** the default `local` storage provider writes to the container filesystem and won't persist across restarts. For production set `NUXT_STORAGE_PROVIDER=s3` (or `cloudinary`) with the matching credentials — see the [File Storage guide](/guides/file-storage).

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Auth not working | Set `BETTER_AUTH_SECRET` in `.env` (32+ chars) |
| OAuth redirect errors | Verify callback URLs match exactly |
| TypeScript errors after clone | Run `pnpm nuxi prepare` |
| Magic link not sending | Check `RESEND_API_KEY` is set |
| sharp install fails | Use the dev container, or install `libvips-dev` |

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for local setup, the pre-PR checks, and conventions. [CLAUDE.md](./CLAUDE.md) and [AGENTS.md](./AGENTS.md) hold the full code-style and architecture details.

## License

MIT
