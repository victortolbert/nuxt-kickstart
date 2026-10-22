<template>
  <u-dashboard-group unit="px" storage-key="dashboard-v3">
    <!-- Desktop Sidebar -->
    <u-dashboard-sidebar
      v-model:collapsed="collapsed"
      collapsible
      :min-size="260"
      :default-size="304"
      :ui="{
        header: 'overflow-visible',
        footer: 'border-t border-default',
      }"
      class="hidden md:flex print:hidden"
    >
      <template #header="{ collapsed: isCollapsed }">
        <nuxt-link :to="loggedIn ? '/app' : '/'" class="flex items-center">
          <app-logo
            :collapsed="isCollapsed"
            size="md"
          ></app-logo>
        </nuxt-link>
      </template>

      <template #default="{ collapsed: isCollapsed }">
        <!-- Filter the sidebar nav as you type (Nuxt UI docs style). The ⌘K
             command palette lives in the header / search button instead. -->
        <u-input
          v-if="!isCollapsed"
          ref="navFilterInput"
          v-model="navFilter"
          type="search"
          size="sm"
          :icon="resolveIcon('search')"
          :placeholder="t('nav.filter')"
          :aria-label="t('nav.filter')"
          class="w-full"
          @keydown.escape="navFilter = ''"
        >
          <template v-if="!navFilter" #trailing>
            <u-kbd value="/"></u-kbd>
          </template>
        </u-input>

        <!-- Main section: every group with section: main (the default) -->
        <u-navigation-menu
          v-if="filteredMainNav.length"
          :key="navFilter"
          :collapsed="isCollapsed"
          :items="filteredMainNav"
          orientation="vertical"
        ></u-navigation-menu>
        <p v-else-if="navFilter" class="px-2.5 py-2 text-sm text-muted">
          {{ t('nav.noMatches') }}
        </p>

        <!-- Footer-section nav groups (e.g. Admin) are surfaced in the user
             menu (see footerMenuItems) rather than the sidebar. -->
      </template>

      <template #footer="{ collapsed: isCollapsed }">
        <u-dropdown-menu
          :items="userMenuItems"
          :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width)' }"
        >
          <u-button
            :icon="isCollapsed ? resolveIcon('userCircle') : undefined"
            color="neutral"
            variant="ghost"
            block
            class="justify-start"
            :class="isCollapsed ? 'justify-center!' : ''"
          >
            <template v-if="!isCollapsed">
              <u-avatar
                v-if="loggedIn && user?.avatar"
                :src="user.avatar"
                :alt="user.name || t('auth.user')"
                size="2xs"
              ></u-avatar>
              <u-icon
                v-else
                :name="resolveIcon('userCircle')"
                class="size-6"
              ></u-icon>
              <span class="truncate flex-1 text-left">
                {{ loggedIn ? (user?.name || user?.email || t('auth.user')) : t('auth.guest') }}
              </span>
              <u-icon :name="resolveIcon('selector')" class="size-5 text-muted"></u-icon>
            </template>
          </u-button>
        </u-dropdown-menu>
      </template>
    </u-dashboard-sidebar>

    <u-dashboard-search
      v-model:search-term="searchTerm"
      :groups="searchGroups"
      :loading="contentSearchStatus === 'pending'"
      :placeholder="t('search.placeholder')"
      :fuse="{ resultLimit: 20 }"
      @select="onSearchSelect"
    ></u-dashboard-search>

    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar class="print:hidden">
          <!-- #left replaces the component's built-in <h1> title: the navbar
               label is chrome — pages own the document's single <h1> -->
          <template #left>
            <!-- Mobile toggle comes built-in via UDashboardNavbar; this is desktop-only -->
            <u-dashboard-sidebar-collapse class="hidden md:flex"></u-dashboard-sidebar-collapse>
            <div class="flex items-center gap-1.5 font-semibold text-highlighted truncate">
              {{ pageTitle }}
            </div>
          </template>

          <template #right>
            <!-- Mobile controls: Search + Language + User Menu -->
            <div class="flex items-center gap-1 md:hidden">
              <u-button
                :icon="resolveIcon('command')"
                color="neutral"
                variant="ghost"
                size="md"
                :aria-label="t('nav.openSearch')"
                @click="openSearch"
              ></u-button>
              <language-switcher></language-switcher>
              <!-- No trigger-width constraint here: the trigger is the small
                   avatar, so the menu (and its submenus) size to content instead
                   of collapsing to the avatar's width and truncating labels. -->
              <u-dropdown-menu
                :items="userMenuItems"
                :ui="{ content: 'min-w-48' }"
              >
                <u-button
                  :icon="loggedIn && user?.avatar ? undefined : resolveIcon('userCircle')"
                  color="neutral"
                  variant="ghost"
                  size="md"
                  :aria-label="t('nav.userMenu')"
                >
                  <u-avatar
                    v-if="loggedIn && user?.avatar"
                    :src="user.avatar"
                    :alt="user.name || t('auth.user')"
                    size="2xs"
                  ></u-avatar>
                </u-button>
              </u-dropdown-menu>
            </div>
            <!-- Desktop controls (hidden on mobile) -->
            <div class="hidden md:flex items-center gap-1">
              <u-dashboard-search-button></u-dashboard-search-button>
              <language-switcher></language-switcher>
              <u-color-mode-button></u-color-mode-button>
            </div>
          </template>
        </u-dashboard-navbar>
      </template>

      <template #body>
        <div
          ref="contentTopAnchor"
          class="hidden"
          aria-hidden="true"
        />
        <slot />
      </template>
    </u-dashboard-panel>

    <!-- Lazy load modal components - only hydrate when browser is idle -->
    <lazy-appearance-panel v-model:open="appearanceOpen" hydrate-on-idle></lazy-appearance-panel>
    <lazy-component-catalog v-model:open="catalogOpen" hydrate-on-idle></lazy-component-catalog>
    <lazy-site-map v-model:open="siteMapOpen" hydrate-on-idle></lazy-site-map>
  </u-dashboard-group>
