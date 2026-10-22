/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  Phone,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Star,
} from 'lucide-react'
import Link from 'next/link'
import { WhatsAppButton } from '@/components/sections/inventorySection/WhatsAppButton'
import TruckGallery from '@/components/sections/inventorySection/TruckGallery'
import TruckPrice from '@/components/sections/inventorySection/TruckPrice'
import EnquiryDialog from '@/components/sections/inventorySection/EnquiryDialog'
import { REVIEW_COUNT, REVIEW_RATING } from '@/lib/reviews'
import { formatDisplayName } from '@/lib/text'
import { formatNumber } from '@/lib/format'

// Server component: the copy, spec list and use-case map render to HTML only.
// The gallery, live price and enquiry dialog are the client islands.

const YOUTUBE_REGEXP =
  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/

function getVideoLinkUrl(link: unknown): string | null {
  if (!link) return null
  if (typeof link === 'string') return link.trim() || null
  if (typeof link === 'object' && link !== null && 'url' in link)
    return (link as { url: string }).url?.trim() || null
  return null
}

function convertYouTubeLink(url: string): string {
  const match = url.match(YOUTUBE_REGEXP)
  return match ? `https://www.youtube.com/embed/${match[1]}` : url
}

const USE_CASES: Record<string, string> = {
  'dropside truck': 'builders, hardware suppliers, construction companies, local deliveries and businesses that need easy side loading.',
  'refrigerated body': 'food distribution, meat suppliers, frozen goods, catering, retail delivery and cold-chain logistics.',
  'insulated body': 'food distribution, meat suppliers, frozen goods, catering, retail delivery and cold-chain logistics.',
  'box truck': 'furniture transport, courier work, parcel delivery, retail stock and protected cargo.',
  'curtain side truck': 'palletised goods, warehouse deliveries and businesses that need faster side loading.',
  'chassis cab': 'businesses that want to fit a custom body for their specific operation.',
  flatbed: 'construction, building materials, steel transport and general heavy loads.',
  'tipper truck': 'construction, mining, earthmoving, waste removal and bulk material transport.',
  'crane truck': 'construction sites, equipment delivery and loads requiring self-loading capability.',
  hooklift: 'skip bin transport, waste management and interchangeable container systems.',
  tanker: 'liquid transport, including fuel, water, chemicals and bulk fluids.',
  'volume body': 'high-volume, low-weight loads including parcel delivery, furniture moving and courier services.',
  'truck tractor': 'long-haul transport, trailer towing and heavy freight operations.',
  'roll back': 'vehicle recovery, towing and transport of disabled vehicles.',
  'bower truck': 'utility maintenance, electrical work and elevated access applications.',
  'cherry picker truck': 'elevated work, maintenance and access applications.',
  'cattle body': 'livestock transport, including cattle, sheep and other farm animals.',
  'skip loader': 'waste management, skip bin transport and construction site cleanup.',
  'fire fighting unit': 'emergency response, firefighting and rescue operations.',
  'honey sucker': 'waste removal, septic tank cleaning and industrial liquid waste management.',
  cage: 'secure transport of goods, tools and equipment requiring enclosed storage.',
  'mass side': 'heavy bulk transport, including mining, construction and aggregate materials.',
  'other specialized': 'specialized commercial applications.',
}

interface VehicleImage {
  url: string
  fileId?: string
}

interface Vehicle {
  id: string
  name: string
  make: string
  model: string
  year: number
  vatPrice: number
  pricenoVat: number
  mileage: number | null
  fuelType: string | null
  condition: string
  transmission: string | null
  description: string
  slug: string
  images: { url: string }[]
  videoLink?: string | null
  truckSize?: string | null
  bodyType?: string | null
  specialPrice?: number | null
  specialValidFrom?: Date | string | null
  specialValidTo?: Date | string | null
}

interface Props {
  vehicle: Vehicle
}

