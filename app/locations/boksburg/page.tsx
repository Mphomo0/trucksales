export const revalidate = 86400

import JsonLd from '@/components/global/JsonLd'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ikCard } from '@/lib/imagekit'
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import DealerFaqBlock from '@/components/sections/shared/DealerFaqBlock'

export const metadata: Metadata = {
  title: { absolute: 'Used Trucks for Sale in Boksburg | A-Z Truck Sales' },
  description:
    'Visit A-Z Truck Sales in Boksburg, Gauteng for quality used rigid trucks. Isuzu, Hino, Fuso, UD & more. 25+ years experience, 100+ trucks in stock.',
  alternates: { canonical: 'https://www.a-ztrucksales.com/locations/boksburg' },
  openGraph: {
    title: 'Used Trucks for Sale in Boksburg | A-Z Truck Sales',
    description:
      'Boksburg truck dealer with 25+ years experience. Browse 100+ used rigid trucks from Isuzu, Hino, Fuso, UD and more at our Boksburg branch.',
    url: 'https://www.a-ztrucksales.com/locations/boksburg',
    siteName: 'A-Z Truck Sales',
    images: [
      {
        url: 'https://www.a-ztrucksales.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'A-Z Truck Sales Boksburg - Used Commercial Vehicles',
      },
    ],
    locale: 'en_ZA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Used Trucks for Sale in Boksburg | A-Z Truck Sales',
    description:
      'Boksburg truck dealer with 25+ years experience. Browse 100+ used rigid trucks from Isuzu, Hino, Fuso, UD and more at our Boksburg branch.',
    images: ['https://www.a-ztrucksales.com/og-image.webp'],
  },
}


const getBoksburgVehicles = unstable_cache(
  async () => prisma.inventory.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      make: true,
      model: true,
      year: true,
      vatPrice: true,
      mileage: true,
      fuelType: true,
      transmission: true,
      images: true,
      slug: true,
      specialPrice: true,
    },
  }),
  ['boksburg-latest-vehicles'],
  { revalidate: 86400, tags: ['inventory'] }
)

