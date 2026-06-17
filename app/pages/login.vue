<template>
  <div class="flex min-h-[60vh] items-center justify-center px-4">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold tracking-tight text-highlighted">
          {{ t('auth.login.title') }}
        </h1>
        <p v-if="route.query.redirect" class="text-sm text-muted mt-2">
          {{ t('auth.login.redirectNotice') }}
        </p>
        <p v-else class="text-sm text-muted mt-2">
          {{ t('auth.login.subtitle') }}
        </p>
      </div>

      <!-- Main card -->
      <div class="border border-default p-6 space-y-6">
        <!-- Magic link confirmation -->
        <div
          v-if="magicLinkSent"
          class="text-center space-y-4"
          role="status"
          aria-live="polite"
        >
          <div class="flex justify-center">
            <div class="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
              <u-icon
                :name="resolveIcon('mailCheck')"
                class="w-8 h-8 text-primary-600 dark:text-primary-400"
              ></u-icon>
            </div>
          </div>
          <div>
            <h2
              ref="magicLinkHeading"
              tabindex="-1"
              class="text-xl font-semibold text-highlighted mb-2 focus:outline-none"
            >
              {{ t('auth.login.checkEmail') }}
            </h2>
            <p class="text-sm text-muted">
              {{ t('auth.login.magicLinkSentTo') }}<br>
              <span class="font-medium text-default">{{ magicLinkEmail }}</span>
            </p>
          </div>
          <div class="pt-2">
            <u-button
              v-if="canResendMagicLink"
              :label="t('auth.login.sendAgain')"
              :icon="resolveIcon('reload')"
              size="md"
              variant="outline"
              color="neutral"
              :disabled="isLoading"
              :loading="isLoading"
              class="motion-safe:transition-transform motion-safe:hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-primary-500"
              :aria-label="t('auth.login.resendMagicLink')"
              @click="handleMagicLink"
            ></u-button>
            <p
              v-else
              class="text-sm text-dimmed"
            >
              {{ t('auth.login.sendAgainIn', { n: resendCountdown }) }}
            </p>
          </div>
          <u-button
            :label="t('auth.login.backToLogin')"
            variant="ghost"
            size="sm"
            color="neutral"
            class="focus-visible:ring-2 focus-visible:ring-primary-500"
            :aria-label="t('auth.login.returnToLoginForm')"
            @click="magicLinkSent = false; email = ''; emailError = ''"
          ></u-button>
        </div>

        <!-- Email OTP verification -->
        <div
          v-else-if="emailOtpSent"
          class="text-center space-y-4"
        >
          <div class="flex justify-center">
            <div class="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
              <u-icon
                :name="resolveIcon('mail')"
                class="w-8 h-8 text-primary-600 dark:text-primary-400"
              ></u-icon>
            </div>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-highlighted mb-2">
              {{ t('auth.login.enterYourCode') }}
            </h2>
            <p class="text-sm text-muted">
              {{ t('auth.login.codeSentTo') }}<br>
              <span class="font-medium text-default">{{ emailOtpEmail }}</span>
            </p>
          </div>
          <div class="pt-2">
            <label
              for="otp-input"
              class="sr-only"
            >
              {{ t('auth.login.verificationCode') }}
            </label>
            <input
              id="otp-input"
              :value="otpCode"
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"
              autocomplete="one-time-code"
              maxlength="6"
              placeholder="000000"
              :disabled="isVerifying"
              :aria-label="t('auth.login.otpAriaLabel')"
              class="w-48 mx-auto block text-center text-3xl tracking-[0.5em] font-mono bg-transparent border border-default rounded-none px-4 py-3 text-highlighted placeholder:text-dimmed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-50"
              @input="(e: Event) => { otpCode = (e.target as HTMLInputElement).value; handleOtpInput() }"
            >
            <p
              v-if="otpError"
              class="text-sm text-error mt-2"
              role="alert"
            >
              {{ otpError }}
            </p>
            <p
              v-if="isVerifying"
              class="text-sm text-muted mt-2"
            >
              {{ t('auth.login.verifying') }}
            </p>
          </div>
          <div class="pt-2">
            <u-button
              v-if="canResendOtp"
              :label="t('auth.login.sendAgain')"
              :icon="resolveIcon('reload')"
              size="md"
              variant="outline"
              color="neutral"
              :disabled="isLoading"
              :loading="isLoading"
              class="motion-safe:transition-transform motion-safe:hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-primary-500"
              :aria-label="t('auth.login.resendEmailCode')"
              @click="handleEmailOTP"
            ></u-button>
            <p
              v-else
              class="text-sm text-dimmed"
            >
              {{ t('auth.login.sendAgainIn', { n: resendOtpCountdown }) }}
            </p>
          </div>
          <u-button
            :label="t('auth.login.backToLogin')"
            variant="ghost"
            size="sm"
            color="neutral"
            class="focus-visible:ring-2 focus-visible:ring-primary-500"
            :aria-label="t('auth.login.returnToLoginForm')"
            @click="emailOtpSent = false; otpCode = ''; otpError = ''; email = ''"
          ></u-button>
        </div>

        <!-- SMS OTP verification -->
        <div
          v-else-if="smsOtpSent"
          class="text-center space-y-4"
        >
          <div class="flex justify-center">
            <div class="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
              <u-icon
                :name="resolveIcon('messageCode')"
                class="w-8 h-8 text-primary-600 dark:text-primary-400"
              ></u-icon>
            </div>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-highlighted mb-2">
              {{ t('auth.login.enterYourCode') }}
            </h2>
            <p class="text-sm text-muted">
              {{ t('auth.login.codeSentTo') }}<br>
              <span class="font-medium text-default">{{ smsOtpPhone }}</span>
            </p>
          </div>
          <div class="pt-2">
            <label
              for="sms-otp-input"
              class="sr-only"
            >
              {{ t('auth.login.smsVerificationCode') }}
            </label>
            <input
              id="sms-otp-input"
              :value="smsOtpCode"
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"
              autocomplete="one-time-code"
              maxlength="6"
              placeholder="000000"
              :disabled="isVerifyingSms"
              :aria-label="t('auth.login.smsOtpAriaLabel')"
              class="w-48 mx-auto block text-center text-3xl tracking-[0.5em] font-mono bg-transparent border border-default rounded-none px-4 py-3 text-highlighted placeholder:text-dimmed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-50"
              @input="(e: Event) => { smsOtpCode = (e.target as HTMLInputElement).value; handleSmsOtpInput() }"
            >
            <p
              v-if="smsOtpError"
              class="text-sm text-error mt-2"
              role="alert"
            >
              {{ smsOtpError }}
            </p>
            <p
              v-if="isVerifyingSms"
              class="text-sm text-muted mt-2"
            >
              {{ t('auth.login.verifying') }}
            </p>
          </div>
          <div class="pt-2">
            <u-button
              v-if="canResendSms"
              :label="t('auth.login.sendAgain')"
              :icon="resolveIcon('reload')"
              size="md"
              variant="outline"
              color="neutral"
              :disabled="isLoading"
              :loading="isLoading"
              class="motion-safe:transition-transform motion-safe:hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-primary-500"
              :aria-label="t('auth.login.resendSmsCode')"
              @click="handleSMSOTP"
            ></u-button>
            <p
              v-else
              class="text-sm text-dimmed"
            >
              {{ t('auth.login.sendAgainIn', { n: resendSmsCountdown }) }}
            </p>
          </div>
          <u-button
            :label="t('auth.login.backToLogin')"
            variant="ghost"
            size="sm"
            color="neutral"
            class="focus-visible:ring-2 focus-visible:ring-primary-500"
            :aria-label="t('auth.login.returnToLoginForm')"
            @click="smsOtpSent = false; smsOtpCode = ''; smsOtpError = ''; phoneNumber = ''"
          ></u-button>
        </div>

        <!-- Email input (always visible) -->
        <div
          v-else
          class="space-y-6"
        >
          <div class="space-y-2">
            <label
              for="email-input"
              class="block text-sm font-medium text-muted"
            >
              {{ t('auth.login.emailAddress') }}
            </label>
            <u-input
              id="email-input"
              v-model="email"
              type="email"
              :placeholder="t('auth.login.emailPlaceholder')"
              autocomplete="email"
              size="lg"
              :leading-icon="resolveIcon('mail')"
              :disabled="isLoading"
              :aria-label="t('auth.login.emailAddress')"
              class="w-full"
              @input="emailError = ''"
            ></u-input>
            <p
              v-if="emailError"
              class="text-sm text-error"
              role="alert"
            >
              {{ emailError }}
            </p>
          </div>

          <!-- Phone number input (conditional) -->
          <div
            v-if="selectedMethod === 'sms-otp'"
            class="space-y-2 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2"
          >
            <label
              for="phone-input"
              class="block text-sm font-medium text-muted"
            >
              {{ t('auth.login.phoneNumber') }}
            </label>
            <u-input
              id="phone-input"
              v-model="phoneNumber"
              type="tel"
              :placeholder="t('auth.login.phonePlaceholder')"
              autocomplete="tel"
              size="lg"
              :leading-icon="resolveIcon('phone')"
              :disabled="isLoading"
              :aria-label="t('auth.login.phoneNumber')"
              class="w-full"
              @input="phoneError = ''"
            ></u-input>
            <p
              v-if="phoneError"
              class="text-sm text-error"
              role="alert"
            >
              {{ phoneError }}
            </p>
          </div>

          <!-- Method selector buttons -->
          <div class="space-y-2">
            <p class="text-xs text-dimmed mb-3">
              {{ t('auth.login.chooseMethod') }}
            </p>

            <!-- Magic link (primary/default) -->
            <u-button
              :label="t('auth.login.sendMagicLink')"
              :icon="resolveIcon('wand')"
              size="lg"
              block
              :variant="selectedMethod === 'magic-link' ? 'solid' : 'outline'"
              :loading="loadingMethod === 'magic-link'"
              :disabled="isLoading"
              class="motion-safe:transition-transform motion-safe:hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-primary-500"
              :aria-label="t('auth.login.sendMagicLinkAria')"
              @click="selectedMethod = 'magic-link'; handleMagicLink()"
            ></u-button>

            <!-- Email OTP -->
            <u-button
              :label="t('auth.login.sendEmailCode')"
              :icon="resolveIcon('mail')"
              size="lg"
              block
              color="neutral"
              :variant="selectedMethod === 'email-otp' ? 'solid' : 'outline'"
              :loading="loadingMethod === 'email-otp'"
              :disabled="isLoading"
              class="motion-safe:transition-transform motion-safe:hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-primary-500"
              :aria-label="t('auth.login.sendEmailCodeAria')"
              @click="selectedMethod = 'email-otp'; handleEmailOTP()"
            ></u-button>

            <!-- SMS OTP -->
            <u-button
              :label="t('auth.login.sendSmsCode')"
              :icon="resolveIcon('messageCode')"
              size="lg"
              block
              color="neutral"
              :variant="selectedMethod === 'sms-otp' ? 'solid' : 'outline'"
              :loading="loadingMethod === 'sms-otp'"
              :disabled="isLoading"
              class="motion-safe:transition-transform motion-safe:hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-primary-500"
              :aria-label="t('auth.login.sendSmsCodeAria')"
              @click="selectedMethod === 'sms-otp' ? handleSMSOTP() : selectedMethod = 'sms-otp'"
            ></u-button>
          </div>

          <!-- Divider -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <u-separator></u-separator>
            </div>
            <div class="relative flex justify-center text-xs">
              <span class="bg-default px-2 text-dimmed">
                {{ t('auth.login.orContinueWith') }}
              </span>
            </div>
          </div>

          <!-- GitHub OAuth -->
          <u-button
            :label="t('auth.login.continueWithGithub')"
            icon="i-simple-icons-github"
            size="lg"
            block
            color="neutral"
            variant="outline"
            :loading="loadingMethod === 'github'"
            :disabled="isLoading"
            class="motion-safe:transition-transform motion-safe:hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-primary-500"
            :aria-label="t('auth.login.signInWithGithub')"
            @click="handleGitHub"
          ></u-button>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-xs text-center text-dimmed mt-6">
        {{ t('auth.login.termsNotice') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authClient } from '~/lib/auth-client'

definePageMeta({
  layout: 'landing',
  middleware: ['guest'],
})

// Validation regex patterns (module scope to avoid re-compilation)
const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
const phoneRegex = /^\+?[\d\s()\-]+$/
const digitOnlyRegex = /\D/g

const route = useRoute()
const { t } = useI18n()
const { resolveIcon } = useAppearance()

// Get redirect destination from query param (set by auth middleware)
const redirectTo = computed(() => {
  const redirect = route.query.redirect as string | undefined
  // Validate redirect is a local path to prevent open redirect
  if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
    return redirect
  }
  return '/app'
})

