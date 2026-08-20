<template>
  <section id="features" class="py-24 sm:py-32 bg-default">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center mb-16">
        <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
          {{ t('landing.features.title') }}
        </h2>
        <p class="mt-4 text-lg text-muted">
          {{ t('landing.features.subtitle') }}
        </p>
      </div>

      <div class="mx-auto max-w-5xl">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
          <u-card
            v-for="service in services"
            :key="service.title"
            class="hover:shadow-lg transition-shadow"
          >
            <div class="flex items-start gap-4">
              <div class="shrink-0">
                <div class="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <u-icon :name="service.icon" class="size-6 text-primary"></u-icon>
                </div>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold mb-2">
                  {{ service.title }}
                </h3>
                <p class="text-sm text-muted">
                  <i18n-t
                    v-if="service.keypath"
                    :keypath="service.keypath"
                    scope="global"
                    tag="span"
                  >
                    <template
                      v-for="(link, slot) in service.links"
                      :key="slot"
                      #[slot]
                    >
                      <nuxt-link
                        v-if="link"
                        :to="link.to"
                        class="text-primary hover:underline"
                      >
                        {{ link.label }}
                      </nuxt-link>
                    </template>
                  </i18n-t>
                  <template v-else>
                    {{ service.description }}
                  </template>
                </p>
              </div>
            </div>
          </u-card>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { resolveIcon } = useAppearance()

/**
 * Feature cards. Cards with `links` render their description through
 * <i18n-t> so the linked keywords live inside the translated sentence
 * (the message uses {slot} placeholders — see landing.features.* in
 * i18n/locales/*.json).
 */
const services = computed(() => [
  {
    icon: resolveIcon('shieldLock'),
    title: t('landing.features.auth.title'),
    description: t('landing.features.auth.description'),
  },
  {
    icon: resolveIcon('fileText'),
    title: t('landing.features.content.title'),
    keypath: 'landing.features.content.description',
    links: {
      docs: { to: '/guides', label: t('landing.features.content.links.docs') },
      posts: { to: '/posts', label: t('landing.features.content.links.posts') },
    },
  },
  {
    icon: resolveIcon('palette'),
    title: t('landing.features.theming.title'),
    keypath: 'landing.features.theming.description',
    links: {
      themes: { to: '/appearance', label: t('landing.features.theming.links.themes') },
    },
  },
])
</script>
