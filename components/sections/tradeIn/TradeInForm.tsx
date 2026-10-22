/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'react-toastify'
import { tradeInFormSchema } from '@/lib/schemas'
import { X, Upload, Image as ImageIcon } from 'lucide-react'
import { z } from 'zod/v4'
import TurnstileWidget from '@/components/shared/TurnstileWidget'

type TradeInFormData = z.input<typeof tradeInFormSchema>

interface ImagePreview {
  file: File
  url: string
  id: string
}

/* <h1>A-Z Truck Sales Components</h1> */ export default function TradeInForm() {
  const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([])
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileReset, setTurnstileReset] = useState(0)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TradeInFormData>({
    resolver: zodResolver(tradeInFormSchema),
    defaultValues: {
      comments: '',
    },
  })

  const [isDragging, setIsDragging] = useState(false)

  const addImages = (files: FileList | null) => {
    if (!files) return
    const newImages: ImagePreview[] = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({
        file,
        url: URL.createObjectURL(file),
        id: crypto.randomUUID(),
      }))
    setSelectedImages((prev) => [...prev, ...newImages])
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    addImages(e.target.files)
    // Reset the input so the same file can be selected again if needed
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    addImages(e.dataTransfer.files)
  }

  const removeImage = (id: string) => {
    setSelectedImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id)
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url) // Clean up memory
      }
      return prev.filter((img) => img.id !== id)
    })
  }

  const clearAllImages = () => {
    selectedImages.forEach((img) => URL.revokeObjectURL(img.url))
    setSelectedImages([])
  }

  const onSubmit = async (data: TradeInFormData) => {
    if (selectedImages.length === 0) {
      toast.error('Add at least one photo of your truck so we can value it.')
      return
    }
    const formData = new FormData()

    // Append all form fields except images
    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value as string)
    }
    formData.append('turnstileToken', turnstileToken ?? '')

    // Append images
    selectedImages.forEach((imagePreview) => {
      formData.append('tradeImages', imagePreview.file)
    })

    try {
      const response = await fetch('/api/send-mail/trade-in', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Message sent successfully!')
        reset()
        clearAllImages()
        setTurnstileReset((n) => n + 1)
      } else {
        toast.error(
          `${result.message || 'Your request was not sent'}. Please try again or call us on 011 902 6071.`
        )
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error(
        'Your request was not sent. Check your connection and try again, or call us on 011 902 6071.'
      )
    }
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Get Your Estimate</CardTitle>
              <p className="text-muted-foreground">
                Fill out the form below to receive a comprehensive evaluation of
                your vehicle&lsquo;s trade-in value.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">
                      Contact Information
                    </h2>

                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        autoComplete="given-name"
                        aria-invalid={!!errors.firstName}
                        aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                        placeholder="e.g. Thabo"
                        {...register('firstName')}
                      />
                      {errors.firstName && (
                        <p id="firstName-error" role="alert" className="text-red-600 text-sm mt-1">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        autoComplete="family-name"
                        aria-invalid={!!errors.lastName}
                        aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                        placeholder="e.g. Mokoena"
                        {...register('lastName')}
                      />
                      {errors.lastName && (
                        <p id="lastName-error" role="alert" className="text-red-600 text-sm mt-1">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        autoComplete="email"
                        spellCheck={false}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        type="email"
                        placeholder="e.g. thabo@company.co.za"
                        {...register('email')}
                      />
                      {errors.email && (
                        <p id="email-error" role="alert" className="text-red-600 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        autoComplete="tel"
                        inputMode="tel"
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                        type="tel"
                        placeholder="e.g. 082 123 4567"
                        {...register('phone')}
                      />
                      {errors.phone && (
                        <p id="phone-error" role="alert" className="text-red-600 text-sm mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="preferredContact">
                        Preferred Contact Method
                      </Label>
                      <Controller
                        name="preferredContact"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value ? String(field.value) : ''}
                          >
                            <SelectTrigger
                              id="preferredContact"
                              className="w-full"
                              aria-invalid={!!errors.preferredContact}
                              aria-describedby={errors.preferredContact ? 'preferredContact-error' : undefined}
                            >
                              <SelectValue placeholder="How would you like to be contacted?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="phone">Phone</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="text">Text Message</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.preferredContact && (
                        <p id="preferredContact-error" role="alert" className="text-red-600 text-sm mt-1">
                          {errors.preferredContact.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">
                      Vehicle Information
                    </h2>

                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        autoComplete="off"
                        inputMode="numeric"
                        aria-invalid={!!errors.year}
                        aria-describedby={errors.year ? 'year-error' : undefined}
                        placeholder="e.g. 2018"
                        {...register('year')}
                      />
                      {errors.year && (
                        <p id="year-error" role="alert" className="text-red-600 text-sm mt-1">
                          {errors.year.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="make">Make</Label>
                      <Input
                        id="make"
                        autoComplete="off"
                        aria-invalid={!!errors.make}
                        aria-describedby={errors.make ? 'make-error' : undefined}
                        type="text"
                        placeholder="e.g. Isuzu, Hino"
                        {...register('make')}
                      />
                      {errors.make && (
                        <p id="make-error" role="alert" className="text-red-600 text-sm mt-1">
                          {errors.make.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Input
                        id="model"
                        autoComplete="off"
                        aria-invalid={!!errors.model}
                        aria-describedby={errors.model ? 'model-error' : undefined}
                        type="text"
                        placeholder="e.g. NPR 400"
                        {...register('model')}
                      />
                      {errors.model && (
                        <p id="model-error" role="alert" className="text-red-600 text-sm mt-1">
                          {errors.model.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mileage">Mileage</Label>
                      <Input
                        id="mileage"
                        autoComplete="off"
                        inputMode="numeric"
                        aria-invalid={!!errors.mileage}
                        aria-describedby={errors.mileage ? 'mileage-error' : undefined}
                        placeholder="e.g. 250000"
                        {...register('mileage')}
                      />
                      {errors.mileage && (
                        <p id="mileage-error" role="alert" className="text-red-600 text-sm mt-1">
                          {errors.mileage.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Enhanced Image Upload Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold">
                      Vehicle Images
                    </Label>
                    {selectedImages.length > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={clearAllImages}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Clear All
                      </Button>
                    )}
                  </div>

                  {/* File Upload Area */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault()
                      setIsDragging(true)
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors focus-within:border-gray-500 ${
                      isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {/* sr-only rather than hidden so the picker stays reachable by keyboard */}
                    <input
                      id="tradeImages"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor="tradeImages"
                      className="cursor-pointer flex flex-col items-center space-y-2 rounded peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2"
                    >
                      <Upload className="h-8 w-8 text-gray-400" />
                      <div className="text-sm">
                        <span className="font-medium text-blue-600 hover:text-blue-500">
                          Click to upload
                        </span>{' '}
                        or drag and drop
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB each
                      </p>
                    </label>
                  </div>

                  {/* Image Preview Grid */}
                  {selectedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {selectedImages.map((imagePreview) => (
                        <div
                          key={imagePreview.id}
                          className="relative group bg-gray-50 rounded-lg overflow-hidden border"
                        >
                          <div className="aspect-square">
                            <Image
                              src={imagePreview.url}
                              alt={imagePreview.file.name}
                              width={200}
                              height={200}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          </div>

                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => removeImage(imagePreview.id)}
                            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full sm:opacity-0 sm:group-hover:opacity-100 transition-[opacity,background-color] hover:bg-red-700 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                            aria-label={`Remove ${imagePreview.file.name}`}
                          >
                            <X className="h-4 w-4" />
                          </button>

                          {/* File name overlay */}
                          <div className="absolute bottom-0 left-0 right-0 bg-black/75 text-white p-2 text-xs truncate opacity-0 group-hover:opacity-100 transition-opacity">
                            {imagePreview.file.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Image count and size info */}
                  {selectedImages.length > 0 && (
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <ImageIcon className="h-4 w-4" />
                        <span>
                          {selectedImages.length} image
                          {selectedImages.length !== 1 ? 's' : ''} selected
                        </span>
                      </span>
                      <span>
                        Total size:{' '}
                        {(
                          selectedImages.reduce(
                            (total, img) => total + img.file.size,
                            0
                          ) /
                          1024 /
                          1024
                        ).toFixed(2)}
                        &nbsp;MB
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 mt-4 mb-6">
                  <Label htmlFor="comments">Additional Comments</Label>
                  <Textarea
                    id="comments"
                    placeholder="Tell us about any recent repairs, modifications, or other details that might affect your vehicle's value…"
                    className="resize h-36"
                    {...register('comments')}
                  />
                  {errors.comments && (
                    <p id="comments-error" role="alert" className="text-red-600 text-sm mt-1">
                      {errors.comments.message}
                    </p>
                  )}
                </div>

                <TurnstileWidget
                  onToken={setTurnstileToken}
                  resetSignal={turnstileReset}
                />

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending…' : 'Get My Estimate'}
                </Button>

                <p className="text-sm text-muted-foreground text-center mt-4">
                  By submitting this form, you agree to be contacted by our
                  sales team. We respect your privacy and will never share your
                  information.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
