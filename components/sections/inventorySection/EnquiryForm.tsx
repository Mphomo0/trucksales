/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { enquiryFormSchema } from '@/lib/schemas'
import { z } from 'zod/v4'
import TurnstileWidget from '@/components/shared/TurnstileWidget'

type EnquiryFormData = z.input<typeof enquiryFormSchema>

interface EnquiryFormProps {
  vehicleSlug: string
}

/* <h1>A-Z Truck Sales Components</h1> */ export default function EnquiryForm({ vehicleSlug }: EnquiryFormProps) {
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileReset, setTurnstileReset] = useState(0)

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
          currentUrl: window.location.href,
          ...data,
          turnstileToken,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Message sent successfully!')
        reset()
        setTurnstileReset((n) => n + 1)
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
            defaultValue={`I would like to check the availability of the https://www.a-ztrucksales.com/inventory/${vehicleSlug}`}
            aria-invalid={!!errors.message}
            {...register('message')}
          />
          {errors.message && (
            <p className="text-red-500">{errors.message.message}</p>
          )}
        </div>

        <TurnstileWidget
          onToken={setTurnstileToken}
          resetSignal={turnstileReset}
        />

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
