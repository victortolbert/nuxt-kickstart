<template>
  <u-modal
    :title="props.title"
    :description="props.description"
    :dismissible="false"
    :ui="{ footer: 'justify-end' }"
  >
    <template v-if="props.icon" #icon>
      <div :class="props.icon" />
    </template>

    <template #footer>
      <u-button
        :label="props.cancelLabel"
        color="neutral"
        variant="outline"
        @click="emits('close', false)"
      ></u-button>
      <u-button
        :label="props.confirmLabel"
        :color="props.confirmColor"
        @click="emits('close', true)"
      ></u-button>
    </template>
  </u-modal>
</template>

<script lang="ts" setup>
interface ConfirmDialogProps {
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  confirmColor?: 'primary' | 'error' | 'neutral'
  icon?: string
}

const props = withDefaults(defineProps<ConfirmDialogProps>(), {
  title: 'Confirm',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  confirmColor: 'primary',
})

const emits = defineEmits<{
  close: [value: boolean]
}>()
</script>
