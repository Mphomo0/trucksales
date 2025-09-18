'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
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

interface Truck {
  id: string
  name: string
  make: string
  model: string
  year: number
  vatPrice: number
  mileage: number
  fuelType: string
  condition: string
  transmission: string
  images: { fileId: string; url: string }[]
  description: string
  bodyType: string
  truckSize: string
  slug: string
}

interface FilterOptions {
  makes: string[]
  models: string[]
  bodyTypes: string[]
  truckSizes: string[]
}

export default function AllVehiclesFilter() {
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [limit, setLimit] = useState(50)

  const [paginationMeta, setPaginationMeta] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [makeFilter, setMakeFilter] = useState('all')
  const [modelFilter, setModelFilter] = useState('all')
  const [bodyTypeFilter, setBodyTypeFilter] = useState('all')
  const [truckSizeFilter, setTruckSizeFilter] = useState('all')

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    makes: [],
    models: [],
    bodyTypes: [],
    truckSizes: [],
  })

  const buildFilters = useCallback(() => {
    const filters: Record<string, string> = {}
    if (searchTerm.trim()) filters.search = searchTerm.trim()
    if (makeFilter !== 'all') filters.make = makeFilter
    if (modelFilter !== 'all') filters.model = modelFilter
    if (bodyTypeFilter !== 'all') filters.bodyType = bodyTypeFilter
    if (truckSizeFilter !== 'all') filters.truckSize = truckSizeFilter
    return filters
  }, [searchTerm, makeFilter, modelFilter, bodyTypeFilter, truckSizeFilter])

  const fetchTrucks = useCallback(
    async (page = 1, limitValue = 50, filters = {}) => {
      try {
        setLoading(true)
        setError(null) // Clear previous errors

        const params = new URLSearchParams({
          page: page.toString(),
          limit: limitValue.toString(),
          ...filters,
        })

        const res = await fetch(`/api/vehicles?${params.toString()}`)

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(
            errorData.message || `HTTP ${res.status}: ${res.statusText}`
          )
        }

        const data = await res.json()

        // Validate response structure
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid response format from server')
        }

        setTrucks(Array.isArray(data.vehicles) ? data.vehicles : [])

        if (data.meta) {
          setPaginationMeta({
            page: data.meta.page || page,
            totalPages: data.meta.totalPages || 1,
            total: data.meta.total || 0,
          })
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
        // Set empty state on error
        setTrucks([])
        setPaginationMeta({ page: 1, totalPages: 1, total: 0 })
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const fetchFilterOptions = useCallback(async () => {
    try {
      const res = await fetch('/api/vehicles/filters')

      if (!res.ok) {
        console.warn(
          `Failed to fetch filter options: ${res.status} ${res.statusText}`
        )
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
      // Keep default empty arrays on error
    }
  }, [])

  // Initial load
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([fetchTrucks(1, limit, {}), fetchFilterOptions()])
    }

    loadInitialData()
  }, []) // Only run once on mount

  // Filter change effect with debouncing
  useEffect(() => {
    const filters = buildFilters()

    // Reset to page 1 when filters change
    setPaginationMeta((prev) => ({ ...prev, page: 1 }))

    const timeoutId = setTimeout(() => {
      fetchTrucks(1, limit, filters)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [
    searchTerm,
    makeFilter,
    modelFilter,
    bodyTypeFilter,
    truckSizeFilter,
    limit,
    buildFilters,
    fetchTrucks,
  ])

  // Reset model when make changes
  useEffect(() => {
    if (makeFilter === 'all') {
      setModelFilter('all')
    } else {
      // Check if current model is valid for the selected make
      const validModels = getModelsForMake
      if (modelFilter !== 'all' && !validModels.includes(modelFilter)) {
        setModelFilter('all')
      }
    }
  }, [makeFilter]) // Note: getModelsForMake is not included to avoid circular dependency

  const getModelsForMake = useMemo(() => {
    if (makeFilter === 'all') return filterOptions.models || []

    // Filter models based on available trucks for the selected make
    const availableModels = trucks
      .filter((truck) => truck.make?.toLowerCase() === makeFilter.toLowerCase())
      .map((truck) => truck.model)
      .filter(Boolean) // Remove null/undefined

    // Get unique models and sort
    const uniqueModels = [...new Set(availableModels)].sort()

    // Return intersection with filterOptions.models to ensure consistency
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
  }, [])

  const handlePageChange = useCallback(
    (page: number) => {
      const filters = buildFilters()
      fetchTrucks(page, limit, filters)
    },
    [buildFilters, fetchTrucks, limit]
  )

  const handleLimitChange = useCallback(
    (newLimit: number) => {
      setLimit(newLimit)
      const filters = buildFilters()
      fetchTrucks(1, newLimit, filters)
    },
    [buildFilters, fetchTrucks]
  )

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-500 text-lg mb-4">Error: {error}</p>
          <Button onClick={() => fetchTrucks(1, limit, buildFilters())}>
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
          <h1 className="hidden md:block text-3xl font-bold text-gray-900 mb-2">
            Our Inventory
          </h1>
          <p className="hidden md:block text-lg text-gray-600">
            Browse our selection of quality pre-owned trucks
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-2 md:mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold">Filter Results</h2>
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

        {/* Results */}
        <div className="mb-6">
          <p className="hidden md:block text-gray-600">
            Showing {loading ? '...' : paginationMeta.total.toLocaleString()}{' '}
            trucks
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trucks.map((truck) => (
                <Link
                  key={truck.id}
                  href={`/inventory/${truck.slug || truck.id}`}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <ImageComponent
                        src={truck.images?.[0]?.url ?? '/placeholder-truck.jpg'}
                        alt={`${truck.year} ${truck.make} ${truck.model}`}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover"
                        priority
                      />
                      <Badge className="absolute top-2 right-2 bg-amber-600">
                        {truck.condition}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">
                        {truck.year} {truck.make?.toUpperCase()}{' '}
                        {truck.model?.toUpperCase()}
                      </h3>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-yellow-600">
                          R{truck.vatPrice?.toLocaleString() ?? 'N/A'}{' '}
                          <span className="text-sm">incl. VAT</span>
                        </span>
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
                          <Badge variant="secondary">
                            {truck.transmission}
                          </Badge>
                        )}
                      </div>
                      <Button asChild className="w-full">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <Pagination
                currentPage={paginationMeta.page}
                totalPages={paginationMeta.totalPages}
                onPageChange={(page) =>
                  setPaginationMeta({ ...paginationMeta, page })
                }
                limit={limit}
                onLimitChange={(newLimit) => {
                  setLimit(newLimit)
                  setPaginationMeta({ ...paginationMeta, page: 1 }) // reset to first page
                }}
                showLimitSelector={true}
              />
            </div>
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
