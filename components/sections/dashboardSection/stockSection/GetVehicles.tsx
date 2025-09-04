'use client'

import { useState, useEffect } from 'react'
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
  description: string
  registrationNo: string
  slug: string
}

interface ImageFile {
  fileId: string
  url: string
}

export default function GetVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [paginationMeta, setPaginationMeta] = useState({
    page: 1,
    limit: 50,
    totalPages: 1,
    total: 0,
  })
  const [globalFilter, setGlobalFilter] = useState('')

  const getAllVehicles = async (page = 1, limit = 50) => {
    try {
      const response = await fetch(`/api/vehicles?page=${page}&limit=${limit}`)
      if (!response.ok) throw new Error('Failed to fetch vehicles')

      const data = await response.json()
      setVehicles(data.vehicles)
      setPaginationMeta(data.meta)
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllVehicles(paginationMeta.page, paginationMeta.limit)
  }, [paginationMeta.page, paginationMeta.limit])

  const handleDeleteVehicle = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return

    try {
      const res = await fetch(`/api/vehicles/${slug}`)
      if (!res.ok) throw new Error('Failed to fetch vehicle details')

      const response = await res.json()
      const vehicle = response.vehicle

      if (!vehicle) throw new Error('Vehicle data not found')

      const fileIds = vehicle.images
        ?.map((img: ImageFile) => img.fileId)
        .filter(Boolean)

      if (fileIds?.length > 0) {
        const delRes = await fetch('/api/images/delete-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileIds }),
        })

        if (!delRes.ok) throw new Error('Failed to delete images from ImageKit')
      }

      const vehicleDeleteRes = await fetch(`/api/vehicles/${slug}`, {
        method: 'DELETE',
      })
      if (!vehicleDeleteRes.ok) throw new Error('Failed to delete vehicle')

      toast.success('Vehicle and associated images deleted successfully')
      getAllVehicles(paginationMeta.page, paginationMeta.limit)
    } catch (error) {
      console.error('Delete operation failed:', error)
      toast.error('Error deleting vehicle and/or images')
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
    { accessorKey: 'registrationNo', header: 'Reg Number' },
    { accessorKey: 'make', header: 'Make' },
    { accessorKey: 'model', header: 'Model' },
    { accessorKey: 'year', header: 'Year' },
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search vehicles..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <div className="text-sm text-gray-500">
          Showing {vehicles.length} of {paginationMeta.total} vehicles (Limit:{' '}
          {paginationMeta.limit})
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p>Loading vehicles...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={vehicles}
          globalFilter={globalFilter}
        />
      )}

      <div className="mt-4 flex justify-end">
        <Pagination
          currentPage={paginationMeta.page}
          totalPages={paginationMeta.totalPages}
          onPageChange={(page) =>
            setPaginationMeta({ ...paginationMeta, page })
          }
          limit={paginationMeta.limit}
          onLimitChange={(newLimit) =>
            setPaginationMeta({ ...paginationMeta, page: 1, limit: newLimit })
          }
          showLimitSelector={true}
        />
      </div>
    </div>
  )
}