/* <h1>A-Z Truck Sales Components</h1> */ export default function TruckDetail({
  vehicle,
}: Props) {
  const videoLinkUrl = getVideoLinkUrl(vehicle.videoLink)
  const altBase = `${vehicle.year} ${formatDisplayName(vehicle.make)} ${formatDisplayName(vehicle.model)}${vehicle.bodyType ? ` ${vehicle.bodyType}` : ''}`
  const bodyType = (vehicle.bodyType ?? '').toLowerCase().trim()
  const useCase = USE_CASES[bodyType] || 'reliable commercial transport for their daily operations.'

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button asChild variant="outline">
            <Link href="/inventory">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Inventory
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="mb-8">
              <TruckGallery images={vehicle.images} altBase={altBase} />

              {/* Video Link */}
              {videoLinkUrl && (
                <div className="mt-4">
                  <p className="text-lg font-semibold mb-2">Vehicle Video</p>
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={convertYouTubeLink(videoLinkUrl)}
                      title={`${altBase} video walkaround`}
                      className="w-full h-64 md:h-96 rounded-lg shadow-lg border"
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
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
                    <h1 className="font-semibold leading-tight tracking-tight text-2xl md:text-3xl text-balance">
                      {vehicle.year} {formatDisplayName(vehicle.make)}{' '}
                      {formatDisplayName(vehicle.model)}
                      {vehicle.mileage
                        ? ` — ${Math.round(vehicle.mileage / 1000)}k km`
                        : ''}
                    </h1>
                  </div>
                  <Badge className="bg-amber-600">{vehicle.condition}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Year</p>
                      <p className="font-semibold">{vehicle.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Mileage</p>
                      <p className="font-semibold">
                        {vehicle.mileage != null ? `${formatNumber(vehicle.mileage)} km` : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Fuel Type</p>
                      <p className="font-semibold">{vehicle.fuelType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Transmission</p>
                      <p className="font-semibold">{vehicle.transmission}</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h2 className="text-lg font-semibold mb-4">
                    About this {vehicle.year}{' '}
                    {formatDisplayName(vehicle.make)}{' '}
                    {formatDisplayName(vehicle.model)}
                  </h2>

                  {/* Auto-generated intro */}
                  <p className="text-gray-600 leading-relaxed mb-4">
                    This {vehicle.year} {formatDisplayName(vehicle.make)} {formatDisplayName(vehicle.model)} is a used {vehicle.truckSize ? `${vehicle.truckSize} ` : ''}{vehicle.bodyType ? `${vehicle.bodyType} ` : ''}available from A-Z Truck Sales in Gauteng. It has {formatNumber(vehicle.mileage ?? 0)} km, a {vehicle.fuelType?.toLowerCase() ?? 'diesel'} engine and {vehicle.transmission?.toLowerCase() ?? 'manual'} transmission.
                  </p>

                  {/* Auto-generated suitable-for + stored description */}
                  <p className="text-gray-600 leading-relaxed mb-4">
                    This truck may be suitable for businesses needing {useCase} Contact our team to confirm current availability, viewing location, COF status and final pricing.
                  </p>

                  {/* Stored description (workshop/unique text) */}
                  {vehicle.description && (
                    <div className="text-gray-600 leading-relaxed whitespace-pre-wrap mb-4">
                      {vehicle.description}
                    </div>
                  )}

                  {/* Key details */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Key details:</h3>
                    <ul className="text-gray-600 space-y-1">
                      <li><span className="font-medium">Make:</span> {formatDisplayName(vehicle.make)}</li>
                      <li><span className="font-medium">Model:</span> {formatDisplayName(vehicle.model)}</li>
                      <li><span className="font-medium">Year:</span> {vehicle.year}</li>
                      <li><span className="font-medium">Mileage:</span> {vehicle.mileage != null ? `${formatNumber(vehicle.mileage)} km` : 'N/A'}</li>
                      <li><span className="font-medium">Fuel type:</span> {vehicle.fuelType?.toLowerCase() ?? 'diesel'}</li>
                      <li><span className="font-medium">Transmission:</span> {vehicle.transmission?.toLowerCase() ?? 'manual'}</li>
                      <li><span className="font-medium">Body type:</span> {vehicle.bodyType ? formatDisplayName(vehicle.bodyType) : ''}</li>
                      <li><span className="font-medium">Truck size:</span> {vehicle.truckSize || 'N/A'}</li>
                      <li><span className="font-medium">Price incl. VAT:</span> R{formatNumber(vehicle.vatPrice)}</li>
                      <li><span className="font-medium">Price excl. VAT:</span> R{formatNumber(vehicle.pricenoVat)}</li>
                    </ul>
                  </div>

                  {/* CTA */}
                  <p className="text-gray-600 leading-relaxed">
                    To enquire, call A-Z Truck Sales on 011 902 6071 or use the WhatsApp enquiry button.
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
                <TruckPrice
                  vatPrice={vehicle.vatPrice}
                  pricenoVat={vehicle.pricenoVat}
                  specialPrice={vehicle.specialPrice ?? null}
                  specialValidFrom={vehicle.specialValidFrom ?? null}
                  specialValidTo={vehicle.specialValidTo ?? null}
                />
              </CardHeader>
              <CardContent className="space-y-4">
                <WhatsAppButton vehicleSlug={vehicle.slug} />
                <EnquiryDialog vehicleSlug={vehicle.slug} />
                <Button asChild className="w-full py-4" size="lg">
                  <a href="tel:+27119026071">
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
                  <div className="flex" aria-hidden="true">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 fill-yellow-500 text-yellow-500"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {REVIEW_RATING} out of 5 ({REVIEW_COUNT} reviews)
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Highly rated dealer with excellent customer service and
                  quality vehicles.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
