<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <!-- Show form for manual unsubscribe -->
    <u-card v-if="showForm" class="max-w-md w-full">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold">
            Unsubscribe
          </h1>
          <p class="text-muted text-sm mt-2">
            Enter your email address to unsubscribe from our mailing list
          </p>
        </div>
      </template>

      <u-form
        :schema="unsubscribeSchema"
        :state="unsubscribeForm"
        @submit="handleManualUnsubscribe"
      >
        <u-form-field
          name="email"
          label="Email Address"
          description="Enter the email address you want to unsubscribe"
        >
          <u-input
            v-model="unsubscribeForm.email"
            type="email"
            placeholder="your@email.com"
            :leading-icon="resolveIcon('mail')"
            size="lg"
            autocomplete="email"
          ></u-input>
        </u-form-field>

        <div class="mt-6 flex justify-center">
          <u-button
            type="submit"
            label="Unsubscribe"
            :icon="resolveIcon('mailOff')"
            size="lg"
            :loading="isSubmitting"
          ></u-button>
        </div>
      </u-form>

      <template #footer>
        <div class="flex justify-center">
          <u-button
            to="/"
            label="Return to Home"
            :icon="resolveIcon('home')"
            variant="ghost"
          ></u-button>
        </div>
      </template>
    </u-card>

    <!-- Show result after processing -->
    <u-card v-else class="max-w-md w-full">
      <template #header>
        <div class="flex items-center justify-center">
          <u-icon
            :name="isSuccess ? resolveIcon('success') : resolveIcon('error')"
            :class="isSuccess ? 'text-success' : 'text-error'"
            class="size-12"
          ></u-icon>
        </div>
      </template>

      <div class="text-center space-y-4">
        <h1 class="text-2xl font-bold">
          {{ isSuccess ? 'Unsubscribed Successfully' : 'Unsubscribe Failed' }}
        </h1>

        <p v-if="isSuccess && isAlreadyUnsubscribed" class="text-muted">
          This email address was already unsubscribed from our mailing list.
        </p>
        <p v-else-if="isSuccess" class="text-muted">
          You have been successfully unsubscribed from our mailing list. You will no longer receive emails from us.
        </p>
        <p v-else class="text-muted">
          {{ errorMessage }}
        </p>
      </div>

      <template #footer>
        <div class="flex justify-center">
          <u-button
            to="/"
            label="Return to Home"
            :icon="resolveIcon('home')"
            size="lg"
          ></u-button>
        </div>
      </template>
    </u-card>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { emailSchema } from '#shared/schemas/common'

const route = useRoute()
const { resolveIcon } = useAppearance()

const isSuccess = computed(() => route.query.success === 'true')
const isAlreadyUnsubscribed = computed(() => route.query.already === 'true')
const errorParam = computed(() => route.query.error as string | undefined)

const errorMessage = computed(() => {
  switch (errorParam.value) {
    case 'invalid-token':
      return 'The unsubscribe link is invalid or has expired. Please contact support if you continue to receive emails.'
    case 'invalid-email':
      return 'The email address format is invalid. Please contact support if you continue to receive emails.'
    case 'server-error':
      return 'A server error occurred. Please try again later or contact support.'
    default:
      return 'An error occurred while processing your unsubscribe request. Please try again later.'
  }
})

// Form schema and state for manual unsubscribe
const unsubscribeSchema = z.object({
  email: emailSchema,
})

const unsubscribeForm = ref({ email: '' })
const isSubmitting = ref(false)

async function handleManualUnsubscribe() {
  isSubmitting.value = true
  try {
    // Encode email as base64 token
    const token = btoa(unsubscribeForm.value.email)
    // Navigate to the unsubscribe endpoint
    await navigateTo(`/api/email/unsubscribe?token=${token}`)
  }
  catch (error) {
    console.error('Manual unsubscribe error:', error)
  }
  finally {
    isSubmitting.value = false
  }
}

// Show form if no query params (direct page visit)
const showForm = computed(() => !route.query.success && !route.query.error)

useHead({
  title: isSuccess.value ? 'Unsubscribed Successfully' : 'Unsubscribe',
})
</script>
