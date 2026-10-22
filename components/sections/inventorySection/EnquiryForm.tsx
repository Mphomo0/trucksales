/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

'use client'

import { useId, useState } from 'react'
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
  const id = useId()
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
        toast.error(
          `${result.message || 'Your enquiry was not sent'}. Please try again or call us on 011 902 6071.`
        )
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error(
        'Your enquiry was not sent. Check your connection and try again, or call us on 011 902 6071.'
      )
    }
  }

  return (
    <div>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label htmlFor={`${id}-name`} className="block text-sm font-medium">Name & Surname</label>
          <input
            id={`${id}-name`}
            type="text"
            autoComplete="name"
            className="w-full border px-3 py-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24603a]"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${id}-name-error` : undefined}
            {...register('name')}
          />
          {errors.name && <p id={`${id}-name-error`} role="alert" className="text-red-600 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor={`${id}-email`} className="block text-sm font-medium">Email</label>
          <input
            id={`${id}-email`}
            type="email"
            autoComplete="email" spellCheck={false}
            className="w-full border px-3 py-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24603a]"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${id}-email-error` : undefined}
            {...register('email')}
          />
          {errors.email && (
            <p id={`${id}-email-error`} role="alert" className="text-red-600 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor={`${id}-phone`} className="block text-sm font-medium">Contact Number</label>
          <input
            id={`${id}-phone`}
            type="tel"
            autoComplete="tel" inputMode="tel"
            className="w-full border px-3 py-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24603a]"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? `${id}-phone-error` : undefined}
            {...register('phone')}
          />
          {errors.phone && (
            <p id={`${id}-phone-error`} role="alert" className="text-red-600 text-sm">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor={`${id}-message`} className="block text-sm font-medium">Message</label>
          <textarea
            id={`${id}-message`}
            autoComplete="off"
            className="w-full border px-3 py-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24603a]"
            rows={4}
            defaultValue={`I would like to check the availability of the https://www.a-ztrucksales.com/inventory/${vehicleSlug}`}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? `${id}-message-error` : undefined}
            {...register('message')}
          />
          {errors.message && (
            <p id={`${id}-message-error`} role="alert" className="text-red-600 text-sm">{errors.message.message}</p>
          )}
        </div>

        <TurnstileWidget
          onToken={setTurnstileToken}
          resetSignal={turnstileReset}
        />

        <button
          type="submit"
          className={`w-full bg-[#24603a] hover:bg-[#1c4d2e] text-white py-2 rounded transition-[opacity,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24603a] focus-visible:ring-offset-2 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending…' : 'Send Enquiry'}
        </button>
      </form>
    </div>
  )
}
