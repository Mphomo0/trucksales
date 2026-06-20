export const revalidate = 86400

import JsonLd from '@/components/global/JsonLd'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: { absolute: 'Used UD Trucks for Sale | A-Z Truck Sales' },
  description:
    'Browse used UD Trucks for sale in Gauteng. Condor, Croner & medium-duty trucks. Visit our Alberton or Boksburg branch.',
  alternates: { canonical: 'https://www.a-ztrucksales.com/brands/ud-trucks' },
  openGraph: {
    title: 'Used UD Trucks for Sale | A-Z Truck Sales',
    description: 'Shop used UD Trucks in Gauteng. Condor and Croner models.',
    url: 'https://www.a-ztrucksales.com/brands/ud-trucks',
    siteName: 'A-Z Truck Sales',
    images: [
      {
        url: 'https://www.a-ztrucksales.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Used UD Trucks for Sale - A-Z Truck Sales',
      },
    ],
    locale: 'en_ZA',
    type: 'website',
  },
}

const faqs = [
  {
    question: 'Does A-Z Truck Sales sell used UD Trucks?',
    answer:
      'Yes, we stock used UD Trucks including Condor and Croner models. UD Trucks are known for their durability, powerful engines and suitability for medium- to heavy-duty transport.',
  },
  {
    question: 'What UD truck models do you sell?',
    answer:
      'We sell used UD Condor (medium-duty) trucks with various body configurations including dropside, box body, refrigerated and curtain side.',
  },
  {
    question: 'Why buy a used UD truck from A-Z?',
    answer:
      'UD Trucks offer excellent value in the medium-duty segment. Known for robust engines and reliable drivetrains, they are a popular choice for owner-drivers and small fleet operators.',
  },
  {
    question: 'Are UD truck spares available in South Africa?',
    answer:
      'Yes, UD Trucks has a solid parts distribution network in South Africa. We also stock common UD spares at our branches for service items.',
  },
  {
    question: 'Where can I view UD trucks in Gauteng?',
    answer:
      'Visit our Alberton or Boksburg branch by appointment. Call or WhatsApp us to arrange a viewing.',
  },
]

const getUdVehicles = unstable_cache(
  () =>
    prisma.inventory.findMany({
      where: { make: { contains: 'UD', mode: 'insensitive' } },
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
  ['ud-brand-vehicles'],
  { tags: ['inventory'], revalidate: 86400 }
)

export default async function UdTrucksPage() {
  const vehicles = await getUdVehicles()

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
        name: 'Used UD Trucks',
        item: 'https://www.a-ztrucksales.com/brands/ud-trucks',
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
            Used UD Trucks for Sale in Gauteng
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Browse our range of used UD Trucks including Condor models. Every
            vehicle is available for viewing at our Alberton or Boksburg branch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/inventory?make=UD`}
              className="inline-flex items-center justify-center px-8 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
            >
              View All UD Trucks
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
                UD Trucks — Built for Heavy Work
              </h2>
              <div className="text-lg text-gray-600 space-y-4">
                <p>
                  UD Trucks (formerly Nissan Diesel) has a strong reputation in
                  South Africa for durable, powerful trucks that handle tough
                  working conditions. The Condor range is especially popular for
                  medium-duty transport, construction and bulk delivery.
                </p>
                <p>
                  Known for their robust engines and reliable drivetrains, UD
                  Trucks offer excellent value in the used truck market. They
                  are a popular choice for owner-drivers and small fleet
                  operators who need a dependable workhorse.
                </p>
                <p>
                  Known for their robust engines and reliable drivetrains, UD
                  Trucks offer excellent value in the used truck market. They
                  are a popular choice for owner-drivers and small fleet
                  operators who need a dependable workhorse.
                </p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Why Choose a UD Truck?
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Robust and
                  reliable engines
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Good value
                  in the used market
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Suitable
                  for medium- to heavy-duty work
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Strong
                  parts availability through UD network
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Durable
                  drivetrains for tough conditions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Used UD Trucks in Stock
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Recently added UD Trucks available at our Gauteng branches.
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
              No UD trucks currently in stock. Check back soon or contact us.
            </p>
          )}
          <div className="text-center mt-8">
            <Link
              href={`/inventory?make=UD`}
              className="inline-flex items-center justify-center px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
            >
              View All UD Trucks
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              UD Trucks — FAQ
            </h2>
            <p className="text-lg text-gray-600 mb-8 text-center">
              Common questions about buying used UD Trucks from A-Z Truck Sales.
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
            Looking for a Used UD Truck?
          </h2>
          <p className="text-xl mb-8">
            Contact our team to discuss your UD truck needs or book a viewing.
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
