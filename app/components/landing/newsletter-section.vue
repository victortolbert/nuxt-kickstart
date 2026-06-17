<template>
  <section class="py-16 px-4 bg-muted/30">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-3xl font-bold mb-4">
        {{ t('landing.newsletter.title') }}
      </h2>
      <p class="text-muted mb-8">
        {{ t('landing.newsletter.subtitle') }}
      </p>

      <form class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" @submit.prevent="subscribe">
        <u-input
          v-model="email"
          type="email"
          :placeholder="t('landing.newsletter.placeholder')"
          size="xl"
          class="flex-1"
          :disabled="isLoading"
          :aria-label="t('landing.newsletter.emailAriaLabel')"
        ></u-input>
        <u-button
          type="submit"
          size="xl"
          color="primary"
          :loading="isLoading"
          :disabled="isLoading"
        >
          {{ t('landing.newsletter.subscribe') }}
        </u-button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()

const email = ref('')
const isLoading = ref(false)
const toast = useToast()

const emailPattern = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/

async function subscribe() {
  if (!email.value.trim()) {
    toast.add({
      title: t('landing.newsletter.toasts.required.title'),
      description: t('landing.newsletter.toasts.required.description'),
      color: 'error',
    })
    return
  }

  if (!emailPattern.test(email.value)) {
    toast.add({
      title: t('landing.newsletter.toasts.invalid.title'),
      description: t('landing.newsletter.toasts.invalid.description'),
      color: 'error',
    })
    return
  }

  isLoading.value = true

  try {
    // MVP: Store email in localStorage for later integration
    const subscribers = JSON.parse(localStorage.getItem('newsletter-subscribers') || '[]')
    const timestamp = new Date().toISOString()

    if (subscribers.some((s: { email: string }) => s.email === email.value)) {
      toast.add({
        title: t('landing.newsletter.toasts.duplicate.title'),
        description: t('landing.newsletter.toasts.duplicate.description'),
        color: 'warning',
      })
      return
    }

    subscribers.push({ email: email.value, timestamp })
    localStorage.setItem('newsletter-subscribers', JSON.stringify(subscribers))

    toast.add({
      title: t('landing.newsletter.toasts.success.title'),
      description: t('landing.newsletter.toasts.success.description'),
      color: 'success',
    })

    email.value = ''
  }
  catch (_error) {
    toast.add({
      title: t('landing.newsletter.toasts.error.title'),
      description: t('landing.newsletter.toasts.error.description'),
      color: 'error',
    })
  }
  finally {
    isLoading.value = false
  }
}
</script>
