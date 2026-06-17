import { describe, expect, it } from 'vitest'
import { TECH_BUCKETS, techBucket } from '../../app/utils/tech-taxonomy'

describe('tech taxonomy', () => {
  it('rolls categories up into their coarse bucket', () => {
    expect(techBucket('programming-language')).toBe('languages')
    expect(techBucket('meta-framework')).toBe('frameworks')
    expect(techBucket('full-stack-adapter')).toBe('frameworks')
    expect(techBucket('ui-library')).toBe('libraries')
    expect(techBucket('build-tool')).toBe('tooling')
    expect(techBucket('design-tool')).toBe('tooling')
    expect(techBucket('platform')).toBe('platforms')
    expect(techBucket('other')).toBe('other')
  })

  it('defaults unknown / missing categories to "other"', () => {
    expect(techBucket('nope')).toBe('other')
    expect(techBucket(undefined)).toBe('other')
    expect(techBucket(null)).toBe('other')
  })

  it('every bucket category is unique (no category maps to two buckets)', () => {
    const all = TECH_BUCKETS.flatMap(b => b.categories)
    expect(new Set(all).size).toBe(all.length)
  })
})
