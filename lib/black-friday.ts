import { isSpecialActive, specialEndsAt, specialStartsAt } from '@/lib/specials'

/**
 * Pure Black Friday campaign logic. No database or Next.js imports here:
 * the cached query lives in lib/black-friday-deals.ts.
 */
export const BLACK_FRIDAY = {
  campaign: 'black-friday',
  startsOn: '2026-11-09',
  endsOn: '2026-11-30',
} as const

export type DealVehicle = {
  id: string
  name: string
  make: string
  model: string
  year: number
  vatPrice: number
  pricenoVat: number
  images: unknown
  slug: string
  bodyType: string | null
  createdAt: Date
  specialPrice: number | null
  specialValidFrom: Date | null
  specialValidTo: Date | null
  specialCampaign: string | null
}

export type DealSpare = {
  id: string
  name: string
  make: string
  category: string
  condition: string
  price: number
  noVatPrice: number | null
  images: unknown
  slug: string
  createdAt: Date
  specialPrice: number | null
  specialPriceNoVat: number | null
  specialValidFrom: Date | null
  specialValidTo: Date | null
  specialCampaign: string | null
}

export type BlackFridayDeals = {
  vehicles: DealVehicle[]
  spares: DealSpare[]
  count: number
  featured: DealVehicle | null
  more: DealVehicle[]
  isDemo: boolean
}

type Env = Record<string, string | undefined>

const WINDOW_FROM = new Date(`${BLACK_FRIDAY.startsOn}T00:00:00Z`)
const WINDOW_TO = new Date(`${BLACK_FRIDAY.endsOn}T00:00:00Z`)

/** True from 00:00 SAST on startsOn through 23:59:59.999 SAST on endsOn. */
export function isBlackFridayWindow(now: Date = new Date()): boolean {
  return now >= specialStartsAt(WINDOW_FROM) && now <= specialEndsAt(WINDOW_TO)
}

/** Demo mode only ever runs on Vercel previews with the flag set. */
export function isDemoMode(env: Env = process.env): boolean {
  return env.VERCEL_ENV === 'preview' && env.BLACK_FRIDAY_PREVIEW === '1'
}

/** Stable non-negative string hash (djb2). */
function hashId(id: string): number {
  let h = 5381
  for (let i = 0; i < id.length; i++) {
    h = ((h * 33) ^ id.charCodeAt(i)) >>> 0
  }
  return h
}

/** Deterministic: about one id in three becomes a pretend deal. */
export function isDemoDealId(id: string): boolean {
  return hashId(id) % 3 === 0
}

/** Pretend discount, an integer from 8 to 15 inclusive. */
function demoDiscountPct(id: string): number {
  return 8 + (Math.floor(hashId(id) / 3) % 8)
}

/** Rounded demo price, always > 0 and strictly below base; null if impossible. */
function demoPrice(id: string, base: number, step: number): number | null {
  if (!(base > 1)) return null
  const raw = base * (1 - demoDiscountPct(id) / 100)
  let price = Math.round(raw / step) * step
  if (price <= 0 || price >= base) {
    price = Math.max(1, Math.min(Math.round(raw), base - 1))
  }
  return price
}

export function applyDemoVehicleSpecials<T extends DealVehicle>(items: T[]): T[] {
  return items.map((item) => {
    if (!isDemoDealId(item.id)) return item
    const specialPrice = demoPrice(item.id, item.vatPrice, 100)
    if (specialPrice === null) return item
    return {
      ...item,
      specialPrice,
      specialValidFrom: new Date(WINDOW_FROM),
      specialValidTo: new Date(WINDOW_TO),
      specialCampaign: BLACK_FRIDAY.campaign,
    }
  })
}

export function applyDemoSpareSpecials<T extends DealSpare>(items: T[]): T[] {
  return items.map((item) => {
    if (!isDemoDealId(item.id)) return item
    const specialPrice = demoPrice(item.id, item.price, 10)
    if (specialPrice === null) return item
    return {
      ...item,
      specialPrice,
      specialPriceNoVat:
        item.noVatPrice != null
          ? Math.round(item.noVatPrice * (specialPrice / item.price))
          : null,
      specialValidFrom: new Date(WINDOW_FROM),
      specialValidTo: new Date(WINDOW_TO),
      specialCampaign: BLACK_FRIDAY.campaign,
    }
  })
}

function saving(v: DealVehicle): number {
  return v.vatPrice - (v.specialPrice ?? v.vatPrice)
}

export function pickFeatured(vehicles: DealVehicle[]): {
  featured: DealVehicle | null
  more: DealVehicle[]
} {
  const sorted = [...vehicles].sort(
    (a, b) =>
      saving(b) - saving(a) || b.createdAt.getTime() - a.createdAt.getTime(),
  )
  return { featured: sorted[0] ?? null, more: sorted.slice(1, 4) }
}

export function buildDeals(
  rows: { vehicles: DealVehicle[]; spares: DealSpare[] },
  opts: { now?: Date; demo: boolean },
): BlackFridayDeals {
  const now = opts.now ?? new Date()
  const vehicles = rows.vehicles.filter(
    (v) => v.specialCampaign === BLACK_FRIDAY.campaign && isSpecialActive(v, now),
  )
  const spares = rows.spares.filter(
    (s) =>
      s.specialCampaign === BLACK_FRIDAY.campaign &&
      isSpecialActive(
        {
          specialPrice: s.specialPrice,
          specialValidFrom: s.specialValidFrom,
          specialValidTo: s.specialValidTo,
        },
        now,
      ),
  )
  const { featured, more } = pickFeatured(vehicles)
  return {
    vehicles,
    spares,
    count: vehicles.length + spares.length,
    featured,
    more,
    isDemo: opts.demo,
  }
}

export function shouldShowBlackFriday(
  deals: BlackFridayDeals,
  now: Date = new Date(),
  env: Env = process.env,
): boolean {
  return (isBlackFridayWindow(now) || isDemoMode(env)) && deals.vehicles.length >= 1
}
