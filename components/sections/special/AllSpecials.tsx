/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

interface Image {
  fileId: string
  url: string
}

interface VehicleSpecial {
  id: string
  name: string
  make: string
  model: string
  year: number
  vatPrice: number
  pricenoVat?: number | null
  images: Image[] | any[]
  description: string
  slug: string
  specialPrice: number
  specialValidFrom?: Date | string | null
  specialValidTo?: Date | string | null
}

interface SpareSpecial {
  id: string
  name: string
  make: string
  price: number
  noVatPrice?: number | null
  images: Image[] | any[]
  description: string
  slug: string
  category: string
  condition: string
  specialPrice: number
  specialPriceNoVat?: number | null
  specialValidFrom?: Date | string | null
  specialValidTo?: Date | string | null
}

interface Props {
  vehicles?: VehicleSpecial[]
  spares?: SpareSpecial[]
}

export default function AllSpecials({ vehicles = [], spares = [] }: Props) {
  const hasVehicles = vehicles.length > 0
  const hasSpares = spares.length > 0

  const formatDate = (dateString: Date | string | null | undefined) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-16">
      {hasVehicles && (
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <Link href={`/inventory/${vehicle.slug}`} key={vehicle.slug} prefetch={false}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image
                      src={vehicle.images?.[0]?.url || '/placeholder-truck.jpg'}
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                      priority
                    />
                    <Badge className="absolute top-2 right-2 bg-red-600">
                      SPECIAL
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h4 className="text-xl font-bold mb-2">
                      {vehicle.year} {vehicle.make.toUpperCase()} {vehicle.model.toUpperCase()}
                    </h4>
                    <div className="mb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">WAS</p>
                          <p className="text-xl font-semibold text-red-600 line-through">
                            R{vehicle.vatPrice.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">NOW</p>
                          <p className="text-2xl font-bold text-green-600">
                            R{vehicle.specialPrice.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    {vehicle.specialValidTo && (
                      <div className="text-sm text-gray-600">
                        Valid until <strong>{formatDate(vehicle.specialValidTo)}</strong>
                      </div>
                    )}
                    <Button className="w-full bg-black text-white mt-4">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {hasSpares && (
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spares.map((spare) => (
              <Link href={`/spares/${spare.slug}`} key={spare.slug} prefetch={false}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image
                      src={spare.images?.[0]?.url || '/placeholder-truck.jpg'}
                      alt={spare.name}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                      priority
                    />
                    <Badge className="absolute top-2 right-2 bg-red-600">
                      SPECIAL
                    </Badge>
                    <Badge className="absolute top-2 left-2 bg-blue-600 capitalize">
                      {spare.condition.toLowerCase()}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h4 className="text-lg font-bold mb-1 truncate">
                      {spare.name}
                    </h4>
                    <p className="text-sm text-gray-600 capitalize mb-2">
                      {spare.make} - {spare.category.toLowerCase()}
                    </p>
                    <div className="mb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">WAS</p>
                          <p className="text-xl font-semibold text-red-600 line-through">
                            R{spare.price.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">NOW</p>
                          <p className="text-2xl font-bold text-green-600">
                            R{spare.specialPrice.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    {spare.specialValidTo && (
                      <div className="text-sm text-gray-600">
                        Valid until <strong>{formatDate(spare.specialValidTo)}</strong>
                      </div>
                    )}
                    <Button className="w-full bg-black text-white mt-4">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}