// Primary email input
const email = ref('')
const emailError = ref('')

// Phone number for SMS method
const phoneNumber = ref('')
const phoneError = ref('')

// Selected method
const selectedMethod = ref<'magic-link' | 'email-otp' | 'sms-otp'>('magic-link')

// Loading states — one per action to show spinner on the correct button
const loadingMethod = ref<'magic-link' | 'email-otp' | 'sms-otp' | 'github' | null>(null)
const isLoading = computed(() => loadingMethod.value !== null)

// Magic link confirmation state
const magicLinkSent = ref(false)
const magicLinkHeading = ref<HTMLElement | null>(null)
const magicLinkEmail = ref('')
const canResendMagicLink = ref(true)
const resendCountdown = ref(0)

// Email OTP state
const emailOtpSent = ref(false)
const emailOtpEmail = ref('')
const otpCode = ref('')
const otpError = ref('')
const isVerifying = ref(false)
const canResendOtp = ref(true)
const resendOtpCountdown = ref(0)

// SMS OTP state
const smsOtpSent = ref(false)
const smsOtpPhone = ref('')
const smsOtpCode = ref('')
const smsOtpError = ref('')
const isVerifyingSms = ref(false)
const canResendSms = ref(true)
const resendSmsCountdown = ref(0)

// Validation
function validateEmail(value: string): boolean {
  if (!value) {
    emailError.value = t('auth.login.emailRequired')
    return false
  }
  if (!emailRegex.test(value)) {
    emailError.value = t('auth.login.emailInvalid')
    return false
  }
  emailError.value = ''
  return true
}

