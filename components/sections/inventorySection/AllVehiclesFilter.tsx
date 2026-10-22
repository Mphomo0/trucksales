'use client'

import { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Filter, Gauge } from 'lucide-react'
import ImageComponent from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Pagination } from '@/components/global/Pagination'
import { getCurrentPrice } from '@/lib/pricing'
import { ikCard } from '@/lib/imagekit'
import { formatNumber } from '@/lib/format'
import { cn } from '@/lib/utils'
import {
  isDefaultInventoryQuery,
  readInventoryQuery,
  toVehicleApiParams,
  updateInventorySearch,
  type InventoryFilterOptions,
  type InventoryQuery,
} from '@/lib/inventory-query'

interface Truck {
  id: string
  name: string
  make: string
  model: string
  year: number
  vatPrice: number
  pricenoVat: number
  mileage: number | null
  fuelType: string | null
  condition: string
  transmission: string | null
  images: { fileId: string; url: string }[]
  description: string
  bodyType: string | null
  truckSize: string | null
  slug: string
  specialPrice: number | null
  specialValidFrom: Date | string | null
  specialValidTo: Date | string | null
}

interface FilterOptions extends InventoryFilterOptions {
  // Lowercased make -> models stocked under it, so the model list covers every page
  modelsByMake?: Record<string, string[]>
}

interface VehicleMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

// Prisma returns images as JsonValue; this type bridges the server/client boundary
type InitialTruck = Omit<Truck, 'images'> & { images: unknown }

interface AllVehiclesFilterProps {
  initialVehicles?: InitialTruck[]
  initialMeta?: VehicleMeta
  initialFilterOptions?: FilterOptions
}

interface TruckCardProps {
  truck: Truck
  priority: boolean
}

const EMPTY_OPTIONS: FilterOptions = { makes: [], models: [], bodyTypes: [], truckSizes: [] }

