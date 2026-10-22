// The /inventory filters live in the URL so a filtered or paged view can be
// shared, bookmarked and restored with the back button.

export const INVENTORY_PAGE_SIZE = 25
export const INVENTORY_PAGE_SIZES = [10, 25, 50, 100, 150] as const

export interface InventoryQuery {
  search: string
  make: string
  model: string
  bodyType: string
  truckSize: string
  page: number
  limit: number
}

export interface InventoryFilterOptions {
  makes: string[]
  models: string[]
  bodyTypes: string[]
  truckSizes: string[]
}

// URL parameter for each query field. `size` predates this module and is used
// by links across the site (tonnage pages, brand pages), so it stays.
const PARAM: Record<keyof InventoryQuery, string> = {
  search: 'search',
  make: 'make',
  model: 'model',
  bodyType: 'bodyType',
  truckSize: 'size',
  page: 'page',
  limit: 'limit',
}

const DEFAULTS: InventoryQuery = {
  search: '',
  make: 'all',
  model: 'all',
  bodyType: 'all',
  truckSize: 'all',
  page: 1,
  limit: INVENTORY_PAGE_SIZE,
}

interface ReadableParams {
  get(name: string): string | null
}

/** Matches a URL value to a stored option case-insensitively, so the select shows it. */
function matchOption(raw: string | null, options: string[] | undefined): string {
  if (!raw) return 'all'
  return options?.find((o) => o.toLowerCase() === raw.toLowerCase()) ?? raw
}

function positiveInt(raw: string | null, fallback: number): number {
  const n = Number.parseInt(raw ?? '', 10)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

export function readInventoryQuery(
  params: ReadableParams,
  options?: InventoryFilterOptions,
): InventoryQuery {
  const limit = positiveInt(params.get(PARAM.limit), DEFAULTS.limit)
  return {
    search: params.get(PARAM.search)?.trim() ?? '',
    make: matchOption(params.get(PARAM.make), options?.makes),
    model: matchOption(params.get(PARAM.model), options?.models),
    bodyType: matchOption(params.get(PARAM.bodyType), options?.bodyTypes),
    truckSize: matchOption(params.get(PARAM.truckSize), options?.truckSizes),
    page: positiveInt(params.get(PARAM.page), DEFAULTS.page),
    limit: (INVENTORY_PAGE_SIZES as readonly number[]).includes(limit)
      ? limit
      : DEFAULTS.limit,
  }
}

/** True when the query asks for anything other than the server-rendered first page. */
export function isDefaultInventoryQuery(query: InventoryQuery): boolean {
  return (Object.keys(DEFAULTS) as (keyof InventoryQuery)[]).every(
    (key) => query[key] === DEFAULTS[key],
  )
}

/**
 * Applies `patch` to the current URL search string and returns the new one.
 * Default values are dropped to keep URLs short, and any filter change sends
 * the visitor back to page 1. Unrelated parameters (utm_*, gclid) are kept.
 */
export function updateInventorySearch(
  current: string,
  patch: Partial<InventoryQuery>,
): string {
  const next = new URLSearchParams(current)
  for (const key of Object.keys(patch) as (keyof InventoryQuery)[]) {
    const value = patch[key]
    if (value === undefined || value === DEFAULTS[key] || value === '') {
      next.delete(PARAM[key])
    } else {
      next.set(PARAM[key], String(value))
    }
  }
  if (patch.make !== undefined && patch.model === undefined) next.delete(PARAM.model)
  if (patch.page === undefined) next.delete(PARAM.page)
  return next.toString()
}

/** Parameters for GET /api/vehicles. */
export function toVehicleApiParams(query: InventoryQuery): URLSearchParams {
  const params = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
  })
  if (query.search) params.set('search', query.search)
  if (query.make !== 'all') params.set('make', query.make)
  if (query.model !== 'all') params.set('model', query.model)
  if (query.bodyType !== 'all') params.set('bodyType', query.bodyType)
  if (query.truckSize !== 'all') params.set('truckSize', query.truckSize)
  return params
}
