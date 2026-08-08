import { describe, it, expect } from 'vitest'
import {
  TONNAGE_BUCKETS,
  getTonnageBucket,
  getTonnageBucketBySize,
  getSiblingTonnageBuckets,
} from './tonnage'

describe('getTonnageBucket', () => {
  it('resolves a bucket by slug', () => {
    expect(getTonnageBucket('8-to-9-ton')?.label).toBe('8 to 9 Ton')
  })

  it('returns undefined for an unknown slug', () => {
    expect(getTonnageBucket('42-to-99-ton')).toBeUndefined()
  })
})

describe('getTonnageBucketBySize', () => {
  it('resolves every bucket from its own dbValue', () => {
    for (const bucket of TONNAGE_BUCKETS) {
      expect(getTonnageBucketBySize(bucket.dbValue)?.slug).toBe(bucket.slug)
    }
  })

  // Stored truckSize casing is inconsistent — both "3 to 5 Ton" and
  // "3 to 5 ton" exist in the inventory table.
  it('matches regardless of casing', () => {
    expect(getTonnageBucketBySize('3 to 5 Ton')?.slug).toBe('3-to-5-ton')
    expect(getTonnageBucketBySize('3 to 5 ton')?.slug).toBe('3-to-5-ton')
    expect(getTonnageBucketBySize('10 TO 18 TON')?.slug).toBe('10-to-18-ton')
  })

  it('tolerates surrounding and repeated whitespace', () => {
    expect(getTonnageBucketBySize('  8 to 9 ton  ')?.slug).toBe('8-to-9-ton')
    expect(getTonnageBucketBySize('1 to  2.5  Ton')?.slug).toBe('1-to-2-5-ton')
  })

  it('returns undefined for null, undefined, empty or unmapped sizes', () => {
    expect(getTonnageBucketBySize(null)).toBeUndefined()
    expect(getTonnageBucketBySize(undefined)).toBeUndefined()
    expect(getTonnageBucketBySize('')).toBeUndefined()
    expect(getTonnageBucketBySize('   ')).toBeUndefined()
    expect(getTonnageBucketBySize('40 to 60 ton')).toBeUndefined()
  })
})

describe('getSiblingTonnageBuckets', () => {
  it('excludes the current bucket and keeps the rest in payload order', () => {
    const siblings = getSiblingTonnageBuckets('8-to-9-ton')
    expect(siblings).toHaveLength(TONNAGE_BUCKETS.length - 1)
    expect(siblings.map((b) => b.slug)).not.toContain('8-to-9-ton')
    expect(siblings.map((b) => b.slug)).toEqual(
      TONNAGE_BUCKETS.filter((b) => b.slug !== '8-to-9-ton').map((b) => b.slug),
    )
  })

  it('gives every bucket a sibling link, so no page is a dead end', () => {
    for (const bucket of TONNAGE_BUCKETS) {
      expect(getSiblingTonnageBuckets(bucket.slug).length).toBeGreaterThan(0)
    }
  })

  it('returns all buckets for an unknown slug', () => {
    expect(getSiblingTonnageBuckets('nope')).toHaveLength(TONNAGE_BUCKETS.length)
  })
})
