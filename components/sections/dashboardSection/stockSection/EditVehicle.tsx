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
}

export default function EditVehicle() {
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
        reset(data.vehicle)
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
        fuelType: formData.fuelType?.toUpperCase() ?? null,
        condition: formData.condition?.toUpperCase(),
        transmission: formData.transmission?.toUpperCase() ?? null,
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
              <Label htmlFor="model">Vehicle Model</Label>
              <Input
                id="model"
                type="text"
                placeholder="Enter Vehicle Model"
                {...register('model')}
              />
              {errors.registrationNo && (
                <p className="text-red-500 text-sm">
                  {errors.registrationNo.message}
                </p>
              )}
            </div>
            <div className="mb-4 space-y-2">
              <Label htmlFor="year">Year Manufactured</Label>
              <Input
                id="year"
                type="text"
                placeholder="Year Manufactured"
                {...register('year')}
              />
              {errors.year && (
                <p className="text-red-500 text-sm">{errors.year.message}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="mb-4 space-y-2">
              <Label htmlFor="vatPrice">Price VAT Included</Label>
              <Input
                id="vatPrice"
                type="text"
                placeholder="Price VAT Included"
                {...register('vatPrice')}
              />
              {errors.vatPrice && (
                <p className="text-red-500 text-sm">
                  {errors.vatPrice.message}
                </p>
              )}
            </div>
            <div className="mb-4 space-y-2">
              <Label htmlFor="pricenoVat">Price No VAT Included</Label>
              <Input
                id="pricenoVat"
                type="text"
                placeholder="Price No VAT Included"
                {...register('pricenoVat')}
              />
              {errors.pricenoVat && (
                <p className="text-red-500 text-sm">
                  {errors.pricenoVat.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="mb-4 space-y-2">
              <Label htmlFor="vatPrice">Mileage</Label>
              <Input
                id="mileage"
                type="text"
                placeholder="Vehicle Mileage"
                {...register('mileage')}
              />
              {errors.mileage && (
                <p className="text-red-500 text-sm">{errors.mileage.message}</p>
              )}
            </div>
            <div className="mb-4 space-y-2">
              <Label htmlFor="fuelType">Fuel Type</Label>
              <select
                id="fuelType"
                {...register('fuelType')}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Fuel Type</option>
                <option value="DIESEL">Diesel</option>
                <option value="PETROL">Petrol</option>
              </select>
              {errors.fuelType && (
                <p className="text-red-500 text-sm">
                  {errors.fuelType.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="mb-4 space-y-2">
              <Label>Condition</Label>
              <select
                id="condition"
                {...register('condition')}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Condition</option>
                <option value="USED">Used</option>
                <option value="NEW">New</option>
              </select>
              {errors.condition && (
                <p className="text-red-500 text-sm">
                  {errors.condition.message}
                </p>
              )}
            </div>
            <div className="mb-4 space-y-2">
              <Label>Transmission</Label>
              <select
                id="transmission"
                {...register('transmission')}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Transmission</option>
                <option value="MANUAL">Manual</option>
                <option value="AUTOMATIC">Automatic</option>
              </select>
              {errors.transmission && (
                <p className="text-red-500 text-sm">
                  {errors.transmission.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="mb-4 space-y-2">
              <Label>Body Type</Label>
              <select
                id="bodyType"
                {...register('bodyType')}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Body Type</option>
                <option value="Bower Truck">Bower Truck</option>
                <option value="Cage">Cage</option>
                <option value="Cattle Body">Cattle Body</option>
                <option value="Chassis Cab">Chassis Cab</option>
                <option value="Cherry Picker Truck">Cherry Picker Truck</option>
                <option value="Crane Truck">Crane Truck</option>
                <option value="Curtain Side Truck">Curtain Side Truck</option>
                <option value="Dropside Truck">Dropside Truck</option>
                <option value="Fire Fighting Unit">Fire Fighting Unit</option>
                <option value="Flatbed">Flatbed</option>
                <option value="Honey Sucker">Honey Sucker</option>
                <option value="Hooklift">Hooklift</option>
                <option value="Insulated Body">Insulated Body</option>
                <option value="Mass Side">Mass Side</option>
                <option value="Other Specialized">Other Specialized</option>
                <option value="Refrigerated Body">Refrigerated Body</option>
                <option value="Roll Back">Roll Back</option>
                <option value="Skip Loader">Skip Loader</option>
                <option value="Tanker">Tanker</option>
                <option value="Tipper Truck">Tipper Truck</option>
                <option value="Truck Tractor">Truck Tractor</option>
                <option value="Volume Body">Volume Body</option>
              </select>
              {errors.bodyType && (
                <p className="text-red-500 text-sm">
                  {errors.bodyType.message}
                </p>
              )}
            </div>
            <div className="mb-4 space-y-2">
              <Label>Truck Size</Label>
              <select
                id="truckSize"
                {...register('truckSize')}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Truck Size</option>
                <option value="1 to 2.5 Ton">1 to 2.5 Ton</option>
                <option value="3 to 5 Ton">3 to 5 Ton</option>
                <option value="6 to 7 Ton">6 to 7 Ton</option>
                <option value="8 to 9 Ton">8 to 9 Ton</option>{' '}
                <option value="10 to 18 Ton">10 to 18 Ton</option>
                <option value="18 to 35 Ton">18 to 35 Ton</option>
              </select>
              {errors.truckSize && (
                <p className="text-red-500 text-sm">
                  {errors.truckSize.message}
                </p>
              )}
            </div>
          </div>

          {/* --- Images Section --- */}
          <div className="space-y-4 mt-6">
            <Label>Vehicle Images</Label>

            <ReactSortable
              tag="div"
              list={sortableImages}
              setList={(newOrder) => {
                setSortableImages(newOrder)
                setValue(
                  'images',
                  newOrder.map((img) => ({
                    url: img.url,
                    fileId: img.fileId ?? '',
                  })),
                  { shouldValidate: true }
                )
              }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {sortableImages.map((item, idx) => (
                <div key={item.id} className="relative group">
                  <div className="aspect-square relative overflow-hidden rounded-lg border">
                    <Image
                      src={item.url}
                      alt={`Image ${idx + 1}`}
                      width={200}
                      height={200}
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      if (item.isNew) URL.revokeObjectURL(item.url)
                      const newList = sortableImages.filter(
                        (i) => i.id !== item.id
                      )
                      setSortableImages(newList)
                      setValue(
                        'images',
                        newList.map((img) => ({
                          url: img.url,
                          fileId: img.fileId ?? '',
                        })),
                        { shouldValidate: true }
                      )
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </ReactSortable>

            {/* Upload Button */}
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <div className="mt-4">
                  <Label htmlFor="imageUpload" className="cursor-pointer">
                    <span className="text-sm font-medium text-primary hover:text-primary/80">
                      Click to upload images
                    </span>
                    <Input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, GIF up to 10MB each
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* --- Video Link --- */}
          <div className="mb-4 space-y-2 mt-4">
            <Label htmlFor="videoLink">Video Link</Label>
            <Input
              id="videoLink"
              placeholder="Enter video link"
              {...register('videoLink')}
            />
            {errors.videoLink && (
              <p className="text-red-500 text-sm">{errors.videoLink.message}</p>
            )}
          </div>

          {/* --- Description --- */}
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
