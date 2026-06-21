/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

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

type VehicleFormData = z.input<typeof vehicleSchema>

/* <h1>A-Z Truck Sales Components</h1> */ export default function CreateVehicle() {
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    setValue,
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

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="w-full mx-4 p-6 bg-white shadow-xl rounded-lg">
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
                      <SelectItem value="bower truck">Bower Truck</SelectItem>
                      <SelectItem value="cage">Cage</SelectItem>
                      <SelectItem value="cattle body">Cattle Body</SelectItem>
                      <SelectItem value="chassis cab">Chassis Cab</SelectItem>
                      <SelectItem value="cherry picker truck">
                        Cherry Picker Truck
                      </SelectItem>
                      <SelectItem value="crane truck">Crane Truck</SelectItem>
                      <SelectItem value="curtain side truck">
                        Curtain Side Truck
                      </SelectItem>
                      <SelectItem value="dropside truck">
                        Dropside Truck
                      </SelectItem>
                      <SelectItem value="fire fighting unit">
                        Fire Fighting Unit
                      </SelectItem>
                      <SelectItem value="flatbed">Flatbed</SelectItem>
                      <SelectItem value="honey sucker">Honey Sucker</SelectItem>
                      <SelectItem value="hooklift">Hooklift</SelectItem>
                      <SelectItem value="insulated body">
                        Insulated Body
                      </SelectItem>
                      <SelectItem value="mass side">Mass Side</SelectItem>
                      <SelectItem value="other specialized">
                        Other Specialized
                      </SelectItem>
                      <SelectItem value="refrigerated body">
                        Refrigerated Body
                      </SelectItem>
                      <SelectItem value="roll back">Roll Back</SelectItem>
                      <SelectItem value="skip loader">Skip Loader</SelectItem>
                      <SelectItem value="tanker">Tanker</SelectItem>
                      <SelectItem value="tipper truck">Tipper Truck</SelectItem>
                      <SelectItem value="truck tractor">
                        Truck Tractor
                      </SelectItem>
                      <SelectItem value="volume body">Volume Body</SelectItem>
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
                      <SelectItem value="1 to 2.5 ton">1 to 2.5 Ton</SelectItem>
                      <SelectItem value="3 to 5 ton">3 to 5 Ton</SelectItem>
                      <SelectItem value="6 to 7 ton">6 to 7 Ton</SelectItem>
                      <SelectItem value="8 to 9 ton">8 to 9 Ton</SelectItem>
                      <SelectItem value="10 to 18 ton">10 to 18 Ton</SelectItem>
                      <SelectItem value="18 to 35 ton">18 to 35 Ton</SelectItem>
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
            {isSubmitting || isUploading ? 'Creating...' : 'Create Vehicle'}
          </Button>
        </form>
      </div>
    </div>
  )
}
