import { describe, expect, it } from 'vitest'
import {
  filterSpecials,
  getBodyTypes,
  parseTypeParam,
  SPECIALS_TYPE_CHANGE_EVENT,
} from './specials-filter'

const v = (id: string, bodyType?: string | null) => ({ id, bodyType })
const s = (id: string) => ({ id })

const vehicles = [v('v1', 'Tipper'), v('v2', 'tipper'), v('v3', 'Dropside'), v('v4', null)]
const spares = [s('s1'), s('s2')]

describe('filterSpecials', () => {
  it('all shows everything', () => {
    const r = filterSpecials(vehicles, spares, { kind: 'all' })
    expect(r.vehicles).toHaveLength(4)
    expect(r.spares).toHaveLength(2)
  })
  it('trucks shows vehicles only', () => {
    const r = filterSpecials(vehicles, spares, { kind: 'trucks' })
    expect(r.vehicles).toHaveLength(4)
    expect(r.spares).toHaveLength(0)
  })
  it('spares shows spares only', () => {
    const r = filterSpecials(vehicles, spares, { kind: 'spares' })
    expect(r.vehicles).toHaveLength(0)
    expect(r.spares).toHaveLength(2)
  })
  it('body type matches case-insensitively and hides spares', () => {
    const r = filterSpecials(vehicles, spares, { kind: 'bodyType', value: 'TIPPER' })
    expect(r.vehicles.map((x) => x.id)).toEqual(['v1', 'v2'])
    expect(r.spares).toHaveLength(0)
  })
  it('returns empty when nothing matches', () => {
    const r = filterSpecials(vehicles, spares, { kind: 'bodyType', value: 'Crane' })
    expect(r.vehicles).toHaveLength(0)
    expect(r.spares).toHaveLength(0)
  })
})

describe('getBodyTypes', () => {
  it('ignores null, undefined and blank values', () => {
    expect(getBodyTypes([v('a', null), v('b'), v('c', '  ')])).toEqual([])
  })
  it('de-duplicates case-insensitively keeping first spelling, sorted', () => {
    expect(getBodyTypes(vehicles)).toEqual(['Dropside', 'Tipper'])
  })
})

describe('parseTypeParam', () => {
  it('maps trucks and spares', () => {
    expect(parseTypeParam('trucks')).toEqual({ kind: 'trucks' })
    expect(parseTypeParam('spares')).toEqual({ kind: 'spares' })
  })
  it('falls back to all', () => {
    expect(parseTypeParam(null)).toEqual({ kind: 'all' })
    expect(parseTypeParam('x')).toEqual({ kind: 'all' })
  })
  it('exposes the shared event name', () => {
    expect(SPECIALS_TYPE_CHANGE_EVENT).toBe('specials:type-change')
  })
})
