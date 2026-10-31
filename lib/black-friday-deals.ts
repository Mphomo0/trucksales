import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'
import {
  applyDemoSpareSpecials,
  applyDemoVehicleSpecials,
  buildDeals,
  isDemoMode,
  reviveRows,
  settleDeals,
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
const getRealRows = unstable_cache(
  async (): Promise<Rows> => {
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
  },
  ['black-friday-rows'],
  CACHE_OPTS,
)

/** Demo mode (previews only): latest stock, specials are faked afterwards. */
const getDemoRows = unstable_cache(
  async (): Promise<Rows> => {
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
  },
  ['black-friday-rows-demo'],
  CACHE_OPTS,
)

async function loadDeals(): Promise<BlackFridayDeals> {
  const demo = isDemoMode()
  const raw = await (demo ? getDemoRows() : getRealRows())
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

/** Never throws: a failing query hides the campaign instead of crashing pages. */
export function getBlackFridayDeals(): Promise<BlackFridayDeals> {
  return settleDeals(loadDeals, (err) =>
    console.error('[black-friday] deals query failed', err),
  )
}
