import { describe, expect, it } from 'vitest'
import { GARDEN_STATUSES, gardenStatus, gardenStatusMeta, isGardenStatus } from '../../app/utils/garden-status'

describe('garden status', () => {
  it('defines the four lifecycle statuses in order', () => {
    expect(GARDEN_STATUSES).toEqual(['seed', 'sprout', 'evergreen', 'wilted'])
  })

  it('maps each status to a readiness "traffic light" color', () => {
    expect(gardenStatusMeta.seed.color).toBe('neutral')
    expect(gardenStatusMeta.sprout.color).toBe('warning')
    expect(gardenStatusMeta.evergreen.color).toBe('success')
    expect(gardenStatusMeta.wilted.color).toBe('error')
  })

  it('maps each status to a semantic icon name', () => {
    expect(gardenStatusMeta.seed.icon).toBe('sparkles')
    expect(gardenStatusMeta.sprout.icon).toBe('sprout')
    expect(gardenStatusMeta.evergreen.icon).toBe('evergreen')
    expect(gardenStatusMeta.wilted.icon).toBe('archive')
  })

  it('resolves known statuses', () => {
    expect(gardenStatus('evergreen')).toEqual({ color: 'success', icon: 'evergreen' })
  })

  it('defaults unknown / missing statuses to seed', () => {
    expect(gardenStatus('nope')).toEqual(gardenStatusMeta.seed)
    expect(gardenStatus(undefined)).toEqual(gardenStatusMeta.seed)
    expect(gardenStatus(null)).toEqual(gardenStatusMeta.seed)
  })

  it('narrows with isGardenStatus', () => {
    expect(isGardenStatus('sprout')).toBe(true)
    expect(isGardenStatus('wilted')).toBe(true)
    expect(isGardenStatus('archived')).toBe(false)
    expect(isGardenStatus(42)).toBe(false)
  })
})
