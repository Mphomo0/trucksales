'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Gauge } from 'lucide-react'
import Marquee from 'react-fast-marquee'
import { getCurrentPrice } from '@/lib/pricing'
import { ikCard } from '@/lib/imagekit'

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

export default function FeaturedMarquee({ trucks }: { trucks: TruckItem[] }) {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-lg text-gray-600">
            Check out our most popular vehicles
          </p>
        </div>

        <div className="overflow-hidden">
          <Marquee
            speed={80}
            pauseOnHover={true}
            pauseOnClick={true}
            delay={0}
            play={true}
            direction="left"
          >
            {trucks.map((truck, index) => {
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
                <div key={truck.id} className="min-w-75 max-w-75 mx-4 shrink-0">
                  <Link href={`/inventory/${truck.slug}`} prefetch={false}>
                    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="relative">
                        {truck.thumbnail?.url ? (
                          <Image
                            src={ikCard(truck.thumbnail.url)}
                            alt={`${truck.year} ${truck.make} ${truck.model}`}
                            width={400}
                            height={300}
                            className="w-full h-48 object-cover"
                            priority={index < 3}
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
                        <Button className="w-full mt-auto">
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              )
            })}
          </Marquee>
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
