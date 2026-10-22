'use client'

import Image from 'next/image'
import { formatNumber } from '@/lib/format'
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Gauge, Pause, Play } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
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

const validUntilFormat = new Intl.DateTimeFormat('en-ZA', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Africa/Johannesburg',
})

const AUTOPLAY_MS = 3500

// Advances one slide every few seconds. Pauses while the pointer is over the
// slider, while anything inside it has keyboard focus, during a drag, while the
// tab is hidden, or while stopped (pause button, reduced motion). Starts
// stopped: the server can't know the visitor's motion preference.
function createAutoplay() {
  let stopped = true
  let restart = () => {}

  const plugin: KeenSliderPlugin = (slider) => {
    let timeout: ReturnType<typeof setTimeout>
    let hovered = false
    let focused = false
    const clear = () => clearTimeout(timeout)
    const next = () => {
      clear()
      if (hovered || focused || stopped || document.hidden) return
      timeout = setTimeout(() => slider.next(), AUTOPLAY_MS)
    }
    restart = next
    const onVisibility = () => next()
    slider.on('created', () => {
      const el = slider.container
      el.addEventListener('mouseover', () => {
        hovered = true
        clear()
      })
      el.addEventListener('mouseout', () => {
        hovered = false
        next()
      })
      el.addEventListener('focusin', () => {
        focused = true
        clear()
      })
      el.addEventListener('focusout', () => {
        focused = false
        next()
      })
      document.addEventListener('visibilitychange', onVisibility)
      next()
    })
    slider.on('dragStarted', clear)
    slider.on('animationEnded', next)
    slider.on('updated', next)
    slider.on('destroyed', () => {
      clear()
      document.removeEventListener('visibilitychange', onVisibility)
    })
  }

  return {
    plugins: [plugin],
    setStopped(value: boolean) {
      stopped = value
      restart()
    },
  }
}

export default function FeaturedMarquee({ trucks }: { trucks: TruckItem[] }) {
  // null until mounted: the server can't know the visitor's motion preference
  const [userPaused, setUserPaused] = useState<boolean | null>(null)
  const [autoplay] = useState(createAutoplay)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    autoplay.setStopped(reduce)
    setUserPaused(reduce)
  }, [autoplay])

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
    autoplay.plugins,
  )

  const togglePaused = () => {
    const paused = !userPaused
    autoplay.setStopped(paused)
    setUserPaused(paused)
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-balance">
            Featured Used Trucks
          </h2>
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
            role="region"
            aria-roledescription="carousel"
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
                ? validUntilFormat.format(new Date(truck.specialValidTo))
                : null

              return (
                <div
                  key={truck.id}
                  className="keen-slider__slide min-w-[calc((100%_+_12px)/1.15_-_12px)] max-w-[calc((100%_+_12px)/1.15_-_12px)] sm:min-w-[calc((100%_+_16px)/2_-_16px)] sm:max-w-[calc((100%_+_16px)/2_-_16px)] lg:min-w-[calc((100%_+_16px)/4_-_16px)] lg:max-w-[calc((100%_+_16px)/4_-_16px)]"
                >
                  <Link
                    href={`/inventory/${truck.slug}`}
                    prefetch={false}
                    className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
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
                        <div className="flex flex-col items-start mb-3 tabular-nums">
                          {priceInfo.isSpecial ? (
                            <div className="flex flex-col">
                              <span className="text-xl font-bold text-red-500 line-through">
                                R{formatNumber(priceInfo.originalPrice)}
                              </span>
                              <span className="text-2xl font-bold text-yellow-600">
                                R{formatNumber(priceInfo.currentPrice)}
                              </span>
                              <span className="text-xs text-gray-500">
                                incl. VAT
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
                                R{formatNumber(truck.vatPrice)}{' '}
                                <span className="text-sm">incl. VAT</span>
                              </span>
                            </div>
                          )}
                          <div>
                            <span className="text-gray-600 flex items-center">
                              <Gauge size={18} className="mr-1" />
                              {formatNumber(truck.mileage) ?? 'N/A'} km
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
                        {/* The card is the link; a <button> inside an <a> is invalid HTML */}
                        <span className={cn(buttonVariants(), 'w-full mt-auto')}>
                          View Details
                        </span>
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

        {userPaused !== null && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={togglePaused}
              aria-pressed={userPaused}
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
            >
              {userPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              {userPaused ? 'Play Slideshow' : 'Pause Slideshow'}
            </button>
          </div>
        )}

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
