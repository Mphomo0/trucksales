import { describe, expect, it } from 'vitest'
import { getCurrentPrice } from './pricing'
import { isSpecialActive } from './specials'

const FROM = '2026-11-09'
const TO = '2026-11-30'

describe('getCurrentPrice', () => {
  it('a future-dated special is not special', () => {
    const info = getCurrentPrice(1000, 800, FROM, TO, null, new Date('2026-10-28T08:00:00Z'))
    expect(info.isSpecial).toBe(false)
    expect(info.currentPrice).toBe(1000)
  })

  it('an active special shows the special price', () => {
    const info = getCurrentPrice(
      1000,
      800,
      FROM,
      TO,
      'black-friday',
      new Date('2026-11-10T08:00:00Z'),
    )
    expect(info.isSpecial).toBe(true)
    expect(info.currentPrice).toBe(800)
    expect(info.savings).toBe(200)
    expect(info.campaign).toBe('black-friday')
  })

  it('an expired special reverts', () => {
    const info = getCurrentPrice(1000, 800, FROM, TO, null, new Date('2026-11-30T22:00:00Z'))
    expect(info.isSpecial).toBe(false)
  })

  it('a price with missing dates is not special', () => {
    const info = getCurrentPrice(1000, 800, null, null, null, new Date('2026-11-10T08:00:00Z'))
    expect(info.isSpecial).toBe(false)
  })

  it('campaign is null when not special', () => {
    const info = getCurrentPrice(
      1000,
      800,
      FROM,
      TO,
      'black-friday',
      new Date('2026-10-28T08:00:00Z'),
    )
    expect(info.campaign).toBeNull()
  })

  it('agrees with isSpecialActive', () => {
    const cases: Array<[string | null, string | null, string]> = [
      [FROM, TO, '2026-11-08T21:59:59Z'],
      [FROM, TO, '2026-11-08T22:00:00Z'],
      [FROM, TO, '2026-11-20T10:00:00Z'],
      [FROM, TO, '2026-11-30T21:59:59Z'],
      [FROM, TO, '2026-11-30T22:00:00Z'],
      [FROM, null, '2026-11-20T10:00:00Z'],
    ]
    for (const [from, to, at] of cases) {
      const now = new Date(at)
      expect(getCurrentPrice(1000, 800, from, to, null, now).isSpecial).toBe(
        isSpecialActive(
          { specialPrice: 800, specialValidFrom: from, specialValidTo: to },
          now,
        ),
      )
    }
  })
})
