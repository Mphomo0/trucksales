'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { Gauge } from 'lucide-react'
import { toast } from 'react-toastify'

interface Image {
  fileId: string
  url: string
}

interface Special {
  id: string
  amount: number
  slug: number
  validFrom: string
  validTo: string
  inventoryId: string
  inventory: {
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
}

export default function AllSpecials() {
  const [specials, setSpecials] = useState<Special[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSpecials = async () => {
    try {
      const response = await fetch('/api/specials')
      if (!response.ok) {
        throw new Error('Failed to fetch specials')
      }
      const data = await response.json()
      console.log(data.data)
      setSpecials(data.data)
    } catch (error) {
      console.error('Error fetching specials:', error)
      toast.error('Error fetching specials')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSpecials()
  }, [])

  if (loading) {
    return <p className="flex items-center justify-center h-56">loading.....</p>
  }

  return (
    <div className="bg-gray-100 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {specials.map((special) => (
          <Card
            key={special.slug}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative -top-6">
              <Image
                src={
                  special.inventory.images[0]?.url || '/placeholder-truck.jpg'
                }
                alt={`${special.inventory.year} ${special.inventory.make} ${special.inventory.model}`}
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
              <h3 className="text-xl font-bold mb-2 -mt-10">
                {special.inventory.year} {special.inventory.make.toUpperCase()}{' '}
                {special.inventory.model.toUpperCase()}
              </h3>
              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">WAS</p>
                    <p className="text-xl font-semibold text-red-600 line-through">
                      R{special.inventory.vatPrice.toLocaleString()}{' '}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">NOW</p>
                    <p className="text-2xl font-bold text-green-600">
                      R{special.amount.toLocaleString()}{' '}
                      <span className="text-sm">incl. VAT</span>
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-600">
                  <Gauge size={16} className="mr-1" />
                  {special.inventory.mileage.toLocaleString()} km
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{special.inventory.condition}</Badge>
                <Badge variant="secondary">{special.inventory.fuelType}</Badge>
                <Badge variant="secondary">
                  {special.inventory.transmission}
                </Badge>
              </div>
              <Button asChild className="w-full">
                <Link href={`/specials/${special.slug}`}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
