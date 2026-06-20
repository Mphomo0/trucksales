/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

'use client'

import type React from 'react'
import { ReactSortable } from 'react-sortablejs'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Upload, Trash2, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type ExistingImage = {
  url: string
  fileId: string
}

type PreviewFile = {
  file: File
  id: string
  preview: string
  isExisting?: boolean
}

type UploadMultipleProps = {
  onFilesSelected: (files: File[], previews: PreviewFile[]) => void
  maxFiles?: number
  className?: string
  existingImages?: ExistingImage[]
}

const UploadMultiple = ({
  onFilesSelected,
  maxFiles = 16,
  className,
  existingImages = [],
}: UploadMultipleProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<PreviewFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  useEffect(() => {
    if (existingImages.length > 0) {
      const initialPreviews: PreviewFile[] = existingImages.map((img) => ({
        file: new File([], img.url, { type: 'image/jpeg' }),
        id: img.fileId,
        preview: img.url,
        isExisting: true,
      }))
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviews(initialPreviews)
    } else {
      setPreviews([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(existingImages)])

  const handleFileChange = () => {
    const inputFiles = fileInputRef.current?.files
    if (inputFiles) {
      processFiles(Array.from(inputFiles))
    }
  }

  const processFiles = (filesArray: File[]) => {
    const imageFiles = filesArray.filter((f) => f.type.startsWith('image/'))
    if (imageFiles.length === 0) return

    const newPreviewData: PreviewFile[] = imageFiles.map((file) => ({
      file,
      id: `${file.name}-${file.lastModified}`,
      preview: URL.createObjectURL(file),
      isExisting: false,
    }))

    const existingIds = new Set(previews.map((p) => p.id))
    const filteredNewPreviews = newPreviewData.filter(
      (p) => !existingIds.has(p.id)
    )

    const availableSlots = maxFiles - previews.length
    const finalPreviews = filteredNewPreviews.slice(
      0,
      Math.max(0, availableSlots)
    )

    const updatedPreviews = [...previews, ...finalPreviews]

    setPreviews(updatedPreviews)
    onFilesSelected(
      updatedPreviews.map((p) => p.file),
      updatedPreviews
    )
  }

  useEffect(() => {
    return () => {
      previews.forEach((p) => {
        if (!p.isExisting) {
          URL.revokeObjectURL(p.preview)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const removeFile = (id: string) => {
    const fileToRemove = previews.find((p) => p.id === id)
    if (fileToRemove && !fileToRemove.isExisting) {
      URL.revokeObjectURL(fileToRemove.preview)
    }

    const newPreviews = previews.filter((p) => p.id !== id)
    setPreviews(newPreviews)
    onFilesSelected(
      newPreviews.map((p) => p.file),
      newPreviews
    )
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    )

    if (files.length > 0) {
      processFiles(files)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    )
  }

  const canAddMore = previews.length < maxFiles

  return (
    <div className={cn('space-y-4', className)}>
      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Area */}
      <Card
        className={cn(
          'border-2 border-dashed transition-all duration-200 cursor-pointer hover:border-primary/50',
          isDragOver && 'border-primary bg-primary/5',
          !canAddMore && 'opacity-50 cursor-not-allowed'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => canAddMore && fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <div
            className={cn(
              'rounded-full p-4 mb-4 transition-colors',
              isDragOver ? 'bg-primary text-primary-foreground' : 'bg-muted'
            )}
          >
            <Upload className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {canAddMore ? 'Upload Images' : 'Maximum files reached'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {canAddMore
              ? 'Drag and drop your images here, or click to browse'
              : `You can upload up to ${maxFiles} files`}
          </p>
          {canAddMore && (
            <Button type="button" variant="outline" size="sm">
              <ImageIcon className="h-4 w-4 mr-2" />
              Choose Files
            </Button>
          )}
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="secondary">
              {previews.length} / {maxFiles} files
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Selected Images</h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                previews.forEach((p) => {
                  if (!p.isExisting) URL.revokeObjectURL(p.preview)
                })
                setPreviews([])
                onFilesSelected([], [])
              }}
            >
              Clear All
            </Button>
          </div>

          <ReactSortable
            list={previews}
            setList={(newState) => {
              setPreviews(newState)
              onFilesSelected(
                newState.map((p) => p.file),
                newState
              )
            }}
            animation={200}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {previews.map((img) => (
              <Card key={img.id} className="group relative overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={img.preview}
                      alt={img.file.name}
                      className="object-cover w-full h-full transition-transform group-hover:scale-105"
                      width={200}
                      height={200}
                      unoptimized={img.isExisting}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                    {/* Remove button */}
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(img.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* File info */}
                  <div className="p-3 space-y-1">
                    <p
                      className="text-xs font-medium truncate"
                      title={img.file.name}
                    >
                      {img.isExisting
                        ? img.preview.split('/').pop()?.split('?')[0] || 'Existing image'
                        : img.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {img.isExisting ? 'Existing' : formatFileSize(img.file.size)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ReactSortable>
        </div>
      )}
    </div>
  )
}

/* <h1>A-Z Truck Sales Components</h1> */ export default UploadMultiple
