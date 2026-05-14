/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Gauge } from 'lucide-react'
import Marquee from 'react-fast-marquee'
import { getCurrentPrice } from '@/lib/pricing'

interface Image {
  fileId: string
  url: string
}

interface Truck {
  id: string
  name: string
  make: string
  model: string
  year: number
  vatPrice: number
  mileage: number
  fuelType: string
  condition: string
  transmission: string
  images: Image[]
  description: string
  slug: string
  specialPrice: number | null
  specialValidFrom: Date | null
  specialValidTo: Date | null
}

/* <h1>A-Z Truck Sales Components</h1> */ export default function Featured() {
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchTrucks = async () => {
    try {
      const res = await fetch('/api/vehicles/featured')
      const data = await res.json()
      if (data.fallback) {
        setTrucks([])
      } else {
        setTrucks(Array.isArray(data) ? data : data.vehicles || [])
      }
    } catch (error) {
      console.error('Error fetching trucks:', error)
      setTrucks([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrucks()
  }, [])

  if (loading) {
    return (
      <section className="py-16 text-center">
        <p className="text-gray-500">Loading featured vehicles...</p>
      </section>
    )
  }

  if (trucks.length === 0 && !loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-lg text-gray-600">
              Check out our most popular vehicles
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">
              No vehicles available at the moment. Please check back soon or{' '}
              <Link href="/inventory" className="text-amber-600 hover:underline">
                browse our full inventory
              </Link>.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Text */}
        <div className="text-center mb-12">
          <p className="text-lg text-gray-600">
            Check out our most popular vehicles
          </p>
        </div>

        {/* Marquee Container */}
        <div className="overflow-hidden">
          <Marquee
            speed={80}
            pauseOnHover={true}
            pauseOnClick={true}
            delay={0}
            play={true}
            direction="left"
          >
            {trucks.map((truck, index) => (
              <div
                key={truck.id}
                className="min-w-[300px] max-w-[300px] mx-4 flex-shrink-0"
              >
                <Link href={`/inventory/${truck.slug}`}>
                  <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    {/* Image Section */}
                    <div className="relative">
                      {truck.images?.[0]?.url ? (
                        <Image
                          src={truck.images[0].url}
                          alt={`${truck.year} ${truck.make} ${truck.model}`}
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover"
                          priority={index < 3}
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                          No Image Available
                        </div>
                      )}
                      <Badge className="absolute top-2 right-2 bg-amber-600">
                        {truck.condition}
                      </Badge>
                    </div>

                    {/* Card Content */}
                    <CardContent className="p-4 flex flex-col justify-between flex-grow">
                      <h3 className="text-xl font-bold mb-2 line-clamp-1">
                        {truck.year} {truck.make.toUpperCase()}{' '}
                        {truck.model.toUpperCase()}
                      </h3>
                      <div className="flex flex-col items-start mb-3">
                        {(() => {
                          const priceInfo = getCurrentPrice(
                            truck.vatPrice,
                            truck.specialPrice ?? null,
                            truck.specialValidFrom ?? null,
                            truck.specialValidTo ?? null
                          )
                          const validUntil = truck.specialValidTo 
                            ? new Date(truck.specialValidTo).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                            : null
                          return priceInfo.isSpecial ? (
                            <div className="flex flex-col">
                              <span className="text-xl font-bold text-red-500 line-through">
                                R{priceInfo.originalPrice.toLocaleString()}
                              </span>
                              <span className="text-2xl font-bold text-yellow-600">
                                R{priceInfo.currentPrice.toLocaleString()}
                              </span>
                              <span className="text-xs text-gray-500">inc. VAT</span>
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
                          )
                        })()}
                        <div>
                          <span className="text-gray-600 flex items-center">
                            <Gauge size={18} className="mr-1" />
                            {truck.mileage.toLocaleString()} km
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge key={`${truck.id}-condition`}>
                          {truck.condition}
                        </Badge>
                        <Badge key={`${truck.id}-fuelType`}>
                          {truck.fuelType}
                        </Badge>
                        <Badge key={`${truck.id}-transmission`}>
                          {truck.transmission}
                        </Badge>
                      </div>
                      <Button asChild className="w-full mt-auto">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
          </Marquee>
        </div>

        {/* Footer CTA */}
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
