'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from './data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, SquarePen } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { Pagination } from '@/components/global/Pagination'

interface Vehicle {
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
  images: ImageFile[]
  videoLink?: VideoFile | null
  description: string
  registrationNo: string
  slug: string
}

interface ImageFile {
  fileId: string
  url: string
}

interface VideoFile {
  fileId: string
  url: string
}

interface Meta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function GetVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(25)
  const [meta, setMeta] = useState<Meta>({
    total: 0,
    page: 1,
    limit: 25,
    totalPages: 0,
  })

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchInput])

  // Fetch vehicles when page, limit, or debounced search changes
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: limit.toString(),
        })
        if (debouncedSearch && debouncedSearch.trim()) {
          params.append('search', debouncedSearch.trim())
        }
        
        const response = await fetch(`/api/vehicles?${params.toString()}`)
        if (!response.ok) {
          throw new Error('Failed to fetch vehicles')
        }

        const data = await response.json()
        setVehicles(data.vehicles || [])
        if (data.meta) {
          setMeta(data.meta)
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error)
        toast.error('Failed to fetch vehicles')
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [currentPage, limit, debouncedSearch])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit)
    setCurrentPage(1) // Reset to page 1 when limit changes
  }, [])

  const handleDeleteVehicle = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return

    try {
      const res = await fetch(`/api/vehicles/${slug}`)
      if (!res.ok) throw new Error('Failed to fetch vehicle details')

      const response = await res.json()
      const vehicle = response.vehicle

      if (!vehicle) throw new Error('Vehicle data not found')

      const fileIds = [
        ...(vehicle.images?.map((img: ImageFile) => img.fileId) || []),
        ...(vehicle.videoLink?.fileId ? [vehicle.videoLink.fileId] : []),
      ]

      if (fileIds.length > 0) {
        const delRes = await fetch('/api/images/delete-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileIds }),
        })

        if (!delRes.ok) throw new Error('Failed to delete files from ImageKit')
      }

      const vehicleDeleteRes = await fetch(`/api/vehicles/${slug}`, {
        method: 'DELETE',
      })
      if (!vehicleDeleteRes.ok) throw new Error('Failed to delete vehicle')

      toast.success('Vehicle and associated files deleted successfully')
      // Refresh current page by triggering a re-fetch
      setCurrentPage(prev => prev)
    } catch (error) {
      console.error('Delete operation failed:', error)
      toast.error('Error deleting vehicle and/or files')
    }
  }

  const columns: ColumnDef<Vehicle>[] = [
    {
      accessorKey: 'thumbnail',
      header: 'Thumbnail',
      cell: ({ row }) => (
        <Image
          src={row.original.images[0]?.url}
          alt={row.original.name}
          width={50}
          height={50}
          className="rounded-md object-cover h-12 w-12"
        />
      ),
      enableSorting: false,
      enableColumnFilter: false,
    },
    { accessorKey: 'name', header: 'Name' },
    {
      accessorKey: 'registrationNo',
      header: () => <span className="hidden sm:inline">Reg Number</span>,
      cell: ({ row }) => (
        <span className="hidden sm:table-cell">
          {row.original.registrationNo}
        </span>
      ),
    },
    {
      accessorKey: 'make',
      header: () => <span className="hidden md:inline">Make</span>,
      cell: ({ row }) => (
        <span className="hidden md:table-cell">
          {row.original.make.toUpperCase()}
        </span>
      ),
    },
    {
      accessorKey: 'model',
      header: () => <span className="hidden md:inline">Model</span>,
      cell: ({ row }) => (
        <span className="hidden md:table-cell">
          {row.original.model.toUpperCase()}
        </span>
      ),
    },
    {
      accessorKey: 'year',
      header: () => <span className="hidden lg:inline">Year</span>,
      cell: ({ row }) => (
        <span className="hidden lg:table-cell">{row.original.year}</span>
      ),
    },
    {
      accessorKey: 'vatPrice',
      header: 'Price',
      cell: ({ row }) => `R${row.original.vatPrice.toFixed(2)}`,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:h-10 sm:w-10"
            onClick={() => handleDeleteVehicle(row.original.slug)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
          <Link href={`/dashboard/vehicles/edit-vehicle/${row.original.slug}`}>
            <SquarePen className="h-4 w-4 text-blue-500" />
          </Link>
        </div>
      ),
      enableSorting: false,
      enableColumnFilter: false,
    },
  ]

  // Calculate display range
  const startItem = meta.total > 0 ? (currentPage - 1) * limit + 1 : 0
  const endItem = meta.total > 0 ? Math.min(currentPage * limit, meta.total) : 0

  return (
    <div className="space-y-4">
      {/* Top controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <Input
          placeholder="Search vehicles (name, make, model, reg, body type, size)..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full sm:max-w-md"
        />
        <div className="text-sm text-gray-500">
          {loading ? (
            <>Loading...</>
          ) : (
            <>{meta.total > 0 ? `Showing ${startItem} - ${endItem} of ${meta.total} vehicles` : 'No vehicles found'}</>
          )}
        </div>
      </div>

      {/* Table container for responsiveness */}
      <div className="w-full overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p>Loading vehicles...</p>
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={vehicles}
            />
            {meta.totalPages > 0 && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={meta.totalPages}
                  onPageChange={handlePageChange}
                  limit={limit}
                  onLimitChange={handleLimitChange}
                  showLimitSelector={true}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
