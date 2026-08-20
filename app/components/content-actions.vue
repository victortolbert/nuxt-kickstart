<template>
  <div class="flex items-center gap-1 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-bg)] p-1 print:hidden">
    <u-tooltip :text="t('content.actions.copyLink')">
      <button
        type="button"
        class="flex size-10 items-center justify-center rounded-md text-[var(--ui-text-muted)] transition-colors hover:bg-[var(--ui-bg-elevated)] hover:text-[var(--ui-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]"
        :aria-label="t('content.actions.copyLink')"
        @click="copyLink"
      >
        <u-icon :name="resolveIcon('link')" class="size-5"></u-icon>
      </button>
    </u-tooltip>
    <u-tooltip :text="t('content.actions.emailPage')">
      <nuxt-link
        :to="emailHref"
        external
        class="flex size-10 items-center justify-center rounded-md text-[var(--ui-text-muted)] transition-colors hover:bg-[var(--ui-bg-elevated)] hover:text-[var(--ui-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]"
        :aria-label="t('content.actions.emailPage')"
      >
        <u-icon :name="resolveIcon('mail')" class="size-5"></u-icon>
      </nuxt-link>
    </u-tooltip>
    <u-tooltip :text="t('content.actions.printPage')">
      <button
        type="button"
        class="flex size-10 items-center justify-center rounded-md text-[var(--ui-text-muted)] transition-colors hover:bg-[var(--ui-bg-elevated)] hover:text-[var(--ui-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]"
        :aria-label="t('content.actions.printPage')"
        @click="handlePrint"
      >
        <u-icon :name="resolveIcon('printer')" class="size-5"></u-icon>
      </button>
    </u-tooltip>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  description?: string
  subjectPrefix?: string
}>()

const { t } = useI18n()
const toast = useToast()
const { resolveIcon } = useAppearance()

const pageUrl = ref('')

onMounted(() => {
  pageUrl.value = window.location.href
})

const subjectPrefix = computed(() => props.subjectPrefix ?? t('content.actions.subjectPrefix'))

const emailHref = computed(() => {
  if (!pageUrl.value)
    return '#'
  const subject = encodeURIComponent(`${subjectPrefix.value}: ${props.title}`)
  const body = encodeURIComponent(
    `${props.description ? `${props.description}\n\n` : ''}${pageUrl.value}`,
  )
  return `mailto:?subject=${subject}&body=${body}`
})

async function copyLink() {
  try {
    await navigator.clipboard.writeText(pageUrl.value)
    toast.add({
      title: t('content.actions.toasts.copied.title'),
      description: t('content.actions.toasts.copied.description'),
      icon: resolveIcon('check'),
      color: 'success',
    })
  }
  catch {
    toast.add({
      title: t('content.actions.toasts.copyFailed.title'),
      description: t('content.actions.toasts.copyFailed.description'),
      icon: resolveIcon('close'),
      color: 'error',
    })
  }
}

function handlePrint() {
  window.print()
}
</script>
