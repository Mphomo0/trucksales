'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Gauge } from 'lucide-react'
import { useKeenSlider, KeenSliderPlugin } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { getCurrentPrice } from '@/lib/pricing'
import { ikCard } from '@/lib/imagekit'
import { formatDisplayName } from '@/lib/text'

interface TruckItem {
  id: string
  name: string
  make: string
  model: string
  year: number
  vatPrice: number
  mileage: number | null
  fuelType: string | null
  condition: string
  transmission: string | null
  thumbnail?: { fileId?: string; url: string } | null
  slug: string
  specialPrice: number | null
  specialValidFrom: Date | string | null
  specialValidTo: Date | string | null
}

const noImage = (
  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
    No Image Available
  </div>
)

// Advances one slide every few seconds; pauses while the user hovers, touches or drags.
const autoplay: KeenSliderPlugin = (slider) => {
  let timeout: ReturnType<typeof setTimeout>
  let paused = false
  const clear = () => clearTimeout(timeout)
  const next = () => {
    clear()
    if (paused) return
    timeout = setTimeout(() => slider.next(), 3500)
  }
  slider.on('created', () => {
    slider.container.addEventListener('mouseover', () => {
      paused = true
      clear()
    })
    slider.container.addEventListener('mouseout', () => {
      paused = false
      next()
    })
    next()
  })
  slider.on('dragStarted', clear)
  slider.on('animationEnded', next)
  slider.on('updated', next)
  slider.on('destroyed', clear)
}

export default function FeaturedMarquee({ trucks }: { trucks: TruckItem[] }) {
  const [sliderRef, sliderInstanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      mode: 'free-snap',
      slides: { perView: 1.15, spacing: 12 },
      breakpoints: {
        '(min-width: 640px)': { slides: { perView: 2, spacing: 16 } },
        '(min-width: 1024px)': { slides: { perView: 4, spacing: 16 } },
      },
    },
    [autoplay],
  )

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-lg text-gray-600">
            Check out our most popular vehicles
          </p>
        </div>

        {/* Rendered on the server too, so truck links are in the HTML for crawlers.
            Slide widths are preset below to match keen-slider's layout and avoid a
            layout shift when it initialises. */}
        <div className="relative">
          <div
            ref={sliderRef}
            className="keen-slider"
            aria-label="Featured used trucks"
          >
            {trucks.slice(0, 12).map((truck) => {
              const priceInfo = getCurrentPrice(
                truck.vatPrice,
                truck.specialPrice ?? null,
                truck.specialValidFrom ?? null,
                truck.specialValidTo ?? null,
              )
              const validUntil = truck.specialValidTo
                ? new Date(truck.specialValidTo).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : null

              return (
                <div
                  key={truck.id}
                  className="keen-slider__slide min-w-[calc((100%_+_12px)/1.15_-_12px)] max-w-[calc((100%_+_12px)/1.15_-_12px)] sm:min-w-[calc((100%_+_16px)/2_-_16px)] sm:max-w-[calc((100%_+_16px)/2_-_16px)] lg:min-w-[calc((100%_+_16px)/4_-_16px)] lg:max-w-[calc((100%_+_16px)/4_-_16px)]"
                >
                  <Link
                    href={`/inventory/${truck.slug}`}
                    prefetch={false}
                    className="block h-full"
                  >
                    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="relative">
                        {truck.thumbnail?.url ? (
                          <Image
                            src={ikCard(truck.thumbnail.url)}
                            alt={`${truck.year} ${formatDisplayName(truck.make)} ${formatDisplayName(truck.model)}`}
                            width={400}
                            height={300}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          noImage
                        )}
                        <Badge className="absolute top-2 right-2 bg-amber-600">
                          {truck.condition}
                        </Badge>
                      </div>

                      <CardContent className="p-4 flex flex-col justify-between grow">
                        <h3 className="text-xl font-bold mb-2 line-clamp-1">
                          {truck.year} {truck.make.toUpperCase()}{' '}
                          {truck.model.toUpperCase()}
                        </h3>
                        <div className="flex flex-col items-start mb-3">
                          {priceInfo.isSpecial ? (
                            <div className="flex flex-col">
                              <span className="text-xl font-bold text-red-500 line-through">
                                R{priceInfo.originalPrice.toLocaleString()}
                              </span>
                              <span className="text-2xl font-bold text-yellow-600">
                                R{priceInfo.currentPrice.toLocaleString()}
                              </span>
                              <span className="text-xs text-gray-500">
                                inc. VAT
                              </span>
                              {validUntil && (
                                <span className="text-xs text-green-600 font-medium">
                                  Valid until {validUntil}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div>
                              <span className="text-2xl font-bold text-yellow-600">
                                R{truck.vatPrice.toLocaleString()}{' '}
                                <span className="text-sm">inc. VAT</span>
                              </span>
                            </div>
                          )}
                          <div>
                            <span className="text-gray-600 flex items-center">
                              <Gauge size={18} className="mr-1" />
                              {truck.mileage?.toLocaleString() ?? 'N/A'} km
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge>{truck.condition}</Badge>
                          {truck.fuelType && <Badge>{truck.fuelType}</Badge>}
                          {truck.transmission && (
                            <Badge>{truck.transmission}</Badge>
                          )}
                        </div>
                        <Button className="w-full mt-auto">View Details</Button>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              )
            })}
          </div>

          <button
            type="button"
            onClick={() => sliderInstanceRef.current?.prev()}
            className="absolute left-2 top-1/3 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-colors"
            aria-label="Previous trucks"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => sliderInstanceRef.current?.next()}
            className="absolute right-2 top-1/3 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-colors"
            aria-label="Next trucks"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="hover:bg-black hover:text-white"
          >
            <Link href="/inventory">View All Inventory</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
