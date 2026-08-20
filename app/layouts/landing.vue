<template>
  <div class="flex min-h-screen flex-col">
    <!-- Public version banner for authenticated users on landing layout -->
    <public-version-banner hidden></public-version-banner>

    <!-- Header -->
    <u-header title="Kickstart" to="/">
      <template #title>
        <app-logo size="md"></app-logo>
      </template>

      <u-navigation-menu :items="navLinks"></u-navigation-menu>

      <template #right>
        <template v-if="loggedIn">
          <u-dropdown-menu
            :items="userMenuItems"
            :content="{ align: 'end' }"
          >
            <u-button
              color="neutral"
              variant="ghost"
              size="md"
            >
              <u-avatar
                :src="user?.avatar || undefined"
                :alt="user?.name || t('auth.user')"
                size="2xs"
              ></u-avatar>
              <span class="hidden sm:inline">{{ user?.name || t('auth.account') }}</span>
              <u-icon :name="resolveIcon('chevronDown')" class="size-4"></u-icon>
            </u-button>
          </u-dropdown-menu>
        </template>
        <template v-else>
          <u-button
            :label="t('auth.signIn')"
            to="/login"
            color="neutral"
            variant="outline"
          ></u-button>
        </template>
      </template>

      <template #body>
        <u-navigation-menu
          :items="navLinks"
          orientation="vertical"
          class="-mx-2.5"
        ></u-navigation-menu>
        <div class="flex flex-col gap-2 mt-4">
          <template v-if="loggedIn">
            <u-button
              :label="t('auth.goToApp')"
              to="/app"
              :icon="resolveIcon('layoutDashboard')"
              block
            ></u-button>
            <u-button
              :label="t('auth.signOut')"
              :icon="resolveIcon('logout')"
              color="neutral"
              variant="outline"
              block
              @click="logout()"
            ></u-button>
          </template>
          <template v-else>
            <u-button
              :label="t('auth.signIn')"
              to="/login"
              :icon="resolveIcon('login')"
              block
            ></u-button>
          </template>
        </div>
      </template>
    </u-header>

    <!-- Main content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-default bg-muted/30">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-4">
          <!-- Branding column -->
          <div class="space-y-4">
            <app-logo size="sm"></app-logo>
            <p class="text-sm text-muted">
              {{ t('landing.footer.tagline') }}
            </p>
            <div class="flex gap-2">
              <u-button
                v-for="social in socialLinks"
                :key="social.to"
                :icon="social.icon"
                :to="social.to"
                target="_blank"
                color="neutral"
                variant="ghost"
                size="sm"
                :aria-label="social.label"
              ></u-button>
            </div>
          </div>

          <!-- Product links -->
          <div>
            <h3 class="text-sm font-semibold mb-4">
              {{ t('nav.product') }}
            </h3>
            <ul class="space-y-3">
              <li v-for="link in footerLinks.product" :key="link.to">
                <nuxt-link :to="link.to" class="text-sm text-muted hover:text-default transition-colors">
                  {{ link.label }}
                </nuxt-link>
              </li>
            </ul>
          </div>

          <!-- Resources links -->
          <div>
            <h3 class="text-sm font-semibold mb-4">
              {{ t('nav.resources') }}
            </h3>
            <ul class="space-y-3">
              <li v-for="link in footerLinks.resources" :key="link.to">
                <nuxt-link :to="link.to" class="text-sm text-muted hover:text-default transition-colors">
                  {{ link.label }}
                </nuxt-link>
              </li>
            </ul>
          </div>

          <!-- Company links -->
          <div>
            <h3 class="text-sm font-semibold mb-4">
              {{ t('nav.company') }}
            </h3>
            <ul class="space-y-3">
              <li v-for="link in footerLinks.company" :key="link.to">
                <nuxt-link :to="link.to" class="text-sm text-muted hover:text-default transition-colors">
                  {{ link.label }}
                </nuxt-link>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom bar -->
        <div class="mt-12 pt-8 border-t border-default flex flex-col sm:flex-row justify-between items-center gap-4">
          <p class="text-sm text-muted">
            {{ t('landing.footer.copyright', { year: currentYear }) }}
          </p>
          <div class="flex gap-6">
            <nuxt-link to="/privacy" class="text-sm text-muted hover:text-default transition-colors">
              {{ t('nav.privacy') }}
            </nuxt-link>
            <nuxt-link to="/terms" class="text-sm text-muted hover:text-default transition-colors">
              {{ t('nav.terms') }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'
import { authClient } from '~/lib/auth-client'

const session = authClient.useSession()
const { t } = useI18n()
const { resolveIcon } = useAppearance()
const loggedIn = computed(() => !!session.value.data?.user)
const user = computed(() => {
  const u = session.value.data?.user
  if (!u)
    return null
  return { ...u, avatar: u.image }
})
async function logout() {
  await authClient.signOut()
  await navigateTo('/')
}

// Navigation links for landing header
const navLinks = computed<NavigationMenuItem[]>(() => [
  { label: t('nav.features'), to: '/#features' },
  { label: t('nav.tech'), to: '/#tech' },
])

// Authenticated user dropdown items
const userMenuItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: user.value?.name || user.value?.email || t('auth.user'),
      avatar: user.value?.avatar ? { src: user.value.avatar } : undefined,
      type: 'label' as const,
    },
  ],
  [
    {
      label: t('auth.goToApp'),
      icon: resolveIcon('layoutDashboard'),
      to: '/app',
    },
    {
      label: t('auth.profile'),
      icon: resolveIcon('userCog'),
      to: '/app/profile',
    },
  ],
  [
    {
      label: t('auth.signOut'),
      icon: resolveIcon('logout'),
      onSelect: () => logout(),
    },
  ],
])

// Footer link groups
const footerLinks = computed(() => ({
  product: [
    { label: t('nav.features'), to: '/#features' },
    { label: t('nav.techStack'), to: '/#tech' },
  ],
  resources: [
    { label: t('nav.guides'), to: '/guides' },
  ],
  company: [
    { label: t('nav.about'), to: '/about' },
    { label: t('nav.contact'), to: '/contact' },
  ],
}))

// Social links
const socialLinks = [
  { icon: 'i-tabler-brand-github', to: 'https://github.com/victortolbert', label: 'GitHub' },
  { icon: 'i-tabler-brand-linkedin', to: 'https://linkedin.com/in/victortolbert', label: 'LinkedIn' },
]

const currentYear = new Date().getFullYear()
</script>
