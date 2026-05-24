/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { v4 as uuidv4 } from 'uuid'
import { upload } from '@imagekit/next'
import UploadMultiple from '../stockSection/UploadMultiple'

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
  specialPrice?: number | null
  specialPriceNoVat?: number | null
  specialValidFrom?: Date | string | null
  specialValidTo?: Date | string | null
}

type PreviewFile = {
  file: File
  id: string
  preview: string
  isExisting?: boolean
}

/* <h1>A-Z Truck Sales Components</h1> */ export default function EditSpares() {
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [existingImages, setExistingImages] = useState<SparesImage[]>([])
  const [currentPreviews, setCurrentPreviews] = useState<PreviewFile[]>([])
  const initialExistingRef = useRef<SparesImage[]>([])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<SparesItem>({
    defaultValues: { images: [] } as Partial<SparesItem>,
  })

  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  useEffect(() => {
    const fetchSpares = async () => {
      try {
        const res = await fetch(`/api/spares/${slug}`)
        if (!res.ok) throw new Error('Failed to fetch spare item')
        const data = await res.json()

        if (!data.sparesItem) {
          throw new Error('Spares item not found')
        }

        const item = data.sparesItem
        setExistingImages(item.images || [])
        initialExistingRef.current = item.images || []
        reset({
          ...item,
          images: item.images || [],
          specialPrice: item.specialPrice ?? '',
          specialPriceNoVat: item.specialPriceNoVat ?? '',
          specialValidFrom: item.specialValidFrom ? new Date(item.specialValidFrom).toISOString().split('T')[0] : '',
          specialValidTo: item.specialValidTo ? new Date(item.specialValidTo).toISOString().split('T')[0] : '',
        })
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

  const getAuthParams = async () => {
    const res = await fetch('/api/images/upload-auth')
    if (!res.ok) throw new Error('Failed to fetch upload authentication')
    return res.json()
  }

  const onSubmit = async (formData: SparesItem) => {
    try {
      const existingPreviews = currentPreviews.filter((p) => p.isExisting)
      const newPreviews = currentPreviews.filter((p) => !p.isExisting)

      if (existingPreviews.length === 0 && newPreviews.length === 0) {
        toast.error('Please select at least one image.')
        return
      }

      setIsUploading(true)

      const newUploadedImages: SparesImage[] = []

      for (const preview of newPreviews) {
        const file = preview.file
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

      setIsUploading(false)

      const allImages = currentPreviews.map((p) => {
        if (p.isExisting) {
          return { url: p.preview, fileId: p.id }
        }
        const uploaded = newUploadedImages.shift()
        return uploaded || { url: p.preview, fileId: p.id }
      })

      if (allImages.length === 0) {
        toast.error('No images available. Please try again.')
        return
      }

      const deletedFileIds = initialExistingRef.current
        .filter(
          (init) =>
            !currentPreviews.some(
              (p) => p.isExisting && p.id === init.fileId
            )
        )
        .map((img) => img.fileId)

      const updatedFormData = {
        ...formData,
        images: allImages,
        deletedFileIds:
          deletedFileIds.length > 0 ? deletedFileIds : undefined,
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
      <div className="w-full mx-4 bg-white rounded-2xl p-6 px-12 py-12">
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
            <UploadMultiple
              existingImages={existingImages}
              onFilesSelected={(_files, previews) =>
                setCurrentPreviews(previews)
              }
            />
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

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="mb-4 space-y-2">
              <Label>Special Price (VAT Incl)</Label>
              <Input
                {...register('specialPrice')}
                type="number"
                placeholder="Enter special price"
              />
            </div>
            <div className="mb-4 space-y-2">
              <Label>Special Price (No VAT)</Label>
              <Input
                {...register('specialPriceNoVat')}
                type="number"
                placeholder="Enter special price"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="mb-4 space-y-2">
              <Label>Special Valid From</Label>
              <Input
                {...register('specialValidFrom')}
                type="date"
              />
            </div>
            <div className="mb-4 space-y-2">
              <Label>Special Valid To</Label>
              <Input
                {...register('specialValidTo')}
                type="date"
              />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting || isUploading ? 'Updating...' : 'Update Spare'}
          </Button>
        </form>
      </div>
    </div>
  )
}
