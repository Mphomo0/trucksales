import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'
import {
  applyDemoSpareSpecials,
  applyDemoVehicleSpecials,
  buildDeals,
  emptyDeals,
  isDemoMode,
  reviveRows,
  settleDeals,
  shouldQueryLayoutDeals,
  type BlackFridayDeals,
  type DealSpare,
  type DealVehicle,
} from '@/lib/black-friday'
import { SPECIALS_REVALIDATE_SECONDS } from '@/lib/specials'

type Rows = { vehicles: DealVehicle[]; spares: DealSpare[] }

const vehicleSelect = {
  id: true,
  name: true,
  make: true,
  model: true,
  year: true,
  vatPrice: true,
  pricenoVat: true,
  images: true,
  slug: true,
  bodyType: true,
  createdAt: true,
  specialPrice: true,
  specialValidFrom: true,
  specialValidTo: true,
  specialCampaign: true,
} as const

const spareSelect = {
  id: true,
  name: true,
  make: true,
  category: true,
  condition: true,
  price: true,
  noVatPrice: true,
  images: true,
  slug: true,
  createdAt: true,
  specialPrice: true,
  specialPriceNoVat: true,
  specialValidFrom: true,
  specialValidTo: true,
  specialCampaign: true,
} as const

const CACHE_OPTS = {
  revalidate: SPECIALS_REVALIDATE_SECONDS,
  tags: ['black-friday', 'inventory', 'spares'],
}

/**
 * Real mode: every row tagged for the campaign. No date conditions here:
 * exact liveness is decided at render time in buildDeals, so the cache
 * never hides a deal that starts within the hour.
 */
async function queryRealRows(): Promise<Rows> {
  const where = { specialCampaign: 'black-friday', specialPrice: { gt: 0 } }
  const [vehicles, spares] = await Promise.all([
    prisma.inventory.findMany({
      where,
      select: vehicleSelect,
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    prisma.spares.findMany({
      where,
      select: spareSelect,
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
  ])
  return { vehicles, spares } as Rows
}

/** Demo mode (previews only): latest stock, specials are faked afterwards. */
async function queryDemoRows(): Promise<Rows> {
  const [vehicles, spares] = await Promise.all([
    prisma.inventory.findMany({
      select: vehicleSelect,
      orderBy: { createdAt: 'desc' },
      take: 40,
    }),
    prisma.spares.findMany({
      select: spareSelect,
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
  ])
  return { vehicles, spares } as Rows
}

const getRealRows = unstable_cache(
  queryRealRows,
  ['black-friday-rows'],
  CACHE_OPTS,
)
const getDemoRows = unstable_cache(
  queryDemoRows,
  ['black-friday-rows-demo'],
  CACHE_OPTS,
)

/**
 * Layout-only caches: tagged 'black-friday' only. unstable_cache called during
 * a prerender lowers the route's revalidate and adds its tags to the page, and
 * the root layout renders on every page, so these must not carry the
 * inventory/spares tags or an owner save would purge the whole site.
 */
const LAYOUT_CACHE_OPTS = {
  revalidate: SPECIALS_REVALIDATE_SECONDS,
  tags: ['black-friday'],
}
const getLayoutRealRows = unstable_cache(
  queryRealRows,
  ['black-friday-rows-layout'],
  LAYOUT_CACHE_OPTS,
)
const getLayoutDemoRows = unstable_cache(
  queryDemoRows,
  ['black-friday-rows-layout-demo'],
  LAYOUT_CACHE_OPTS,
)

function shapeDeals(raw: Rows, demo: boolean): BlackFridayDeals {
  const rows = reviveRows(raw)
  const now = new Date()
  const prepared = demo
    ? {
        vehicles: applyDemoVehicleSpecials(rows.vehicles, now),
        spares: applyDemoSpareSpecials(rows.spares, now),
      }
    : rows
  return buildDeals(prepared, { now, demo })
}

async function loadDeals(): Promise<BlackFridayDeals> {
  const demo = isDemoMode()
  return shapeDeals(await (demo ? getDemoRows() : getRealRows()), demo)
}

async function loadLayoutDeals(): Promise<BlackFridayDeals> {
  // Outside the window nothing cached is read, so the layout adds no tags
  // and no revalidate lifetime to the pages it wraps.
  if (!shouldQueryLayoutDeals(new Date())) return emptyDeals()
  const demo = isDemoMode()
  return shapeDeals(
    await (demo ? getLayoutDemoRows() : getLayoutRealRows()),
    demo,
  )
}

/** Never throws: a failing query hides the campaign instead of crashing pages. */
export function getBlackFridayDeals(): Promise<BlackFridayDeals> {
  return settleDeals(loadDeals, (err) =>
    console.error('[black-friday] deals query failed', err),
  )
}

/**
 * For app/layout.tsx only (top bar + chat links). Cheap and tag-isolated;
 * pages that render deals use getBlackFridayDeals. Never throws.
 */
export function getBlackFridayLayoutDeals(): Promise<BlackFridayDeals> {
  return settleDeals(loadLayoutDeals, (err) =>
    console.error('[black-friday] layout deals query failed', err),
  )
}
