import { describe, it, expect } from 'vitest'
import { indefiniteArticle, withIndefiniteArticle } from './text'
import { TONNAGE_BUCKETS } from './tonnage'

describe('indefiniteArticle', () => {
  it('uses "an" for numbers that sound like they start with a vowel', () => {
    expect(indefiniteArticle('8 to 9 Ton')).toBe('an')
    expect(indefiniteArticle('18 to 35 Ton')).toBe('an')
    expect(indefiniteArticle('11 Ton')).toBe('an')
  })

  it('uses "a" for numbers that do not', () => {
    expect(indefiniteArticle('1 to 2.5 Ton')).toBe('a')
    expect(indefiniteArticle('3 to 5 Ton')).toBe('a')
    expect(indefiniteArticle('6 to 7 Ton')).toBe('a')
    expect(indefiniteArticle('10 to 18 Ton')).toBe('a')
  })

  it('falls back to a vowel-letter check for words', () => {
    expect(indefiniteArticle('Isuzu truck')).toBe('an')
    expect(indefiniteArticle('Hino truck')).toBe('a')
  })

  it('defaults to "a" for empty input', () => {
    expect(indefiniteArticle('')).toBe('a')
    expect(indefiniteArticle('   ')).toBe('a')
  })

  it('produces correct copy for every tonnage bucket label', () => {
    const phrases = TONNAGE_BUCKETS.map((b) => withIndefiniteArticle(b.label))
    expect(phrases).toEqual([
      'a 1 to 2.5 Ton',
      'a 3 to 5 Ton',
      'a 6 to 7 Ton',
      'an 8 to 9 Ton',
      'a 10 to 18 Ton',
      'an 18 to 35 Ton',
    ])
  })
})
