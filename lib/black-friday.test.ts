import { describe, expect, it, vi } from 'vitest'
import { isSpecialActive } from './specials'
import {
  BLACK_FRIDAY,
  applyDemoSpareSpecials,
  applyDemoVehicleSpecials,
  buildDeals,
  emptyDeals,
  formatWindowLabel,
  isBlackFridayWindow,
  isDemoDealId,
  isDemoMode,
  pickFeatured,
  reviveRows,
  settleDeals,
  shouldQueryLayoutDeals,
  shouldShowBlackFriday,
  withDemoSpareSpecials,
  withDemoVehicleSpecials,
  type DealSpare,
  type DealVehicle,
} from './black-friday'

const IN_WINDOW = new Date('2026-11-15T10:00:00Z')

function vehicle(over: Partial<DealVehicle> = {}): DealVehicle {
  return {
    id: 'v1',
    name: 'Truck',
    make: 'Isuzu',
    model: 'FTR',
    year: 2020,
    vatPrice: 500000,
    pricenoVat: 434783,
    images: [],
    slug: 'truck',
    bodyType: null,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    specialPrice: null,
    specialValidFrom: null,
    specialValidTo: null,
    specialCampaign: null,
    ...over,
  }
}

function spare(over: Partial<DealSpare> = {}): DealSpare {
  return {
    id: 's1',
    name: 'Part',
    make: 'Isuzu',
    category: 'Engine',
    condition: 'Used',
    price: 10000,
    noVatPrice: 8696,
    images: [],
    slug: 'part',
    createdAt: new Date('2026-01-01T00:00:00Z'),
    specialPrice: null,
    specialPriceNoVat: null,
    specialValidFrom: null,
    specialValidTo: null,
    specialCampaign: null,
    ...over,
  }
}

const bfWindow = {
  specialValidFrom: new Date('2026-11-09T00:00:00Z'),
  specialValidTo: new Date('2026-11-30T00:00:00Z'),
  specialCampaign: 'black-friday',
}

function ids(n: number, prefix: string, demo: boolean): string[] {
  const out: string[] = []
  for (let i = 0; out.length < n && i < 10000; i++) {
    const id = `${prefix}-${i}`
    if (isDemoDealId(id) === demo) out.push(id)
  }
  return out
}

describe('isBlackFridayWindow', () => {
  it('window opens at 00:00 SAST on 9 Nov', () => {
    expect(isBlackFridayWindow(new Date('2026-11-08T21:59:59Z'))).toBe(false)
    expect(isBlackFridayWindow(new Date('2026-11-08T22:00:00Z'))).toBe(true)
  })

  it('window closes at 23:59:59 SAST on 30 Nov', () => {
    expect(isBlackFridayWindow(new Date('2026-11-30T21:59:59Z'))).toBe(true)
    expect(isBlackFridayWindow(new Date('2026-11-30T22:00:00Z'))).toBe(false)
  })
})

describe('isDemoMode', () => {
  it('demo mode needs preview and the flag', () => {
    expect(isDemoMode({ VERCEL_ENV: 'preview', BLACK_FRIDAY_PREVIEW: '1' })).toBe(true)
    expect(isDemoMode({ VERCEL_ENV: 'production', BLACK_FRIDAY_PREVIEW: '1' })).toBe(false)
    expect(isDemoMode({ VERCEL_ENV: 'preview' })).toBe(false)
  })
})

