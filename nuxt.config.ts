import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import preflightSecurityHeaders from '@victortolbert/preflight/security-headers'
import { contentSitemapEntry } from './shared/utils/content-visibility'
import { noindexRouteRules, sitemapExcludePatterns } from './shared/utils/protected-paths'

// Minimal local shapes for Rollup's warning handler — `rollup` isn't a hoisted
// direct dependency, so we avoid importing its types.
interface RollupLog { code?: string, message: string }
type LoggingFunction = (log: RollupLog) => void
type OnWarn = (warning: RollupLog, defaultHandler: LoggingFunction) => void

const __dirname = dirname(fileURLToPath(import.meta.url))

// Light/dark favicons via `media`. Hoisted to a const so TS's excess-property
// check (which only fires on inline literals) doesn't reject `media`, and
// `rel` is `as const` so it stays the literal 'icon' — widened to `string` it
// matches no member of Unhead's link union and the array fails to assign.
const faviconLinks = [
  { rel: 'icon' as const, type: 'image/svg+xml', href: '/favicon.svg', media: '(prefers-color-scheme: light)' },
  { rel: 'icon' as const, type: 'image/svg+xml', href: '/favicon-dark.svg', media: '(prefers-color-scheme: dark)' },
]

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // SSR enabled (required for OG Image generation)

  // Enable async context for nested composables after await
  // Fixes "Nuxt instance unavailable" when using composables after useAsyncData

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/fonts', // Font optimization with fallback metrics (reduces FOUC)
    '@nuxtjs/seo',
    '@nuxt/a11y',
    '@nuxtjs/i18n',
    'nuxt-og-image',
    '@vueuse/nuxt',
    'nuxt-authorization',
    'nuxt-vitalizer', // Eliminates render-blocking CSS (FOUC prevention)
    'nuxt-fathom',
    // 'nuxt-charts', // Disabled - using @unovis/vue instead (see app/components/charts/)
    // '@nuxtjs/html-validator',
    // '@nuxt/scripts',
    // '@nuxt/test-utils',
    // '@vite-pwa/nuxt',

  ],

  $test: {
    debug: {
      hydration: true,
    },
  },
  ssr: true,

  devtools: {
    enabled: true,
    timeline: { enabled: true },

    // accessibility: { enabled: false },
  },

  app: {
    head: {
      title: 'Kickstart',
      script: [
        {
          // Blocking script to prevent theme flash (FOUC)
          // Runs before page render to apply saved theme from localStorage
          innerHTML: `(function(){try{var t=localStorage.getItem('kickstart-theme');if(t&&t!=='system'){document.documentElement.dataset.theme=t}}catch(e){}})()`,
          tagPosition: 'head',
        },
      ],
      link: faviconLinks,
      meta: [
        { name: 'description', content: 'An opinionated, content-first Nuxt 4 starter with auth, i18n, and theming built in' },
        { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#0f172a', media: '(prefers-color-scheme: dark)' },
      ],
    },
  },

  css: [
    '~/assets/css/fonts/index.css',
    '~/assets/css/main.css',
  ],

  // SEO configuration
  site: {
    url: 'https://nuxt-kickstart.example.com',
    name: 'Kickstart',
    description: 'An opinionated, content-first Nuxt 4 starter with auth, email, i18n, and theming built in',
    defaultLocale: 'en',
  },

  content: {
    // Use Node.js built-in SQLite (Node 22+) instead of better-sqlite3 native addon
    experimental: {
      sqliteConnector: 'native',
    },
    renderer: {
      anchorLinks: {
        h2: true,
        h3: true,
        h4: true,
      },
    },
    build: {
      markdown: {
        toc: {
          depth: 4,
          searchDepth: 3,
        },
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
          },
          // Reduced language list to minimize memory pressure during build
          // Add languages back as needed (each adds ~2-5MB to build memory)
          langs: [
            'astro',
            'bash',
            'blade',
            'csharp',
            'csv',
            'css',
            'diff',
            'docker',
            'gherkin',
            'handlebars',
            'html',
            'http',
            'java',
            'javascript',
            'json',
            'jsx',
            'markdown',
            'mdx',
            'mermaid',
            'postcss',
            'python',
            'razor',
            'regex',
            'ruby',
            'scss',
            'sql',
            'svelte',
            'tsx',
            'typescript',
            'vue',
            'xml',
            'yaml',
          ],
        },
      },
    },
  },
  // Nuxt UI v4 Configuration
  ui: {
    fonts: false,
  },

  runtimeConfig: {
    // Content repository configuration (server-side only)
    contentRepoUrl: '', // Set via NUXT_CONTENT_REPO_URL env var (e.g., owner/repo)
    contentAuthToken: '', // Set via NUXT_CONTENT_AUTH_TOKEN env var (GitHub PAT for private repos)
    contentBranch: 'main', // Set via NUXT_CONTENT_BRANCH env var
    contentRequireExternal: false, // Set via NUXT_CONTENT_REQUIRE_EXTERNAL env var

    // Storage configuration (file uploads)
    storageProvider: 'local', // 'local' | 's3' | 'cloudinary' - Set via NUXT_STORAGE_PROVIDER
    localStorageDir: 'public', // Public web root; Set via NUXT_LOCAL_STORAGE_DIR
    // S3 configuration (production)
    s3Bucket: '', // Set via NUXT_S3_BUCKET
    s3Region: '', // Set via NUXT_S3_REGION
    s3AccessKeyId: '', // Set via NUXT_S3_ACCESS_KEY_ID
    s3SecretAccessKey: '', // Set via NUXT_S3_SECRET_ACCESS_KEY
    s3PublicUrl: '', // Optional: Set via NUXT_S3_PUBLIC_URL (e.g., CloudFront URL)
    // Cloudinary configuration (alternative to S3)
    cloudinaryCloudName: '', // Set via NUXT_CLOUDINARY_CLOUD_NAME
    cloudinaryApiKey: '', // Set via NUXT_CLOUDINARY_API_KEY
    cloudinaryApiSecret: '', // Set via NUXT_CLOUDINARY_API_SECRET

    public: {
      siteUrl: '', // Set via NUXT_PUBLIC_SITE_URL env var (e.g., http://localhost:3000 or https://nuxt-kickstart.example.com)
      // Content local collections list (exposed for client-side edit link logic)
      contentLocalCollections: '', // Set via NUXT_PUBLIC_CONTENT_LOCAL_COLLECTIONS env var
    },
  },

  // Redirect old /admin/* paths to /app/admin/* for bookmark compatibility
  routeRules: {
    // Three security headers on `/**`, from Preflight. Spread first so a local
    // rule below can override; nothing here shares its key today.
    //
    // These used to live in `netlify.toml`, which no host this repo deploys to
    // reads any more — `routeRules` is applied by Nitro on every preset, so the
    // policy now survives a change of host. See ADR-0012 in the Preflight repo.
    ...preflightSecurityHeaders,
    // Gated and sign-in routes carry `robots: false`; the public exceptions
    // inside a gated prefix (/labs/broadsheet) are re-opened. One list, three
    // surfaces — middleware, sitemap, these rules: shared/utils/protected-paths.ts.
    ...noindexRouteRules(),
    // NOTE: ISR/SWR caching was evaluated and is intentionally NOT used here.
    // Two blockers: (1) content routes (/guides, /posts, /blocks, /tech) render
    // per-session via the visibility filter / access checks, so a shared cache
    // could leak internal/private content; (2) every response sets cookies (the
    // i18n locale cookie + the Nuxt UI dashboard sidebar-state cookie), and
    // Nitro will not cache Set-Cookie responses — so `isr` rules are inert.
    // Public pages stay SSR; rely on CDN/edge caching of static assets instead.
  },
  experimental: {
    asyncContext: true,
    // Performance: View transitions for smooth navigation
    viewTransition: true,
    // Performance: Prefetch on interaction (hover/focus) instead of viewport
    defaults: {
      nuxtLink: {
        prefetchOn: { interaction: true, visibility: false },
      },
    },
    typescriptPlugin: true, // Enable Nuxt's TypeScript plugin for better type inference and editor support
    typedPages: true, // Enable typed pages for type-safe route definitions and navigation
  },
  compatibilityDate: '2025-01-23',

  // Nitro server configuration
  nitro: {
    experimental: {
      websocket: true,
    },
    serverAssets: [
      { baseName: 'navigation', dir: resolve(__dirname, 'content/navigation') },
    ],
    prerender: {
      // Reduce memory pressure during prerendering
      concurrency: 1,
      // Disable automatic link crawling (prevents loading all pages at once)
      crawlLinks: false,
      // Only prerender essential routes
      routes: ['/'],
    },
  },

  // Vite build optimizations
  vite: {
    build: {
      sourcemap: false,
      // Increase chunk size warning limit (large dependencies like Monaco, Mermaid)
      chunkSizeWarningLimit: 1000,
    },
    // Reduce memory pressure during dev
    optimizeDeps: {
      include: [
        '@internationalized/date',
        '@unhead/schema-org/vue',
        'better-auth/client/plugins',
        'better-auth/vue',
        'mermaid',
      ],
    },
  },

  hooks: {
    // The sitemap is a surface of the visibility rules too: a document that is
    // not effectively public (internal, private, wilted, or held by the review
    // gate) gets `sitemap: false` before @nuxtjs/sitemap reads it, and a public
    // one is listed at the route that renders it. The hook sees frontmatter as
    // written, before Zod defaults, so an unset `visibility` is read from the
    // collection's JSON-schema default — the value the row will hold.
    // Nuxt Content caches parses in `.data/content/contents.sqlite`; delete it
    // to see a change to this hook.
    'content:file:afterParse': (ctx) => {
      const doc = ctx.content as { visibility?: string, path?: string, reviewed?: string | null, status?: string | null, sitemap?: unknown }
      const schema = ctx.collection.extendedSchema as { definitions?: { __SCHEMA__?: { properties?: { visibility?: { default?: string } } } } }
      const entry = contentSitemapEntry(doc, schema.definitions?.__SCHEMA__?.properties?.visibility?.default)
      doc.sitemap = entry && { ...(typeof doc.sitemap === 'object' ? doc.sitemap : {}), ...entry }
    },
    // Several transform-only plugins (@tailwindcss/vite, nuxt:vue-async-context,
    // nuxt:module-preload-polyfill, …) don't return a sourcemap, so Rollup logs a
    // SOURCEMAP_BROKEN warning per processed file. Output sourcemaps are disabled,
    // so these are pure noise. Nuxt sets its own `onwarn` on the server build
    // (overriding `vite.build.rollupOptions.onwarn`), so filter on the resolved
    // config for every environment, chaining any handler Nuxt already installed.
    'vite:extendConfig': (readonlyConfig) => {
      // The hook hands us a `Readonly<ViteConfig>`; mutating onwarn requires a
      // writable view of the build options.
      const config = readonlyConfig as { build?: { rollupOptions?: { onwarn?: OnWarn } } }
      const build = (config.build ??= {})
      const rollupOptions = (build.rollupOptions ??= {})
      const previous = rollupOptions.onwarn
      rollupOptions.onwarn = (warning, defaultHandler) => {
        if (warning.code === 'SOURCEMAP_BROKEN') {
          return
        }
        if (typeof previous === 'function') {
          previous(warning, defaultHandler)
          return
        }
        defaultHandler(warning)
      }
    },
  },

  // Dev-time axe accessibility checks (@nuxt/a11y)
  a11y: {
    axe: {
      options: {},
      runOptions: {
        rules: {
          // Nuxt UI/reka-ui accordion triggers put aria-controls/aria-expanded
          // on a <span> without a role, tripping this rule on every page.
          // Upstream issue — re-enable once fixed in Nuxt UI.
          'aria-allowed-attr': { enabled: false },
        },
      },
    },
  },

  eslint: {
    config: {
      standalone: false,
      nuxt: {
        sortConfigKeys: true,
      },
    },
  },

  fathom: {
    siteId: 'WMNAGESK',
  },

  // Fonts: Auto-optimize with fallback metrics
  // Each theme uses different fonts to match its character
  // Using local @fontsource packages to avoid corporate proxy issues
  fonts: {
    // Use ONLY the local provider — every font is served from local @fontsource
    // packages (their @font-face rules come in via assets/css/fonts/index.css),
    // so @nuxt/fonts must never reach the network. Without this it tries to
    // fetch any font-family found in CSS that isn't matched locally (e.g.
    // 'JetBrains Mono Variable', or the brand fonts in the demo pages), which
    // throws "TypeError: fetch failed" on sandboxed build networks (Netlify)
    // and aborts the build. Disabling each provider individually below is not
    // enough; this is the authoritative "offline" switch.
    provider: 'local',
    defaults: {
      weights: [400, 700],
    },
    providers: {
      bunny: false, // Disable Bunny provider to avoid connection timeouts
      fontsource: false, // Disable API calls - fonts installed locally via npm
      google: false, // Disable Google Fonts — using local @fontsource packages
      fontshare: false, // Disable Fontshare — not used, avoids proxy/cert errors
      googleicons: false, // Disable Google Material Symbols — not used, avoids proxy/cert errors
    },
    families: [
      // Fonts loaded directly from local @fontsource packages
      // No remote API calls needed
      { name: 'JetBrains Mono', provider: 'none' },
      { name: 'Roboto', provider: 'none' },
      { name: 'Barlow', provider: 'none' },
      { name: 'Lobster Two', provider: 'none' },
    ],
  },

  // Internationalization configuration
  i18n: {
    langDir: 'locales',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'es', language: 'es-ES', name: 'Español', file: 'es.json' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'kickstart-locale',
      redirectOn: 'root',
      alwaysRedirect: false,
    },
    // SEO: Generate hreflang tags for search engines
    baseUrl: 'https://nuxt-kickstart.example.com',
  },

  // Image optimization (IPX provider, images served from public/)
  image: {
    quality: 80,
    format: ['webp', 'png', 'jpg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },

  // Link checker (via @nuxtjs/seo). These routes are valid at runtime but can't
  // be verified during the build's prerender, which would otherwise flag them as
  // broken (no-error-response):
  //  - /login is a real page but noindex, so it's never prerendered
  //  - /app/** is the authenticated area; guests are redirected to /login (302)
  //    and these routes are never prerendered
  linkChecker: {
    excludeLinks: ['/login', '/app/**'],
  },

  // OG Image configuration
  // Disabled during tests (Nuxt test env runs with SSR disabled)
  ogImage: {
    // eslint-disable-next-line node/no-process-env
    enabled: !process.env.VITEST,
    defaults: {
      width: 1200,
      height: 630,
    },
  },
  // Sitemap configuration (via @nuxtjs/seo)
  sitemap: {
    // Sitemaps generated at build time only
    zeroRuntime: true,
    // Gated app routes, plus their locale forms (/es/settings), which the
    // unprefixed `robots: false` route rules alone would miss.
    exclude: sitemapExcludePatterns(),
    // Content URLs come from the collections that declare `sitemap` on their
    // schema (every one built on schemas/shared/base.ts); which documents make
    // it is decided in the `content:file:afterParse` hook above.
    discoverImages: false, // Disable image discovery for faster builds
  },

  // Vitalizer: Performance optimizations
  vitalizer: {
    // Keep stylesheets enabled to prevent FOUC. Note disableStylesheets is
    // typed as a boolean in vitalizer v3 — the old 'entry' string value is no
    // longer accepted — and it only takes effect when inline SSR styles are
    // enabled, so turning it on without them reintroduces the FOUC.
    // disableStylesheets: true,
    // Disable prefetch for dynamic imports (reduces unnecessary requests)
    disablePrefetchLinks: true,
  },
})
