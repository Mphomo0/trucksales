'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { toast } from 'react-toastify'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { upload } from '@imagekit/next'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation'
import UploadMultiple from './UploadMultiple'
import { vehicleSchema } from '@/lib/schemas'
import UploadVideo from '@/components/global/UploadVideo'

type VehicleFormData = z.infer<typeof vehicleSchema>

export default function CreateVehicle() {
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      images: [],
    },
  })

  const getAuthParams = async () => {
    const res = await fetch('/api/images/upload-auth')
    if (!res.ok) throw new Error('Failed to fetch upload auth')
    return res.json()
  }

  const onSubmit = async (data: VehicleFormData) => {
    try {
      if (!selectedFiles || selectedFiles.length === 0) {
        toast.error('Please select at least one image.')
        return
      }

      setIsUploading(true)

      // Create a unique subfolder for this vehicle
      // const vehicleFolder = `inventory/${uuidv4()}`
      const uploadedImages: { url: string; fileId: string }[] = []

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        const { token, signature, publicKey, expire } = await getAuthParams()
        const uniqueFileName = `${uuidv4()}_${file.name}`

        try {
          const res = await upload({
            file,
            fileName: uniqueFileName,
            folder: 'inventory',
            expire,
            token,
            signature,
            publicKey,
          })

          if (!res || !res.url || !res.fileId)
            throw new Error(`Upload failed for ${file.name}`)

          uploadedImages.push({ url: res.url, fileId: res.fileId })
        } catch (err) {
          console.error(err)
          toast.error(`Failed to upload ${file.name}`)
        }
      }

      setIsUploading(false)

      if (uploadedImages.length === 0) {
        toast.error('All uploads failed. Please try again.')
        return
      }

      setValue('images', uploadedImages, { shouldValidate: true })
      const payload = {
        ...data,
        images: uploadedImages,
        fuelType: data.fuelType?.toUpperCase() ?? null,
        condition: data.condition.toUpperCase(),
        transmission: data.transmission?.toUpperCase() ?? null,
      }

      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success('Vehicle created successfully!')
        setSelectedFiles(null)

        router.push('/dashboard/vehicles')
      } else {
        const err = await res.json()
        toast.error(err.error || 'Failed to create vehicle')
      }
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid md:grid-cols-2 gap-4">
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
            <div className="mb-4 space-y-2">
              <Label htmlFor="name">Registration Number</Label>
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
              <Controller
                control={control}
                name="fuelType"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Fuel Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="petrol">Petrol</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.fuelType && (
                <p className="text-red-500">{errors.fuelType.message}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="mb-4 space-y-2">
              <Label>Condition</Label>
              <Controller
                control={control}
                name="condition"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="used">Used</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.condition && (
                <p className="text-red-500">{errors.condition.message}</p>
              )}
            </div>
            <div className="mb-4 space-y-2">
              <Label>Transmission</Label>
              <Controller
                control={control}
                name="transmission"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="automatic">Automatic</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.transmission && (
                <p className="text-red-500">{errors.transmission.message}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="mb-4 space-y-2">
              <Label>Body Type</Label>
              <Controller
                control={control}
                name="bodyType"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bower Truck">Bower Truck</SelectItem>
                      <SelectItem value="Cage">Cage</SelectItem>
                      <SelectItem value="Cattle Body">Cattle Body</SelectItem>
                      <SelectItem value="Chassis Cab">Chassis Cab</SelectItem>
                      <SelectItem value="Cherry Picker Truck">
                        Cherry Picker Truck
                      </SelectItem>
                      <SelectItem value="Crane Truck">Crane Truck</SelectItem>
                      <SelectItem value="Curtain Side Truck">
                        Curtain Side Truck
                      </SelectItem>
                      <SelectItem value="Dropside Truck">
                        Dropside Truck
                      </SelectItem>
                      <SelectItem value="Fire Fighting Unit">
                        Fire Fighting Unit
                      </SelectItem>
                      <SelectItem value="Flatbed">Flatbed</SelectItem>
                      <SelectItem value="Honey Sucker">Honey Sucker</SelectItem>
                      <SelectItem value="Hooklift">Hooklift</SelectItem>
                      <SelectItem value="Insulated Body">
                        Insulated Body
                      </SelectItem>
                      <SelectItem value="Mass Side">Mass Side</SelectItem>
                      <SelectItem value="Other Specialized">
                        Other Specialized
                      </SelectItem>
                      <SelectItem value="Refrigerated Body">
                        Refrigerated Body
                      </SelectItem>
                      <SelectItem value="Roll Back">Roll Back</SelectItem>
                      <SelectItem value="Skip Loader">Skip Loader</SelectItem>
                      <SelectItem value="Tanker">Tanker</SelectItem>
                      <SelectItem value="Tipper Truck">Tipper Truck</SelectItem>
                      <SelectItem value="Truck Tractor">
                        Truck Tractor
                      </SelectItem>
                      <SelectItem value="Volume Body">Volume Body</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.bodyType && (
                <p className="text-red-500">{errors.bodyType.message}</p>
              )}
            </div>
            <div className="mb-4 space-y-2">
              <Label>Truck Size</Label>
              <Controller
                control={control}
                name="truckSize"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 to 2.5 Ton">1 to 2.5 Ton</SelectItem>
                      <SelectItem value="3 to 5 Ton">3 to 5 Ton</SelectItem>
                      <SelectItem value="6 to 7 Ton">6 to 7 Ton</SelectItem>
                      <SelectItem value="8 to 9 Ton">8 to 9 Ton</SelectItem>
                      <SelectItem value="10 to 18 Ton">10 to 18 Ton</SelectItem>
                      <SelectItem value="18 to 35 Ton">18 to 35 Ton</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.truckSize && (
                <p className="text-red-500">{errors.truckSize.message}</p>
              )}
            </div>
          </div>

          {/* Images */}
          <div className="mb-4 space-y-2">
            <label className="space-y-4">Images</label>
            <UploadMultiple
              onFilesSelected={(files) => setSelectedFiles(files)}
            />
          </div>

          <div className="mb-4 space-y-2">
            <Label htmlFor="description">Video Link</Label>
            <Input
              id="videoLink"
              placeholder="e.g https://www.youtube.com/watch?v=T6i6L6vSxBU"
              {...register('videoLink')}
            />
            {errors.videoLink && (
              <p className="text-red-500 text-sm">{errors.videoLink.message}</p>
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
            {isSubmitting || isUploading ? 'Creating...' : 'Create Vehicle'}
          </Button>
        </form>
      </div>
    </div>
  )
}