describe('pickFeatured', () => {
  it('picks the largest rand saving', () => {
    const small = vehicle({ id: 'a', vatPrice: 500000, specialPrice: 490000 })
    const big = vehicle({ id: 'b', vatPrice: 300000, specialPrice: 250000 })
    const mid = vehicle({ id: 'c', vatPrice: 400000, specialPrice: 380000 })
    const r = pickFeatured([small, big, mid])
    expect(r.featured?.id).toBe('b')
    expect(r.more.map((v) => v.id)).toEqual(['c', 'a'])
  })

  it('breaks ties by newest', () => {
    const older = vehicle({ id: 'old', specialPrice: 450000, createdAt: new Date('2026-01-01T00:00:00Z') })
    const newer = vehicle({ id: 'new', specialPrice: 450000, createdAt: new Date('2026-06-01T00:00:00Z') })
    expect(pickFeatured([older, newer]).featured?.id).toBe('new')
  })

  it('returns only three in more', () => {
    const list = [1, 2, 3, 4, 5].map((n) =>
      vehicle({ id: `v${n}`, specialPrice: 500000 - n * 1000 }),
    )
    const r = pickFeatured(list)
    expect(r.featured?.id).toBe('v5')
    expect(r.more).toHaveLength(3)
  })

  it('returns null featured and empty more for no deals', () => {
    expect(pickFeatured([])).toEqual({ featured: null, more: [] })
  })
})

describe('buildDeals', () => {
  it('keeps only black-friday tagged, currently active specials', () => {
    const good = vehicle({ id: 'good', specialPrice: 450000, ...bfWindow })
    const normalSpecial = vehicle({ id: 'normal', specialPrice: 450000, ...bfWindow, specialCampaign: null })
    const expired = vehicle({
      id: 'expired',
      specialPrice: 450000,
      ...bfWindow,
      specialValidTo: new Date('2026-11-10T00:00:00Z'),
    })
    const goodSpare = spare({ id: 'gs', specialPrice: 9000, ...bfWindow })
    const otherSpare = spare({ id: 'os', specialPrice: 9000, ...bfWindow, specialCampaign: null })

    const deals = buildDeals(
      { vehicles: [good, normalSpecial, expired], spares: [goodSpare, otherSpare] },
      { now: IN_WINDOW, demo: false },
    )
    expect(deals.vehicles.map((v) => v.id)).toEqual(['good'])
    expect(deals.spares.map((s) => s.id)).toEqual(['gs'])
    expect(deals.count).toBe(2)
    expect(deals.featured?.id).toBe('good')
    expect(deals.isDemo).toBe(false)
  })

  it('mirrors opts.demo in isDemo', () => {
    expect(buildDeals({ vehicles: [], spares: [] }, { now: IN_WINDOW, demo: true }).isDemo).toBe(true)
  })
})

const DEMO_NOW = new Date('2026-10-28T08:00:00Z')
const LATE_NOW = new Date('2026-12-05T08:00:00Z')

describe('demo deal dates', () => {
  it('are live now and run to the window end when previewed early', () => {
    const [id] = ids(1, 'early', true)
    const [v] = applyDemoVehicleSpecials([vehicle({ id })], DEMO_NOW)
    const [s] = applyDemoSpareSpecials([spare({ id })], DEMO_NOW)
    for (const x of [v, s]) {
      expect(isSpecialActive(x, DEMO_NOW)).toBe(true)
      expect(x.specialValidFrom).toEqual(new Date('2026-10-27T00:00:00Z'))
      expect(x.specialValidTo).toEqual(new Date('2026-11-30T00:00:00Z'))
    }
  })

  it('are still live after the window and end tomorrow', () => {
    const [id] = ids(1, 'late', true)
    const [v] = applyDemoVehicleSpecials([vehicle({ id })], LATE_NOW)
    const [s] = applyDemoSpareSpecials([spare({ id })], LATE_NOW)
    for (const x of [v, s]) {
      expect(isSpecialActive(x, LATE_NOW)).toBe(true)
      expect(x.specialValidTo).toEqual(new Date('2026-12-06T00:00:00Z'))
    }
  })
})

