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

interface SparesItem {
  id: string
  name: string
  make: string
  price: number
  condition: string
  category: string
  images: ImageFile[]
  description: string
  slug: string
}

interface ImageFile {
  fileId: string
  url: string
}

export default function GetVehicles() {
  const [spareItem, setSpareItem] = useState<SparesItem[]>([])
  const [loading, setLoading] = useState(true)
  const [globalFilter, setGlobalFilter] = useState('')

  const getAllSpares = async () => {
    try {
      const response = await fetch('/api/spares') // No pagination params
      if (!response.ok) throw new Error('Failed to fetch spares')

      const data = await response.json()
      console.log('Fetched Spares:', data)
      setSpareItem(data.spares)
    } catch (error) {
      console.error('Error fetching Spares:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllSpares()
  }, [])

  const handleDeleteSpares = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this spares Item?')) return

    try {
      const res = await fetch(`/api/spares/${slug}`, { method: 'GET' })
      if (!res.ok) throw new Error('Failed to fetch spares details')

      const response = await res.json()
      const spareItem = response.sparesItem

      if (!spareItem) throw new Error('Spares data not found')

      const fileIds = spareItem.images
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

      const sparesRes = await fetch(`/api/spares/${slug}`, {
        method: 'DELETE',
      })
      if (!sparesRes.ok) throw new Error('Failed to delete spares item')

      toast.success('Spares Item and associated images deleted successfully')
      getAllSpares()
    } catch (error) {
      console.error('Delete operation failed:', error)
      toast.error('Error deleting spares and/or images')
    }
  }

  const columns: ColumnDef<SparesItem>[] = [
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
    { accessorKey: 'make', header: 'Make' },
    { accessorKey: 'price', header: 'Price' },
    { accessorKey: 'category', header: 'Category' },
    { accessorKey: 'condition', header: 'Condition' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteSpares(row.original.slug)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
          <Link href={`/dashboard/spares/edit-spares/${row.original.slug}`}>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <Input
          placeholder="Search Spares..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <div className="text-sm text-gray-500">
          Showing {spareItem.length} spares
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p>Loading spares...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={spareItem}
          globalFilter={globalFilter}
        />
      )}
    </div>
  )
}
