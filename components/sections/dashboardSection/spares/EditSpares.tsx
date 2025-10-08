'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { v4 as uuidv4 } from 'uuid'
import { upload } from '@imagekit/next'
import { Trash2, Upload } from 'lucide-react'

interface SparesImage {
  url: string
  fileId: string
}

interface SparesItem {
  id: string
  name: string
  make: string
  price: number
  noVatPrice: number
  category: string
  condition: string
  description?: string
  slug: string
  images: SparesImage[]
  videoLink?: string | null
}

export default function EditSpares() {
  const [loading, setLoading] = useState(true)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SparesItem>({
    defaultValues: { images: [] },
  })

  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const watchedImages = watch('images') || []

  useEffect(() => {
    const fetchSpares = async () => {
      try {
        const res = await fetch(`/api/spares/${slug}`)
        if (!res.ok) throw new Error('Failed to fetch spare item')
        const data = await res.json()
        console.log(data.sparesItem)

        if (!data.sparesItem) {
          throw new Error('Spares item not found')
        }

        reset(data.sparesItem)
      } catch (error) {
        console.error('Error fetching spare item:', error)
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to load spare item data'
        )
      } finally {
        setLoading(false)
      }
    }
    fetchSpares()
  }, [slug, reset])

  useEffect(() => {
    return () => {
      previewImages.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previewImages])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    previewImages.forEach((url) => URL.revokeObjectURL(url))
    const newFiles = Array.from(files)
    setSelectedFiles(newFiles)
    setPreviewImages(newFiles.map((file) => URL.createObjectURL(file)))
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
  }

  const removeImage = (index: number) => {
    const currentImages = [...watchedImages]
    currentImages.splice(index, 1)
    setValue('images', currentImages)
  }

  const removePreviewImage = (index: number) => {
    URL.revokeObjectURL(previewImages[index])
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    const newPreviews = previewImages.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    setPreviewImages(newPreviews)
  }

  const getAuthParams = async () => {
    const res = await fetch('/api/images/upload-auth')
    if (!res.ok) throw new Error('Failed to fetch upload authentication')
    return res.json()
  }

  const onSubmit = async (formData: SparesItem) => {
    try {
      setIsUploading(true)

      const newUploadedImages: SparesImage[] = []
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          try {
            const { token, signature, publicKey, expire } =
              await getAuthParams()
            const uniqueFileName = `${uuidv4()}_${file.name}`
            const res = await upload({
              file,
              fileName: uniqueFileName,
              folder: 'spares',
              expire,
              token,
              signature,
              publicKey,
            })
            if (!res?.url || !res?.fileId)
              throw new Error(`Upload failed for ${file.name}`)
            newUploadedImages.push({ url: res.url, fileId: res.fileId })
          } catch (err) {
            console.error(err)
            toast.error(`Failed to upload ${file.name}`)
          }
        }
      }

      const allImages = [...watchedImages, ...newUploadedImages]
      const updatedFormData = {
        ...formData,
        images: allImages,
      }

      const res = await fetch(`/api/spares/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFormData),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData?.error || 'Failed to update spare item')
      }

      previewImages.forEach((url) => URL.revokeObjectURL(url))

      toast.success('Spares Item updated successfully')
      router.push('/dashboard/spares')
    } catch (error) {
      console.error(error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to update spare item'
      )
    } finally {
      setIsUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 p-8">
        Loading...
      </div>
    )
  }

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 px-12 py-12">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="mb-4 space-y-2">
              <Label>Name</Label>
              <Input {...register('name')} placeholder="Enter spares name" />
            </div>
            <div className="mb-4 space-y-2">
              <Label>Vehicle Make</Label>
              <Input {...register('make')} placeholder="Enter vehicle make" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="mb-4 space-y-2">
              <Label>Price VAT Included</Label>
              <Input {...register('price')} placeholder="Enter price" />
            </div>
            <div className="mb-4 space-y-2">
              <Label>Price No VAT</Label>
              <Input {...register('noVatPrice')} placeholder="Enter price" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="mb-4 space-y-2">
              <Label>Condition</Label>
              <select
                {...register('condition')}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Condition</option>
                <option value="USED">Used</option>
                <option value="NEW">New</option>
              </select>
            </div>
            <div className="mb-4 space-y-2">
              <Label>Category</Label>
              <select
                {...register('category')}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Category</option>
                <option value="ENGINE">ENGINE</option>
                <option value="GEARBOX">GEARBOX</option>
                <option value="DIFF">DIFF</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-4">
            <Label>Images</Label>
            {watchedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {watchedImages.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <Image
                      src={`${img.url}?tr=f-auto`}
                      alt={`image ${idx}`}
                      width={200}
                      height={200}
                      className="object-cover rounded-lg border"
                      priority
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                      onClick={() => removeImage(idx)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <Label htmlFor="imageUpload" className="cursor-pointer">
                <span className="text-sm font-medium text-primary">
                  Click to upload images
                </span>
                <Input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </Label>
            </div>
            {previewImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                {previewImages.map((preview, idx) => (
                  <div key={idx} className="relative group">
                    <Image
                      src={preview}
                      alt={`preview ${idx}`}
                      width={200}
                      height={200}
                      className="object-cover rounded-lg border-2 border-dashed border-primary/50"
                      priority
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                      onClick={() => removePreviewImage(idx)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video Section */}
          <div className="mb-4 space-y-2 mt-6">
            <Label>Video Link</Label>
            <Input
              {...register('videoLink')}
              placeholder="e.g https://www.youtube.com/watch?v=example"
            />
          </div>

          <div className="mb-4 space-y-2 mt-6">
            <Label>Description</Label>
            <Textarea
              {...register('description')}
              placeholder="Enter description"
              className="h-56 resize"
            />
          </div>

          <Button type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting || isUploading ? 'Updating...' : 'Update Spare'}
          </Button>
        </form>
      </div>
    </div>
  )
}