const TruckCard = memo(function TruckCard({ truck, priority }: TruckCardProps) {
  const priceInfo = getCurrentPrice(
    truck.vatPrice,
    truck.specialPrice ?? null,
    truck.specialValidFrom ?? null,
    truck.specialValidTo ?? null
  )
  const validUntil = truck.specialValidTo
    ? new Intl.DateTimeFormat('en-ZA', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'Africa/Johannesburg',
      }).format(new Date(truck.specialValidTo))
    : null

  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <ImageComponent
          src={ikCard(truck.images?.[0]?.url || '/placeholder-truck.svg')}
          alt={`${truck.year} ${truck.make} ${truck.model}`}
          width={400}
          height={300}
          className="w-full h-48 object-cover"
          priority={priority}
        />
        {priceInfo.isSpecial && (
          <Badge className="absolute top-2 left-2 bg-red-600">SPECIAL</Badge>
        )}
        <Badge className="absolute top-2 right-2 bg-amber-600">
          {truck.condition}
        </Badge>
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2 text-balance">
          {truck.year} {truck.make?.toUpperCase()} {truck.model?.toUpperCase()}
        </h3>
        <div className="flex justify-between items-start gap-2 mb-4">
          <div className="flex flex-col gap-1 min-w-0 tabular-nums">
            {priceInfo.isSpecial ? (
              <>
                <span className="text-lg font-bold text-red-500 line-through">
                  R{formatNumber(priceInfo.originalPrice)}
                </span>
                <span className="text-2xl font-bold text-yellow-600">
                  R{formatNumber(priceInfo.currentPrice)}
                  <span className="text-xs font-normal text-gray-500 ml-1">
                    incl. VAT
                  </span>
                </span>
                {validUntil && (
                  <span className="text-xs text-green-600 font-medium">
                    Valid until {validUntil}
                  </span>
                )}
              </>
            ) : (
              <span className="text-2xl font-bold text-yellow-600">
                {truck.vatPrice ? `R${formatNumber(truck.vatPrice)}` : 'POA'}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  incl. VAT
                </span>
              </span>
            )}
          </div>
          <span className="text-gray-600 flex items-center shrink-0 tabular-nums">
            <Gauge size={18} className="mr-1" />
            {formatNumber(truck.mileage) ?? 'N/A'} km
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {truck.condition && (
            <Badge variant="secondary">{truck.condition}</Badge>
          )}
          {truck.fuelType && (
            <Badge variant="secondary">{truck.fuelType}</Badge>
          )}
          {truck.transmission && (
            <Badge variant="secondary">{truck.transmission}</Badge>
          )}
        </div>
        {/* The whole card is the link; a <button> inside an <a> is invalid HTML */}
        <span className={cn(buttonVariants(), 'w-full')}>View Details</span>
      </CardContent>
    </Card>
  )
})

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function AllVehiclesFilter({
  initialVehicles = [],
  initialMeta,
  initialFilterOptions,
}: AllVehiclesFilterProps) {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(
    initialFilterOptions ?? EMPTY_OPTIONS
  )

  // The URL is the source of truth for filters and paging (shareable, and the
  // back button restores the previous view). Links such as
  // /inventory?make=Isuzu or ?size=3 to 5 ton preselect filters.
  const searchParams = useSearchParams()
  const query = useMemo(
    () => readInventoryQuery(searchParams, filterOptions),
    [searchParams, filterOptions]
  )
  // Primitive key so the fetch only re-runs when the request would change
  const apiKey = toVehicleApiParams(query).toString()

  const [trucks, setTrucks] = useState<Truck[]>(initialVehicles as Truck[])
  const [meta, setMeta] = useState<VehicleMeta>({
    total: initialMeta?.total ?? 0,
    page: initialMeta?.page ?? 1,
    limit: initialMeta?.limit ?? 25,
    totalPages: initialMeta?.totalPages ?? 0,
  })
  const [loading, setLoading] = useState(initialVehicles.length === 0)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  // Search box: typed text is local, the debounced value goes to the URL.
  // When the URL's search changes from outside (back/forward), mirror it.
  const [searchInput, setSearchInput] = useState(query.search)
  const [syncedSearch, setSyncedSearch] = useState(query.search)
  if (query.search !== syncedSearch) {
    setSyncedSearch(query.search)
    setSearchInput(query.search)
  }

  const updateQuery = useCallback(
    (patch: Partial<InventoryQuery>, mode: 'push' | 'replace' = 'replace') => {
      const next = updateInventorySearch(window.location.search, patch)
      const url = next ? `?${next}` : window.location.pathname
      // Native history calls sync with useSearchParams without a server round trip
      if (mode === 'push') window.history.pushState(null, '', url)
      else window.history.replaceState(null, '', url)
    },
    []
  )

  // Filter options are server-rendered; this only runs if they were not passed
  useEffect(() => {
    if (initialFilterOptions) return
    const controller = new AbortController()
    fetch('/api/vehicles/filters', { cache: 'force-cache', signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data || typeof data !== 'object') return
        setFilterOptions({
          makes: Array.isArray(data.makes) ? data.makes : [],
          models: Array.isArray(data.models) ? data.models : [],
          bodyTypes: Array.isArray(data.bodyTypes) ? data.bodyTypes : [],
          truckSizes: Array.isArray(data.truckSizes) ? data.truckSizes : [],
        })
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return
        console.error('Filter options fetch error:', err)
      })
    return () => controller.abort()
  }, [initialFilterOptions])

  // One request per distinct query. Aborting the previous request means a slow
  // response for an old filter can never overwrite the results of a newer one.
  const skipInitialFetch = useRef(
    initialVehicles.length > 0 && isDefaultInventoryQuery(query)
  )
  useEffect(() => {
    if (skipInitialFetch.current) {
      skipInitialFetch.current = false
      return
    }

    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetch(`/api/vehicles?${apiKey}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.message || `HTTP ${res.status}: ${res.statusText}`)
        }
        return res.json()
      })
      .then((data) => {
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid response format from server')
        }
        setTrucks(Array.isArray(data.vehicles) ? data.vehicles : [])
        if (data.meta) setMeta(data.meta)
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return
        console.error('Error fetching trucks:', err)
        setError(
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred while fetching vehicles'
        )
        setTrucks([])
        setLoading(false)
      })

    return () => controller.abort()
  }, [apiKey, retryCount])

  // Debounce only the search input — select filters update the URL immediately
  useEffect(() => {
    const trimmed = searchInput.trim()
    if (trimmed === query.search) return
    const timeoutId = setTimeout(() => updateQuery({ search: trimmed }), 500)
    return () => clearTimeout(timeoutId)
  }, [searchInput, query.search, updateQuery])

  const modelsForMake = useMemo(() => {
    if (query.make === 'all') return filterOptions.models
    return filterOptions.modelsByMake?.[query.make.toLowerCase()] ?? filterOptions.models
  }, [query.make, filterOptions])

  const clearFilters = useCallback(() => {
    setSearchInput('')
    updateQuery({
      search: '',
      make: 'all',
      model: 'all',
      bodyType: 'all',
      truckSize: 'all',
      limit: 25,
    })
  }, [updateQuery])

  const handlePageChange = useCallback(
    (page: number) => {
      updateQuery({ page }, 'push')
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    },
    [updateQuery]
  )

  const getPageHref = useCallback(
    (page: number) => {
      const next = updateInventorySearch(searchParams.toString(), { page })
      return next ? `/inventory?${next}` : '/inventory'
    },
    [searchParams]
  )

  const handleLimitChange = useCallback(
    (limit: number) => updateQuery({ limit }),
    [updateQuery]
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 md:py-8">
        <div className="mb-8">
          <h2 className="hidden md:block text-3xl font-bold text-gray-900 mb-2 text-balance">
            Our Inventory
          </h2>
          <p className="hidden md:block text-lg text-gray-600">
            Browse our selection of quality pre-owned trucks
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-2 md:mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold">Filter Results</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                name="search"
                autoComplete="off"
                spellCheck={false}
                aria-label="Search trucks by make or model"
                placeholder="Search make or model…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Truck Size */}
            <Select
              value={query.truckSize}
              onValueChange={(value) => updateQuery({ truckSize: value })}
            >
              <SelectTrigger className="w-full" aria-label="Filter by truck size">
                <SelectValue placeholder="All Truck Sizes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Truck Sizes</SelectItem>
                {filterOptions.truckSizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Make */}
            <Select
              value={query.make}
              onValueChange={(value) => updateQuery({ make: value })}
            >
              <SelectTrigger className="w-full" aria-label="Filter by make">
                <SelectValue placeholder="All Makes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Makes</SelectItem>
                {filterOptions.makes.map((make) => (
                  <SelectItem key={make} value={make}>
                    {make.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Model */}
            <Select
              value={query.model}
              onValueChange={(value) => updateQuery({ model: value })}
              disabled={query.make === 'all'}
            >
              <SelectTrigger className="w-full" aria-label="Filter by model">
                <SelectValue placeholder="All Models" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Models</SelectItem>
                {modelsForMake.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Body Type */}
            <Select
              value={query.bodyType}
              onValueChange={(value) => updateQuery({ bodyType: value })}
            >
              <SelectTrigger className="w-full" aria-label="Filter by body type">
                <SelectValue placeholder="All Body Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Body Types</SelectItem>
                {filterOptions.bodyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4">
            <Button onClick={clearFilters} variant="outline" size="sm">
              Clear All Filters
            </Button>
          </div>
        </div>

        {/* Results — announced to screen readers as they change */}
        <div className="mb-6" role="status" aria-live="polite">
          <p className={cn('text-gray-600', !loading && 'sr-only md:not-sr-only')}>
            {loading
              ? 'Loading trucks…'
              : error
                ? 'Could not load trucks.'
                : `Showing ${trucks.length}${meta.total > trucks.length ? ` of ${meta.total}` : ''} trucks`}
          </p>
        </div>

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg mb-4">
              We couldn&apos;t load the trucks ({error}). Check your connection
              and try again.
            </p>
            <Button onClick={() => setRetryCount((n) => n + 1)}>Try Again</Button>
          </div>
        )}

        {loading && (
          <div className="text-center py-12" aria-hidden="true">
            <p className="text-gray-500 text-lg motion-safe:animate-pulse">
              Loading vehicles…
            </p>
          </div>
        )}

        {!loading && !error && trucks.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {trucks.map((truck, index) => (
                <Link
                  key={truck.id}
                  href={`/inventory/${truck.slug || truck.id}`}
                  prefetch={false}
                  className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
                >
                  <TruckCard truck={truck} priority={index < 3} />
                </Link>
              ))}
            </div>

            {meta.totalPages > 1 && (
              <div className="mt-8 mb-12">
                <Pagination
                  currentPage={meta.page}
                  totalPages={meta.totalPages}
                  onPageChange={handlePageChange}
                  getPageHref={getPageHref}
                  limit={meta.limit}
                  onLimitChange={handleLimitChange}
                  showLimitSelector={true}
                />
              </div>
            )}
          </>
        )}

        {!loading && !error && trucks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              No trucks match these filters. Try a different size or make, or
              clear the filters to see all stock.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
