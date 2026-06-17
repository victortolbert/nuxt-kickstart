<template>
  <section class="py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto text-center">
      <!-- CTA Headline -->
      <h2 class="text-3xl sm:text-4xl font-bold mb-4">
        {{ t('landing.cta.title') }}
      </h2>
      <p class="text-lg text-muted mb-8 max-w-2xl mx-auto">
        {{ t('landing.cta.subtitle') }}
      </p>

      <!-- Primary CTAs -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
        <u-button
          v-if="!loggedIn"
          to="/guides/getting-started"
          size="xl"
          color="primary"
          :icon="resolveIcon('rocket')"
        >
          {{ t('landing.cta.getStarted') }}
        </u-button>
        <u-button
          v-else
          to="/app"
          size="xl"
          color="primary"
          :icon="resolveIcon('layoutDashboard')"
        >
          {{ t('landing.cta.goToDashboard') }}
        </u-button>
        <u-button
          to="/guides"
          size="xl"
          variant="outline"
          :icon="resolveIcon('book2')"
        >
          {{ t('landing.cta.readTheDocs') }}
        </u-button>
      </div>

      <!-- Contact Information -->
      <div class="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm text-muted">
        <div class="flex items-center gap-2">
          <u-icon :name="resolveIcon('mail')" class="text-lg"></u-icon>
          <a href="mailto:hello@example.com" class="hover:text-highlighted transition-colors">
            hello@example.com
          </a>
        </div>
        <div class="hidden sm:block text-dimmed">
          •
        </div>
        <div class="flex items-center gap-4">
          <a
            href="https://github.com/victortolbert"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-highlighted transition-colors flex items-center gap-1.5"
            aria-label="GitHub Profile"
          >
            <u-icon name="i-tabler-brand-github" class="text-lg"></u-icon>
            <span>GitHub</span>
          </a>
          <a
            href="https://linkedin.com/in/victortolbert"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-highlighted transition-colors flex items-center gap-1.5"
            aria-label="LinkedIn Profile"
          >
            <u-icon name="i-tabler-brand-linkedin" class="text-lg"></u-icon>
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()

const { loggedIn } = useSessionState()
const { resolveIcon } = useAppearance()
</script>
