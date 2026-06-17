<template>
  <div class="p-6 sm:p-8 max-w-2xl w-full mx-auto space-y-10">
    <header class="space-y-1">
      <h1 class="text-2xl font-bold">
        {{ t('settings.profile.title') }}
      </h1>
      <p class="text-sm text-muted">
        {{ t('settings.profile.subtitle') }}
      </p>
    </header>

    <!-- Profile Section -->
    <section class="space-y-6">
      <u-form-field :label="t('settings.profile.name')" name="name">
        <u-input
          v-model="name"
          :placeholder="t('settings.profile.namePlaceholder')"
          size="lg"
          :leading-icon="resolveIcon('user')"
          :disabled="isSaving"
          class="w-full"
        ></u-input>
      </u-form-field>

      <u-form-field
        :label="t('auth.email')"
        name="email"
        :help="t('settings.profile.emailHelp')"
      >
        <u-input
          :model-value="session?.data?.user?.email || ''"
          size="lg"
          :leading-icon="resolveIcon('mail')"
          disabled
          class="w-full"
        ></u-input>
      </u-form-field>

      <u-form-field :label="t('settings.profile.avatarUrl')" name="image">
        <div class="flex items-center gap-3">
          <u-avatar
            :src="image || undefined"
            :alt="name || t('settings.profile.avatarPreviewAlt')"
            :icon="resolveIcon('user')"
            size="lg"
            class="shrink-0"
          ></u-avatar>
          <u-input
            v-model="image"
            :placeholder="t('settings.profile.avatarPlaceholder')"
            size="lg"
            :leading-icon="resolveIcon('photo')"
            :disabled="isSaving"
            class="flex-1 min-w-0"
          ></u-input>
        </div>
      </u-form-field>

      <div class="pt-1">
        <u-button
          :label="t('settings.profile.saveProfile')"
          :icon="resolveIcon('save')"
          :loading="isSaving"
          :disabled="isSaving"
          @click="saveProfile"
        ></u-button>
        <p
          v-if="profileError"
          class="text-sm text-error mt-2"
          role="alert"
        >
          {{ profileError }}
        </p>
      </div>
    </section>

    <u-separator></u-separator>

    <!-- Phone Number Section -->
    <section class="space-y-4">
      <h2 class="text-lg font-semibold">
        {{ t('settings.profile.phoneNumber') }}
      </h2>

      <div v-if="!phoneOtpSent" class="space-y-3">
        <u-form-field
          :label="t('settings.profile.phoneLabel')"
          name="phone"
          :error="phoneError || undefined"
        >
          <u-input
            v-model="newPhone"
            type="tel"
            :placeholder="t('settings.profile.phonePlaceholder')"
            autocomplete="tel"
            size="lg"
            :leading-icon="resolveIcon('phone')"
            :disabled="isSendingPhone"
            class="w-full"
            @update:model-value="phoneError = ''"
          ></u-input>
        </u-form-field>
        <u-button
          :label="t('settings.profile.sendCode')"
          :icon="resolveIcon('messageCode')"
          variant="outline"
          color="neutral"
          :loading="isSendingPhone"
          :disabled="isSendingPhone"
          @click="sendPhoneOtp"
        ></u-button>
      </div>

      <!-- OTP entry for phone update -->
      <div v-else class="space-y-3">
        <p class="text-sm text-muted">
          <i18n-t keypath="settings.profile.otpPrompt" scope="global">
            <template #phone>
              <span class="font-medium text-default">{{ newPhone }}</span>
            </template>
          </i18n-t>
        </p>
        <u-pin-input
          v-model="phoneOtpCode"
          :length="6"
          size="xl"
          autofocus
          :disabled="isVerifyingPhone"
          :aria-label="t('settings.profile.otpAriaLabel')"
          @complete="verifyPhoneOtp"
        ></u-pin-input>
        <p
          v-if="phoneError"
          class="text-sm text-error"
          role="alert"
        >
          {{ phoneError }}
        </p>
        <p
          v-if="isVerifyingPhone"
          class="text-sm text-muted"
          aria-live="polite"
        >
          {{ t('settings.profile.verifying') }}
        </p>
        <u-button
          :label="t('common.cancel')"
          variant="ghost"
          size="sm"
          color="neutral"
          @click="cancelPhoneOtp"
        ></u-button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { authClient } from '~/lib/auth-client'

const { t } = useI18n()

useHead({ title: () => t('settings.profile.title') })

const session = authClient.useSession()
const toast = useToast()
const { resolveIcon } = useAppearance()

// Profile form
const name = ref('')
const image = ref('')
const profileError = ref('')
const isSaving = ref(false)

// Phone number update
const newPhone = ref('')
const phoneOtpCode = ref<string[]>([])
const phoneOtpSent = ref(false)
const phoneError = ref('')
const isSendingPhone = ref(false)
const isVerifyingPhone = ref(false)

// Initialize form from session
watch(() => session.value?.data?.user, (user) => {
  if (user) {
    name.value = user.name || ''
    image.value = user.image || ''
  }
}, { immediate: true })

async function saveProfile() {
  isSaving.value = true
  profileError.value = ''
  const { error } = await authClient.updateUser({
    name: name.value,
    image: image.value || undefined,
  })
  isSaving.value = false
  if (error) {
    profileError.value = error.message || t('settings.profile.updateError')
    return
  }
  toast.add({ title: t('settings.profile.profileUpdated'), icon: resolveIcon('check'), color: 'success' })
}

async function sendPhoneOtp() {
  if (!newPhone.value) {
    phoneError.value = t('settings.profile.phoneRequired')
    return
  }
  isSendingPhone.value = true
  phoneError.value = ''
  const { error } = await authClient.phoneNumber.sendOtp({
    phoneNumber: newPhone.value,
  })
  isSendingPhone.value = false
  if (error) {
    phoneError.value = error.message || t('settings.profile.sendCodeError')
    return
  }
  phoneOtpSent.value = true
  phoneOtpCode.value = []
}

async function verifyPhoneOtp() {
  isVerifyingPhone.value = true
  phoneError.value = ''
  const { error } = await authClient.phoneNumber.verify({
    phoneNumber: newPhone.value,
    code: phoneOtpCode.value.join(''),
    updatePhoneNumber: true,
  })
  isVerifyingPhone.value = false
  if (error) {
    phoneError.value = error.message || t('settings.profile.invalidCode')
    return
  }
  phoneOtpSent.value = false
  phoneOtpCode.value = []
  toast.add({ title: t('settings.profile.phoneUpdated'), icon: resolveIcon('check'), color: 'success' })
}

function cancelPhoneOtp() {
  phoneOtpSent.value = false
  phoneOtpCode.value = []
  phoneError.value = ''
}
</script>
