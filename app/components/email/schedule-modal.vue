<template>
  <u-modal
    v-model:open="isOpen"
    title="Schedule Email"
    description="Choose when to send this email"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <div class="space-y-4">
        <p class="text-sm text-ui-text-muted">
          Choose when you want this email to be sent to {{ recipientCount }} {{ recipientCount === 1 ? 'recipient' : 'recipients' }}.
        </p>

        <u-form-field label="Schedule Date & Time">
          <u-input
            v-model="dateTime"
            type="datetime-local"
            name="schedule-datetime"
            :leading-icon="resolveIcon('calendar')"
            :min="new Date().toISOString().slice(0, 16)"
          ></u-input>
        </u-form-field>
      </div>
    </template>

    <template #footer>
      <u-button
        color="neutral"
        variant="outline"
        @click="isOpen = false"
      >
        Cancel
      </u-button>
      <u-button
        color="primary"
        :disabled="!scheduledDateTime || isScheduling"
        :loading="isScheduling"
        @click="emit('schedule')"
      >
        <template #leading>
          <u-icon :name="resolveIcon('clock')"></u-icon>
        </template>
        Schedule Email
      </u-button>
    </template>
  </u-modal>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  scheduledDateTime: string
  recipientCount: number
  isScheduling: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
  'update:scheduledDateTime': [string]
  'schedule': []
}>()

const { resolveIcon } = useAppearance()

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const dateTime = computed({
  get: () => props.scheduledDateTime,
  set: value => emit('update:scheduledDateTime', value),
})
</script>
