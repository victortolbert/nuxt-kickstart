<template>
  <div class="space-y-4">
    <!-- Mode Toggle -->
    <u-radio-group
      :model-value="mode"
      :items="recipientModes"
      orientation="horizontal"
      size="sm"
      name="recipient-mode"
      @update:model-value="emit('update:mode', $event as 'manual' | 'list')"
    ></u-radio-group>

    <!-- Manual Mode -->
    <div v-if="mode === 'manual'">
      <u-textarea
        :model-value="manualRecipients"
        name="manual-recipients"
        placeholder="Enter email addresses separated by commas (e.g., user1@example.com, user2@example.com)"
        :rows="3"
        autocomplete="off"
        @update:model-value="emit('update:manualRecipients', $event)"
      ></u-textarea>
      <!-- Validation Errors -->
      <div
        v-if="invalidEmails.length > 0"
        class="mt-2 text-sm text-(--color-error-500)"
        role="alert"
      >
        Invalid email format: {{ invalidEmails.join(', ') }}
      </div>
    </div>

    <!-- List Mode -->
    <div v-else>
      <u-select
        :model-value="selectedListSlug"
        :items="listOptions"
        name="contact-list"
        placeholder="Select a contact list"
        size="md"
        @update:model-value="emit('update:selectedListSlug', String($event ?? ''))"
      ></u-select>
    </div>

    <!-- Recipient Count Badge -->
    <div v-if="recipientCount > 0" class="flex items-center gap-2">
      <u-badge color="primary" variant="subtle">
        {{ recipientCount }} {{ recipientCount === 1 ? 'recipient' : 'recipients' }}
      </u-badge>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  mode: 'manual' | 'list'
  manualRecipients: string
  selectedListSlug: string
  emailLists: Array<{ path: string, name?: string, title?: string, contacts?: Array<{ email: string }> }>
  recipientCount: number
}>()

const emit = defineEmits<{
  'update:mode': [value: 'manual' | 'list']
  'update:manualRecipients': [value: string]
  'update:selectedListSlug': [value: string]
}>()

const recipientModes = [
  { value: 'manual', label: 'Manual' },
  { value: 'list', label: 'List' },
]

const listOptions = computed(() => {
  if (!props.emailLists)
    return []
  return props.emailLists.map(list => ({
    value: list.path.split('/').pop() || '',
    label: `${list.name || list.title} (${list.contacts?.length || 0} contacts)`,
  }))
})

// Validate manual email formats
const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
const invalidEmails = computed(() => {
  if (props.mode !== 'manual')
    return []
  const emails = props.manualRecipients
    .split(',')
    .map(e => e.trim())
    .filter(e => e.length > 0)
  return emails.filter(email => !emailRegex.test(email))
})
</script>
