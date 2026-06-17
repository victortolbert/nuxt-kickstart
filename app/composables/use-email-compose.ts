import type { Ref } from 'vue'
import { useDebounceFn, useIntervalFn } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { useAppearance, useRoute, useRouter, useToast } from '#imports'

const EMAIL_REGEX = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/

export interface EmailComposeState {
  subject: Ref<string>
  body: Ref<string>
  template: Ref<'newsletter' | 'announcement' | 'personal'>
  outputFormat: Ref<'markdown' | 'html' | 'jira'>
  recipientMode: Ref<'manual' | 'list'>
  manualRecipients: Ref<string>
  selectedListSlug: Ref<string>
  previewHtml: Ref<string>
  isLoadingPreview: Ref<boolean>
  draftId: Ref<string>
  isSavingDraft: Ref<boolean>
  lastSavedAt: Ref<Date | null>
  lastSavedContent: Ref<string>
  isSending: Ref<boolean>
  isScheduleModalOpen: Ref<boolean>
  scheduledDateTime: Ref<string>
  isScheduling: Ref<boolean>
}

export interface EmailList {
  path: string
  name?: string
  title?: string
  contacts?: Array<{ email: string }>
}

interface DraftResponse {
  success: boolean
  id?: string
  draft?: {
    subject?: string
    body?: string
    template?: 'newsletter' | 'announcement' | 'personal'
    outputFormat?: 'markdown' | 'html' | 'jira'
    recipientMode?: 'manual' | 'list'
    listSlug?: string
    updatedAt?: string
  }
}

interface SendResponse {
  success: boolean
  sent?: number
}

interface PreviewResponse {
  success: boolean
  html?: string
}

