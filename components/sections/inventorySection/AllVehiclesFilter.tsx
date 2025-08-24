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
    if (searchTerm) filters.search = searchTerm
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
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limitValue.toString(),
          ...filters,
        })

        const res = await fetch(`/api/vehicles?${params.toString()}`)
        if (!res.ok) throw new Error('Failed to fetch trucks')
        const data = await res.json()

        setTrucks(data.vehicles)
        setPaginationMeta({
          ...data.meta,
          page,
        })

        if (data.filterOptions) {
          setFilterOptions(data.filterOptions)
        }

        setError(null)
      } catch (error: unknown) {
        console.error('Error fetching trucks:', error)
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError('An unexpected error occurred')
        }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const fetchFilterOptions = useCallback(async () => {
    try {
      const res = await fetch('/api/vehicles/filters')
      if (!res.ok) throw new Error('Failed to fetch filter options')
      const data = await res.json()
      setFilterOptions(data)
    } catch (error) {
      console.error('Filter options fetch error:', error)
    }
  }, [])

  useEffect(() => {
    fetchTrucks()
    fetchFilterOptions()
  }, [fetchTrucks, fetchFilterOptions])

  useEffect(() => {
    const filters = buildFilters()
    setPaginationMeta((prev) => ({ ...prev, page: 1 }))

    const timeoutId = setTimeout(() => {
      fetchTrucks(1, limit, filters)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [buildFilters, limit, fetchTrucks]) // Simplified dependencies

  useEffect(() => {
    setModelFilter('all')
  }, [makeFilter])

  const getModelsForMake = useMemo(() => {
    if (makeFilter === 'all') return filterOptions.models
    return filterOptions.models
      .filter((model) =>
        trucks.some(
          (truck) =>
            truck.make.toLowerCase() === makeFilter.toLowerCase() &&
            truck.model.toLowerCase() === model.toLowerCase()
        )
      )
      .filter((model, index, array) => array.indexOf(model) === index)
      .sort()
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
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">Error: {error}</p>
          <Button onClick={() => fetchTrucks()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Our Inventory
          </h1>
          <p className="text-lg text-gray-600">
            Browse our selection of quality pre-owned trucks
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
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

            {/* Make */}
            <Select value={makeFilter} onValueChange={setMakeFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Makes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Makes</SelectItem>
                {filterOptions.makes.map((make) => (
                  <SelectItem key={make} value={make}>
                    {make}
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
                {filterOptions.bodyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Truck Size */}
            <Select value={truckSizeFilter} onValueChange={setTruckSizeFilter}>
              <SelectTrigger className="w-full">
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
          </div>

          <div className="mt-4">
            <Button onClick={clearFilters} variant="outline" size="sm">
              Clear All Filters
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">Showing {paginationMeta.total} trucks</p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading vehicles...</p>
          </div>
        )}

        {!loading && trucks.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trucks.map((truck) => (
                <Card
                  key={truck.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative -top-6">
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
                    <h3 className="text-xl font-bold mb-2 -mt-10">
                      {truck.year} {truck.make.toUpperCase()}{' '}
                      {truck.model.toUpperCase()}
                    </h3>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-yellow-600">
                        R{truck.vatPrice.toLocaleString()}{' '}
                        <span className="text-sm">incl. VAT</span>
                      </span>
                      <span className="text-gray-600 flex items-center">
                        <Gauge size={18} className="mr-1" />
                        {truck.mileage.toLocaleString()} km
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary">{truck.condition}</Badge>
                      <Badge variant="secondary">{truck.fuelType}</Badge>
                      <Badge variant="secondary">{truck.transmission}</Badge>
                    </div>
                    <Button asChild className="w-full">
                      <Link href={`/inventory/${truck.slug}`}>
                        View Details
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-end">
              <Pagination
                currentPage={paginationMeta.page}
                totalPages={paginationMeta.totalPages}
                onPageChange={handlePageChange}
                limit={limit}
                onLimitChange={handleLimitChange}
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
