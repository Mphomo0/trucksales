'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
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

type TradeInFormData = z.infer<typeof tradeInFormSchema>

interface ImagePreview {
  file: File
  url: string
  id: string
}

export default function TradeInForm() {
  const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([])

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TradeInFormData>({
    resolver: zodResolver(tradeInFormSchema),
    defaultValues: {
      preferredContact: '',
    },
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages: ImagePreview[] = Array.from(files).map((file) => ({
        file,
        url: URL.createObjectURL(file),
        id: Math.random().toString(36).substring(7),
      }))

      setSelectedImages((prev) => [...prev, ...newImages])
    }
    // Reset the input so the same file can be selected again if needed
    e.target.value = ''
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
      toast.error('At least one image is required.')
      return
    }
    const formData = new FormData()

    // Append all form fields except images
    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value as string)
    }

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
      } else {
        toast.error(result.message || 'Something went wrong')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Failed to send message. Please try again later.')
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
                    <h3 className="text-lg font-semibold">
                      Contact Information
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="Enter your first name"
                        {...register('firstName')}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Enter your last name"
                        {...register('lastName')}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        {...register('email')}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number e.g(011-011-0000)"
                        {...register('phone')}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
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
                            <SelectTrigger className="w-full">
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
                        <p className="text-red-500 text-sm mt-1">
                          {errors.preferredContact.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Vehicle Information
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        placeholder="Enter Vehicle Year"
                        {...register('year')}
                      />
                      {errors.year && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.year.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="make">Make</Label>
                      <Input
                        id="make"
                        type="text"
                        placeholder="Enter vehicle make (e.g., Toyota, Ford)"
                        {...register('make')}
                      />
                      {errors.make && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.make.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Input
                        id="model"
                        type="text"
                        placeholder="Enter model"
                        {...register('model')}
                      />
                      {errors.model && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.model.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mileage">Mileage</Label>
                      <Input
                        id="mileage"
                        placeholder="Enter current mileage e.g 100000"
                        {...register('mileage')}
                      />
                      {errors.mileage && (
                        <p className="text-red-500 text-sm mt-1">
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
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      id="tradeImages"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="tradeImages"
                      className="cursor-pointer flex flex-col items-center space-y-2"
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
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => removeImage(imagePreview.id)}
                            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            aria-label="Remove image"
                          >
                            <X className="h-4 w-4" />
                          </button>

                          {/* File name overlay */}
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 text-xs truncate opacity-0 group-hover:opacity-100 transition-opacity">
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
                        ).toFixed(2)}{' '}
                        MB
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 mt-4 mb-6">
                  <Label htmlFor="comments">Additional Comments</Label>
                  <Textarea
                    id="comments"
                    placeholder="Tell us about any recent repairs, modifications, or other details that might affect your vehicle's value..."
                    className="resize h-36"
                  />
                </div>

                <Button size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : ' Get My Estimate'}
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