export function useEmailCompose(emailLists: Ref<EmailList[] | null | undefined>) {
  const route = useRoute()
  const router = useRouter()
  const toast = useToast()
  const { resolveIcon } = useAppearance()

  // Core state — prefilled from share links (?subject=…&body=…) when present
  const subject = ref(typeof route.query.subject === 'string' ? route.query.subject : '')
  const body = ref(typeof route.query.body === 'string' ? route.query.body : '')
  const template = ref<'newsletter' | 'announcement' | 'personal'>('newsletter')
  const outputFormat = ref<'markdown' | 'html' | 'jira'>('markdown')
  const recipientMode = ref<'manual' | 'list'>('manual')
  const manualRecipients = ref('')
  const selectedListSlug = ref<string>('')
  const previewHtml = ref('')
  const isLoadingPreview = ref(false)

  // Draft state
  const draftId = ref<string>(route.query.draft as string || '')
  const lastSavedContent = ref('')
  const isSavingDraft = ref(false)
  const lastSavedAt = ref<Date | null>(null)

  // Send/schedule state
  const isSending = ref(false)
  const isScheduleModalOpen = ref(false)
  const scheduledDateTime = ref('')
  const isScheduling = ref(false)

  // Email validation

  // Calculate recipient count
  const recipientCount = computed(() => {
    if (recipientMode.value === 'manual') {
      const emails = manualRecipients.value
        .split(',')
        .map(e => e.trim())
        .filter(e => e.length > 0)
      return emails.length
    }
    else {
      const selectedList = emailLists.value?.find(
        list => list.path.split('/').pop() === selectedListSlug.value,
      )
      return selectedList?.contacts?.length || 0
    }
  })

  // Validate manual email formats
  const invalidEmails = computed(() => {
    if (recipientMode.value !== 'manual')
      return []
    const emails = manualRecipients.value
      .split(',')
      .map(e => e.trim())
      .filter(e => e.length > 0)
    return emails.filter(email => !EMAIL_REGEX.test(email))
  })

  // Check if send button should be disabled
  const canSend = computed(() => {
    return body.value.trim().length > 0
      && recipientCount.value > 0
      && invalidEmails.value.length === 0
  })

  // Get recipients array based on mode
  function getRecipients(): string[] {
    if (recipientMode.value === 'manual') {
      return manualRecipients.value
        .split(',')
        .map(e => e.trim())
        .filter(e => e.length > 0 && EMAIL_REGEX.test(e))
    }
    else {
      const selectedList = emailLists.value?.find(
        list => list.path.split('/').pop() === selectedListSlug.value,
      )
      return selectedList?.contacts?.map(c => c.email) || []
    }
  }

  // Get current content as string for change detection
  function getCurrentContent(): string {
    return JSON.stringify({
      subject: subject.value,
      body: body.value,
      template: template.value,
      outputFormat: outputFormat.value,
      recipientMode: recipientMode.value,
      manualRecipients: manualRecipients.value,
      selectedListSlug: selectedListSlug.value,
    })
  }

  // Check if content has changed since last save
  function hasContentChanged(): boolean {
    return getCurrentContent() !== lastSavedContent.value
  }

  // Fetch preview from API
  async function fetchPreview() {
    if (!body.value) {
      previewHtml.value = ''
      return
    }

    isLoadingPreview.value = true

    try {
      const response = await $fetch<PreviewResponse>('/api/email/preview', {
        method: 'POST',
        body: {
          markdown: body.value,
          template: template.value,
          subject: subject.value || 'Preview',
        },
      })

      if (response.success && response.html) {
        previewHtml.value = response.html
      }
    }
    catch (error) {
      toast.add({
        title: 'Failed to render preview',
        description: error instanceof Error ? error.message : 'An error occurred while rendering the preview',
        color: 'error',
        icon: resolveIcon('caution'),
      })
    }
    finally {
      isLoadingPreview.value = false
    }
  }

  // Debounced preview update (500ms delay)
  const debouncedFetchPreview = useDebounceFn(fetchPreview, 500)

  // Watch for changes and trigger preview update
  watch([body, template, subject], () => {
    debouncedFetchPreview()
  })

  // Auto-save draft
  async function saveDraft() {
    // Don't save if no content or already saving
    if (!subject.value && !body.value)
      return
    if (isSavingDraft.value)
      return
    if (!hasContentChanged())
      return

    isSavingDraft.value = true

    try {
      const recipients = getRecipients()

      const draftData = {
        subject: subject.value || 'Untitled Draft',
        body: body.value,
        template: template.value,
        outputFormat: outputFormat.value,
        recipientMode: recipientMode.value,
        recipients,
        ...(selectedListSlug.value && { listSlug: selectedListSlug.value }),
      }

      // Create or update draft
      if (draftId.value) {
        // Update existing draft
        await $fetch(`/api/email/drafts/${draftId.value}`, {
          method: 'PUT',
          body: draftData,
        })
      }
      else {
        // Create new draft
        const response = await $fetch<DraftResponse>('/api/email/drafts', {
          method: 'POST',
          body: draftData,
        })

        if (response.success && response.id) {
          draftId.value = response.id
          // Update URL with draft ID
          await router.replace({
            query: { draft: response.id },
          })
        }
      }

      // Update last saved state
      lastSavedContent.value = getCurrentContent()
      lastSavedAt.value = new Date()
    }
    catch (error) {
      toast.add({
        title: 'Failed to save draft',
        description: error instanceof Error ? error.message : 'An error occurred while saving the draft',
        color: 'error',
        icon: resolveIcon('caution'),
      })
    }
    finally {
      isSavingDraft.value = false
    }
  }

  // Auto-save every 30 seconds
  useIntervalFn(() => {
    saveDraft()
  }, 30000) // 30 seconds

  // Load draft if draft ID is present
  async function loadDraft() {
    if (!draftId.value)
      return

    try {
      const draftResponse = await $fetch<DraftResponse>(`/api/email/drafts/${draftId.value}`)
      if (draftResponse?.success && draftResponse?.draft) {
        const draft = draftResponse.draft
        subject.value = draft.subject || ''
        body.value = draft.body || ''
        template.value = draft.template || 'newsletter'
        outputFormat.value = draft.outputFormat || 'markdown'
        recipientMode.value = draft.recipientMode || 'manual'
        if (draft.listSlug) {
          selectedListSlug.value = draft.listSlug
        }
        // Update last saved state
        lastSavedContent.value = getCurrentContent()
        lastSavedAt.value = draft.updatedAt ? new Date(draft.updatedAt) : new Date()
      }
    }
    catch (error) {
      toast.add({
        title: 'Failed to load draft',
        description: error instanceof Error ? error.message : 'An error occurred while loading the draft',
        color: 'error',
        icon: resolveIcon('caution'),
      })
    }
  }

  // Initialize from query params
  function initializeFromQueryParams() {
    if (route.query.subject && typeof route.query.subject === 'string') {
      subject.value = decodeURIComponent(route.query.subject)
    }
    if (route.query.body && typeof route.query.body === 'string') {
      body.value = decodeURIComponent(route.query.body)
    }
  }

  // Confirm dialog options type
  interface ConfirmDialogOptions {
    title: string
    description: string
    confirmLabel?: string
    icon?: string
  }

  type ConfirmDialogFn = (options: ConfirmDialogOptions) => Promise<boolean>

  // Send email
  async function sendEmail(confirm: ConfirmDialogFn) {
    const recipients = getRecipients()

    // Confirm with user
    const confirmed = await confirm({
      title: 'Send email?',
      description: `This will send the email to ${recipients.length} ${recipients.length === 1 ? 'recipient' : 'recipients'}.`,
      confirmLabel: 'Send',
      icon: resolveIcon('send'),
    })

    if (!confirmed)
      return

    isSending.value = true

    try {
      const response = await $fetch<SendResponse>('/api/email/send', {
        method: 'POST',
        body: {
          subject: subject.value,
          body: body.value,
          template: template.value,
          recipients,
        },
      })

      if (response.success) {
        toast.add({
          title: 'Email sent successfully',
          description: `Sent to ${response.sent ?? 0} ${response.sent === 1 ? 'recipient' : 'recipients'}`,
          color: 'success',
        })

        // Clear form
        subject.value = ''
        body.value = ''
        manualRecipients.value = ''
        selectedListSlug.value = ''
      }
      else {
        throw new Error('Send failed')
      }
    }
    catch (error) {
      toast.add({
        title: 'Failed to send email',
        description: error instanceof Error ? error.message : 'An error occurred while sending the email',
        color: 'error',
      })
    }
    finally {
      isSending.value = false
    }
  }

  // Schedule email
  function openScheduleModal() {
    // Set default to 1 hour from now
    const defaultDate = new Date()
    defaultDate.setHours(defaultDate.getHours() + 1)
    scheduledDateTime.value = defaultDate.toISOString().slice(0, 16)
    isScheduleModalOpen.value = true
  }

  async function scheduleEmail() {
    if (!scheduledDateTime.value) {
      return
    }

    isScheduling.value = true

    try {
      const recipients = getRecipients()

      const draftData = {
        subject: subject.value || 'Untitled Draft',
        body: body.value,
        template: template.value,
        outputFormat: outputFormat.value,
        recipientMode: recipientMode.value,
        recipients,
        ...(selectedListSlug.value && { listSlug: selectedListSlug.value }),
        scheduledAt: new Date(scheduledDateTime.value).toISOString(),
        status: 'scheduled',
      }

      // Create or update draft with scheduled status
      if (draftId.value) {
        await $fetch(`/api/email/drafts/${draftId.value}`, {
          method: 'PUT',
          body: draftData,
        })
      }
      else {
        const response = await $fetch<DraftResponse>('/api/email/drafts', {
          method: 'POST',
          body: draftData,
        })

        if (response.success && response.id) {
          draftId.value = response.id
        }
      }

      // Show success toast
      const scheduledDate = new Date(scheduledDateTime.value)
      toast.add({
        title: 'Email scheduled successfully',
        description: `Scheduled for ${scheduledDate.toLocaleString()}`,
        color: 'success',
      })

      // Redirect to drafts page
      await router.push('/app/admin/email/drafts')
    }
    catch (error) {
      toast.add({
        title: 'Failed to schedule email',
        description: error instanceof Error ? error.message : 'An error occurred while scheduling the email',
        color: 'error',
      })
    }
    finally {
      isScheduling.value = false
      isScheduleModalOpen.value = false
    }
  }

  return {
    // State
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
    lastSavedContent,
    isSending,
    isScheduleModalOpen,
    scheduledDateTime,
    isScheduling,

    // Computed
    recipientCount,
    invalidEmails,
    canSend,

    // Methods
    getRecipients,
    getCurrentContent,
    hasContentChanged,
    fetchPreview,
    saveDraft,
    loadDraft,
    initializeFromQueryParams,
    sendEmail,
    openScheduleModal,
    scheduleEmail,
  }
}
