'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

interface Vehicle {
  id: string
  name: string
  registrationNo: string
}

const specialFormSchema = z.object({
  inventoryId: z
    .string()
    .min(1, { message: 'Inventory Name must not be empty' }),
  amount: z.coerce
    .number<number>()
    .min(1, { message: 'Please enter your special amount' }),
  validFrom: z.string({ message: 'Please choose a start date' }),
  validTo: z.string({ message: 'Please choose an end date' }),
})

type SpecialFormData = z.infer<typeof specialFormSchema>

export default function CreateSpecial() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])

  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SpecialFormData>({
    resolver: zodResolver(specialFormSchema),
    defaultValues: {
      inventoryId: '',
    },
  })

  useEffect(() => {
    const fetchInventories = async () => {
      const res = await fetch('/api/vehicles/unfiltered')
      const data = await res.json()
      setVehicles(data)
    }
    fetchInventories()
  }, [])

  // Get today's date
  const today = new Date()
  const todayString = today.toISOString().split('T')[0]

  const onSubmit = async (data: SpecialFormData) => {
    // Find the vehicle by registration number

    console.log('data', vehicles)
    const matchedVehicle = vehicles.find(
      (v) =>
        v.registrationNo.toLowerCase() === data.inventoryId.trim().toLowerCase()
    )

    if (!matchedVehicle) {
      toast.error('Vehicle with that registration number does not exist.')
      return
    }

    // Replace inventoryId with the vehicle's actual ID
    const payload = {
      ...data,
      inventoryId: matchedVehicle.id,
    }

    try {
      const res = await fetch('/api/specials', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      })

      if (res.ok) {
        toast.success('Special created successfully!')
        router.push('/dashboard/specials')
      } else if (res.status === 409) {
        toast.error(
          'A special already exists for this vehicle during the selected date range.'
        )
      } else {
        const err = await res.json()
        toast.error(
          err.message || 'An error occurred while creating the special'
        )
      }
    } catch (error) {
      toast.error('Unexpected error occurred.')
    }
  }

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Vehicle Name */}
          <div className="space-y-2">
            <Label htmlFor="inventoryId">Vehicle Registration Number</Label>
            {/* <Controller
              control={control}
              name="inventoryId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select registration Number" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.registrationNo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            /> */}
            <Input
              id="inventoryId"
              placeholder="Enter vehicle registration number"
              {...register('inventoryId')}
            />
            {errors.inventoryId && (
              <p className="text-sm text-red-500">
                {errors.inventoryId.message}
              </p>
            )}
          </div>

          {/* Special Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Special Amount</Label>
            <Input
              id="amount"
              placeholder="Enter special amount e.g 1000000"
              {...register('amount')}
            />
            {errors.amount && (
              <p className="text-red-500 text-sm">{errors.amount.message}</p>
            )}
          </div>

          {/* Valid From */}
          <div className="space-y-2">
            <Label htmlFor="validFrom">Valid From</Label>
            <Input
              id="validFrom"
              type="date"
              {...register('validFrom')}
              min={todayString} // Min date is today
            />
            {errors.validFrom && (
              <p className="text-red-500 text-sm">{errors.validFrom.message}</p>
            )}
          </div>

          {/* Valid To */}
          <div className="space-y-2">
            <Label htmlFor="validTo">Valid To</Label>
            <Input
              id="validTo"
              type="date"
              {...register('validTo')}
              min={todayString} // Min date is today
            />
            {errors.validTo && (
              <p className="text-red-500 text-sm">{errors.validTo.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Creating...' : 'Create Special'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
