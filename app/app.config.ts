// `AppConfigInput extends CustomAppConfig`, and @nuxt/ui's module augmentation
// makes the inherited `ui` resolve to the fully-required runtime type (all
// colors + icons + the tailwind-variants `tv` config). Partial `ui` config is
// the intended DX, so assert against defineAppConfig's own parameter type to
// bypass that strictness. (Importing AppConfigInput directly mismatches under
// pnpm because the module augmentation resolves to a different copy.)
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'neutral',
      neutral: 'neutral',
    },
    icons: {
      arrowDown: 'i-tabler-arrow-down',
      arrowLeft: 'i-tabler-arrow-left',
      arrowRight: 'i-tabler-arrow-right',
      arrowUp: 'i-tabler-arrow-up',
      caution: 'i-tabler-alert-circle',
      check: 'i-tabler-check',
      chevronDoubleLeft: 'i-tabler-chevrons-left',
      chevronDoubleRight: 'i-tabler-chevrons-right',
      chevronDown: 'i-tabler-chevron-down',
      chevronLeft: 'i-tabler-chevron-left',
      chevronRight: 'i-tabler-chevron-right',
      chevronUp: 'i-tabler-chevron-up',
      close: 'i-tabler-x',
      copy: 'i-tabler-copy',
      copyCheck: 'i-tabler-copy-check',
      dark: 'i-tabler-moon',
      drag: 'i-tabler-grip-vertical',
      ellipsis: 'i-tabler-dots',
      error: 'i-tabler-circle-x',
      external: 'i-tabler-arrow-up-right',
      eye: 'i-tabler-eye',
      eyeOff: 'i-tabler-eye-off',
      file: 'i-tabler-file',
      folder: 'i-tabler-folder',
      folderOpen: 'i-tabler-folder-open',
      hash: 'i-tabler-hash',
      info: 'i-tabler-info-circle',
      light: 'i-tabler-sun',
      loading: 'i-tabler-loader-2',
      menu: 'i-tabler-menu-2',
      minus: 'i-tabler-minus',
      panelClose: 'i-tabler-layout-sidebar-left-collapse',
      panelOpen: 'i-tabler-layout-sidebar-left-expand',
      plus: 'i-tabler-plus',
      reload: 'i-tabler-refresh',
      search: 'i-tabler-search',
      stop: 'i-tabler-square',
      success: 'i-tabler-circle-check',
      system: 'i-tabler-device-desktop',
      tip: 'i-tabler-bulb',
      upload: 'i-tabler-upload',
      warning: 'i-tabler-alert-triangle',
    },
  },
  content: {
    repo: '',
    branch: 'main',
    basePath: '',
  },
  // The search registry (`#shared/utils/search-registry`): the template's own
  // searchable collections. A layer registers its collections the same way in
  // its own app config; Nuxt concatenates the arrays across layers, so nothing
  // here changes when one is added or deleted.
  search: {
    collections: [
      { collection: 'guides', fields: ['title', 'description', 'tags'], localized: true },
      { collection: 'posts', fields: ['title', 'description', 'tags'] },
      { collection: 'tech', fields: ['title', 'displayName', 'description', 'aliases'], roles: { aliases: 'aliases' } },
      { collection: 'blocks', fields: ['title', 'description', 'jobsToBeDone'] },
    ],
  },
} as Parameters<typeof defineAppConfig>[0])
