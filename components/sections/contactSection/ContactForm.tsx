/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { contactFormSchema, HEARD_ABOUT_US_OPTIONS } from '@/lib/schemas'
import { z } from 'zod/v4'
import TurnstileWidget from '@/components/shared/TurnstileWidget'
import { getAttributionPayload } from '@/lib/attribution-client'
import { trackLeadCreated } from '@/lib/analytics-events'

type ContactFormData = z.input<typeof contactFormSchema>

/* <h1>A-Z Truck Sales Components</h1> */ export default function ContactForm() {
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileReset, setTurnstileReset] = useState(0)
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur',
  })

  const heardAboutUs = useWatch({ control, name: 'heardAboutUs' })

  const onSubmit = async (data: ContactFormData) => {
    try {
      const attribution = getAttributionPayload()

      const response = await fetch('/api/send-mail/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'Contact',
          ...data,
          attribution,
          turnstileToken,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send email')
      }

      trackLeadCreated({
        source: 'contact_form',
        name: data.name,
        email: data.email,
        phone: data.phone,
        branch: data.branch,
        subject: data.subject,
        heardAboutUs:
          data.heardAboutUs === 'Other'
            ? data.heardAboutUsOther || null
            : data.heardAboutUs || null,
        attribution,
      })

      toast.success('Message sent successfully!')
      reset()
      setTurnstileReset((n) => n + 1)
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to send message. Please try again later.'
      )
    }
  }

  return (
    <div className="py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-6 bg-transparent md:bg-white md:shadow-lg rmd:ounded-lg p-12">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-8">
          Contact Form
        </h2>

        <form className="px-4 md:px-8" onSubmit={handleSubmit(onSubmit)}>
          {/* Name and Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="w-full">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Name *
              </label>
              <input
                id="name"
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Your Name"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email *
              </label>
              <input
                id="email"
                type="email"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Your Email"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Subject and Phone Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="w-full">
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Subject *
              </label>
              <input
                id="subject"
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Subject"
                {...register('subject')}
              />
              {errors.subject && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Your Phone Number"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Branch Selection */}
          <div className="w-full mb-4">
            <label
              htmlFor="branch"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Branch
            </label>
            <select
              id="branch"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              {...register('branch')}
            >
              <option value="">Select Branch</option>
              <option value="Alberton">Alberton</option>
              <option value="Boksburg">Boksburg</option>
            </select>
            {errors.branch && (
              <p className="text-red-500 text-sm mt-1">
                {errors.branch.message}
              </p>
            )}
          </div>

          {/* Message */}
          <div className="mb-6">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Message *
            </label>
            <textarea
              id="message"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              rows={6}
              placeholder="Your Message"
              {...register('message')}
            ></textarea>
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Self-reported attribution — optional, and the only way we ever see
              word of mouth, driving past the yard, or print. */}
          <div className="w-full mb-6">
            <label
              htmlFor="heardAboutUs"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              How did you hear about us?
            </label>
            <select
              id="heardAboutUs"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              {...register('heardAboutUs')}
            >
              <option value="">Prefer not to say</option>
              {HEARD_ABOUT_US_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            {heardAboutUs === 'Other' && (
              <input
                type="text"
                className="w-full mt-3 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Where did you hear about us?"
                aria-label="Tell us where you heard about us"
                {...register('heardAboutUsOther')}
              />
            )}
          </div>

          {/* CAPTCHA */}
          <TurnstileWidget
            onToken={setTurnstileToken}
            resetSignal={turnstileReset}
          />

          {/* Submit Button */}
          <div className="mt-6">
            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
