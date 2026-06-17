<template>
  <client-only>
    <u-popover v-if="showClock" :ui="{ content: 'p-0' }">
      <u-button
        color="neutral"
        variant="ghost"
        class="font-mono text-sm"
        :aria-label="t('clock.ariaLabel')"
      >
        <u-icon
          :name="resolveIcon('clock')"
          class="size-5"
          aria-hidden="true"
        ></u-icon>
        <span class="hidden sm:inline">{{ primaryTime }}</span>
      </u-button>

      <template #content>
        <div class="p-4 min-w-72">
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm font-medium">{{ t('clock.title') }}</span>
            <u-button
              :icon="resolveIcon('close')"
              color="neutral"
              variant="ghost"
              size="xs"
              :aria-label="t('clock.close')"
              @click="showClock = false"
            ></u-button>
          </div>

          <div class="space-y-3">
            <div
              v-for="tz in timezones"
              :key="tz.zone"
              class="flex items-center justify-between gap-4"
            >
              <div class="flex items-center gap-2">
                <span
                  class="size-2 rounded-full shrink-0"
                  :class="isWorkingHours(tz.zone) ? 'bg-green-500' : 'bg-neutral-400'"
                />
                <span class="text-sm font-medium">{{ tz.label }}</span>
                <span class="text-xs text-muted">{{ tz.abbr }}</span>
              </div>
              <div class="text-right font-mono whitespace-nowrap">
                <span class="text-sm">{{ formatTime(tz.zone) }}</span>
                <span class="text-xs text-muted ml-2">{{ formatDay(tz.zone) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="px-4 py-3 border-t border-default bg-muted/50">
          <p class="text-xs text-muted">
            <span class="inline-block size-2 rounded-full bg-green-500 mr-1.5 align-middle" />
            {{ t('clock.workingHours') }}
          </p>
        </div>
      </template>
    </u-popover>

    <u-button
      v-else
      :icon="resolveIcon('clock')"
      color="neutral"
      variant="ghost"
      :aria-label="t('clock.show')"
      @click="showClock = true"
    ></u-button>

    <template #fallback>
      <u-button
        color="neutral"
        variant="ghost"
        class="font-mono text-sm"
        disabled
      >
        <u-icon :name="resolveIcon('clock')" class="size-5"></u-icon>
        <span class="hidden sm:inline">--:-- / --:--</span>
      </u-button>
    </template>
  </client-only>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const { resolveIcon } = useAppearance()

const STORAGE_KEY = 'kickstart-world-clock-visible'

const showClock = useState('worldClockVisible', () => {
  if (import.meta.client) {
    return localStorage.getItem(STORAGE_KEY) !== 'false'
  }
  return true
})

// Persist preference
watch(showClock, (value) => {
  if (import.meta.client) {
    localStorage.setItem(STORAGE_KEY, String(value))
  }
})

const timezones = computed(() => [
  { label: t('clock.mumbai'), abbr: 'IST', zone: 'Asia/Kolkata', flag: '\u{1F1EE}\u{1F1F3}' },
  { label: t('clock.atlanta'), abbr: 'ET', zone: 'America/New_York', flag: '\u{1F1FA}\u{1F1F8}' },
  { label: t('clock.chicago'), abbr: 'CT', zone: 'America/Chicago', flag: '\u{1F1FA}\u{1F1F8}' },
  { label: t('clock.losAngeles'), abbr: 'PT', zone: 'America/Los_Angeles', flag: '\u{1F1FA}\u{1F1F8}' },
])

const now = ref<Date | null>(null)

// Update time every minute
let interval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  now.value = new Date()
  interval = setInterval(() => {
    now.value = new Date()
  }, 60000) // Update every minute
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})

function formatTime(zone: string): string {
  if (!now.value)
    return '--:--'
  // Locale-aware: en gets 12-hour, es gets 24-hour
  return now.value.toLocaleTimeString(locale.value, {
    timeZone: zone,
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatDay(zone: string): string {
  if (!now.value)
    return '---'
  return now.value.toLocaleDateString(locale.value, {
    timeZone: zone,
    weekday: 'short',
  })
}

function isWorkingHours(zone: string): boolean {
  if (!now.value)
    return false
  // en-US + hour12:false is intentional here: stable numeric parsing only
  const hour = Number.parseInt(
    now.value.toLocaleTimeString('en-US', {
      timeZone: zone,
      hour: 'numeric',
      hour12: false,
    }),
  )
  return hour >= 9 && hour < 18
}

// Primary display: first two timezones inline
const primaryTime = computed(() => {
  if (!now.value)
    return '--:-- / --:--'
  const first = formatTime(timezones.value[0]!.zone)
  const second = formatTime(timezones.value[1]!.zone)
  return `${first} / ${second}`
})
</script>