</template>

<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'
import type { ThemeId } from '~~/shared/types/theme'
import type { SearchResult } from '#shared/utils/search-registry'
import { authClient } from '~/lib/auth-client'

const colorMode = useColorMode()
const router = useRouter()
const route = useRoute()
const { loggedIn, user: sessionUser } = useSessionState()
const user = computed(() =>
  sessionUser.value ? { ...sessionUser.value, avatar: sessionUser.value.image } : null)
const { theme, themes, setTheme } = useTheme()
const { resolveIcon } = useAppearance()
const { t, te, locale } = useI18n()

// Load navigation from YAML config files (sidebar) + derived palette groups
const { navigation, paletteGroups } = useNavigationConfig()

// Sidebar nav filter (type to narrow the menu; the ⌘K palette is in the header)
const navFilter = ref('')

function filterNavItems(items: NavigationMenuItem[], query: string): NavigationMenuItem[] {
  const q = query.toLowerCase()
  const result: NavigationMenuItem[] = []
  for (const item of items) {
    const labelMatch = typeof item.label === 'string' && item.label.toLowerCase().includes(q)
    const children = Array.isArray(item.children) ? filterNavItems(item.children as NavigationMenuItem[], query) : undefined
    if (labelMatch) {
      // Whole group matches — keep all its children, expanded
      result.push(item.children ? { ...item, defaultOpen: true } : item)
    }
    else if (children && children.length) {
      // Only some children match — keep the group with just those, expanded
      result.push({ ...item, children, defaultOpen: true })
    }
  }
  return result
}

const filteredMainNav = computed(() => {
  const q = navFilter.value.trim()
  return q ? filterNavItems(navigation.value.main, q) : navigation.value.main
})

const catalogOpen = ref(false)
const siteMapOpen = ref(false)
const appearanceOpen = ref(false)
async function logout() {
  await authClient.signOut()
  await navigateTo('/')
}

// Trigger search programmatically (simulate Cmd+K)
function openSearch() {
  const event = new KeyboardEvent('keydown', {
    key: 'k',
    code: 'KeyK',
    metaKey: true,
    ctrlKey: false,
    bubbles: true,
    cancelable: true,
  })
  document.dispatchEvent(event)
}

