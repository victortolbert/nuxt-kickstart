<template>
  <div
    class="relative rounded-lg border-2 border-dashed p-8 text-center transition-colors"
    :class="{
      'border-primary bg-primary/5': isDragging && !disabled,
      'border-default hover:border-primary/50 cursor-pointer': !disabled && !isDragging,
      'border-muted opacity-50 cursor-not-allowed': disabled,
    }"
    role="button"
    tabindex="0"
    :aria-disabled="disabled || undefined"
    aria-label="Upload a JSON token file. Drag and drop, or activate to browse."
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
    @dragover="handleDragOver"
    @drop="handleDrop"
    @click="triggerFileInput"
    @keydown.enter.prevent="triggerFileInput"
    @keydown.space.prevent="triggerFileInput"
  >
    <input
      ref="fileInputRef"
      type="file"
      accept=".json"
      class="hidden"
      aria-label="Upload tokens JSON file"
      :disabled="disabled"
      @change="handleFileInput"
    >

    <div class="flex flex-col items-center gap-3">
      <u-icon
        :name="resolveIcon('upload')"
        class="text-4xl"
        :class="isDragging && !disabled ? 'text-primary' : 'text-muted'"
      ></u-icon>

      <div class="space-y-1">
        <p class="text-sm font-medium text-default">
          Drop JSON file here or click to browse
        </p>
        <p class="text-xs text-muted">
          Maximum file size: {{ (maxSize / (1024 * 1024)).toFixed(1) }}MB
        </p>
      </div>

      <u-button
        variant="outline"
        size="sm"
        :disabled="disabled"
        @click.stop="triggerFileInput"
      >
        Choose File
      </u-button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  disabled?: boolean
  maxSize?: number
}>(), {
  disabled: false,
  maxSize: 5 * 1024 * 1024, // 5MB default
})

const emit = defineEmits<{
  fileSelected: [file: File]
  error: [message: string]
}>()

const { resolveIcon } = useAppearance()

const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement>()

function handleDragEnter(event: DragEvent) {
  if (props.disabled)
    return
  event.preventDefault()
  isDragging.value = true
}

function handleDragLeave(event: DragEvent) {
  if (props.disabled)
    return
  event.preventDefault()
  isDragging.value = false
}

function handleDragOver(event: DragEvent) {
  if (props.disabled)
    return
  event.preventDefault()
}

function handleDrop(event: DragEvent) {
  if (props.disabled)
    return

  event.preventDefault()
  isDragging.value = false

  const files = event.dataTransfer?.files
  if (!files || files.length === 0)
    return

  const file = files[0]
  if (file)
    validateAndEmitFile(file)
}

function handleFileInput(event: Event) {
  if (props.disabled)
    return

  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files || files.length === 0)
    return

  const file = files[0]
  if (file)
    validateAndEmitFile(file)

  // Reset input so the same file can be selected again
  input.value = ''
}

function validateAndEmitFile(file: File) {
  // Check file type
  if (!file.name.endsWith('.json')) {
    emit('error', 'Only JSON files are allowed')
    return
  }

  // Check file size
  if (file.size > props.maxSize) {
    const maxSizeMB = (props.maxSize / (1024 * 1024)).toFixed(1)
    emit('error', `File size exceeds ${maxSizeMB}MB limit`)
    return
  }

  emit('fileSelected', file)
}

function triggerFileInput() {
  if (props.disabled)
    return
  fileInputRef.value?.click()
}
</script>
