import { describe, expect, it } from 'vitest'
import {
  buildSpareDescription,
  buildSpareTitle,
  fitToLength,
  formatMake,
  formatSpareName,
} from './spares'

describe('formatSpareName', () => {
  it('title-cases supplier ALL CAPS but keeps model codes and acronyms', () => {
    expect(formatSpareName('NISSAN UD90 CENTRE PORTION')).toBe(
      'Nissan UD90 Centre Portion',
    )
    expect(formatSpareName('NISSAN / UD FD46 ENGINE')).toBe(
      'Nissan / UD FD46 Engine',
    )
    expect(formatSpareName('ISUZU NPR400 5SPD CAST IRON GEARBOX')).toBe(
      'Isuzu NPR400 5SPD Cast Iron Gearbox',
    )
  })

  it('collapses whitespace and handles already-cased input', () => {
    expect(formatSpareName('  hino   500  gearbox ')).toBe('Hino 500 Gearbox')
  })
})

describe('formatMake', () => {
  it('uppercases UD and capitalises others', () => {
    expect(formatMake('ud')).toBe('UD')
    expect(formatMake('isuzu')).toBe('Isuzu')
  })
})

describe('fitToLength', () => {
  it('cuts at a word boundary with no ellipsis', () => {
    const out = fitToLength('Used Isuzu NPR400 5SPD Cast Iron Gearbox', 30)
    expect(out.length).toBeLessThanOrEqual(30)
    expect(out.endsWith('...')).toBe(false)
    expect('Used Isuzu NPR400 5SPD Cast Iron Gearbox'.startsWith(out)).toBe(true)
  })
})

describe('buildSpareTitle', () => {
  it('adds sale intent when it fits', () => {
    expect(buildSpareTitle('UD TD42 ENGINE')).toBe('Used UD TD42 Engine for Sale')
  })

  it('never exceeds 43 characters or truncates mid-word', () => {
    const t = buildSpareTitle('ISUZU NPR400 5SPD CAST IRON GEARBOX WITH PTO')
    expect(t.length).toBeLessThanOrEqual(43)
    expect(t).not.toMatch(/\.\.\.|\s$/)
  })
})

describe('buildSpareDescription', () => {
  it('is readable and within 158 characters', () => {
    const d = buildSpareDescription({
      name: 'NISSAN UD90 CENTRE PORTION',
      make: 'ud',
      condition: 'USED',
    })
    expect(d).toContain('Nissan UD90 Centre Portion')
    expect(d).toContain('for UD trucks')
    expect(d.length).toBeLessThanOrEqual(158)
  })
})
