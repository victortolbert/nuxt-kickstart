<template>
  <u-button
    :disabled="isDisabled"
    :loading="isDownloading"
    :icon="resolveIcon('download')"
    @click="handleDownload"
  >
    {{ isDownloading ? 'Downloading...' : files.length > 1 ? `Download ${files.length} Files` : 'Download' }}
  </u-button>
</template>

<script setup lang="ts">
import JSZip from 'jszip'

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const { resolveIcon } = useAppearance()

const TIMESTAMP_SEPARATOR_REGEX = /[:.]/g

interface DownloadFile {
  filename: string
  content: string
  format: string
}

interface Props {
  files: DownloadFile[]
  disabled?: boolean
}

const isDownloading = ref(false)

const isDisabled = computed(() => props.disabled || props.files.length === 0 || isDownloading.value)

async function handleDownload() {
  if (isDisabled.value)
    return

  isDownloading.value = true

  try {
    if (props.files.length === 1) {
      // Single file: download directly
      const file = props.files[0]
      if (file) {
        downloadFile(file.content, file.filename)
      }
    }
    else {
      // Multiple files: create ZIP
      await downloadAsZip()
    }
  }
  catch (error) {
    console.error('Download failed:', error)
  }
  finally {
    isDownloading.value = false
  }
}

function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

async function downloadAsZip() {
  const zip = new JSZip()

  // Add all files to ZIP
  for (const file of props.files) {
    zip.file(file.filename, file.content)
  }

  // Generate ZIP blob
  const blob = await zip.generateAsync({ type: 'blob' })

  // Download ZIP with timestamp
  const timestamp = new Date().toISOString().replace(TIMESTAMP_SEPARATOR_REGEX, '-').slice(0, 19)
  const filename = `tokens-${timestamp}.zip`

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
</script>