describe('reviveRows', () => {
  const iso = '2026-11-10T08:30:00.000Z'

  it('turns ISO strings into Dates with the same instant, without mutating input', () => {
    const rows = {
      vehicles: [{ ...vehicle(), createdAt: iso, specialValidFrom: iso, specialValidTo: iso }],
      spares: [{ ...spare(), createdAt: iso, specialValidFrom: iso, specialValidTo: iso }],
    }
    const snapshot = JSON.stringify(rows)
    const out = reviveRows(rows)
    expect(JSON.stringify(rows)).toBe(snapshot)
    for (const x of [out.vehicles[0], out.spares[0]]) {
      expect(x.createdAt).toBeInstanceOf(Date)
      expect(x.createdAt.getTime()).toBe(new Date(iso).getTime())
      expect(x.specialValidFrom?.getTime()).toBe(new Date(iso).getTime())
      expect(x.specialValidTo?.getTime()).toBe(new Date(iso).getTime())
    }
  })

  it('passes Dates through equal and keeps null as null', () => {
    const d = new Date(iso)
    const out = reviveRows({
      vehicles: [vehicle({ createdAt: d, specialValidFrom: d, specialValidTo: null })],
      spares: [spare({ createdAt: d, specialValidFrom: null, specialValidTo: d })],
    })
    expect(out.vehicles[0].createdAt).toEqual(d)
    expect(out.vehicles[0].specialValidFrom).toEqual(d)
    expect(out.vehicles[0].specialValidTo).toBeNull()
    expect(out.spares[0].specialValidFrom).toBeNull()
    expect(out.spares[0].specialValidTo).toEqual(d)
  })
})

describe('applyDemoVehicleSpecials', () => {
  it('is deterministic and never mutates its input', () => {
    const demoIds = ids(3, 'dv', true)
    const plainIds = ids(2, 'pv', false)
    const input = [...demoIds, ...plainIds].map((id) => vehicle({ id }))
    const snapshot = JSON.stringify(input)

    const a = applyDemoVehicleSpecials(input, DEMO_NOW)
    const b = applyDemoVehicleSpecials(input, DEMO_NOW)
    expect(JSON.stringify(input)).toBe(snapshot)
    expect(a).toEqual(b)
    expect(a).not.toBe(input)

    for (const item of a) {
      if (isDemoDealId(item.id)) {
        expect(item.specialCampaign).toBe(BLACK_FRIDAY.campaign)
        expect(item.specialValidFrom).toEqual(new Date('2026-10-27T00:00:00Z'))
        expect(item.specialValidTo).toEqual(new Date('2026-11-30T00:00:00Z'))
        expect(item.specialPrice).not.toBeNull()
      } else {
        expect(item.specialPrice).toBeNull()
        expect(item.specialCampaign).toBeNull()
      }
    }
  })

  it('discounts are between 8% and 15%', () => {
    const demoIds = ids(50, 'disc', true)
    const out = applyDemoVehicleSpecials(demoIds.map((id) => vehicle({ id, vatPrice: 500000 })))
    for (const v of out) {
      const pct = (1 - (v.specialPrice as number) / 500000) * 100
      expect(pct).toBeGreaterThanOrEqual(7.9)
      expect(pct).toBeLessThanOrEqual(15.1)
      expect((v.specialPrice as number) % 100).toBe(0)
    }
  })

  it('keeps the special price strictly below a tiny base price and above zero', () => {
    const [id] = ids(1, 'tiny', true)
    const [out] = applyDemoVehicleSpecials([vehicle({ id, vatPrice: 120 })])
    expect(out.specialPrice).toBeGreaterThan(0)
    expect(out.specialPrice as number).toBeLessThan(120)
  })

  it('selects roughly one id in three', () => {
    const hits = Array.from({ length: 900 }, (_, i) => isDemoDealId(`id-${i}`)).filter(Boolean).length
    expect(hits).toBeGreaterThan(200)
    expect(hits).toBeLessThan(400)
  })
})

