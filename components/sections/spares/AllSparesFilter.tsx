'use client'

import { useState, useEffect, useCallback } from 'react'
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
import { Search, Filter } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Pagination } from '@/components/global/Pagination'

interface SparesItem {
  id: string
  name: string
  make: string
  price: number
  category: string
  condition: string
  images: { fileId: string; url: string }[]
  description: string
  slug: string
}

interface FilterOptions {
  makes: string[]
  categories: string[]
}

export default function AllSparesFilter() {
  const [spares, setSpares] = useState<SparesItem[]>([])
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
  const [categoryFilter, setCategoryFilter] = useState('all')

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    makes: [],
    categories: [],
  })

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const res = await fetch('/api/spares/filters')
        if (res.ok) {
          const options = await res.json()
          setFilterOptions(options)
        }
      } catch (error) {
        console.error('Failed to load filter options:', error)
      }
    }
    loadFilterOptions()
  }, [])

  const buildFilters = useCallback(() => {
    const filters: Record<string, string> = {}
    if (searchTerm.trim()) filters.search = searchTerm.trim()
    if (makeFilter !== 'all') filters.make = makeFilter
    if (categoryFilter !== 'all') filters.category = categoryFilter
    return filters
  }, [searchTerm, makeFilter, categoryFilter])

  const fetchSpares = useCallback(
    async (page = 1, limitValue = 50, filters = {}) => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams({
          page: page.toString(),
          limit: limitValue.toString(),
          ...filters,
        })

        const res = await fetch(`/api/spares?${params.toString()}`)

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(
            errorData.message || `HTTP ${res.status}: ${res.statusText}`
          )
        }

        const data = await res.json()

        setSpares(Array.isArray(data.spares) ? data.spares : [])

        if (data.meta) {
          setPaginationMeta({
            page: data.meta.page || page,
            totalPages: data.meta.totalPages || 1,
            total: data.meta.total || 0,
          })
        }
      } catch (error: unknown) {
        console.error('Error fetching spares:', error)
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError('An unexpected error occurred while fetching spares')
        }
        setSpares([])
        setPaginationMeta({ page: 1, totalPages: 1, total: 0 })
      } finally {
        setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    fetchSpares(1, limit, {})
  }, [])

  useEffect(() => {
    const filters = buildFilters()
    setPaginationMeta((prev) => ({ ...prev, page: 1 }))

    const timeoutId = setTimeout(() => {
      fetchSpares(1, limit, filters)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, makeFilter, categoryFilter, limit, buildFilters, fetchSpares])

  const clearFilters = useCallback(() => {
    setSearchTerm('')
    setMakeFilter('all')
    setCategoryFilter('all')
  }, [])

  const handlePageChange = useCallback(
    (page: number) => {
      const filters = buildFilters()
      fetchSpares(page, limit, filters)
    },
    [buildFilters, fetchSpares, limit]
  )

  const handleLimitChange = useCallback(
    (newLimit: number) => {
      setLimit(newLimit)
      const filters = buildFilters()
      fetchSpares(1, newLimit, filters)
    },
    [buildFilters, fetchSpares]
  )

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <p className="text-red-500 text-lg mb-4">Error: {error}</p>
          <Button onClick={() => fetchSpares(1, limit, buildFilters())}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Spare Parts Inventory
          </h1>
          <p className="text-lg text-gray-600">
            Browse our available vehicle spare parts
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold">Filter Spare Parts</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, make, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Make Filter */}
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

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {filterOptions.categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
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

        {/* Total Count */}
        <div className="mb-6 text-center sm:text-left">
          <p className="text-gray-600">
            Showing {loading ? '...' : paginationMeta.total.toLocaleString()}{' '}
            spare
            {paginationMeta.total === 1 ? '' : 's'}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading spare parts...</p>
          </div>
        )}

        {/* Cards */}
        {!loading && spares.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {spares.map((spare) => (
                <Link key={spare.id} href={`/spares/${spare.slug || spare.id}`}>
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <Image
                        src={spare.images?.[0]?.url ?? '/placeholder-spare.jpg'}
                        alt={spare.name}
                        width={400}
                        height={250}
                        className="w-full h-44 sm:h-52 object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-green-600 capitalize">
                        {spare.condition}
                      </Badge>
                      <Badge className="absolute top-2 left-2 bg-blue-600 capitalize">
                        {spare.category.toLowerCase()}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-bold mb-1 truncate">
                        {spare.name}
                      </h3>
                      <p className="text-sm text-gray-600 capitalize truncate mb-1">
                        {spare.make}
                      </p>
                      <p className="text-yellow-600 font-semibold text-base mb-3">
                        R{spare.price.toLocaleString()}
                        <span className="text-xs text-gray-500">
                          {' '}
                          incl. VAT
                        </span>
                      </p>
                      <Button asChild className="w-full text-sm">
                        <span>View Details</span>
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
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

        {/* No Results */}
        {!loading && spares.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              No spare parts found matching your criteria.
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
