/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { contactFormSchema } from '@/lib/schemas'

type ContactFormData = {
  name: string
  email: string
  phone: string
  branch: string
  subject: string
  message: string
  captchaAnswer: string
}

function generateCaptcha() {
  const a = Math.floor(Math.random() * 10) + 1
  const b = Math.floor(Math.random() * 10) + 1
  return { question: `${a} + ${b} = ?`, answer: a + b }
}

/* <h1>A-Z Truck Sales Components</h1> */ export default function ContactForm() {
  const [captcha, setCaptcha] = useState<{ question: string; answer: number }>({ question: '', answer: 0 })

  useEffect(() => {
    setCaptcha(generateCaptcha())
  }, [])
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch('/api/send-mail/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          type: 'Contact', 
          ...data,
          captchaAnswer: parseInt(data.captchaAnswer, 10),
          captchaExpected: captcha.answer 
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send email')
      }

      toast.success('Message sent successfully!')
      reset()
      setCaptcha(generateCaptcha())
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

          {/* CAPTCHA */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Security Check
            </label>
            <p className="text-sm text-gray-600 mb-2">
              Please solve this simple math problem: <span className="font-bold">{captcha.question}</span>
            </p>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Your Answer"
              {...register('captchaAnswer')}
            />
            {errors.captchaAnswer && (
              <p className="text-red-500 text-sm mt-1">
                {errors.captchaAnswer.message}
              </p>
            )}
          </div>

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
