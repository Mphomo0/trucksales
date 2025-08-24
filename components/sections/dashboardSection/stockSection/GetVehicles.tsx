'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
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
  images: Image[]
  description: string
  slug: string
}

interface Image {
  fileId: string
  url: string
}

export default function GetVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [paginationMeta, setPaginationMeta] = useState({
    page: 1,
    limit: 5,
    totalPages: 1,
    total: 0,
  })

  const getAllVehicles = async (page = 1, limit = 5) => {
    try {
      const response = await fetch(`/api/vehicles?page=${page}&limit=${limit}`)
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles')
      }
      const data = await response.json()
      console.log('Fetched vehicles:', data)
      setVehicles(data.vehicles)
      setPaginationMeta(data.meta)
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllVehicles()
  }, [])

  const handleDeleteVehicle = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return

    try {
      // Fetch the vehicle to get the image fileIds
      const res = await fetch(`/api/vehicles/${slug}`)
      if (!res.ok) throw new Error('Failed to fetch vehicle details')

      const response = await res.json()

      // Extract the actual vehicle object from the nested response
      const vehicle = response.vehicle

      if (!vehicle) {
        console.error('Vehicle data not found in response:', response)
        throw new Error('Vehicle data not found in API response')
      }

      // Extract fileIds from the vehicle's image array
      if (!vehicle.images || !Array.isArray(vehicle.images)) {
        console.error('Vehicle images is not an array:', vehicle.images)
        throw new Error('Vehicle images data is invalid or missing')
      }

      const fileIds = vehicle.images
        .map((img: Image) => img.fileId)
        .filter(Boolean)

      // Batch delete from ImageKit (only if there are fileIds)
      if (fileIds.length > 0) {
        const response = await fetch('/api/images/delete-images', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileIds }),
        })

        if (!response.ok) {
          const err = await response.json()
          console.error('ImageKit delete error:', err)
          throw new Error('Failed to delete images from ImageKit')
        }

        console.log('Images deleted successfully from ImageKit')
      } else {
        console.log('No images to delete')
      }

      // 4. Delete the vehicle from your backend
      const vehicleDeleteRes = await fetch(`/api/vehicles/${slug}`, {
        method: 'DELETE',
      })
      if (!vehicleDeleteRes.ok) throw new Error('Failed to delete vehicle')

      toast.success('Vehicle and associated images deleted successfully')
      getAllVehicles() // refresh the list
    } catch (error) {
      console.error('Delete operation failed:', error)
      toast.error('Error deleting vehicle and/or images')
    }
  }
  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p>Loading vehicles...</p>
        </div>
      ) : (
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thumbnail</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Make</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <Image
                      src={vehicle.images[0]?.url}
                      alt={vehicle.name}
                      width={50}
                      height={50}
                      className="rounded-md object-cover h-12 w-12"
                    />
                  </TableCell>
                  <TableCell>{vehicle.name}</TableCell>
                  <TableCell>{vehicle.make}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>{vehicle.year}</TableCell>
                  <TableCell>R{vehicle.vatPrice.toFixed(2)}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <div className="text-red-500">
                      <Trash2
                        size={18}
                        onClick={() => handleDeleteVehicle(vehicle.slug)}
                      />
                    </div>
                    <div className="text-blue-500">
                      <Link
                        href={`/dashboard/vehicles/edit-vehicle/${vehicle.slug}`}
                      >
                        <SquarePen size={18} />
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* mobile view */}
      <div className="md:hidden">
        <div className="grid grid-cols-1">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p>Loading vehicles...</p>{' '}
            </div>
          ) : (
            vehicles.map((vehicle) => (
              <Card key={vehicle.id} className="mb-4 p-4">
                <div className="flex items-center gap-4">
                  <Image
                    src={vehicle.images[0]?.url}
                    alt={vehicle.name}
                    width={100}
                    height={100}
                    className="rounded-md object-cover h-24 w-24"
                  />
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold line-clamp-1">
                      {vehicle.name}
                    </h3>
                    <p>
                      <span>Make: {vehicle.make}</span>
                      <br />
                      <span>Model: {vehicle.model}</span>
                      <br />
                      <span>Year: ({vehicle.year})</span>
                    </p>
                    <p>
                      <span>Price:</span> R{vehicle.vatPrice.toFixed(2)}
                    </p>
                    <div className="flex">
                      <div className="text-red-500">
                        <Trash2
                          size={18}
                          onClick={() => handleDeleteVehicle(vehicle.slug)}
                        />
                      </div>
                      <div className="text-blue-500">
                        <Link
                          href={`/dashboard/vehicles/edit-vehicle/${vehicle.slug}`}
                        >
                          <SquarePen size={18} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
      <div className="mt-12 flex justify-end">
        <Pagination
          currentPage={paginationMeta.page}
          totalPages={paginationMeta.totalPages}
          onPageChange={(page) => getAllVehicles(page, paginationMeta.limit)}
          limit={paginationMeta.limit}
          onLimitChange={(newLimit) => {
            getAllVehicles(1, newLimit)
          }}
          showLimitSelector={true}
        />
      </div>
    </div>
  )
}