// The page content scrolls inside UDashboardPanel's body (not the window),
// so the router can't reset it — do it ourselves on navigation.
const contentTopAnchor = ref<HTMLElement | null>(null)

// Watch route changes: reset content scroll
watch(() => route.path, () => {
  if (!route.hash) {
    nextTick(() => {
      contentTopAnchor.value?.parentElement?.scrollTo({ top: 0 })
    })
  }
})

// Compute page title from route
const pageTitle = computed(() => {
  // Strip the locale prefix (prefix_except_default: /es/posts -> /posts)
  let path = route.path
  const prefix = `/${locale.value}`
  if (locale.value !== 'en' && (path === prefix || path.startsWith(`${prefix}/`)))
    path = path.slice(prefix.length) || '/'

  if (path === '/' || path === '/app')
    return t('nav.dashboard')

  // For /app/* routes, use the segment after /app/
  let segment = path.startsWith('/app/') ? path.split('/')[2] : path.split('/')[1]
  if (!segment)
    return t('nav.dashboard')

  // Translate by convention (nav.<camelCaseSegment>), fall back to capitalizing
  segment = segment.replace(/-(\w)/g, (_, c: string) => c.toUpperCase())
  const key = `nav.${segment}`
  if (te(key))
    return t(key)
  return segment.charAt(0).toUpperCase() + segment.slice(1)
})

const collapsed = ref(false)

// "/" focuses the sidebar filter (Nuxt UI docs pattern); ⌘K still opens the
// command palette. defineShortcuts ignores this while typing in a field.
const navFilterInput = useTemplateRef('navFilterInput')

defineShortcuts({
  '/': () => {
    collapsed.value = false
    nextTick(() => navFilterInput.value?.inputRef?.focus())
  },
})

// Content results come from `/api/search`, which matches the search registry
// on the server and returns only what this Viewer may see — the palette never
// holds a collection the visibility rules have not filtered. Debounced, so a
// typed word is one request rather than one per keystroke.
const searchTerm = ref('')
const debouncedTerm = refDebounced(searchTerm, 200)
const { data: contentSearch, status: contentSearchStatus } = useFetch('/api/search', {
  query: { q: debouncedTerm, locale },
  server: false,
  lazy: true,
  default: () => ({ results: [] as SearchResult[] }),
})

/** The semantic icon per collection; anything a layer registers gets the generic one. */
const COLLECTION_ICONS: Record<string, string> = {
  guides: 'book2',
  posts: 'fileText',
  tech: 'cpu',
  blocks: 'apps',
}

// Command palette groups: navigation destinations derive from the same YAML
// config as the sidebar; content matches follow, already ranked and filtered
// by the server, so that group skips the palette's own fuzzy filter.
const searchGroups = computed(() => {
  const contentItems = (contentSearch.value?.results ?? []).map(result => ({
    label: result.title,
    suffix: result.description ?? '',
    icon: resolveIcon(COLLECTION_ICONS[result.collection] ?? 'file'),
    to: result.path,
  }))

  // A nav item carries no description of its own; when the page it links to
  // is among the matches, it borrows that one.
  const descByPath = new Map(contentItems.filter(item => item.suffix).map(item => [item.to, item.suffix]))
  const navGroups = paletteGroups.value.map(group => ({
    id: group.id,
    label: group.label,
    items: group.items.map(item => ({
      ...item,
      suffix: item.to ? descByPath.get(item.to) : undefined,
    })),
  }))

  // A page the nav already lists is not repeated as a content match.
  const navTargets = new Set(navGroups.flatMap(group => group.items.map(item => item.to)))
  const contentGroup = {
    id: 'content',
    label: t('search.content'),
    ignoreFilter: true,
    items: contentItems.filter(item => !navTargets.has(item.to)),
  }

  return [
    ...navGroups,
    {
      id: 'actions',
      label: t('search.actions'),
      items: [
        {
          label: t('search.openAppearance'),
          icon: resolveIcon('brush'),
          onSelect: () => { appearanceOpen.value = true },
        },
        {
          label: t('search.openSiteMap'),
          icon: resolveIcon('sitemap'),
          onSelect: () => { siteMapOpen.value = true },
        },
        {
          label: t('search.openComponentCatalog'),
          icon: resolveIcon('components'),
          onSelect: () => { catalogOpen.value = true },
        },
      ],
    },
    {
      id: 'themes',
      label: t('search.themes'),
      items: themes.map(themeItem => ({
        label: t('search.switchToTheme', { theme: t(`theme.labels.${themeItem.id}`) }),
        suffix: theme.value === themeItem.id ? t('search.active') : '',
        icon: themeItem.icon,
        onSelect: () => setTheme(themeItem.id as ThemeId),
      })),
    },
    ...(contentGroup.items.length ? [contentGroup] : []),
  ]
})

