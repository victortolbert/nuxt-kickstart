<template>
  <u-container class="max-w-7xl">
    <div class="py-6 lg:py-8 space-y-6">
      <!-- Header -->
      <email-compose-header
        :last-saved-at="lastSavedAt"
        :is-saving="isSavingDraft"
        :draft-id="draftId"
      ></email-compose-header>

      <!-- Subject Line Card -->
      <u-card
        :ui="{
          root: 'animate-fade-in',
          body: 'p-4 sm:p-5',
        }"
      >
        <u-form-field label="Subject" name="subject">
          <u-input
            v-model="subject"
            name="email-subject"
            placeholder="Enter your email subject line…"
            :leading-icon="resolveIcon('mail')"
            size="lg"
            autocomplete="off"
            class="w-full"
          ></u-input>
        </u-form-field>
      </u-card>

      <!-- Two-Panel Layout -->
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Settings Panel (Left Sidebar - Desktop) -->
        <aside class="hidden md:block shrink-0 animate-fade-in animate-delay-0">
          <div class="sticky top-20">
            <email-settings-panel
              :mode="recipientMode"
              :manual-recipients="manualRecipients"
              :selected-list-slug="selectedListSlug"
              :template="template"
              :output-format="outputFormat"
              :email-lists="emailLists || []"
              :recipient-count="recipientCount"
              @update:mode="recipientMode = $event"
              @update:manual-recipients="manualRecipients = $event"
              @update:selected-list-slug="selectedListSlug = $event"
              @update:template="template = $event"
              @update:output-format="outputFormat = $event"
            ></email-settings-panel>
          </div>
        </aside>

        <!-- Settings Panel (Mobile - Above Editor) -->
        <div class="md:hidden animate-fade-in animate-delay-0">
          <email-settings-panel
            :mode="recipientMode"
            :manual-recipients="manualRecipients"
            :selected-list-slug="selectedListSlug"
            :template="template"
            :output-format="outputFormat"
            :email-lists="emailLists || []"
            :recipient-count="recipientCount"
            @update:mode="recipientMode = $event"
            @update:manual-recipients="manualRecipients = $event"
            @update:selected-list-slug="selectedListSlug = $event"
            @update:template="template = $event"
            @update:output-format="outputFormat = $event"
          ></email-settings-panel>
        </div>

        <!-- Editor Panel (Main Content) -->
        <main class="flex-1 min-w-0 animate-fade-in animate-delay-60">
          <email-editor-panel
            ref="editorRef"
            v-model="body"
            :preview-html="previewHtml"
            :is-loading-preview="isLoadingPreview"
            :output-format="outputFormat"
          ></email-editor-panel>
        </main>
      </div>

      <!-- Action Bar -->
      <email-action-bar
        :can-send="canSend"
        :is-sending="isSending"
        :is-scheduling="isScheduling"
        :has-content="!!body.trim()"
        @copy-jira="copyAsJira"
        @schedule="openScheduleModal"
        @send="handleSendEmail"
      ></email-action-bar>
    </div>

    <!-- Schedule Modal -->
    <email-schedule-modal
      v-model="isScheduleModalOpen"
      v-model:scheduled-date-time="scheduledDateTime"
      :recipient-count="recipientCount"
      :is-scheduling="isScheduling"
      @schedule="scheduleEmail"
    ></email-schedule-modal>
  </u-container>
</template>

<script setup lang="ts">
import { serializeToJira } from '~~/lib/jira-markup-serializer'

definePageMeta({
  middleware: 'admin',
})

const confirm = useConfirmDialog()
const { resolveIcon } = useAppearance()
const editorRef = ref()

// Load email lists for dropdown
const { data: emailLists } = await useAsyncData('email-lists', () =>
  queryCollection('emailLists').order('title', 'ASC').all())

// Use email compose composable for all state and logic
const {
  subject,
  body,
  template,
  outputFormat,
  recipientMode,
  manualRecipients,
  selectedListSlug,
  previewHtml,
  isLoadingPreview,
  draftId,
  isSavingDraft,
  lastSavedAt,
  isSending,
  isScheduleModalOpen,
  scheduledDateTime,
  isScheduling,
  recipientCount,
  canSend,
  saveDraft,
  loadDraft,
  initializeFromQueryParams,
  sendEmail,
  openScheduleModal,
  scheduleEmail,
} = useEmailCompose(emailLists)

// Initialize from query params and load draft
initializeFromQueryParams()
await loadDraft()

// Copy content as Jira markup
async function copyAsJira() {
  const toast = useToast()

  try {
    // Access the editor instance from the EmailEditorPanel -> RichTextEditor component
    const editorInstance = editorRef.value?.editorRef?.editor?.editor
    if (!editorInstance) {
      toast.add({
        title: 'Error',
        description: 'Editor not available',
        color: 'error',
      })
      return
    }

    // Get JSON content from editor and convert to Jira markup
    const json = editorInstance.getJSON()
    const jiraMarkup = serializeToJira(json)

    // Copy to clipboard
    await navigator.clipboard.writeText(jiraMarkup)

    toast.add({
      title: 'Copied as Jira markup',
      description: 'Content has been copied to your clipboard',
      color: 'success',
    })
  }
  catch (error) {
    console.error('Failed to copy as Jira:', error)
    toast.add({
      title: 'Failed to copy',
      description: error instanceof Error ? error.message : 'Could not copy content to clipboard',
      color: 'error',
    })
  }
}

// Wrap sendEmail to pass confirm dialog
async function handleSendEmail() {
  await sendEmail(confirm)
}

// Register keyboard shortcuts
useEmailKeyboardShortcuts({
  canSend,
  isScheduleModalOpen,
  saveDraft,
  openScheduleModal,
  sendEmail: handleSendEmail,
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 250ms ease-out;
  animation-fill-mode: both;
}

.animate-delay-0 {
  animation-delay: 0ms;
}

.animate-delay-60 {
  animation-delay: 60ms;
}

.animate-delay-120 {
  animation-delay: 120ms;
}

.animate-delay-180 {
  animation-delay: 180ms;
}

@media (prefers-reduced-motion: reduce) {
  .animate-fade-in {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
</style>
