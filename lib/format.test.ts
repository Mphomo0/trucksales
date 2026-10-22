import { describe, expect, it } from 'vitest'
import { formatNumber } from './format'

describe('formatNumber', () => {
  it('groups thousands with a no-break space', () => {
    expect(formatNumber(1234567)).toBe('1 234 567')
  })

  it('rounds to a whole number', () => {
    expect(formatNumber(1499.6)).toBe('1 500')
  })

  it('leaves small numbers alone', () => {
    expect(formatNumber(0)).toBe('0')
    expect(formatNumber(999)).toBe('999')
  })

  it('returns null for missing values so callers can fall back', () => {
    expect(formatNumber(null)).toBeNull()
    expect(formatNumber(undefined)).toBeNull()
    expect(formatNumber(Number.NaN)).toBeNull()
  })
})
