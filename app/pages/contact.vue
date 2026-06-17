<template>
  <u-page>
    <u-page-header
      title="Contact"
      description="Get in touch."
    ></u-page-header>
    <u-page-body>
      <div class="flex flex-col gap-4 max-w-md">
        <u-card v-for="channel in channels" :key="channel.label">
          <nuxt-link
            :to="channel.href"
            target="_blank"
            class="flex items-center gap-4"
          >
            <div class="flex items-center justify-center size-10 shrink-0 rounded-sm contact-icon">
              <u-icon :name="channel.icon" class="size-5"></u-icon>
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-semibold contact-label">{{ channel.label }}</span>
              <span class="text-sm contact-value">{{ channel.value }}</span>
            </div>
          </nuxt-link>
        </u-card>

        <p class="text-sm contact-note">
          These are placeholder channels — swap in your own links. The
          newsletter signup on the landing page is wired to the email
          subsystem and works once Resend is configured.
        </p>
      </div>
    </u-page-body>
  </u-page>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Contact',
})

useSeoMeta({
  description: 'Get in touch.',
})

const { resolveIcon } = useAppearance()

// Placeholder contact channels — replace with your own
// (see /guides/using-this-template)
const channels = computed(() => [
  {
    icon: resolveIcon('mail'),
    label: 'Email',
    value: 'hello@example.com',
    href: 'mailto:hello@example.com',
  },
  {
    icon: 'i-tabler-brand-github',
    label: 'GitHub',
    value: 'github.com/your-handle',
    href: 'https://github.com',
  },
])
</script>

<style scoped>
.contact-icon {
  background: color-mix(in oklch, var(--color-primary-500) 15%, transparent);
  color: var(--color-primary-500);
}

.contact-label {
  color: var(--ui-text);
}

.contact-value,
.contact-note {
  color: var(--ui-text-muted);
}
</style>