function validatePhone(value: string): boolean {
  if (!value) {
    phoneError.value = t('auth.login.phoneRequired')
    return false
  }
  // Basic validation - should start with + and contain only digits and spaces
  if (!phoneRegex.test(value)) {
    phoneError.value = t('auth.login.phoneInvalid')
    return false
  }
  phoneError.value = ''
  return true
}

// Countdown timer for resend
const activeIntervals: ReturnType<typeof setInterval>[] = []

onUnmounted(() => {
  activeIntervals.forEach(id => clearInterval(id))
})

function startResendCountdown() {
  canResendMagicLink.value = false
  resendCountdown.value = 30

  const interval = setInterval(() => {
    resendCountdown.value--
    if (resendCountdown.value <= 0) {
      clearInterval(interval)
      canResendMagicLink.value = true
    }
  }, 1000)
  activeIntervals.push(interval)
}

// Method handlers
async function handleMagicLink() {
  if (!validateEmail(email.value))
    return
  loadingMethod.value = 'magic-link'
  emailError.value = ''
  const { error } = await authClient.signIn.magicLink({
    email: email.value,
    callbackURL: redirectTo.value,
  })
  loadingMethod.value = null
  if (error) {
    emailError.value = error.message || t('auth.login.magicLinkFailed')
    return
  }
  magicLinkSent.value = true
  magicLinkEmail.value = email.value
  startResendCountdown()
  nextTick(() => magicLinkHeading.value?.focus())
}

