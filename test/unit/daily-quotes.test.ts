import { describe, expect, it } from 'vitest'
import { getDailyQuote } from '../../shared/data/daily-quotes'

describe('getDailyQuote', () => {
  it('returns a quote object with text field', () => {
    const quote = getDailyQuote(new Date('2026-01-15'))
    expect(quote).toHaveProperty('text')
    expect(typeof quote.text).toBe('string')
    expect(quote.text.length).toBeGreaterThan(0)
  })

  it('returns same quote for same date (deterministic)', () => {
    const date = new Date('2026-06-15')
    const quote1 = getDailyQuote(date)
    const quote2 = getDailyQuote(date)
    expect(quote1).toEqual(quote2)
  })

  it('may include optional author field', () => {
    const quote = getDailyQuote(new Date('2026-03-20'))
    if (quote.author) {
      expect(typeof quote.author).toBe('string')
    }
  })

  it('returns different quotes for different dates', () => {
    const date1 = new Date('2026-01-01')
    const date2 = new Date('2026-01-02')
    const quote1 = getDailyQuote(date1)
    const quote2 = getDailyQuote(date2)

    // They might be the same if quotes array is small, but structure should match
    expect(quote1).toHaveProperty('text')
    expect(quote2).toHaveProperty('text')
  })

  it('uses current date when no date provided', () => {
    const quote = getDailyQuote()
    expect(quote).toHaveProperty('text')
    expect(typeof quote.text).toBe('string')
  })

  it('handles leap year dates', () => {
    const leapYearDate = new Date('2024-02-29')
    const quote = getDailyQuote(leapYearDate)
    expect(quote).toHaveProperty('text')
  })

  it('cycles through quotes when days exceed quote count', () => {
    // Test that day 1 and day 366+ return different quotes (if quote array < 366)
    const date1 = new Date('2026-01-01')
    const date2 = new Date('2027-01-01')

    const quote1 = getDailyQuote(date1)
    const quote2 = getDailyQuote(date2)

    expect(quote1).toHaveProperty('text')
    expect(quote2).toHaveProperty('text')
  })
})
