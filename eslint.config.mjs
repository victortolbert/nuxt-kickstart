import antfu from '@antfu/eslint-config'
import * as figmaPlugin from '@figma/eslint-plugin-figma-plugins'
import pluginCasePolice from 'eslint-plugin-case-police'

import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu(
    {
      type: 'app',
      formatters: {
        /**
         * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
         * By default uses Prettier
         */
        css: false,
        /**
         * Format HTML files
         * By default uses Prettier
         */
        html: true,
        /**
         * Format Markdown files
         * Supports Prettier and dprint
         * By default uses Prettier
         */
        markdown: false,
      },
      vue: {
        a11y: true,
        overrides: {
          'vue/custom-event-name-casing': 'off',
          'vue/one-component-per-file': 'off',
          'vue/no-irregular-whitespace': 'off',
          'vue/no-required-prop-with-default': 'off',
          'vue/no-side-effects-in-computed-properties': 'off',
          'vue/no-unused-refs': 'off',
          'vue/no-template-shadow': 'off',
          'vue/block-order': ['error', {
            order: ['template', 'script', 'style'],
          }],
          'vue/max-attributes-per-line': ['error', {
            singleline: {
              max: 2,
            },
            multiline: {
              max: 1,
            },
          }],
          // Toggle individual entries in this array to allow PascalCase for
          // specific framework components in templates. Anything listed here
          // is exempt from the kebab-case rule below.
          // Entries can be exact names (e.g. 'NuxtPage') or regex strings
          // wrapped in slashes (e.g. '/^U[A-Z]/' to match all Nuxt UI
          // components like UButton, UCard, UIcon).
          'vue/component-name-in-template-casing': ['error', 'kebab-case', {
            registeredComponentsOnly: false,
            ignores: [
              // Nuxt built-ins
              // 'NuxtPage',
              // 'NuxtLayout',
              // 'NuxtLink',
              // 'NuxtLoadingIndicator',
              // 'NuxtWelcome',
              // 'NuxtErrorBoundary',
              // 'NuxtIsland',
              // 'NuxtRouteAnnouncer',
              // Vue built-ins
              // 'ClientOnly',
              // 'Teleport',
              // 'Transition',
              // 'TransitionGroup',
              // 'KeepAlive',
              // 'Suspense',
              // 'Component',
              // Nuxt UI components (UButton, UCard, UIcon, UBadge, ...).
              // Uncomment to keep them as PascalCase in templates:
              // '/^U[A-Z]/',
            ],
          }],
          // Force explicit closing tags on components so snippets work in
          // browsers via CDN (native HTML doesn't honor self-closing on
          // custom elements).
          'vue/html-self-closing': ['error', {
            html: {
              void: 'never',
              normal: 'always',
              component: 'never',
            },
            svg: 'always',
            math: 'always',
          }],
          // Accept either the `for`/`id` pair OR nesting — the stricter
          // default (both) rejects valid patterns with wrapped form controls.
          'vue-a11y/label-has-for': ['error', {
            required: { some: ['nesting', 'id'] },
          }],
          'vue-a11y/no-autofocus': 'off',
          'vue-a11y/media-has-caption': 'off',
        },
      },
      pnpm: false,
      typescript: true,
      stylistic: {
        indent: 2,
        semi: false,
        quotes: 'single',
      },
      ignores: [
        '.pnpm-store/**',
        '**/migrations/*',
        '**/build/**',
        '**/public/**',
        '**/dist/**',
        '**/.agent/**',
        '**/.agents/**',
        '**/.claude/**',
        '**/.clawdbot/**',
        '**/.cline/**',
        '**/.codex/**',
        '**/.commandcode/**',
        '**/.cursor/**',
        '**/.factory/**',
        '**/.gemini/**',
        '**/.github/**',
        '**/.nuxt/**',
        '**/.opencode/**',
        '**/.output/**',
        '**/.trae/**',
        '**/.vscode/**',
        '**/.windsurf/**',
        'content/*',
        '**/CLAUDE.md',
        '**/AGENTS.md',
        'README.md',
        'lib/**',
        'scripts/**',
        // Ignore all markdown files (code blocks were being linted as TS)
        '**/*.md',
        // Figma plugins - separate project with different conventions
        'figma-plugins/**',
      ],
    },
    {
      rules: {
        'no-alert': 'off',
        'no-console': 'off',
        'no-unused-vars': 'off',
        'unused-imports/no-unused-vars': 'off',
        'antfu/no-top-level-await': ['off'],
        'node/no-process-env': ['error'],
        'node/prefer-global/process': ['off'],
        'pnpm/json-enforce-catalog': 'off',
        'pnpm/json-prefer-workspace-settings': 'off',
        'ts/no-redeclare': 'off',
        'ts/consistent-type-definitions': ['error', 'interface'],
        // Figma-style unused vars - allow underscore prefix to ignore
        '@typescript-eslint/no-unused-vars': ['error', {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        }],
        'unicorn/filename-case': ['error', {
          case: 'kebabCase',
          // Ignore dynamic pages with camelcase params since Nuxt requires camel case for dynamic routes
          // for example: [projectId]
          ignore: [
            'CLAUDE.md',
            'COMPONENT_QUICK_REF.md',
            'DEVELOPMENT.md',
            'GUIDE.md',
            'NEXT_STEPS.md',
            'NOTES.md',
            'ONBOARDING_IMPROVEMENTS.md',
            'PROGRESS.md',
            'README.md',
            'SCRATCH.md',
            'SKILL.md',
            // GitHub-specific files that require exact casing
            'FUNDING.yml',
            'pull_request_template.md',
            // Matches files like [projectId].vue, [userName].ts, etc.
            '\\[([a-zA-Z0-9]+)\\].[jt]s(x)?',
            '\\[([a-zA-Z0-9]+)\\].vue',
          ],
        }],
      },
    },
  ),

  // Case-police: only check source files, not tests/build/scripts
  {
    files: ['app/**/*.{ts,vue}', 'shared/**/*.ts', 'server/**/*.ts'],
    plugins: { 'case-police': pluginCasePolice },
    rules: {
      'case-police/string-check': 'warn',
    },
  },

  // Figma plugins config - scoped to figma plugin files with type-aware linting
  {
    files: ['**/figma-plugins/**/*.ts', '**/figma/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './figma-plugins/tsconfig.json',
      },
    },
    plugins: {
      '@figma/figma-plugins': figmaPlugin,
    },
    rules: {
      ...figmaPlugin.flatConfigs.recommended.rules,
    },
  },

  // jQuery global configuration for JavaScript files
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        $: 'readonly',
        jQuery: 'readonly',
      },
    },
  },

  // Maizzle email templates (app/emails/, own tsconfig). These compile to HTML
  // rather than running as Nuxt components, and use single-word PascalCase
  // component names (<Layout>, <Container>, <Heading>, …) — so override the
  // global kebab-case rule to PascalCase here.
  {
    files: ['app/emails/**/*.vue'],
    rules: {
      'vue/component-name-in-template-casing': ['error', 'PascalCase', {
        registeredComponentsOnly: false,
      }],
      // Maizzle templates lead with the <script setup> config block, then the
      // <template> — the reverse of the app-wide order.
      'vue/block-order': ['error', {
        order: ['script', 'template', 'style'],
      }],
    },
  },
)