async function handleEmailOTP() {
  if (!validateEmail(email.value))
    return
  loadingMethod.value = 'email-otp'
  emailError.value = ''
  const { error } = await authClient.emailOtp.sendVerificationOtp({
    email: email.value,
    type: 'sign-in',
  })
  loadingMethod.value = null
  if (error) {
    emailError.value = error.message || t('auth.login.emailCodeFailed')
    return
  }
  emailOtpSent.value = true
  emailOtpEmail.value = email.value
  otpCode.value = ''
  otpError.value = ''
  startOtpResendCountdown()
  nextTick(() => {
    document.getElementById('otp-input')?.focus()
  })
}

function startOtpResendCountdown() {
  canResendOtp.value = false
  resendOtpCountdown.value = 30
  const interval = setInterval(() => {
    resendOtpCountdown.value--
    if (resendOtpCountdown.value <= 0) {
      clearInterval(interval)
      canResendOtp.value = true
    }
  }, 1000)
  activeIntervals.push(interval)
}

function handleOtpInput() {
  otpCode.value = otpCode.value.replace(digitOnlyRegex, '').slice(0, 6)
  otpError.value = ''
  if (otpCode.value.length === 6) {
    handleVerifyOtp()
  }
}

async function handleVerifyOtp() {
  isVerifying.value = true
  otpError.value = ''
  const { error } = await authClient.emailOtp.verifyEmail({
    email: emailOtpEmail.value,
    otp: otpCode.value,
  })
  isVerifying.value = false
  if (error) {
    otpError.value = error.message || t('auth.login.codeInvalid')
    return
  }
  navigateTo(redirectTo.value)
}

