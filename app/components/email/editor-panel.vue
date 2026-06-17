<template>
  <div class="email-editor-panel grid min-h-125 gap-6 lg:grid-cols-2">
    <!-- Editor (left panel on desktop, top on mobile) -->
    <u-card
      class="editor-section animate-fade-in animate-delay-0"
      :ui="{
        root: 'h-full flex flex-col',
        header: 'py-3 px-4 border-b border-default',
        body: 'flex-1 p-0 overflow-hidden',
      }"
    >
      <template #header>
        <div class="flex items-center gap-2">
          <u-icon :name="resolveIcon('edit')" class="w-4 h-4 text-ui-text-muted"></u-icon>
          <span class="text-sm font-medium text-ui-text">Compose</span>
          <u-badge
            :label="outputFormat.toUpperCase()"
            color="neutral"
            variant="subtle"
            size="sm"
          ></u-badge>
        </div>
      </template>

      <rich-text-editor
        ref="editorRef"
        :model-value="modelValue"
        :content-type="outputFormat"
        placeholder="Write your email content here…"
        min-height="450px"
        @update:model-value="handleUpdate"
      ></rich-text-editor>
    </u-card>

    <!-- Preview (right panel on desktop, bottom on mobile) -->
    <u-card
      class="preview-section animate-fade-in animate-delay-60"
      :ui="{
        root: 'h-full flex flex-col',
        header: 'py-3 px-4 border-b border-[var(--ui-border)]',
        body: 'flex-1 p-0 overflow-hidden',
      }"
    >
      <template #header>
        <div class="flex items-center gap-2">
          <u-icon :name="resolveIcon('eye')" class="w-4 h-4 text-ui-text-muted"></u-icon>
          <span class="text-sm font-medium text-ui-text">Preview</span>
        </div>
      </template>

      <email-preview
        :html="previewHtml"
        :is-loading="isLoadingPreview"
        :has-content="hasPreviewContent"
      ></email-preview>
    </u-card>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  modelValue: string
  previewHtml: string
  isLoadingPreview: boolean
  outputFormat: 'markdown' | 'html' | 'jira'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { resolveIcon } = useAppearance()

// Ref to RichTextEditor for accessing editor instance (used for Jira copy)
const editorRef = ref<Component | null>(null)

// Computed property to determine if preview has content
const hasPreviewContent = computed(() => {
  return props.previewHtml.length > 0
})

// Handle content updates from the rich text editor
function handleUpdate(value: string) {
  emit('update:modelValue', value)
}

// Expose editor ref for parent component to access (e.g., for copy as Jira functionality)
defineExpose({
  editorRef,
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 200ms ease-out;
  animation-fill-mode: both;
}

.animate-delay-0 {
  animation-delay: 0ms;
}

.animate-delay-60 {
  animation-delay: 60ms;
}

@media (prefers-reduced-motion: reduce) {
  .animate-fade-in {
    animation: none;
    opacity: 1;
  }
}

.email-editor-panel {
  width: 100%;
}

.editor-section,
.preview-section {
  min-height: 520px;
}

/* Ensure editor fills the card body */
.editor-section :deep(.rich-text-editor) {
  height: 100%;
}

.editor-section :deep(.tiptap-editor) {
  height: 100%;
}
</style>
