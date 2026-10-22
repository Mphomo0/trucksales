import { describe, it, expect } from 'vitest'
import { BRAND_ROUTES } from './brands'
import { getBrandPage } from './brand-pages'

describe('getBrandPage', () => {
  it('has landing page content for every brand route', () => {
    for (const route of BRAND_ROUTES) {
      const page = getBrandPage(route.slug)
      expect(page?.label).toBe(route.label)
      expect(page?.faqs.length).toBeGreaterThan(0)
    }
  })

  it('returns undefined for brands without a landing page', () => {
    expect(getBrandPage('volvo')).toBeUndefined()
  })
})
