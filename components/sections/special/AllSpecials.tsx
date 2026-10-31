/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

'use client'

import { Badge } from '@/components/ui/badge'
import { formatNumber } from '@/lib/format'
import { getSavingsPercent } from '@/lib/pricing'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { ikCard } from '@/lib/imagekit'
import BlackFridayTag from '@/components/shared/BlackFridayTag'
import { useEffect, useState } from 'react'
import {
  filterSpecials,
  getBodyTypes,
  parseTypeParam,
  type SpecialsFilter,
} from '@/lib/specials-filter'

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
  bodyType?: string | null
  vatPrice: number
  pricenoVat?: number | null
  images: Image[] | any[]
  description: string
  slug: string
  specialPrice: number
  specialValidFrom?: Date | string | null
  specialValidTo?: Date | string | null
  specialCampaign?: string | null
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
  specialCampaign?: string | null
}

interface Props {
  vehicles?: VehicleSpecial[]
  spares?: SpareSpecial[]
  showTypeFilters?: boolean
}

function sameFilter(a: SpecialsFilter, b: SpecialsFilter) {
  if (a.kind !== b.kind) return false
  if (a.kind === 'bodyType' && b.kind === 'bodyType') {
    return a.value.toLowerCase() === b.value.toLowerCase()
  }
  return true
}

export default function AllSpecials({
  vehicles: allVehicles = [],
  spares: allSpares = [],
  showTypeFilters = false,
}: Props) {
  // Initial state is "all" on server and client; ?type is applied after mount
  const [filter, setFilter] = useState<SpecialsFilter>({ kind: 'all' })

  useEffect(() => {
    if (!showTypeFilters) return
    const type = new URLSearchParams(window.location.search).get('type')
    setFilter(parseTypeParam(type))
  }, [showTypeFilters])

  const { vehicles, spares } = showTypeFilters
    ? filterSpecials(allVehicles, allSpares, filter)
    : { vehicles: allVehicles, spares: allSpares }
  const bodyTypes = showTypeFilters ? getBodyTypes(allVehicles) : []

  const chips: { label: string; value: SpecialsFilter }[] = [
    { label: 'All deals', value: { kind: 'all' } },
    { label: 'Trucks', value: { kind: 'trucks' } },
    { label: 'Spares', value: { kind: 'spares' } },
    ...bodyTypes.map((t) => ({
      label: t.charAt(0).toUpperCase() + t.slice(1),
      value: { kind: 'bodyType', value: t } as SpecialsFilter,
    })),
  ]

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
    <>
      {showTypeFilters && (
        <div
          role="group"
          aria-label="Filter deals"
          className="mb-8 flex flex-wrap gap-2"
        >
          {chips.map((chip) => {
            const active = sameFilter(filter, chip.value)
            return (
              <button
                key={chip.label}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(chip.value)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
                  active
                    ? 'border-amber-500 bg-amber-500 text-gray-950'
                    : 'border-gray-400 bg-white text-gray-800 hover:border-gray-900'
                }`}
              >
                {chip.label}
              </button>
            )
          })}
        </div>
      )}
      {showTypeFilters && !hasVehicles && !hasSpares && (
        <div className="rounded-lg bg-white py-12 text-center shadow-sm">
          <p className="mb-4 text-lg text-gray-700">No deals match this filter.</p>
          <button
            type="button"
            onClick={() => setFilter({ kind: 'all' })}
            className="rounded-full border border-amber-500 bg-amber-500 px-4 py-2 text-sm font-semibold text-gray-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
          >
            Show all deals
          </button>
        </div>
      )}
    <div className="space-y-16">
      {hasVehicles && (
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <Link href={`/inventory/${vehicle.slug}`} key={vehicle.slug} prefetch={false}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image
                      src={ikCard(vehicle.images?.[0]?.url || '/placeholder-truck.svg')}
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    {vehicle.specialCampaign === 'black-friday' ? (
                      <BlackFridayTag className="absolute top-2 right-2" />
                    ) : (
                      <Badge className="absolute top-2 right-2 bg-red-600">
                        SPECIAL
                      </Badge>
                    )}
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
                            R{formatNumber(vehicle.vatPrice)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">NOW</p>
                          <p className="text-2xl font-bold text-green-600">
                            R{formatNumber(vehicle.specialPrice)}
                          </p>
                        </div>
                      </div>
                      {vehicle.specialCampaign === 'black-friday' &&
                        vehicle.vatPrice > vehicle.specialPrice && (
                          <p className="mt-1 text-sm font-bold text-red-600">
                            Save R{formatNumber(vehicle.vatPrice - vehicle.specialPrice)}
                          </p>
                        )}
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
                      src={ikCard(spare.images?.[0]?.url || '/placeholder-truck.svg')}
                      alt={spare.name}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    {spare.specialCampaign === 'black-friday' ? (
                      <BlackFridayTag className="absolute top-2 right-2" />
                    ) : (
                      <Badge className="absolute top-2 right-2 bg-red-600">
                        SPECIAL
                      </Badge>
                    )}
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
                            R{formatNumber(spare.price)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">NOW</p>
                          <p className="text-2xl font-bold text-green-600">
                            R{formatNumber(spare.specialPrice)}
                          </p>
                        </div>
                      </div>
                      {spare.specialCampaign === 'black-friday' &&
                        getSavingsPercent(spare.price, spare.specialPrice) > 0 && (
                          <p className="mt-1 text-sm font-bold text-red-600">
                            Save {getSavingsPercent(spare.price, spare.specialPrice)}%
                          </p>
                        )}
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
    </>
  )
}
