import type { Ref } from 'vue'
import { onKeyStroke } from '@vueuse/core'

export function useEmailKeyboardShortcuts(options: {
  canSend: Ref<boolean>
  isScheduleModalOpen: Ref<boolean>
  saveDraft: () => void
  openScheduleModal: () => void
  sendEmail: () => void
}) {
  // Helper function to check if user is typing in an input/textarea/editor
  function isTypingInEditor(): boolean {
    const activeElement = document.activeElement
    if (!activeElement)
      return false

    const tagName = activeElement.tagName.toLowerCase()
    const isInput = tagName === 'input' || tagName === 'textarea'
    const isContentEditable = activeElement.getAttribute('contenteditable') === 'true'

    return isInput || isContentEditable
  }

  // Cmd/Ctrl + S: Save draft immediately
  onKeyStroke('s', (event) => {
    if ((event.metaKey || event.ctrlKey) && !event.shiftKey && !isTypingInEditor()) {
      event.preventDefault()
      options.saveDraft()
    }
  })

  // Cmd/Ctrl + Shift + S: Open schedule modal
  onKeyStroke('s', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.shiftKey && !isTypingInEditor()) {
      event.preventDefault()
      options.openScheduleModal()
    }
  })

  // Cmd/Ctrl + Enter: Send email
  onKeyStroke('Enter', (event) => {
    if ((event.metaKey || event.ctrlKey) && !isTypingInEditor() && options.canSend.value) {
      event.preventDefault()
      options.sendEmail()
    }
  })

  // Escape: Close schedule modal
  onKeyStroke('Escape', () => {
    if (options.isScheduleModalOpen.value) {
      options.isScheduleModalOpen.value = false
    }
  })
}
