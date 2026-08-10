import { describe, it, expect } from 'vitest'
import { BRAND_ROUTES, getBrandRouteByMake } from './brands'

describe('getBrandRouteByMake', () => {
  it('resolves every brand route from its own match term', () => {
    for (const brand of BRAND_ROUTES) {
      expect(getBrandRouteByMake(brand.match)?.slug).toBe(brand.slug)
    }
  })

  // Real values seen in the inventory table's `make` column.
  it('matches every real casing variant seen in the database', () => {
    expect(getBrandRouteByMake('isuzu')?.slug).toBe('isuzu')
    expect(getBrandRouteByMake('hino')?.slug).toBe('hino')
    expect(getBrandRouteByMake('UD')?.slug).toBe('ud-trucks')
    expect(getBrandRouteByMake('ud')?.slug).toBe('ud-trucks')
    expect(getBrandRouteByMake('fuso')?.slug).toBe('fuso')
    expect(getBrandRouteByMake('FUSO')?.slug).toBe('fuso')
    expect(getBrandRouteByMake('toyota')?.slug).toBe('toyota')
    expect(getBrandRouteByMake('tata')?.slug).toBe('tata')
    expect(getBrandRouteByMake('man')?.slug).toBe('man')
    expect(getBrandRouteByMake('mercedes benz')?.slug).toBe('mercedes-benz')
    expect(getBrandRouteByMake('hyundai')?.slug).toBe('hyundai')
  })

  it('returns undefined for makes with no brand page', () => {
    expect(getBrandRouteByMake('nissan')).toBeUndefined()
    expect(getBrandRouteByMake('volkswagen')).toBeUndefined()
    expect(getBrandRouteByMake('vw')).toBeUndefined()
    expect(getBrandRouteByMake('ford')).toBeUndefined()
  })

  it('returns undefined for null, undefined, or empty make', () => {
    expect(getBrandRouteByMake(null)).toBeUndefined()
    expect(getBrandRouteByMake(undefined)).toBeUndefined()
    expect(getBrandRouteByMake('')).toBeUndefined()
  })
})