async function handleSMSOTP() {
  if (!validatePhone(phoneNumber.value))
    return
  loadingMethod.value = 'sms-otp'
  phoneError.value = ''
  const { error } = await authClient.phoneNumber.sendOtp({
    phoneNumber: phoneNumber.value,
  })
  loadingMethod.value = null
  if (error) {
    phoneError.value = error.message || t('auth.login.smsCodeFailed')
    return
  }
  smsOtpSent.value = true
  smsOtpPhone.value = phoneNumber.value
  smsOtpCode.value = ''
  smsOtpError.value = ''
  startSmsResendCountdown()
  nextTick(() => {
    document.getElementById('sms-otp-input')?.focus()
  })
}

function startSmsResendCountdown() {
  canResendSms.value = false
  resendSmsCountdown.value = 30
  const interval = setInterval(() => {
    resendSmsCountdown.value--
    if (resendSmsCountdown.value <= 0) {
      clearInterval(interval)
      canResendSms.value = true
    }
  }, 1000)
  activeIntervals.push(interval)
}

function handleSmsOtpInput() {
  smsOtpCode.value = smsOtpCode.value.replace(digitOnlyRegex, '').slice(0, 6)
  smsOtpError.value = ''
  if (smsOtpCode.value.length === 6) {
    handleVerifySmsOtp()
  }
}

async function handleVerifySmsOtp() {
  isVerifyingSms.value = true
  smsOtpError.value = ''
  const { error } = await authClient.phoneNumber.verify({
    phoneNumber: smsOtpPhone.value,
    code: smsOtpCode.value,
  })
  isVerifyingSms.value = false
  if (error) {
    smsOtpError.value = error.message || t('auth.login.codeInvalid')
    return
  }
  navigateTo(redirectTo.value)
}

async function handleGitHub() {
  loadingMethod.value = 'github'
  try {
    await authClient.signIn.social({
      provider: 'github',
      callbackURL: redirectTo.value,
    })
  }
  catch (e: unknown) {
    emailError.value = e instanceof Error ? e.message : t('auth.login.githubFailed')
    loadingMethod.value = null
  }
}

// Watch method selection to clear errors and OTP state
watch(selectedMethod, () => {
  emailError.value = ''
  phoneError.value = ''
  otpError.value = ''
  otpCode.value = ''
  smsOtpError.value = ''
  smsOtpCode.value = ''
})
</script>
