<template>
  <u-card
    class="email-settings-panel"
    :ui="{
      root: 'h-fit',
      header: 'py-3 px-4 border-b border-[var(--ui-border)]',
      body: 'p-0',
    }"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <u-icon :name="resolveIcon('settings')" class="w-4 h-4 text-ui-text-muted"></u-icon>
        <span class="text-sm font-medium text-ui-text">Settings</span>
      </div>
    </template>

    <u-accordion
      v-model="openSections"
      type="multiple"
      :items="accordionItems"
      :ui="{
        item: 'border-b border-[var(--ui-border)] last:border-b-0',
        trigger: 'px-4 py-3 text-sm font-medium hover:bg-[var(--ui-bg-elevated)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] focus-visible:ring-inset',
        content: 'px-4 pb-4',
        leadingIcon: 'w-4 h-4 text-ui-text-muted',
        trailingIcon: 'w-4 h-4 text-ui-text-dimmed',
      }"
    >
      <!-- Recipients Section Content -->
      <template #recipients>
        <email-recipient-selector
          :mode="mode"
          :manual-recipients="manualRecipients"
          :selected-list-slug="selectedListSlug"
          :email-lists="emailLists"
          :recipient-count="recipientCount"
          @update:mode="emit('update:mode', $event)"
          @update:manual-recipients="emit('update:manualRecipients', $event)"
          @update:selected-list-slug="emit('update:selectedListSlug', $event)"
        ></email-recipient-selector>
      </template>

      <!-- Template Section Content -->
      <template #template>
        <u-select
          :model-value="template"
          :items="templates"
          size="md"
          name="email-template"
          class="w-full"
          @update:model-value="emit('update:template', $event as 'newsletter' | 'announcement' | 'personal')"
        ></u-select>
      </template>

      <!-- Output Format Section Content -->
      <template #format>
        <u-select
          :model-value="outputFormat"
          :items="formatOptions"
          size="md"
          name="output-format"
          class="w-full"
          @update:model-value="emit('update:outputFormat', $event as 'html' | 'markdown' | 'jira')"
        ></u-select>
      </template>
    </u-accordion>
  </u-card>
</template>

<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'

defineProps<{
  mode: 'manual' | 'list'
  manualRecipients: string
  selectedListSlug: string
  template: 'newsletter' | 'announcement' | 'personal'
  outputFormat: 'markdown' | 'html' | 'jira'
  emailLists: Array<{ path: string, name?: string, title?: string, contacts?: Array<{ email: string }> }>
  recipientCount: number
}>()

const emit = defineEmits<{
  'update:mode': [value: 'manual' | 'list']
  'update:manualRecipients': [value: string]
  'update:selectedListSlug': [value: string]
  'update:template': [value: 'newsletter' | 'announcement' | 'personal']
  'update:outputFormat': [value: 'markdown' | 'html' | 'jira']
}>()

const { resolveIcon } = useAppearance()

const templates = computed(() => [
  { value: 'newsletter', label: 'Newsletter', icon: resolveIcon('news') },
  { value: 'announcement', label: 'Announcement', icon: resolveIcon('speakerphone') },
  { value: 'personal', label: 'Personal', icon: resolveIcon('user') },
])

const formatOptions = [
  { value: 'markdown', label: 'Markdown' },
  { value: 'html', label: 'HTML' },
  { value: 'jira', label: 'Jira' },
]

// Accordion items configuration
const accordionItems = computed<AccordionItem[]>(() => [
  {
    label: 'Recipients',
    icon: resolveIcon('users'),
    value: 'recipients',
    slot: 'recipients' as const,
  },
  {
    label: 'Template',
    icon: resolveIcon('template'),
    value: 'template',
    slot: 'template' as const,
  },
  {
    label: 'Output Format',
    icon: resolveIcon('code'),
    value: 'format',
    slot: 'format' as const,
  },
])

// Default all sections open
const openSections = ref(['recipients', 'template', 'format'])
</script>

<style scoped>
.email-settings-panel {
  width: 100%;
}

@media (min-width: 768px) {
  .email-settings-panel {
    width: 15rem; /* w-60 = 240px */
  }
}

@media (min-width: 1024px) {
  .email-settings-panel {
    width: 17.5rem; /* w-70 = 280px */
  }
}
</style>
