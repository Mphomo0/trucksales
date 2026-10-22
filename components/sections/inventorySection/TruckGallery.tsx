'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useKeenSlider } from 'keen-slider/react'
import { ikHero, ikThumb } from '@/lib/imagekit'
import 'keen-slider/keen-slider.min.css'

interface TruckGalleryProps {
  images: { url: string }[]
  /** Alt text shared by every slide; the image number is appended. */
  altBase: string
}

/** Main image slider with a thumbnail strip — the only interactive part of the detail page's media. */
export default function TruckGallery({ images, altBase }: TruckGalleryProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const [sliderRef, sliderInstanceRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel)
      },
      created() {
        setLoaded(true)
      },
      slides: {
        perView: 1,
        spacing: 0,
      },
      loop: true,
    },
    [],
  )

  const [thumbnailRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      slides: {
        perView: 4,
        spacing: 10,
        origin: 'center',
      },
      breakpoints: {
        '(min-width: 768px)': {
          slides: { perView: 5, spacing: 10 },
        },
      },
    },
    [],
  )

  if (images.length === 0) return null

  // Only slide 0 is fetched on first paint; the rest load once the slider is
  // live and only for the current slide and its neighbours (loop-aware), so
  // they stop competing with the LCP image for bandwidth.
  const imageCount = images.length
  const shouldRenderSlide = (index: number) => {
    if (index === 0) return true
    if (!loaded) return false
    const distance = Math.abs(index - currentSlide)
    return Math.min(distance, imageCount - distance) <= 1
  }

  return (
    <>
      {/* Main image slider */}
      <div className="relative">
        <div
          ref={sliderRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Vehicle photos"
          className="keen-slider aspect-video w-full mb-4 rounded-lg overflow-hidden shadow-lg border bg-neutral-50"
        >
          {images.map((img, index) => (
            <div
              className="keen-slider__slide relative flex items-center justify-center bg-neutral-100"
              key={img.url}
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${imageCount}`}
            >
              <div className="relative w-full h-60 md:h-96">
                {shouldRenderSlide(index) && (
                  <Image
                    src={ikHero(img.url)}
                    alt={`${altBase} - image ${index + 1}`}
                    width={1200}
                    height={800}
                    className="object-cover w-full h-full"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
                    priority={index === 0}
                    fetchPriority={index === 0 ? 'high' : 'low'}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        {imageCount > 1 && (
          <>
            <button
              type="button"
              onClick={() => sliderInstanceRef.current?.prev()}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Previous image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => sliderInstanceRef.current?.next()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Next image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail slider */}
      {imageCount > 1 && (
        <div
          ref={thumbnailRef}
          // slide widths are preset (4/5 per view) so the strip keeps its height
          // until keen-slider initialises, instead of collapsing and shifting the page
          className="keen-slider mb-8 px-2"
        >
          {images.map((img, index) => (
            <button
              type="button"
              key={img.url}
              onClick={() => sliderInstanceRef.current?.moveToIdx(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={currentSlide === index ? 'true' : undefined}
              className={`keen-slider__slide min-w-[calc((100%-30px)/4)] max-w-[calc((100%-30px)/4)] md:min-w-[calc((100%-40px)/5)] md:max-w-[calc((100%-40px)/5)] transition-[opacity,transform,box-shadow] rounded overflow-hidden aspect-video cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 ${
                currentSlide === index
                  ? 'ring-2 ring-yellow-600 scale-95'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <span className="relative block w-full h-full">
                <Image
                  src={ikThumb(img.url)}
                  alt=""
                  width={300}
                  height={200}
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 100px, (max-width: 1024px) 150px, 200px"
                  fetchPriority="low"
                />
              </span>
            </button>
          ))}
        </div>
      )}
    </>
  )
}
