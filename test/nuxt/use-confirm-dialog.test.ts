import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

// Test the composable file exists and has correct structure
// Full integration testing requires actual Nuxt overlay system

const COMPOSABLE_PATH = resolve(__dirname, '../../app/composables/use-confirm-dialog.ts')

describe('useConfirmDialog composable', () => {
  describe('file structure', () => {
    it('composable file exists', () => {
      expect(existsSync(COMPOSABLE_PATH)).toBe(true)
    })

    it('exports useConfirmDialog function', () => {
      const content = readFileSync(COMPOSABLE_PATH, 'utf-8')
      expect(content).toContain('export function useConfirmDialog')
    })

    it('exports ConfirmDialogOptions interface', () => {
      const content = readFileSync(COMPOSABLE_PATH, 'utf-8')
      expect(content).toContain('export interface ConfirmDialogOptions')
    })
  })

  describe('confirmDialogOptions interface', () => {
    const content = readFileSync(COMPOSABLE_PATH, 'utf-8')

    it('has required title property', () => {
      expect(content).toContain('title: string')
    })

    it('has optional description property', () => {
      expect(content).toContain('description?: string')
    })

    it('has optional confirmLabel property', () => {
      expect(content).toContain('confirmLabel?: string')
    })

    it('has optional cancelLabel property', () => {
      expect(content).toContain('cancelLabel?: string')
    })

    it('has optional confirmColor property', () => {
      expect(content).toContain('confirmColor?:')
    })

    it('has optional icon property', () => {
      expect(content).toContain('icon?: string')
    })
  })

  describe('implementation details', () => {
    const content = readFileSync(COMPOSABLE_PATH, 'utf-8')

    it('uses useOverlay composable', () => {
      expect(content).toContain('const overlay = useOverlay()')
    })

    it('creates modal with ConfirmDialog component', () => {
      expect(content).toContain('overlay.create(ConfirmDialog')
    })

    it('sets destroyOnClose to true', () => {
      expect(content).toContain('destroyOnClose: true')
    })

    it('passes options as props', () => {
      expect(content).toContain('props: options')
    })

    it('returns Promise<boolean>', () => {
      expect(content).toContain(': Promise<boolean>')
    })

    it('calls modal.open()', () => {
      expect(content).toContain('return modal.open()')
    })
  })

  describe('imports', () => {
    const content = readFileSync(COMPOSABLE_PATH, 'utf-8')

    it('imports useOverlay from #imports', () => {
      expect(content).toContain('useOverlay')
    })

    it('imports ConfirmDialog component', () => {
      expect(content).toContain('import ConfirmDialog from')
    })
  })
})