// Search item type
interface SearchItem {
  to?: string
  onSelect?: () => void
}

function onSearchSelect(item: SearchItem) {
  if (item.to) {
    router.push(item.to)
  }
}

// Footer-section nav groups (currently just Admin) surfaced in the user menu
// instead of the sidebar. navigation.footer is already auth/role-filtered, so
// this is empty for non-admins. Each group becomes a submenu with its items
// flattened one level (e.g. Email's children promoted to the top level).
const footerMenuItems = computed<DropdownMenuItem[]>(() =>
  navigation.value.footer.map((group) => {
    const flat = (group.children ?? []).flatMap(item =>
      item.children?.length ? item.children : [item],
    )
    return {
      label: group.label,
      icon: group.icon,
      children: [
        flat.map(item => ({
          label: item.label,
          icon: item.icon,
          to: item.to,
        })),
      ],
    } as DropdownMenuItem
  }),
)

// User menu items
const userMenuItems = computed<DropdownMenuItem[][]>(() => {
  const items: DropdownMenuItem[][] = [
    [
      {
        label: t('nav.appearance'),
        icon: resolveIcon('brush'),
        children: [
          // Color mode (top group)
          [
            {
              label: t('theme.light'),
              icon: resolveIcon('light'),
              type: 'checkbox' as const,
              checked: colorMode.value === 'light',
              onSelect: () => { colorMode.preference = 'light' },
            },
            {
              label: t('theme.dark'),
              icon: resolveIcon('dark'),
              type: 'checkbox' as const,
              checked: colorMode.value === 'dark',
              onSelect: () => { colorMode.preference = 'dark' },
            },
            {
              label: t('theme.system'),
              icon: resolveIcon('system'),
              type: 'checkbox' as const,
              checked: colorMode.preference === 'system',
              onSelect: () => { colorMode.preference = 'system' },
            },
          ],
          // Themes (separated below the color-mode group)
          themes.map(themeItem => ({
            label: t(`theme.labels.${themeItem.id}`),
            icon: themeItem.icon,
            type: 'checkbox' as const,
            checked: theme.value === themeItem.id,
            onSelect: () => setTheme(themeItem.id as ThemeId),
          })),
        ],
      },
      // Admin (and any footer-section group) — admins only
      ...footerMenuItems.value,
    ],
    [
      {
        label: t('nav.siteMap'),
        icon: resolveIcon('sitemap'),
        onSelect: () => { siteMapOpen.value = true },
      },
      {
        label: t('nav.componentCatalog'),
        icon: resolveIcon('components'),
        onSelect: () => { catalogOpen.value = true },
      },
      // Auth-only destinations — hidden for guests
      ...(loggedIn.value
        ? [
            {
              label: t('auth.profile'),
              icon: resolveIcon('userCog'),
              to: '/app/profile',
            },
            {
              label: t('auth.settings'),
              icon: resolveIcon('settings'),
              to: '/settings',
            },
          ]
        : []),
    ],
  ]

  // Add sign in or sign out based on auth state
  if (loggedIn.value) {
    items.push([
      {
        label: t('auth.signOut'),
        icon: resolveIcon('logout'),
        onSelect: logout,
      },
    ])
  }
  else {
    items.push([
      {
        label: t('auth.signIn'),
        icon: resolveIcon('login'),
        to: '/login',
      },
    ])
  }

  return items
})
</script>
