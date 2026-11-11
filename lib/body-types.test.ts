import { describe, it, expect } from 'vitest'
import {
  BODY_TYPE_PAGES,
  getBodyTypePage,
  getBodyTypePageByBodyType,
  getSiblingBodyTypePages,
} from './body-types'

describe('getBodyTypePage', () => {
  it('resolves a page by slug', () => {
    expect(getBodyTypePage('dropside-trucks')?.name).toBe('Dropside Trucks')
  })

  it('returns undefined for an unknown slug', () => {
    expect(getBodyTypePage('tipper-trucks')).toBeUndefined()
  })

  it('has unique slugs', () => {
    const slugs = BODY_TYPE_PAGES.map((b) => b.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})

describe('getBodyTypePageByBodyType', () => {
  it('resolves every page from its own dbValue', () => {
    for (const page of BODY_TYPE_PAGES) {
      expect(getBodyTypePageByBodyType(page.dbValue)?.slug).toBe(page.slug)
    }
  })

  // Both "Dropside Truck" and "dropside truck" exist in the inventory table.
  it('matches regardless of casing and whitespace', () => {
    expect(getBodyTypePageByBodyType('dropside truck')?.slug).toBe('dropside-trucks')
    expect(getBodyTypePageByBodyType('  CURTAIN  SIDE TRUCK ')?.slug).toBe(
      'curtain-side-trucks',
    )
    expect(getBodyTypePageByBodyType('volume body')?.slug).toBe('volume-body-trucks')
  })

  it('returns undefined for missing or unmapped body types', () => {
    expect(getBodyTypePageByBodyType(null)).toBeUndefined()
    expect(getBodyTypePageByBodyType(undefined)).toBeUndefined()
    expect(getBodyTypePageByBodyType('')).toBeUndefined()
    expect(getBodyTypePageByBodyType('tipper truck')).toBeUndefined()
  })
})

describe('getSiblingBodyTypePages', () => {
  it('excludes the current page', () => {
    const siblings = getSiblingBodyTypePages('dropside-trucks')
    expect(siblings.map((s) => s.slug)).not.toContain('dropside-trucks')
    expect(siblings).toHaveLength(BODY_TYPE_PAGES.length - 1)
  })
})
