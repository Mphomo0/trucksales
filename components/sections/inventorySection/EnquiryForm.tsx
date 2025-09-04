'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'react-toastify'
import { enquiryFormSchema } from '@/lib/schemas'

type EnquiryFormData = z.infer<typeof enquiryFormSchema>

interface EnquiryFormProps {
  vehicleSlug: string
}

export default function EnquiryForm({ vehicleSlug }: EnquiryFormProps) {
  const [currentUrl, setCurrentUrl] = useState<string>('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
    }
  }, [])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquiryFormSchema),
  })

  const onSubmit = async (data: EnquiryFormData) => {
    try {
      const response = await fetch('/api/send-mail/enquiry-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'Enquiry',
          vehicleSlug,
          currentUrl,
          ...data,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Message sent successfully!')
        reset()
      } else {
        toast.error(`Error: ${result.message || 'Something went wrong'}`)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Failed to send message. Please try again later.')
    }
  }

  return (
    <div>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className="block text-sm font-medium">Name & Surname</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            aria-invalid={!!errors.name}
            {...register('name')}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Contact Number</label>
          <input
            type="tel"
            className="w-full border px-3 py-2 rounded"
            aria-invalid={!!errors.phone}
            {...register('phone')}
          />
          {errors.phone && (
            <p className="text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Message</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            rows={4}
            defaultValue={`I would like to check the availability of the http://localhost:3000/inventory/${vehicleSlug}`}
            aria-invalid={!!errors.message}
            {...register('message')}
          />
          {errors.message && (
            <p className="text-red-500">{errors.message.message}</p>
          )}
        </div>

        <button
          type="submit"
          className={`w-full bg-[#24603a] text-white py-2 rounded transition-opacity ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Send Enquiry'}
        </button>
      </form>
    </div>
  )
}