describe('applyDemoSpareSpecials', () => {
  it('discounts spares to the nearest R10 and scales the ex-VAT price', () => {
    const demoIds = ids(20, 'ds', true)
    const input = [...demoIds, ...ids(2, 'ps', false)].map((id) => spare({ id, price: 10000, noVatPrice: 8696 }))
    const snapshot = JSON.stringify(input)
    const out = applyDemoSpareSpecials(input, DEMO_NOW)
    expect(JSON.stringify(input)).toBe(snapshot)

    for (const s of out) {
      if (isDemoDealId(s.id)) {
        const sp = s.specialPrice as number
        expect(sp).toBeLessThan(10000)
        expect(sp).toBeGreaterThan(0)
        expect(sp % 10).toBe(0)
        expect(sp / 10000).toBeGreaterThanOrEqual(0.849)
        expect(sp / 10000).toBeLessThanOrEqual(0.921)
        expect(s.specialPriceNoVat).toBeCloseTo(8696 * (sp / 10000), 0)
        expect(s.specialCampaign).toBe('black-friday')
      } else {
        expect(s.specialPrice).toBeNull()
        expect(s.specialCampaign).toBeNull()
      }
    }
  })

  it('leaves specialPriceNoVat null when there is no ex-VAT price', () => {
    const [id] = ids(1, 'nv', true)
    const [out] = applyDemoSpareSpecials([spare({ id, noVatPrice: null })])
    expect(out.specialPrice).not.toBeNull()
    expect(out.specialPriceNoVat).toBeNull()
  })
})

describe('shouldShowBlackFriday', () => {
  const withDeal = buildDeals(
    { vehicles: [vehicle({ id: 'x', specialPrice: 450000, ...bfWindow })], spares: [] },
    { now: IN_WINDOW, demo: false },
  )
  const empty = buildDeals({ vehicles: [], spares: [] }, { now: IN_WINDOW, demo: false })
  const preview = { VERCEL_ENV: 'preview', BLACK_FRIDAY_PREVIEW: '1' }

  it('is false when the window is live but there are no vehicle deals', () => {
    expect(shouldShowBlackFriday(empty, IN_WINDOW, {})).toBe(false)
  })

  it('is true inside the window with a vehicle deal', () => {
    expect(shouldShowBlackFriday(withDeal, IN_WINDOW, {})).toBe(true)
  })

  it('is true in demo mode with a vehicle deal outside the window', () => {
    expect(shouldShowBlackFriday(withDeal, new Date('2026-10-31T10:00:00Z'), preview)).toBe(true)
  })

  it('is false outside the window without demo', () => {
    expect(shouldShowBlackFriday(withDeal, new Date('2026-10-31T10:00:00Z'), {})).toBe(false)
  })

  it('is false in the window when only spares are tagged', () => {
    const now = new Date('2026-11-10T08:00:00Z')
    const sparesOnly = buildDeals(
      { vehicles: [], spares: [spare({ id: 'sp', specialPrice: 5000, ...bfWindow })] },
      { now, demo: false },
    )
    expect(sparesOnly.spares.length).toBe(1)
    expect(sparesOnly.vehicles).toEqual([])
    expect(shouldShowBlackFriday(sparesOnly, now, {})).toBe(false)
  })

  it('is false in production even with the preview flag set, outside the window', () => {
    const env = { VERCEL_ENV: 'production', BLACK_FRIDAY_PREVIEW: '1' }
    expect(shouldShowBlackFriday(withDeal, new Date('2026-10-28T08:00:00Z'), env)).toBe(false)
  })
})

describe('formatWindowLabel', () => {
  it('formats the current campaign window', () => {
    expect(formatWindowLabel()).toBe('9 – 30 Nov')
  })
})

