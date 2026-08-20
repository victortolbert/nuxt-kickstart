import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import preflightSecurityHeaders from '@victortolbert/preflight/security-headers'

// Minimal local shapes for Rollup's warning handler — `rollup` isn't a hoisted
// direct dependency, so we avoid importing its types.
interface RollupLog { code?: string, message: string }
type LoggingFunction = (log: RollupLog) => void
type OnWarn = (warning: RollupLog, defaultHandler: LoggingFunction) => void

const __dirname = dirname(fileURLToPath(import.meta.url))

// Light/dark favicons via `media`. Hoisted to a const so TS's excess-property
// check (which only fires on inline literals) doesn't reject `media` — it's
// valid HTML for responsive icons but omitted from Unhead's icon-link type.
const faviconLinks = [
  { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg', media: '(prefers-color-scheme: light)' },
  { rel: 'icon', type: 'image/svg+xml', href: '/favicon-dark.svg', media: '(prefers-color-scheme: dark)' },
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
    '@maizzle/nuxt',
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
      // @ts-expect-error Unhead's icon-link type omits `media`, which is valid HTML for responsive (light/dark) favicons.
      link: faviconLinks,
      meta: [
        { name: 'description', content: 'An opinionated, content-first Nuxt 4 starter with auth, email, i18n, and theming built in' },
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
    scoreboardWebsocketEnabled: true, // Nitro experimental WebSocket is enabled

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

    // LLM provider for AI insights (server-side only). Works inside and outside
    // the enterprise: 'anthropic' (direct) or 'proxy'.
    llmProvider: 'anthropic', // 'anthropic' | 'proxy' — Set via NUXT_LLM_PROVIDER
    llmModel: 'claude-sonnet-4-6', // Set via NUXT_LLM_MODEL
    anthropicApiKey: '', // Set via NUXT_ANTHROPIC_API_KEY (provider=anthropic)
    proxyBaseUrl: '', // Set via NUXT_LLM_PROXY_BASE_URL (provider=proxy)
    proxyApiKey: '', // Set via NUXT_LLM_PROXY_API_KEY (provider=proxy)

    // Brand Mention multi-provider coverage (server-only). All OPTIONAL — each
    // provider is skipped when its key is blank. The Claude row reuses the
    // anthropic/proxy config above.
    openaiApiKey: '', // Set via NUXT_OPENAI_API_KEY (ChatGPT)
    openaiModel: 'gpt-4o-mini', // Set via NUXT_OPENAI_MODEL
    googleApiKey: '', // Set via NUXT_GOOGLE_API_KEY (Gemini)
    googleModel: 'gemini-flash-latest', // Set via NUXT_GOOGLE_MODEL (alias tracks current flash; 1.5 is retired)
    xaiApiKey: '', // Set via NUXT_XAI_API_KEY (Grok)
    xaiModel: 'grok-2-latest', // Set via NUXT_XAI_MODEL

    // Headless-render JS detection (Playwright, server-only). Falls back to the
    // static heuristic when off or when chromium is unavailable (serverless/CI).
    llmRenderEnabled: true, // Set via NUXT_LLM_RENDER_ENABLED ('false' to disable)
    llmRenderTimeoutMs: 15000, // Set via NUXT_LLM_RENDER_TIMEOUT_MS

    public: {
      googleMapsKey: '', // Set via NUXT_PUBLIC_GOOGLE_MAPS_KEY env var
      siteUrl: '', // Set via NUXT_PUBLIC_SITE_URL env var (e.g., http://localhost:3000 or https://nuxt-kickstart.example.com)
      // Content local collections list (exposed for client-side edit link logic)
      contentLocalCollections: '', // Set via NUXT_PUBLIC_CONTENT_LOCAL_COLLECTIONS env var
      scoreboard: {
        transport: 'auto', // 'auto' | 'websocket' | 'sse' | 'polling'
        pollInterval: 5000, // ms — client polling interval
        ssePollInterval: 2000, // ms — SSE endpoint internal DB polling (serverless fallback)
      },
    },
  },

  // Transpile @fawmi/vue-google-maps for SSR compatibility
  build: {
    transpile: ['@fawmi/vue-google-maps'],
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
    '/admin/email/**': { redirect: '/app/admin/email/**' },
    '/admin/trash': { redirect: '/app/admin/trash' },
    '/admin/content/**': { redirect: '/app/admin/content/**' },
    // Labs relocation (apps moved out of /examples) — keep old links working.
    '/examples/scoreboard-mvp': { redirect: '/labs/scoreboard' },
    '/examples/scoreboard-mvp/**': { redirect: '/labs/scoreboard/**' },
    '/examples/podcast-app': { redirect: '/labs/podcasts' },
    '/examples/podcast-app/**': { redirect: '/labs/podcasts/**' },
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
        '@fullcalendar/daygrid',
        '@fullcalendar/interaction',
        '@fullcalendar/list',
        '@fullcalendar/timegrid',
        '@fullcalendar/vue3',
        '@internationalized/date',
        '@unhead/schema-org/vue',
        '@unovis/vue',
        'better-auth/client/plugins',
        'better-auth/vue',
        'mermaid',
        'slot-text',
        'slot-text/vue',
        'vue3-emoji-picker',
      ],
    },
  },

  hooks: {
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

  // Only treat .vue files as email templates (so app/emails/README.md isn't
  // compiled as an email). Add '*.md' here if you author Markdown emails.
  maizzle: {
    content: ['app/emails/**/*.vue'],
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
    // Automatically exclude pages with noindex robots meta
    // Non-public content (private/internal) gets noindex via server plugin
    discoverImages: false, // Disable image discovery for faster builds
  },

  // Vitalizer: Performance optimizations
  vitalizer: {
    // Keep stylesheets enabled to prevent FOUC
    // disableStylesheets: 'entry', // Disabled - causes FOUC without inlineSSRStyles
    // Disable prefetch for dynamic imports (reduces unnecessary requests)
    disablePrefetchLinks: true,
  },
})