export default async function BoksburgPage() {
  const vehicles = await getBoksburgVehicles()

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.a-ztrucksales.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Boksburg Truck Dealer',
        item: 'https://www.a-ztrucksales.com/locations/boksburg',
      },
    ],
  }
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://www.a-ztrucksales.com/locations/boksburg#branch',
    name: 'A-Z Truck Sales — Boksburg',
    parentOrganization: { '@id': 'https://www.a-ztrucksales.com/#org' },
    image: 'https://www.a-ztrucksales.com/og-image.webp',
    url: 'https://www.a-ztrucksales.com/locations/boksburg',
    hasMap: 'https://www.google.com/maps/search/?api=1&query=-26.1711,28.2414',
    telephone: '+27832345377',
    email: 'aztruckboks@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Corner Trichardts Road & Ravenswood Street',
      addressLocality: 'Ravenswood',
      addressRegion: 'Gauteng',
      postalCode: '1451',
      addressCountry: 'ZA',
    },
    geo: { '@type': 'GeoCoordinates', latitude: -26.1711, longitude: 28.2414 },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:00',
      },
    ],
    areaServed: 'Gauteng, South Africa',
  }
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={localBusinessSchema} />

      {/* Hero */}
      <section className="bg-linear-to-r from-gray-900 to-gray-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Used Trucks for Sale in Boksburg
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Boksburg truck dealer with 25+ years of experience. Browse 100+
            quality used rigid trucks from 1.5 to 35 tons at our Ravenswood
            branch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/inventory"
              className="inline-flex items-center justify-center px-8 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
            >
              Browse Inventory
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* About Boksburg Branch */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Boksburg Truck Dealer — Serving the East Rand since 1999
              </h2>
              <div className="text-lg text-gray-600 space-y-4">
                <p>
                  A-Z Truck Sales serves Boksburg and the greater East Rand from
                  our Boksburg branch at Corner Trichardts Road and Ravenswood
                  Street in Ravenswood. We are a trusted used truck dealership
                  specializing in pre-owned rigid commercial vehicles from 1.5
                  to 35 tons.
                </p>
                <p>
                  Boksburg is a key transport and logistics hub in Gauteng.
                  Whether you are a fleet owner, contractor, logistics operator
                  or owner-driver, our Boksburg team can help you find a
                  reliable used truck that matches your payload needs, route
                  requirements and budget.
                </p>
                <p>
                  We stock Isuzu, Hino, Fuso, UD, MAN, Mercedes-Benz, Toyota,
                  Nissan and other commercial vehicle brands. We also carry
                  truck spares at our Boksburg branch.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-3xl font-bold text-amber-500">100+</div>
                  <div className="text-gray-600">Trucks in Stock</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-3xl font-bold text-amber-500">25+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-3xl font-bold text-amber-500">245+</div>
                  <div className="text-gray-600">Verified Reviews</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-3xl font-bold text-amber-500">2</div>
                  <div className="text-gray-600">Gauteng Branches</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Visit Our Boksburg Branch
              </h3>
              <div className="text-gray-600 space-y-3">
                <p>
                  <strong>Address:</strong> Corner Trichardts Road and
                  Ravenswood Street, Ravenswood, Boksburg, 1451
                </p>
                <p>
                  <strong>Phone:</strong>{' '}
                  <a
                    href="tel:+27832345377"
                    className="text-amber-600 hover:underline"
                  >
                    083 234 5377
                  </a>
                </p>
                <p>
                  <strong>Email:</strong>{' '}
                  <a
                    href="mailto:aztruckboks@gmail.com"
                    className="text-amber-600 hover:underline"
                  >
                    aztruckboks@gmail.com
                  </a>
                </p>
                <p>
                  <strong>Hours:</strong> Monday-Friday 8:00 AM - 5:00 PM
                </p>
                <p>
                  <strong>Services:</strong> Used truck sales, truck spares,
                  trade-ins, vehicle viewing
                </p>
                <p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=-26.1711,28.2414"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:underline font-semibold"
                  >
                    View us on Google Maps →
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Trucks */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Latest Used Trucks Available in Boksburg
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Recently added stock available at our Boksburg branch.
          </p>
          {vehicles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((truck) => (
                <Link
                  key={truck.id}
                  href={`/inventory/${truck.slug}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
                >
                  <div className="aspect-video bg-gray-200 relative">
                    {(truck.images as { url: string }[])?.[0]?.url && (
                      <Image
                        src={ikCard((truck.images as { url: string }[])[0].url)}
                        alt={`${truck.year} ${truck.name}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">
                      {truck.year} {truck.name}
                    </h3>
                    <p className="text-amber-600 font-bold text-lg">
                      {truck.vatPrice
                        ? `R${truck.vatPrice.toLocaleString()}`
                        : 'Call for price'}
                    </p>
                    <div className="flex gap-2 mt-2 text-sm text-gray-500">
                      <span>{truck.mileage?.toLocaleString() ?? '-'} km</span>
                      <span>|</span>
                      <span>{truck.fuelType ?? '-'}</span>
                      <span>|</span>
                      <span>{truck.transmission ?? '-'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No trucks currently listed. Check back soon or contact us.
            </p>
          )}
          <div className="text-center mt-8">
            <Link
              href="/inventory"
              className="inline-flex items-center justify-center px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
            >
              View All Trucks
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose A-Z Boksburg */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Why Choose A-Z Truck Sales in Boksburg?
          </h2>
          <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            Boksburg and East Rand businesses choose A-Z for quality trucks and
            reliable service.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Convenient Boksburg Location
              </h3>
              <p className="text-gray-600">
                Our Ravenswood branch is easily accessible from the R21, N12 and
                N17 — ideal for Boksburg, Brakpan, Springs and East Rand buyers.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                100+ Trucks Available
              </h3>
              <p className="text-gray-600">
                Access our full inventory of 100+ used rigid trucks from both
                branches. If it is on our website, it is available to Boksburg
                buyers.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Truck Spares in Boksburg
              </h3>
              <p className="text-gray-600">
                Our Boksburg branch stocks truck spares for Isuzu, Hino, UD,
                Nissan and Mercedes-Benz — helping Boksburg fleets reduce
                downtime.
              </p>
            </div>
          </div>
        </div>
      </section>

      <DealerFaqBlock
        heading="Frequently Asked Questions About Truck Sales in Boksburg"
        withSchema
      />

      {/* CTA */}
      <section className="py-20 bg-linear-to-r from-amber-600 to-yellow-300 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Looking for a Used Truck in Boksburg?
          </h2>
          <p className="text-xl mb-8">
            Visit our Boksburg branch at Ravenswood or call us to speak with our
            team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Contact Our Team
            </Link>
            <Link
              href="/inventory"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition"
            >
              Browse Inventory
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
