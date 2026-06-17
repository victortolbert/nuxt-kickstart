import { useOverlay } from '#imports'
import ConfirmDialog from '~/components/confirm-dialog.vue'

export interface ConfirmDialogOptions {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  confirmColor?: 'primary' | 'error' | 'neutral'
  icon?: string
}

export function useConfirmDialog() {
  const overlay = useOverlay()

  return (options: ConfirmDialogOptions): Promise<boolean> => {
    const modal = overlay.create(ConfirmDialog, {
      destroyOnClose: true,
      props: options,
    })

    return modal.open()
  }
}
