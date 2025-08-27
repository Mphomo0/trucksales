'use client'

import { useState, useCallback } from 'react'
import { useKeenSlider } from 'keen-slider/react'
import Image from 'next/image'

import 'keen-slider/keen-slider.min.css'

interface Props {
  images: { url: string }[]
  vehicleName: string
}

export default function ImageSlider({ images, vehicleName }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const [sliderRef, sliderInstanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    loop: true,
    slideChanged(slider) {
      const idx = slider.track.details.rel
      setCurrentSlide(idx)
    },
    slides: { perView: 1, spacing: 0 },
  })

  const [thumbnailRef, thumbnailInstanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: { perView: 4, spacing: 10, origin: 'center' },
    breakpoints: {
      '(min-width: 768px)': {
        slides: { perView: 5, spacing: 10 },
      },
    },
  })

  const handleThumbnailClick = useCallback((index: number) => {
    sliderInstanceRef.current?.moveToIdx(index)
    thumbnailInstanceRef.current?.moveToIdx(index)
  }, [])

  if (images.length === 0) {
    return (
      <div className="aspect-[16/9] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
        No images available
      </div>
    )
  }

  return (
    <div className="mb-8">
      <div className="relative">
        <div
          ref={sliderRef}
          className="keen-slider aspect-[16/9] w-full mb-4 rounded-lg overflow-hidden shadow-lg border bg-neutral-50"
        >
          {images.map((img, index) => (
            <div
              key={index}
              className="keen-slider__slide relative flex items-center justify-center bg-neutral-100"
            >
              <div className="relative w-full h-full">
                <Image
                  src={img.url}
                  alt={`${vehicleName} image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
                  priority
                />
              </div>
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={() => sliderInstanceRef.current?.prev()}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              aria-label="Previous image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => sliderInstanceRef.current?.next()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              aria-label="Next image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div
          ref={thumbnailRef}
          className="keen-slider mb-8 cursor-pointer px-2"
        >
          {images.map((img, index) => (
            <div
              key={index}
              className={`keen-slider__slide transition-all rounded overflow-hidden aspect-video ${
                currentSlide === index
                  ? 'ring-2 ring-yellow-600 scale-95'
                  : 'opacity-70 hover:opacity-100'
              }`}
              onClick={() => handleThumbnailClick(index)}
            >
              <div className="relative w-full h-full">
                <Image
                  src={img.url}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100px, (max-width: 1024px) 150px, 200px"
                  priority
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
