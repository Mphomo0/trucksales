/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { v4 as uuidv4 } from 'uuid'
import { upload } from '@imagekit/next'
import { Trash2, Upload } from 'lucide-react'
import { ReactSortable } from 'react-sortablejs'

type SortableImage = {
  id: string
  url: string
  file?: File // present if it's a new image
  fileId?: string // present if it’s already uploaded
  isNew: boolean
}

interface VehicleImage {
  url: string
  fileId: string
}

interface Vehicle {
  id: string
  name: string
  make: string
  model: string
  year: number
  vatPrice: number
  pricenoVat: number
  mileage: number
  fuelType: string
  condition: string
  transmission: string
  description?: string
  bodyType: string
  truckSize: string
  featured: string
  slug: string
  registrationNo: string
  images: VehicleImage[]
  videoLink: string | null
  specialPrice: number | null
  specialValidFrom: Date | null
  specialValidTo: Date | null
}

/* <h1>A-Z Truck Sales Components</h1> */ export default function EditVehicle() {
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [sortableImages, setSortableImages] = useState<SortableImage[]>([])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Vehicle>({
    defaultValues: {
      images: [],
    },
  })

  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  // Fetch vehicle data
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await fetch(`/api/vehicles/${slug}`)
        if (!res.ok) throw new Error('Failed to fetch vehicle')
        const data = await res.json()

        const existingImages: SortableImage[] = (data.vehicle.images || []).map(
          (img: VehicleImage) => ({
            id: img.fileId,
            url: img.url,
            fileId: img.fileId,
            isNew: false,
          })
        )

        setSortableImages(existingImages)
        const vehicle = data.vehicle
        reset({
          ...vehicle,
          specialValidFrom: vehicle.specialValidFrom 
            ? new Date(vehicle.specialValidFrom).toISOString().slice(0, 16) 
            : null,
          specialValidTo: vehicle.specialValidTo 
            ? new Date(vehicle.specialValidTo).toISOString().slice(0, 16) 
            : null,
        })
      } catch (error) {
        console.error('Error fetching vehicle:', error)
        toast.error('Failed to load vehicle data')
      } finally {
        setLoading(false)
      }
    }
    fetchVehicle()
  }, [slug, reset])

  // Handle image upload (local preview)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newImages: SortableImage[] = Array.from(files).map((file) => ({
      id: uuidv4(),
      url: URL.createObjectURL(file),
      file,
      isNew: true,
    }))

    const updated = [...sortableImages, ...newImages]
    setSortableImages(updated)
    setValue(
      'images',
      updated.map((img) => ({
        url: img.url,
        fileId: img.fileId ?? '',
      })),
      { shouldValidate: true }
    )
  }

  // Fetch auth params for ImageKit upload
  const getAuthParams = async () => {
    const res = await fetch('/api/images/upload-auth')
    if (!res.ok) throw new Error('Failed to fetch upload authentication')
    return res.json()
  }

  // Submit form
  const onSubmit = async (formData: Vehicle) => {
    try {
      setIsUploading(true)

      const uploadedImages: VehicleImage[] = []

      for (const item of sortableImages) {
        if (item.isNew && item.file) {
          try {
            const { token, signature, publicKey, expire } =
              await getAuthParams()
            const uniqueFileName = `${uuidv4()}_${item.file.name}`

            const res = await upload({
              file: item.file,
              fileName: uniqueFileName,
              folder: 'inventory',
              expire,
              token,
              signature,
              publicKey,
            })

            if (!res || !res.url || !res.fileId)
              throw new Error(`Upload failed for ${item.file.name}`)

            uploadedImages.push({ url: res.url, fileId: res.fileId })

            // cleanup local preview
            URL.revokeObjectURL(item.url)
          } catch (err) {
            console.error(err)
            toast.error(`Failed to upload ${item.file.name}`)
          }
        } else if (!item.isNew && item.fileId) {
          uploadedImages.push({ url: item.url, fileId: item.fileId })
        }
      }

      const updatedFormData = {
        ...formData,
        images: uploadedImages,
        year: Number(formData.year),
        vatPrice: Number(formData?.vatPrice),
        pricenoVat: Number(formData?.pricenoVat),
        fuelType: formData.fuelType?.toUpperCase() ?? null,
        condition: formData.condition?.toUpperCase(),
        transmission: formData.transmission?.toUpperCase() ?? null,
        specialPrice: formData.specialPrice ? Number(formData.specialPrice) : null,
        specialValidFrom: formData.specialValidFrom ? new Date(formData.specialValidFrom) : null,
        specialValidTo: formData.specialValidTo ? new Date(formData.specialValidTo) : null,
      }

      const res = await fetch(`/api/vehicles/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFormData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData?.error || 'Failed to update vehicle')
      }

      toast.success('Vehicle updated successfully')
      router.push('/dashboard/vehicles')
    } catch (error) {
      console.error('PATCH request error:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to update vehicle'
      )
    } finally {
      setIsUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <span className="text-muted-foreground">Loading vehicle data...</span>
      </div>
    )
  }

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 px-12 py-12">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* --- Basic Info --- */}
          <div className="mb-4 space-y-2">
            <Label htmlFor="name">Vehicle Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter vehicle name"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="mb-4 space-y-2">
              <Label htmlFor="registrationNo">Registration Number</Label>
              <Input
                id="registrationNo"
                type="text"
                placeholder="Enter Registration Number"
                {...register('registrationNo')}
              />
              {errors.registrationNo && (
                <p className="text-red-500 text-sm">
                  {errors.registrationNo.message}
                </p>
              )}
            </div>
            <div className="mb-4 space-y-2">
              <Label htmlFor="make">Vehicle Make</Label>
              <Input
                id="make"
                type="text"
                placeholder="Enter Vehicle Make"
                {...register('make')}
              />
              {errors.make && (
                <p className="text-red-500 text-sm">{errors.make.message}</p>
              )}
            </div>
          </div>

<div className="grid md:grid-cols-2 gap-4">
            <div className="mb-4 space-y-2">
              <Label htmlFor="description">Video Link</Label>
              <Input
                id="videoLink"
                placeholder="e.g https://www.youtube.com/watch?v=T6i6L6vSxBU"
                {...register('videoLink')}
              />
            </div>
          </div>

          <div className="border-t pt-4 mt-4 mb-4">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Special Offer (Optional)</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="mb-4 space-y-2">
                <Label htmlFor="specialPrice">Special Price (VAT Incl)</Label>
                <Input
                  id="specialPrice"
                  type="text"
                  placeholder="Special price"
                  {...register('specialPrice')}
                />
              </div>
              <div className="mb-4 space-y-2">
                <Label htmlFor="specialValidFrom">Special Valid From</Label>
                <Input
                  id="specialValidFrom"
                  type="datetime-local"
                  {...register('specialValidFrom')}
                />
              </div>
              <div className="mb-4 space-y-2">
                <Label htmlFor="specialValidTo">Special Valid To</Label>
                <Input
                  id="specialValidTo"
                  type="datetime-local"
                  {...register('specialValidTo')}
                />
              </div>
            </div>
          </div>

          <div className="mb-4 space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter vehicle description"
              {...register('description')}
              className="h-56 resize"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting || isUploading ? 'Editing...' : 'Edit Vehicle'}
          </Button>
        </form>
      </div>
    </div>
  )
}
