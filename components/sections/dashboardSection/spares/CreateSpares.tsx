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
import UploadMultiple from '../stockSection/UploadMultiple'
import { spareSchema } from '@/lib/schemas'
import UploadVideo from '@/components/global/UploadVideo'

type SparesFormData = z.infer<typeof spareSchema>

export default function CreateSpares() {
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null)
  const [uploadedVideo, setUploadedVideo] = useState<{
    url: string
    fileId: string
  } | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SparesFormData>({
    resolver: zodResolver(spareSchema),
    defaultValues: {
      images: [],
      condition: '',
      category: '',
    },
  })

  const getAuthParams = async () => {
    const res = await fetch('/api/images/upload-auth')
    if (!res.ok) throw new Error('Failed to fetch upload auth')
    return res.json()
  }

  const onSubmit = async (data: SparesFormData) => {
    try {
      if (!selectedFiles || selectedFiles.length === 0) {
        toast.error('Please select at least one image.')
        return
      }

      setIsUploading(true)
      const uploadedImages: { url: string; fileId: string }[] = []

      // Upload Images
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        const { token, signature, publicKey, expire } = await getAuthParams()
        const uniqueFileName = `${uuidv4()}_${file.name}`

        try {
          const res = await upload({
            file,
            fileName: uniqueFileName,
            folder: 'spares',
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

      // Upload Video if available
      let videoData: { url: string; fileId: string } | null = null
      if (selectedVideo) {
        try {
          const { token, signature, publicKey, expire } = await getAuthParams()
          const uniqueFileName = `${uuidv4()}_${selectedVideo.name}`

          const res = await upload({
            file: selectedVideo,
            fileName: uniqueFileName,
            folder: 'spares-videos',
            expire,
            token,
            signature,
            publicKey,
          })

          if (!res || !res.url || !res.fileId)
            throw new Error('Video upload failed')

          videoData = { url: res.url, fileId: res.fileId }
          setUploadedVideo(videoData)
        } catch (err) {
          console.error(err)
          toast.error('Failed to upload video')
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
        videoLink: videoData,
        condition: data.condition.toUpperCase(),
        category: data.category?.toUpperCase() ?? null,
      }

      const res = await fetch('/api/spares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success('Spares created successfully!')
        setSelectedFiles(null)
        setSelectedVideo(null)
        setUploadedVideo(null)
        router.push('/dashboard/spares')
      } else {
        const err = await res.json()
        toast.error(err.error || 'Failed to create spares')
      }
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="mb-4 space-y-2">
              <Label htmlFor="name">Spares Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter Spares Name"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div className="mb-4 space-y-2">
              <Label htmlFor="make">Vehicle Make</Label>
              <Input
                id="make"
                type="text"
                placeholder="Enter Vehicle Make"
                {...register('make')}
              />
              {errors.make && (
                <p className="text-red-500 text-sm">{errors.make.message}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="mb-4 space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="text"
                placeholder="Enter Spares Price"
                {...register('price')}
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>
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
              <Label>Category</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ENGINE">ENGINE</SelectItem>
                      <SelectItem value="GEARBOX">GEARBOX</SelectItem>
                      <SelectItem value="DIFF">DIFF</SelectItem>
                      <SelectItem value="OTHER">OTHER</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-red-500">{errors.category.message}</p>
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

          {/* Video */}
          <div className="mb-4 space-y-2">
            <label className="space-y-4">Upload Video</label>
            <UploadVideo
              onFileSelected={(file) => {
                setSelectedVideo(file)
              }}
            />
            {uploadedVideo && (
              <p className="text-sm text-green-600">
                Video uploaded: {uploadedVideo.url}
              </p>
            )}
          </div>

          <div className="mb-4 space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter spare part description"
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
            {isSubmitting || isUploading ? 'Creating...' : 'Create Spare'}
          </Button>
        </form>
      </div>
    </div>
  )
}
