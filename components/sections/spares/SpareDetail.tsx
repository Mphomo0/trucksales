/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ArrowLeft, Phone, Mail, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { WhatsAppButton } from '@/components/sections/inventorySection/WhatsAppButton'
import EnquiryForm from '@/components/sections/inventorySection/EnquiryForm'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { getCurrentPrice } from '@/lib/pricing'

interface SparePartImage {
  url: string
  fileId?: string
}

interface SparePart {
  id: string
  name: string
  make: string
  price: number
  noVatPrice: number | null
  category: string
  condition: string
  description: string
  slug: string
  images: any
  videoLink?: string | null
  specialPrice?: number | null
  specialPriceNoVat?: number | null
  specialValidFrom?: Date | string | null
  specialValidTo?: Date | string | null
}

interface Props {
  spare: SparePart
}

/* <h1>A-Z Truck Sales Components</h1> */ export default function SpareDetail({ spare }: Props) {
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
    []
  )

  const [thumbnailRef, thumbnailInstanceRef] = useKeenSlider<HTMLDivElement>(
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
    []
  )

  const handleThumbnailClick = useCallback((index: number) => {
    sliderInstanceRef.current?.moveToIdx(index)
    thumbnailInstanceRef.current?.moveToIdx(index)
  }, [])

  const handlePrevious = useCallback(() => {
    sliderInstanceRef.current?.prev()
  }, [])

  const handleNext = useCallback(() => {
    sliderInstanceRef.current?.next()
  }, [])

  function convertYouTubeLink(url: any) {
    const regExp =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/
    const match = url.match(regExp)
    return match ? `https://www.youtube.com/embed/${match[1]}` : url
  }

  const getVideoLinkUrl = (link: any): string | null => {
    if (!link) return null
    if (typeof link === 'string') return link.trim() || null
    if (typeof link === 'object' && link.url) return link.url.trim() || null
    return null
  }

  const videoLinkUrl = getVideoLinkUrl(spare.videoLink)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button asChild variant="outline">
            <Link href="/spares">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Spares
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="mb-8">
              {spare.images.length > 0 && (
                <>
                  {/* Main image slider */}
                  <div className="relative">
                    <div
                      ref={sliderRef}
                      className="keen-slider aspect-[16/9] w-full mb-4 rounded-lg overflow-hidden shadow-lg border bg-neutral-50"
                    >
                      {(spare.images || []).map((img: any, index: number) => (
                        <div
                          className="keen-slider__slide relative flex items-center justify-center bg-neutral-100"
                          key={index}
                        >
                          <div className="relative w-full h-60 md:h-96">
                            <Image
                              src={img.url}
                              alt={`${spare.name} image ${index + 1}`}
                              width={1200}
                              height={800}
                              className="object-cover w-full h-full"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
                              priority
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Navigation arrows */}
                    {spare.images.length > 1 && (
                      <>
                        <button
                          onClick={() => sliderInstanceRef.current?.prev()}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                          aria-label="Previous image"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-5 h-5"
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
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-5 h-5"
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

                  {/* Thumbnail slider */}
                  {spare.images.length > 1 && (
                    <div
                      ref={thumbnailRef}
                      className="keen-slider mb-8 cursor-pointer px-2"
                    >
                      {(spare.images || []).map((img: any, index: number) => (
                        <div
                          key={index}
                          className={`keen-slider__slide transition-all rounded overflow-hidden aspect-video ${
                            currentSlide === index
                              ? 'ring-2 ring-yellow-600 scale-95'
                              : 'opacity-70 hover:opacity-100'
                          }`}
                          onClick={() =>
                            sliderInstanceRef.current?.moveToIdx(index)
                          }
                        >
                          <div className="relative w-full h-full">
                            <Image
                              src={img.url}
                              alt={`Thumbnail ${index + 1}`}
                              width={300}
                              height={200}
                              className="object-cover w-full h-full"
                              sizes="(max-width: 768px) 100px, (max-width: 1024px) 150px, 200px"
                              priority
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Video Link */}
              {videoLinkUrl && (
                <div className="mt-4">
                  <h2 className="text-lg font-semibold mb-2">Vehicle Video</h2>
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={convertYouTubeLink(videoLinkUrl)}
                      title="Vehicle Video"
                      className="w-full h-64 md:h-96 rounded-lg shadow-lg border"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>

            {/* Vehicle Info */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl md:text-3xl">
                      {spare.name.toUpperCase()}
                    </CardTitle>
                  </div>
                  <Badge className="bg-amber-600">{spare.condition}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div>
                  <h2 className="text-lg font-semibold mb-4">Description</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {spare.description}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    <span className="font-bold">- Spares Category: </span>
                    {spare.category || 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price & Contact */}
            <Card className="mb-6 sticky top-24">
              <CardHeader>
                <div className="text-center">
                  {(() => {
                    const priceInfo = getCurrentPrice(
                      spare.price,
                      spare.specialPrice ?? null,
                      spare.specialValidFrom ?? null,
                      spare.specialValidTo ?? null
                    )
                    const validUntil = spare.specialValidTo 
                      ? new Date(spare.specialValidTo).toLocaleDateString('en-GB')
                      : null
                    if (priceInfo.isSpecial) {
                      return (
                        <div className="flex flex-col">
                          <span className="text-xl font-bold text-red-500 line-through">
                            R{spare.price.toLocaleString()}
                          </span>
                          <span className="text-3xl font-bold text-amber-600">
                            R{priceInfo.currentPrice.toLocaleString()}
                          </span>
                          <Badge className="mt-2 bg-red-600">SPECIAL</Badge>
                          {validUntil && (
                            <span className="text-sm text-green-600">
                              Valid until {validUntil}
                            </span>
                          )}
                        </div>
                      )
                    }
                    return (
                      <div className="text-3xl font-bold text-amber-600">
                        R{spare.price.toLocaleString()}
                      </div>
                    )
                  })()}
                  {(() => {
                    const noVatPrice = spare.specialPriceNoVat ?? spare.noVatPrice
                    if (!noVatPrice) return null
                    return (
                      <p className="text-gray-600">
                        R{noVatPrice.toLocaleString()} excl. VAT
                      </p>
                    )
                  })()}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <WhatsAppButton vehicleSlug={spare.slug} />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent mt-4"
                      size="lg"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email Dealer
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="sm:max-w-[425px]"
                    aria-describedby="Description"
                  >
                    <DialogHeader>
                      <DialogTitle>Enquire About This Spare Part</DialogTitle>
                    </DialogHeader>
                    <EnquiryForm vehicleSlug={spare.slug} />
                  </DialogContent>
                </Dialog>
                <Button asChild className="w-full py-4" size="lg">
                  <a href="tel:(011) 902-6071">
                    <Phone className="h-4 w-4 mr-2" />
                    Call (011) 902-6071
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Dealer Rating */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Dealer Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 fill-yellow-500 text-yellow-500"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    4.0 (242 reviews)
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Highly rated dealer with excellent customer service and
                  quality spare.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
