/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

'use client'

import { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react'
import { Button } from '@/components/ui/button'
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
import { Pagination } from '@/components/global/Pagination'
import { getCurrentPrice } from '@/lib/pricing'
import { ikCard } from '@/lib/imagekit'

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

interface FilterOptions {
  makes: string[]
  models: string[]
  bodyTypes: string[]
  truckSizes: string[]
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

const TruckCard = memo(function TruckCard({ truck, priority }: TruckCardProps) {
  const priceInfo = getCurrentPrice(
    truck.vatPrice,
    truck.specialPrice ?? null,
    truck.specialValidFrom ?? null,
    truck.specialValidTo ?? null
  )
  const validUntil = truck.specialValidTo
    ? new Date(truck.specialValidTo).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <ImageComponent
          src={ikCard(truck.images?.[0]?.url || '/placeholder-truck.svg')}
          alt={`${truck.year} ${truck.make} ${truck.model}`}
          width={400}
          height={300}
          className="w-full h-48 object-cover"
          priority={priority}
        />
        {priceInfo.isSpecial ? (
          <>
            <Badge className="absolute top-2 left-2 bg-red-600">SPECIAL</Badge>
            <Badge className="absolute top-2 right-2 bg-amber-600">
              {truck.condition}
            </Badge>
          </>
        ) : (
          <Badge className="absolute top-2 right-2 bg-amber-600">
            {truck.condition}
          </Badge>
        )}
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2">
          {truck.year} {truck.make?.toUpperCase()} {truck.model?.toUpperCase()}
        </h3>
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col gap-1">
            {priceInfo.isSpecial ? (
              <>
                <span className="text-lg font-bold text-red-500 line-through">
                  R{priceInfo.originalPrice.toLocaleString()}
                </span>
                <span className="text-2xl font-bold text-yellow-600">
                  R{priceInfo.currentPrice.toLocaleString()}
                  <span className="text-xs font-normal text-gray-500 ml-1">
                    incl. VAT
                  </span>
                </span>
                {truck.specialValidTo && (
                  <span className="text-xs text-green-600 font-medium">
                    Valid until {validUntil}
                  </span>
                )}
              </>
            ) : (
              <span className="text-2xl font-bold text-yellow-600">
                R{truck.vatPrice?.toLocaleString() ?? 'N/A'}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  incl. VAT
                </span>
              </span>
            )}
          </div>
          <span className="text-gray-600 flex items-center">
            <Gauge size={18} className="mr-1" />
            {truck.mileage?.toLocaleString() ?? 'N/A'} km
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
        <Button asChild className="w-full">
          View Details
        </Button>
      </CardContent>
    </Card>
  )
})

/* <h1>A-Z Truck Sales Components</h1> */ export default function AllVehiclesFilter({
  initialVehicles = [],
  initialMeta,
  initialFilterOptions,
}: AllVehiclesFilterProps) {
  const [trucks, setTrucks] = useState<Truck[]>(initialVehicles as Truck[])
  const [loading, setLoading] = useState(initialVehicles.length === 0)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [makeFilter, setMakeFilter] = useState('all')
  const [modelFilter, setModelFilter] = useState('all')
  const [bodyTypeFilter, setBodyTypeFilter] = useState('all')
  const [truckSizeFilter, setTruckSizeFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(25)
  const [meta, setMeta] = useState<VehicleMeta>({
    total: initialMeta?.total ?? 0,
    page: initialMeta?.page ?? 1,
    limit: initialMeta?.limit ?? 25,
    totalPages: initialMeta?.totalPages ?? 0,
  })

  const [filterOptions, setFilterOptions] = useState<FilterOptions>(
    initialFilterOptions ?? { makes: [], models: [], bodyTypes: [], truckSizes: [] }
  )
  const [showFilters, setShowFilters] = useState(true)
  const initialLoad = useRef(true)

  const buildFilters = useCallback(
    (page = 1, itemsPerPage = limit) => {
      const filters: Record<string, string> = {
        page: page.toString(),
        limit: itemsPerPage.toString(),
      }
      if (searchTerm.trim()) filters.search = searchTerm.trim()
      if (makeFilter !== 'all') filters.make = makeFilter
      if (modelFilter !== 'all') filters.model = modelFilter
      if (bodyTypeFilter !== 'all') filters.bodyType = bodyTypeFilter
      if (truckSizeFilter !== 'all') filters.truckSize = truckSizeFilter
      return filters
    },
    [searchTerm, makeFilter, modelFilter, bodyTypeFilter, truckSizeFilter, limit]
  )

  const fetchTrucks = useCallback(async (filters = {}) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams(filters)

      const res = await fetch(`/api/vehicles?${params.toString()}`)

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(
          errorData.message || `HTTP ${res.status}: ${res.statusText}`
        )
      }

      const data = await res.json()

      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format from server')
      }

      setTrucks(Array.isArray(data.vehicles) ? data.vehicles : [])

      if (data.meta) {
        setMeta(data.meta)
        setCurrentPage(data.meta.page)
      }

      if (data.filterOptions) {
        setFilterOptions({
          makes: Array.isArray(data.filterOptions.makes)
            ? data.filterOptions.makes
            : [],
          models: Array.isArray(data.filterOptions.models)
            ? data.filterOptions.models
            : [],
          bodyTypes: Array.isArray(data.filterOptions.bodyTypes)
            ? data.filterOptions.bodyTypes
            : [],
          truckSizes: Array.isArray(data.filterOptions.truckSizes)
            ? data.filterOptions.truckSizes
            : [],
        })
      }
    } catch (error: unknown) {
      console.error('Error fetching trucks:', error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unexpected error occurred while fetching vehicles')
      }
      setTrucks([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchFilterOptions = useCallback(async () => {
    try {
      const res = await fetch('/api/vehicles/filters', { cache: 'force-cache' })

      if (!res.ok) {
        return
      }

      const data = await res.json()

      if (data && typeof data === 'object') {
        setFilterOptions({
          makes: Array.isArray(data.makes) ? data.makes : [],
          models: Array.isArray(data.models) ? data.models : [],
          bodyTypes: Array.isArray(data.bodyTypes) ? data.bodyTypes : [],
          truckSizes: Array.isArray(data.truckSizes) ? data.truckSizes : [],
        })
      }
    } catch (error) {
      console.error('Filter options fetch error:', error)
    }
  }, [])

  // Initial load — skip both fetches when server pre-populated the data
  useEffect(() => {
    const loadInitialData = async () => {
      const tasks: Promise<void>[] = []
      if (!initialFilterOptions) tasks.push(fetchFilterOptions())
      if (initialVehicles.length === 0) tasks.push(fetchTrucks(buildFilters(1)))
      if (tasks.length > 0) await Promise.all(tasks)
    }

    loadInitialData()
  }, [])

  // Filter change effect with debouncing - resets to page 1
  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false
      return
    }

    const timeoutId = setTimeout(() => {
      const filters = buildFilters(1)
      fetchTrucks(filters)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [
    searchTerm,
    makeFilter,
    modelFilter,
    bodyTypeFilter,
    truckSizeFilter,
    buildFilters,
    fetchTrucks,
  ])

  // Reset model when make changes
  useEffect(() => {
    if (makeFilter === 'all') {
      setModelFilter('all')
    } else {
      const validModels = getModelsForMake
      if (modelFilter !== 'all' && !validModels.includes(modelFilter)) {
        setModelFilter('all')
      }
    }
  }, [makeFilter])

  const getModelsForMake = useMemo(() => {
    if (makeFilter === 'all') return filterOptions.models || []

    const availableModels = trucks
      .filter((truck) => truck.make?.toLowerCase() === makeFilter.toLowerCase())
      .map((truck) => truck.model)
      .filter(Boolean)

    const uniqueModels = [...new Set(availableModels)].sort()

    return filterOptions.models.filter((model) =>
      uniqueModels.some(
        (availableModel) => availableModel.toLowerCase() === model.toLowerCase()
      )
    )
  }, [makeFilter, filterOptions.models, trucks])

  const clearFilters = useCallback(() => {
    setSearchTerm('')
    setMakeFilter('all')
    setModelFilter('all')
    setBodyTypeFilter('all')
    setTruckSizeFilter('all')
    setCurrentPage(1)
    setLimit(25)
  }, [])

  const activeFilterCount = [
    makeFilter !== 'all',
    modelFilter !== 'all',
    bodyTypeFilter !== 'all',
    truckSizeFilter !== 'all',
  ].filter(Boolean).length

  const handlePageChange = useCallback(
    (page: number) => {
      const filters = buildFilters(page)
      fetchTrucks(filters)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [buildFilters, fetchTrucks]
  )

  const handleLimitChange = useCallback(
    (newLimit: number) => {
      setLimit(newLimit)
      setCurrentPage(1)
      const filters = buildFilters(1, newLimit)
      fetchTrucks(filters)
    },
    [buildFilters, fetchTrucks]
  )

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-500 text-lg mb-4">Error: {error}</p>
          <Button onClick={() => fetchTrucks(buildFilters(1))}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 md:py-8">
        <div className="mb-8">
          <h2 className="hidden md:block text-3xl font-bold text-gray-900 mb-2">
            Our Inventory
          </h2>
          <p className="hidden md:block text-lg text-gray-600">
            Browse our selection of quality pre-owned trucks
          </p>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-2 md:mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Filter Results</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search make or model..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Truck Size */}
              <Select value={truckSizeFilter} onValueChange={setTruckSizeFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Truck Sizes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Truck Size</SelectItem>
                  {(filterOptions.truckSizes || []).map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Make */}
              <Select value={makeFilter} onValueChange={setMakeFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Makes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Makes</SelectItem>
                  {(filterOptions.makes || []).map((make) => (
                    <SelectItem key={make} value={make}>
                      {make.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Model */}
              <Select
                value={modelFilter}
                onValueChange={setModelFilter}
                disabled={makeFilter === 'all'}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Models" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Models</SelectItem>
                  {getModelsForMake.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Body Type */}
              <Select value={bodyTypeFilter} onValueChange={setBodyTypeFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Body Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Body Types</SelectItem>
                  {(filterOptions.bodyTypes || []).map((type) => (
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
        )}

        {/* Results */}
        <div className="mb-6">
          <p className="hidden md:block text-gray-600">
            Showing {loading ? '...' : trucks.length} trucks
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-pulse">
              <p className="text-gray-500 text-lg">Loading vehicles...</p>
            </div>
          </div>
        )}

        {!loading && trucks.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {trucks.map((truck, index) => (
                <Link
                  key={truck.id}
                  href={`/inventory/${truck.slug || truck.id}`}
                  prefetch={false}
                >
                  <TruckCard truck={truck} priority={index < 3} />
                </Link>
              ))}
            </div>

            {meta.totalPages > 1 && (
              <div className="mt-8 mb-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={meta.totalPages}
                  onPageChange={handlePageChange}
                  limit={meta.limit}
                  onLimitChange={handleLimitChange}
                  showLimitSelector={true}
                />
              </div>
            )}
          </>
        )}

        {!loading && trucks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              No trucks found matching your criteria.
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
