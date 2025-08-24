'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Gauge } from 'lucide-react'
import Marquee from 'react-fast-marquee'

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
}

export default function Featured() {
  const [trucks, setTrucks] = useState<Truck[]>([])

  const fetchTrucks = async () => {
    try {
      const res = await fetch('/api/vehicles/featured')
      const data = await res.json()
      setTrucks(data)
    } catch (error) {
      console.error('Error fetching trucks:', error)
    }
  }

  useEffect(() => {
    fetchTrucks()
  }, [])

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
            speed={20}
            pauseOnHover={true}
            pauseOnClick={true}
            delay={0}
            play={true}
            direction="left"
          >
            {/* Card Wrapper with consistent sizing */}
            {trucks.map((truck) => (
              <div
                key={truck.id}
                className="min-w-[300px] max-w-[300px] mx-4 flex-shrink-0"
              >
                <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* Image Section */}
                  <div className="relative">
                    <Image
                      src={truck.images[0].url}
                      alt={`${truck.year} ${truck.make} ${truck.model}`}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                      priority
                    />
                    <Badge className="absolute top-2 right-2 bg-amber-600">
                      {truck.condition}
                    </Badge>
                  </div>

                  {/* Card Content */}
                  <CardContent className="p-4 flex flex-col justify-between flex-grow">
                    <h3 className="text-xl font-bold mb-2">
                      {truck.year} {truck.make} {truck.model}
                    </h3>
                    <div className="flex flex-col justify-items-startitems-center mb-3">
                      <div>
                        <span className="text-2xl font-bold text-yellow-600">
                          R{truck.vatPrice.toLocaleString()}{' '}
                          <span className="text-sm">inc. VAT</span>
                        </span>
                      </div>
                      <div>
                        {' '}
                        <span className="text-gray-600 flex items-center">
                          <Gauge size={18} className="mr-1" />
                          {truck.mileage.toLocaleString()} km
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge>{truck.condition}</Badge>
                      <Badge>{truck.fuelType}</Badge>
                      <Badge>{truck.transmission}</Badge>
                    </div>
                    <Button asChild className="w-full mt-auto">
                      <Link href={`/inventory/${truck.slug}`}>
                        View Details
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
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
