/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

'use client'

import { useState, useEffect, useRef } from 'react'
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
import { useRouter, useParams } from 'next/navigation'
import { vehicleSchema } from '@/lib/schemas'
import UploadMultiple from './UploadMultiple'

type VehicleFormData = z.input<typeof vehicleSchema>

type PreviewFile = {
  file: File
  id: string
  preview: string
  isExisting?: boolean
}

export default function EditVehicle() {
  const [isUploading, setIsUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [existingImages, setExistingImages] = useState<
    { url: string; fileId: string }[]
  >([])
  const [currentPreviews, setCurrentPreviews] = useState<PreviewFile[]>([])
  const initialExistingRef = useRef<{ url: string; fileId: string }[]>([])

  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      images: [],
      fuelType: '',
      condition: '',
      transmission: '',
      bodyType: '',
      truckSize: '',
    },
  })

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await fetch(`/api/vehicles/${slug}`)
        if (!res.ok) throw new Error('Failed to fetch vehicle')
        const data = await res.json()
        const vehicle = data.vehicle

        setExistingImages(vehicle.images || [])
        initialExistingRef.current = vehicle.images || []

        reset({
          name: vehicle.name,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          registrationNo: vehicle.registrationNo || '',
          vatPrice: vehicle.vatPrice,
          pricenoVat: vehicle.pricenoVat,
          mileage: vehicle.mileage ?? '',
          fuelType: (vehicle.fuelType || '').toLowerCase(),
          condition: (vehicle.condition || '').toLowerCase(),
          transmission: (vehicle.transmission || '').toLowerCase(),
          bodyType: vehicle.bodyType || '',
          truckSize: vehicle.truckSize || '',
          description: vehicle.description || '',
          videoLink: vehicle.videoLink || '',
          images: vehicle.images || [],
          specialPrice: vehicle.specialPrice ?? '',
          specialValidFrom: vehicle.specialValidFrom
            ? new Date(vehicle.specialValidFrom).toISOString().slice(0, 16)
            : '',
          specialValidTo: vehicle.specialValidTo
            ? new Date(vehicle.specialValidTo).toISOString().slice(0, 16)
            : '',
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

  const getAuthParams = async () => {
    const res = await fetch('/api/images/upload-auth')
    if (!res.ok) throw new Error('Failed to fetch upload auth')
    return res.json()
  }

  const onSubmit = async (data: VehicleFormData) => {
    try {
      const existingPreviews = currentPreviews.filter((p) => p.isExisting)
      const newPreviews = currentPreviews.filter((p) => !p.isExisting)

      if (existingPreviews.length === 0 && newPreviews.length === 0) {
        toast.error('Please select at least one image.')
        return
      }

      setIsUploading(true)

      const newUploadedImages: { url: string; fileId: string }[] = []

      for (let i = 0; i < newPreviews.length; i++) {
        const file = newPreviews[i].file
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

          newUploadedImages.push({ url: res.url, fileId: res.fileId })
        } catch (err) {
          console.error(err)
          toast.error(`Failed to upload ${file.name}`)
        }
      }

      setIsUploading(false)

      const allImages = currentPreviews.map((p) => {
        if (p.isExisting) {
          return { url: p.preview, fileId: p.id }
        }
        const uploaded = newUploadedImages.shift()
        return uploaded || { url: p.preview, fileId: p.id }
      })

      if (allImages.length === 0) {
        toast.error('No images available. Please try again.')
        return
      }

      const deletedFileIds = initialExistingRef.current
        .filter(
          (init) =>
            !currentPreviews.some(
              (p) => p.isExisting && p.id === init.fileId
            )
        )
        .map((img) => img.fileId)

      setValue('images', allImages, { shouldValidate: true })
      const payload = {
        name: data.name,
        make: data.make,
        model: data.model,
        year: data.year,
        registrationNo: data.registrationNo,
        vatPrice: data.vatPrice,
        pricenoVat: data.pricenoVat,
        mileage: data.mileage,
        fuelType: data.fuelType?.toUpperCase() ?? null,
        condition: data.condition.toUpperCase(),
        transmission: data.transmission?.toUpperCase() ?? null,
        bodyType: data.bodyType,
        truckSize: data.truckSize,
        description: data.description,
        videoLink: data.videoLink || null,
        images: allImages,
        slug,
        specialPrice: data.specialPrice ? Number(data.specialPrice) : null,
        specialValidFrom: data.specialValidFrom || null,
        specialValidTo: data.specialValidTo || null,
        deletedFileIds:
          deletedFileIds.length > 0 ? deletedFileIds : undefined,
      }

      const res = await fetch(`/api/vehicles/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success('Vehicle updated successfully!')
        router.push('/dashboard/vehicles')
      } else {
        const err = await res.json()
        toast.error(err.error || 'Failed to update vehicle')
      }
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    } finally {
      setIsUploading(false)
    }
  }

  const bodyTypeSuitableFor: Record<string, string> = {
    'refrigerated body': 'This truck is suitable for businesses that need temperature-controlled transport, including food distribution, frozen goods, meat supply, catering, logistics and retail delivery.',
    'dropside truck': 'This truck is suitable for general freight, construction materials, landscaping supplies, and bulky goods that require easy side loading and unloading.',
    flatbed: 'This truck is suitable for transporting construction materials, steel, piping, timber, machinery, and oversized loads.',
    'tipper truck': 'This truck is suitable for construction, mining, earthmoving, waste removal, and bulk material transport.',
    'crane truck': 'This truck is suitable for construction sites, equipment delivery, and loads requiring self-loading capability.',
    'insulated body': 'This truck is suitable for temperature-sensitive deliveries, including food transport, pharmaceutical logistics, and perishable goods.',
    'curtain side truck': 'This truck is suitable for general freight, palletised goods, and loads requiring side access for efficient loading and unloading.',
    hooklift: 'This truck is suitable for skip bin transport, waste management, and interchangeable container systems.',
    tanker: 'This truck is suitable for liquid transport, including fuel, water, chemicals, and bulk fluids.',
    'volume body': 'This truck is suitable for high-volume, low-weight loads including parcel delivery, furniture moving, and courier services.',
    'truck tractor': 'This truck is suitable for long-haul transport, trailer towing, and heavy freight operations.',
    'chassis cab': 'This truck is suitable for businesses that require a versatile base for custom body fitment, including utility, service, and delivery applications.',
    'skip loader': 'This truck is suitable for waste management, skip bin transport, and construction site cleanup.',
    'roll back': 'This truck is suitable for vehicle recovery, towing, and transport of disabled vehicles.',
    'bower truck': 'This truck is suitable for utility maintenance, electrical work, and elevated access applications.',
    'cherry picker truck': 'This truck is suitable for elevated work, maintenance, and access applications.',
    'cattle body': 'This truck is suitable for livestock transport, including cattle, sheep, and other farm animals.',
    'mass side': 'This truck is suitable for heavy bulk transport, including mining, construction, and aggregate materials.',
    'fire fighting unit': 'This truck is suitable for emergency response, firefighting, and rescue operations.',
    'honey sucker': 'This truck is suitable for waste removal, septic tank cleaning, and industrial liquid waste management.',
    cage: 'This truck is suitable for secure transport of goods, tools, and equipment requiring enclosed storage.',
    'other specialized': 'This truck is purpose-built for specialized commercial applications.',
  }

  const defaultSuitableFor =
    'This truck is suitable for businesses that require reliable commercial transport for their daily operations.'

  const baseWorkshopText =
    'The vehicle has been checked by our workshop, with lube service, quality check and testing completed. A-Z Truck Sales can also assist with paperwork for export buyers across Africa.'

  const generateDescription = () => {
    const values = watch()
    const bodyType = values.bodyType?.toLowerCase().trim() ?? ''
    const suitableFor = bodyTypeSuitableFor[bodyType] || defaultSuitableFor

    const generated = `${suitableFor} Contact our team to confirm current availability, viewing location, COF status and final pricing.\n\n${baseWorkshopText}`
    setValue('description', generated)
    toast.success('Description generated')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <span className="text-muted-foreground">Loading vehicle data...</span>
      </div>
    )
  }

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="w-full mx-4 p-6 bg-white shadow-xl rounded-lg">
        <form onSubmit={(e) => { handleSubmit(onSubmit)(e) }}>
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

          <div className="border-t pt-4 mt-4 mb-4">
            <h3 className="text-lg font-semibold mb-4 text-red-600">
              Special Offer (Optional)
            </h3>
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
                  <Select
                    onValueChange={field.onChange}
                    value={field.value as string}
                  >
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
                  <Select
                    onValueChange={field.onChange}
                    value={field.value as string}
                  >
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
                  <Select
                    onValueChange={field.onChange}
                    value={field.value as string}
                  >
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
                  <Select
                    onValueChange={field.onChange}
                    value={field.value as string}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Body Type" />
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
                  <Select
                    onValueChange={field.onChange}
                    value={field.value as string}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Truck Size" />
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

          <div className="mb-4 space-y-2">
            <Label>Images</Label>
            <UploadMultiple
              existingImages={existingImages}
              onFilesSelected={(_files, previews) =>
                setCurrentPreviews(previews)
              }
            />
          </div>

          <div className="mb-4 space-y-2">
            <Label htmlFor="videoLink">Video Link</Label>
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
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateDescription}
              className="mb-2"
            >
              Generate Description
            </Button>
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