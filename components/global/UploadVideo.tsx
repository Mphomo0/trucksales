'use client'

import type React from 'react'

import { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Upload, Trash2, VideoIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type PreviewFile = {
  file: File
  id: string
  preview: string
}

type UploadVideoProps = {
  onFileSelected: (file: File | null, preview: PreviewFile | null) => void
  className?: string
}

const UploadVideo = ({ onFileSelected, className }: UploadVideoProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<PreviewFile | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileChange = () => {
    const inputFile = fileInputRef.current?.files?.[0]
    if (inputFile && inputFile.type.startsWith('video/')) {
      processFile(inputFile)
    }
  }

  const processFile = (file: File) => {
    // Cleanup old preview
    if (preview) URL.revokeObjectURL(preview.preview)

    const newPreview: PreviewFile = {
      file,
      id: `${file.name}-${file.lastModified}`,
      preview: URL.createObjectURL(file),
    }

    setPreview(newPreview)
    onFileSelected(file, newPreview)
  }

  const removeFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview.preview)
    }
    setPreview(null)
    onFileSelected(null, null)
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

    const file = Array.from(e.dataTransfer.files).find((file) =>
      file.type.startsWith('video/')
    )

    if (file) {
      processFile(file)
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

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview.preview)
      }
    }
  }, [preview])

  return (
    <div className={cn('space-y-4', className)}>
      <input
        type="file"
        accept="video/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Area */}
      <Card
        className={cn(
          'border-2 border-dashed transition-all duration-200 cursor-pointer hover:border-primary/50',
          isDragOver && 'border-primary bg-primary/5',
          preview && 'opacity-50 cursor-not-allowed'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !preview && fileInputRef.current?.click()}
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
            {preview ? 'Video Uploaded' : 'Upload a Video'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {preview
              ? 'You can only upload one video at a time'
              : 'Drag and drop your video here, or click to browse'}
          </p>
          {!preview && (
            <Button variant="outline" size="sm">
              <VideoIcon className="h-4 w-4 mr-2" />
              Choose Video
            </Button>
          )}
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="secondary">
              {preview ? '1 / 1 file' : '0 / 1 file'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {preview && (
        <Card className="relative overflow-hidden">
          <CardContent className="p-0">
            <div className="relative w-full aspect-video">
              <video
                src={preview.preview}
                controls
                className="w-full h-full object-cover"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={removeFile}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <div className="p-3 space-y-1">
              <p
                className="text-xs font-medium truncate"
                title={preview.file.name}
              >
                {preview.file.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(preview.file.size)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default UploadVideo
