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

const DAY_MS = 24 * 60 * 60 * 1000

function utcMidnight(d: Date): number {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
}

/**
 * Date-only (00:00:00.000Z) demo bounds that are live at `now`: from the day
 * before, to the later of the real end date and the day after.
 */
function demoBounds(now: Date): { from: Date; to: Date } {
  const from = new Date(utcMidnight(now) - DAY_MS)
  const to = new Date(Math.max(WINDOW_TO.getTime(), utcMidnight(now) + DAY_MS))
  return { from, to }
}

/** Minimal shapes the demo functions need, so call sites with different selects fit. */
export type DemoVehicleShape = {
  id: string
  vatPrice: number
  specialPrice?: number | null
  specialValidFrom?: Date | string | null
  specialValidTo?: Date | string | null
  specialCampaign?: string | null
}

export type DemoSpareShape = {
  id: string
  price: number
  noVatPrice?: number | null
  specialPrice?: number | null
  specialPriceNoVat?: number | null
  specialValidFrom?: Date | string | null
  specialValidTo?: Date | string | null
  specialCampaign?: string | null
}

export function applyDemoVehicleSpecials<T extends DemoVehicleShape>(
  items: T[],
  now: Date = new Date(),
): T[] {
  const { from, to } = demoBounds(now)
  return items.map((item) => {
    if (!isDemoDealId(item.id)) return item
    const specialPrice = demoPrice(item.id, item.vatPrice, 100)
    if (specialPrice === null) return item
    return {
      ...item,
      specialPrice,
      specialValidFrom: new Date(from),
      specialValidTo: new Date(to),
      specialCampaign: BLACK_FRIDAY.campaign,
    }
  })
}

export function applyDemoSpareSpecials<T extends DemoSpareShape>(
  items: T[],
  now: Date = new Date(),
): T[] {
  const { from, to } = demoBounds(now)
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
      specialValidFrom: new Date(from),
      specialValidTo: new Date(to),
      specialCampaign: BLACK_FRIDAY.campaign,
    }
  })
}

/** Returns `items` unchanged (same reference) unless demo mode is on. */
export function withDemoVehicleSpecials<T extends DemoVehicleShape>(
  items: T[],
  env: Env = process.env,
  now: Date = new Date(),
): T[] {
  return isDemoMode(env) ? applyDemoVehicleSpecials(items, now) : items
}

export function withDemoSpareSpecials<T extends DemoSpareShape>(
  items: T[],
  env: Env = process.env,
  now: Date = new Date(),
): T[] {
  return isDemoMode(env) ? applyDemoSpareSpecials(items, now) : items
}

type RawDate = string | Date | null | undefined

function toDate(v: RawDate): Date | null {
  if (v == null) return null
  return v instanceof Date ? v : new Date(v)
}

/**
 * unstable_cache JSON-serialises its result, so Dates come back as ISO
 * strings on a cache hit. Convert them back without mutating the input.
 */
export function reviveRows<
  V extends { createdAt: unknown; specialValidFrom: unknown; specialValidTo: unknown },
  S extends { createdAt: unknown; specialValidFrom: unknown; specialValidTo: unknown },
>(rows: { vehicles: V[]; spares: S[] }): {
  vehicles: (Omit<V, 'createdAt' | 'specialValidFrom' | 'specialValidTo'> & {
    createdAt: Date
    specialValidFrom: Date | null
    specialValidTo: Date | null
  })[]
  spares: (Omit<S, 'createdAt' | 'specialValidFrom' | 'specialValidTo'> & {
    createdAt: Date
    specialValidFrom: Date | null
    specialValidTo: Date | null
  })[]
} {
  const fix = <T extends { createdAt: unknown; specialValidFrom: unknown; specialValidTo: unknown }>(
    r: T,
  ) => ({
    ...r,
    createdAt: toDate(r.createdAt as RawDate) as Date,
    specialValidFrom: toDate(r.specialValidFrom as RawDate),
    specialValidTo: toDate(r.specialValidTo as RawDate),
  })
  return { vehicles: rows.vehicles.map(fix), spares: rows.spares.map(fix) } as never
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

const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const

function dayAndMonth(iso: string): { day: number; month: string } {
  const [, m, d] = iso.split('-')
  return { day: Number(d), month: SHORT_MONTHS[Number(m) - 1] }
}

/** Window label for display, e.g. "9 – 30 Nov" (or "28 Oct – 3 Nov"). */
export function formatWindowLabel(): string {
  const start = dayAndMonth(BLACK_FRIDAY.startsOn)
  const end = dayAndMonth(BLACK_FRIDAY.endsOn)
  return start.month === end.month
    ? `${start.day} – ${end.day} ${end.month}`
    : `${start.day} ${start.month} – ${end.day} ${end.month}`
}

/**
 * Gate for the root layout's deals query: outside the window (and outside
 * preview demo mode) the layout must not touch any cache or the database.
 */
export function shouldQueryLayoutDeals(
  now: Date = new Date(),
  env: Env = process.env,
): boolean {
  return isBlackFridayWindow(now) || isDemoMode(env)
}

export function emptyDeals(isDemo = false): BlackFridayDeals {
  return { vehicles: [], spares: [], count: 0, featured: null, more: [], isDemo }
}

/**
 * Resolve the deals, or fall back to "no campaign" if loading fails (database
 * error, missing column). A synchronous throw in `load` is caught too.
 */
export async function settleDeals(
  load: () => Promise<BlackFridayDeals>,
  onError?: (err: unknown) => void,
): Promise<BlackFridayDeals> {
  try {
    return await load()
  } catch (err) {
    onError?.(err)
    return emptyDeals()
  }
}