describe('withDemo wrappers', () => {
  const PREVIEW = { VERCEL_ENV: 'preview', BLACK_FRIDAY_PREVIEW: '1' }
  const PROD = { VERCEL_ENV: 'production', BLACK_FRIDAY_PREVIEW: '1' }
  const demoV = vehicle({ id: ids(1, 'wv', true)[0] })
  const demoS = spare({ id: ids(1, 'ws', true)[0] })

  it('returns the same reference when not in demo mode', () => {
    const vs = [demoV]
    const ss = [demoS]
    expect(withDemoVehicleSpecials(vs, {}, DEMO_NOW)).toBe(vs)
    expect(withDemoSpareSpecials(ss, {}, DEMO_NOW)).toBe(ss)
    expect(withDemoVehicleSpecials(vs, { VERCEL_ENV: 'preview' }, DEMO_NOW)).toBe(vs)
  })

  it('is a no-op in production even with the flag set', () => {
    const vs = [demoV]
    const ss = [demoS]
    expect(withDemoVehicleSpecials(vs, PROD, DEMO_NOW)).toBe(vs)
    expect(withDemoSpareSpecials(ss, PROD, DEMO_NOW)).toBe(ss)
  })

  it('applies demo specials in preview with the flag', () => {
    const [v] = withDemoVehicleSpecials([demoV], PREVIEW, DEMO_NOW)
    const [s] = withDemoSpareSpecials([demoS], PREVIEW, DEMO_NOW)
    expect(v.specialCampaign).toBe(BLACK_FRIDAY.campaign)
    expect(v.specialPrice).not.toBeNull()
    expect(s.specialCampaign).toBe(BLACK_FRIDAY.campaign)
    expect(s.specialPrice).not.toBeNull()
  })

  it('accepts narrower row shapes', () => {
    const rows = [{ id: demoV.id, vatPrice: 500000, specialPrice: null as number | null }]
    const [out] = withDemoVehicleSpecials(rows, PREVIEW, DEMO_NOW)
    expect(out.specialPrice).toBeLessThan(500000)
  })
})

describe('settleDeals', () => {
  it('resolves with the loader value', async () => {
    const deals = { ...emptyDeals(), count: 3 }
    await expect(settleDeals(async () => deals)).resolves.toBe(deals)
  })

  it('returns empty deals and calls onError once when the loader rejects', async () => {
    const err = new Error('column does not exist')
    const onError = vi.fn()
    const out = await settleDeals(() => Promise.reject(err), onError)
    expect(out.count).toBe(0)
    expect(out.featured).toBeNull()
    expect(out.isDemo).toBe(false)
    expect(out.vehicles).toEqual([])
    expect(out.spares).toEqual([])
    expect(out.more).toEqual([])
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(err)
  })

  it('catches a synchronous throw inside the loader', async () => {
    const err = new Error('boom')
    const onError = vi.fn()
    const out = await settleDeals(() => {
      throw err
    }, onError)
    expect(out.count).toBe(0)
    expect(onError).toHaveBeenCalledWith(err)
  })

  it('works without an onError handler', async () => {
    const out = await settleDeals(() => Promise.reject(new Error('x')))
    expect(out.count).toBe(0)
  })
})

describe('shouldQueryLayoutDeals', () => {
  const preview = { VERCEL_ENV: 'preview', BLACK_FRIDAY_PREVIEW: '1' }
  const production = { VERCEL_ENV: 'production', BLACK_FRIDAY_PREVIEW: '1' }

  it('is false before the window opens', () => {
    expect(shouldQueryLayoutDeals(new Date('2026-11-08T21:59:59.999Z'), {})).toBe(false)
  })

  it('is true at the first instant of the window', () => {
    expect(shouldQueryLayoutDeals(new Date('2026-11-08T22:00:00Z'), {})).toBe(true)
  })

  it('is true at the last instant of the window', () => {
    expect(shouldQueryLayoutDeals(new Date('2026-11-30T21:59:59.999Z'), {})).toBe(true)
  })

  it('is false once the window closes', () => {
    expect(shouldQueryLayoutDeals(new Date('2026-11-30T22:00:00Z'), {})).toBe(false)
  })

  it('is true in preview demo mode outside the window', () => {
    expect(shouldQueryLayoutDeals(new Date('2026-10-28T08:00:00Z'), preview)).toBe(true)
  })

  it('is false in production with the flag outside the window', () => {
    expect(shouldQueryLayoutDeals(new Date('2026-10-28T08:00:00Z'), production)).toBe(false)
  })
})
