'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-toastify'

interface Image {
  fileId: string
  url: string
}

interface Special {
  id: string
  amount: number
  slug: string
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

      if (!Array.isArray(data.data)) {
        throw new Error('Invalid response format')
      }

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
    return (
      <div className="flex items-center justify-center h-56">
        <p className="text-lg text-gray-600 animate-pulse">
          Loading specials...
        </p>
      </div>
    )
  }

  if (!loading && specials.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        No specials available at the moment.
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="bg-gray-100 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {specials.map((special) => (
          <Link href={`/specials/${special.slug}`} key={special.slug}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative -top-6">
                <Image
                  src={`${special.inventory.images[0]?.url}?tr=f-auto,q-75`}
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
                  {special.inventory.year}{' '}
                  {special.inventory.make.toUpperCase()}{' '}
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
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Valid from <strong>{formatDate(special.validFrom)}</strong> to{' '}
                  <strong>{formatDate(special.validTo)}</strong>
                </div>

                <Button asChild className="w-full bg-black text-white mt-8">
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
