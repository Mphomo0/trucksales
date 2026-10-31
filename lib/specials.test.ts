import { describe, expect, it } from 'vitest'
import {
  activeSpareSpecialWhere,
  activeVehicleSpecialWhere,
  isSpecialActive,
  specialEndsAt,
  specialStartsAt,
} from './specials'

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

describe('SAST date-only handling', () => {
  const window = (from: string, to: string) => ({
    specialPrice: 100,
    specialValidFrom: from,
    specialValidTo: to,
  })

  it('date-only end date stays live through 23:59 SAST', () => {
    expect(
      isSpecialActive(
        window('2026-11-09T00:00:00Z', '2026-11-30T00:00:00Z'),
        new Date('2026-11-30T21:59:00Z'),
      ),
    ).toBe(true)
  })

  it('date-only end date is over at 00:00 SAST the next day', () => {
    expect(
      isSpecialActive(
        window('2026-11-09T00:00:00Z', '2026-11-30T00:00:00Z'),
        new Date('2026-11-30T22:00:00Z'),
      ),
    ).toBe(false)
  })

  it('date-only start date opens at 00:00 SAST', () => {
    const w = window('2026-11-09T00:00:00Z', '2026-11-30T00:00:00Z')
    expect(isSpecialActive(w, new Date('2026-11-08T21:59:59Z'))).toBe(false)
    expect(isSpecialActive(w, new Date('2026-11-08T22:00:00Z'))).toBe(true)
  })

  it('a value with a time of day is taken literally', () => {
    const w = window('2026-11-09T00:00:00Z', '2026-11-30T15:00:00Z')
    expect(isSpecialActive(w, new Date('2026-11-30T14:59:59Z'))).toBe(true)
    expect(isSpecialActive(w, new Date('2026-11-30T15:00:01Z'))).toBe(false)
  })

  it('exposes the effective start and end instants', () => {
    expect(specialStartsAt('2026-11-09T00:00:00Z').toISOString()).toBe(
      '2026-11-08T22:00:00.000Z',
    )
    expect(specialEndsAt('2026-11-30T00:00:00Z').toISOString()).toBe(
      '2026-11-30T21:59:59.999Z',
    )
    expect(specialStartsAt(new Date('2026-11-09T08:30:00Z')).toISOString()).toBe(
      '2026-11-09T08:30:00.000Z',
    )
  })

  it('widened pre-filters', () => {
    const at = new Date('2026-11-10T10:00:00Z')
    const vehicle = activeVehicleSpecialWhere(at)
    const spare = activeSpareSpecialWhere(at)
    for (const where of [vehicle, spare]) {
      expect(where.specialValidFrom.lte).toEqual(new Date('2026-11-10T12:00:00Z'))
      expect(where.specialValidTo.gte).toEqual(new Date('2026-11-09T12:00:00Z'))
    }
    expect(spare.specialPrice).toEqual({ gt: 0 })
  })
})
