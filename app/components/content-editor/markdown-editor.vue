<template>
  <div class="markdown-editor">
    <rich-text-editor
      :model-value="modelValue"
      content-type="markdown"
      placeholder="Write your content in markdown..."
      min-height="300px"
      show-raw-toggle
      @update:model-value="$emit('update:modelValue', $event)"
    ></rich-text-editor>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
}

defineProps<Props>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style scoped>
.markdown-editor {
  @apply w-full;
}
</style>
