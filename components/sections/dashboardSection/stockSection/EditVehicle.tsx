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

interface VehicleImage {
  url: string
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
  images: VehicleImage[]
}

export default function EditVehicle() {
  const [loading, setLoading] = useState(true)
  const [uploadingImages] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
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

  const watchedImages = watch('images') || []

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await fetch(`/api/vehicles/${slug}`)
        if (!res.ok) throw new Error('Failed to fetch vehicle')
        const data = await res.json()
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

  useEffect(() => {
    return () => {
      // Clean up preview URLs when component unmounts
      previewImages.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previewImages])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Clean up previous preview URLs
    previewImages.forEach((url) => URL.revokeObjectURL(url))

    // Create new preview URLs for selected files
    const newFiles = Array.from(files)
    setSelectedFiles(newFiles)

    // Generate preview URLs
    const previews = newFiles.map((file) => URL.createObjectURL(file))
    setPreviewImages(previews)
  }

  const removeImage = (index: number) => {
    const currentImages = [...watchedImages]
    currentImages.splice(index, 1)
    setValue('images', currentImages)
  }

  const removePreviewImage = (index: number) => {
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(previewImages[index])

    // Remove from state
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    const newPreviews = previewImages.filter((_, i) => i !== index)

    setSelectedFiles(newFiles)
    setPreviewImages(newPreviews)
  }

  const getAuthParams = async () => {
    const res = await fetch('/api/images/upload-auth')
    if (!res.ok) throw new Error('Failed to fetch upload authentication')
    return res.json()
  }

  const onSubmit = async (formData: Vehicle) => {
    console.log(formData.featured)
    try {
      setIsUploading(true)

      // Upload new images if any selected
      const newUploadedImages: VehicleImage[] = []

      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          try {
            const { token, signature, publicKey, expire } =
              await getAuthParams()
            const uniqueFileName = `${uuidv4()}_${file.name}`

            const res = await upload({
              file,
              fileName: uniqueFileName,
              folder: 'inventory',
              expire,
              token,
              signature,
              publicKey,
            })

            if (!res || !res.url)
              throw new Error(`Upload failed for ${file.name}`)

            newUploadedImages.push({ url: res.url })
          } catch (err) {
            console.error(err)
            toast.error(`Failed to upload ${file.name}`)
          }
        }
      }

      // Combine existing images with newly uploaded ones
      const allImages = [...watchedImages, ...newUploadedImages]

      // Update the formData with all images
      const updatedFormData = {
        ...formData,
        images: allImages,
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

      // Clean up preview URLs
      previewImages.forEach((url) => URL.revokeObjectURL(url))

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
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
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

          <div className="grid md:grid-cols-3 gap-4">
            <div className="mb-4 space-y-2">
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                type="text"
                placeholder="Enter vehicle Make"
                {...register('make')}
              />
              {errors.make && (
                <p className="text-red-500 text-sm">{errors.make.message}</p>
              )}
            </div>
            <div className="mb-4 space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                type="text"
                placeholder="Enter vehicle Model"
                {...register('model')}
              />
              {errors.model && (
                <p className="text-red-500 text-sm">{errors.model.message}</p>
              )}
            </div>
            <div className="mb-4 space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="text"
                placeholder="Enter vehicle Year"
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
                placeholder="Enter vehicle Price with VAT"
                {...register('vatPrice')}
              />
              {errors.vatPrice && (
                <p className="text-red-500 text-sm">
                  {errors.vatPrice.message}
                </p>
              )}
            </div>
            <div className="mb-4 space-y-2">
              <Label htmlFor="pricenoVat">Price no VAT</Label>
              <Input
                id="pricenoVat"
                type="text"
                placeholder="Enter vehicle Price"
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
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                type="text"
                placeholder="Enter vehicle Mileage"
                {...register('mileage')}
              />
              {errors.mileage && (
                <p className="text-red-500 text-sm">{errors.mileage.message}</p>
              )}
            </div>
            <div className="mb-4 space-y-2">
              <Label>Fuel Type</Label>
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

          {/* Images Section */}
          <div className="space-y-4">
            <Label>Vehicle Images</Label>

            {/* Display Current Images */}
            {watchedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {watchedImages.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <div className="aspect-square relative overflow-hidden rounded-lg border">
                      <Image
                        src={img.url || '/placeholder.svg'}
                        alt={`Vehicle image ${idx + 1}`}
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
                      onClick={() => removeImage(idx)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload New Images */}
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
                      disabled={uploadingImages || isUploading}
                    />
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, GIF up to 10MB each
                  </p>
                </div>
              </div>
            </div>

            {/* Preview Selected Images */}
            {previewImages.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  New Images (will be uploaded when you save)
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {previewImages.map((previewUrl, idx) => (
                    <div key={idx} className="relative group">
                      <div className="aspect-square relative overflow-hidden rounded-lg border-2 border-dashed border-primary/50">
                        <Image
                          src={previewUrl || '/placeholder.svg'}
                          alt={`Preview ${idx + 1}`}
                          width={200}
                          height={200}
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-primary/10"></div>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removePreviewImage(idx)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
