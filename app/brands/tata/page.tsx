export const revalidate = 86400

import JsonLd from '@/components/global/JsonLd'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: { absolute: 'Used Tata Trucks for Sale | A-Z Truck Sales' },
  description:
    'Browse used Tata trucks for sale in Gauteng. Tata LPT 709, 912, 1615 & more. Quality used rigid trucks. Visit our Alberton or Boksburg branch.',
  alternates: { canonical: 'https://www.a-ztrucksales.com/brands/tata' },
  openGraph: {
    title: 'Used Tata Trucks for Sale | A-Z Truck Sales',
    description:
      'Shop used Tata trucks in Gauteng. Quality used rigid trucks available at our Alberton or Boksburg branches.',
    url: 'https://www.a-ztrucksales.com/brands/tata',
    siteName: 'A-Z Truck Sales',
    images: [
      {
        url: 'https://www.a-ztrucksales.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Used Tata Trucks for Sale - A-Z Truck Sales',
      },
    ],
    locale: 'en_ZA',
    type: 'website',
  },
}

const faqs = [
  {
    question: 'Does A-Z Truck Sales sell used Tata trucks?',
    answer:
      'Yes, we stock used Tata trucks including LPT and other models. Tata offers good value in the light- to medium-duty truck segment with competitive pricing and strong parts availability.',
  },
  {
    question: 'What Tata truck models do you sell?',
    answer:
      'We sell used Tata rigid trucks in dropside, box body and other configurations suitable for light- to medium-duty transport.',
  },
  {
    question: 'Why buy a used Tata truck from A-Z?',
    answer:
      'Tata trucks offer excellent value, solid build quality and good parts availability in South Africa. Our team can help you find the right model for your payload and budget.',
  },
  {
    question: 'Are Tata truck spares available in South Africa?',
    answer:
      'Yes, Tata has a growing dealer and parts network in South Africa with good availability for common service items.',
  },
]

const getTataVehicles = unstable_cache(
  () =>
    prisma.inventory.findMany({
      where: { make: { contains: 'Tata', mode: 'insensitive' } },
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        year: true,
        vatPrice: true,
        mileage: true,
        fuelType: true,
        transmission: true,
        images: true,
        slug: true,
      },
    }),
  ['tata-brand-vehicles'],
  { tags: ['inventory'], revalidate: 86400 }
)

export default async function TataPage() {
  const vehicles = await getTataVehicles()

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
        name: 'Used Tata Trucks',
        item: 'https://www.a-ztrucksales.com/brands/tata',
      },
    ],
  }
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      <section className="bg-linear-to-r from-gray-900 to-gray-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Used Tata Trucks for Sale in Gauteng
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Browse our range of used Tata rigid trucks. Every vehicle is
            available for viewing at our Alberton or Boksburg branch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/inventory?make=Tata`}
              className="inline-flex items-center justify-center px-8 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
            >
              View All Tata Trucks
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Enquire Now
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Tata Trucks — Value-Driven Commercial Transport
              </h2>
              <div className="text-lg text-gray-600 space-y-4">
                <p>
                  Tata Motors is one of India&rsquo;s largest commercial vehicle
                  manufacturers with a growing presence in South Africa. Tata
                  trucks are known for competitive pricing, solid build quality
                  and good parts availability.
                </p>
                <p>
                  The Tata LPT range covers light- to medium-duty transport
                  needs including dropside, box body and chassis cab
                  configurations. Tata offers strong value for budget-conscious
                  buyers.
                </p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Why Choose a Tata Truck?
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span>{' '}
                  Competitive pricing and good value
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Solid
                  build quality
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Growing SA
                  dealer and parts network
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Suitable
                  for light- to medium-duty work
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Used Tata Trucks in Stock
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Recently added Tata trucks available at our Gauteng branches.
          </p>
          {vehicles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((truck, i) => (
                <Link
                  key={truck.id}
                  href={`/inventory/${truck.slug}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
                >
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    {(truck.images as any[])?.[0]?.url && (
                      <Image
                        src={(truck.images as any[])[0].url}
                        alt={`${truck.year} ${truck.name}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                        priority={i === 0}
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
              No Tata trucks currently in stock. Check back soon or contact us.
            </p>
          )}
          <div className="text-center mt-8">
            <Link
              href={`/inventory?make=Tata`}
              className="inline-flex items-center justify-center px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
            >
              View All Tata Trucks
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Tata Trucks — FAQ
            </h2>
            <p className="text-lg text-gray-600 mb-8 text-center">
              Common questions about buying used Tata trucks from A-Z Truck
              Sales.
            </p>
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="bg-white rounded-lg mb-4 border border-neutral-200 p-6"
              >
                <summary className="font-semibold text-gray-900 cursor-pointer">
                  {faq.question}
                </summary>
                <p className="mt-4 text-gray-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-linear-to-r from-amber-600 to-yellow-300 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Looking for a Used Tata Truck?
          </h2>
          <p className="text-xl mb-8">
            Contact our team to discuss your Tata truck needs or book a viewing.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            Contact Our Team
          </Link>
        </div>
      </section>
    </>
  )
}
