import { describe, expect, it } from 'vitest'
import { isSpecialActive } from './specials'

const now = new Date('2026-10-17T08:00:00Z')

describe('isSpecialActive', () => {
  it('is active inside the window', () => {
    expect(
      isSpecialActive(
        {
          specialPrice: 100,
          specialValidFrom: '2026-10-01T00:00:00Z',
          specialValidTo: '2026-10-31T00:00:00Z',
        },
        now,
      ),
    ).toBe(true)
  })

  it('is inactive once expired', () => {
    expect(
      isSpecialActive(
        {
          specialPrice: 100,
          specialValidFrom: new Date('2026-10-01T00:00:00Z'),
          specialValidTo: new Date('2026-10-16T22:00:00Z'),
        },
        now,
      ),
    ).toBe(false)
  })

  it('is inactive before it starts', () => {
    expect(
      isSpecialActive(
        {
          specialPrice: 100,
          specialValidFrom: '2026-10-20T00:00:00Z',
          specialValidTo: '2026-10-31T00:00:00Z',
        },
        now,
      ),
    ).toBe(false)
  })

  it('requires both dates and a positive price', () => {
    expect(
      isSpecialActive(
        { specialPrice: 100, specialValidFrom: null, specialValidTo: '2026-10-31' },
        now,
      ),
    ).toBe(false)
    expect(
      isSpecialActive(
        { specialPrice: 100, specialValidFrom: '2026-10-01', specialValidTo: null },
        now,
      ),
    ).toBe(false)
    expect(
      isSpecialActive(
        { specialPrice: 0, specialValidFrom: '2026-10-01', specialValidTo: '2026-10-31' },
        now,
      ),
    ).toBe(false)
  })
})
