export const revalidate = 86400

import JsonLd from '@/components/global/JsonLd'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: { absolute: 'Used Hino Trucks for Sale | A-Z Truck Sales' },
  description:
    'Browse used Hino trucks for sale in Gauteng. 300-Series, 500-Series & FC trucks. Visit our Alberton or Boksburg branch.',
  alternates: { canonical: 'https://www.a-ztrucksales.com/brands/hino' },
  openGraph: {
    title: 'Used Hino Trucks for Sale | A-Z Truck Sales',
    description:
      'Shop used Hino trucks in Gauteng. 300-Series, 500-Series and FC.',
    url: 'https://www.a-ztrucksales.com/brands/hino',
    siteName: 'A-Z Truck Sales',
    images: [
      {
        url: 'https://www.a-ztrucksales.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Used Hino Trucks for Sale - A-Z Truck Sales',
      },
    ],
    locale: 'en_ZA',
    type: 'website',
  },
}

const faqs = [
  {
    question: 'Does A-Z Truck Sales sell used Hino trucks?',
    answer:
      'Yes, we stock used Hino trucks including the 300-Series, 500-Series and FC models. Hino is one of our key brands due to its reputation for reliability and strong dealer support in South Africa.',
  },
  {
    question: 'What Hino truck models do you sell?',
    answer:
      'We sell used Hino 300-Series (ranging from 3.5 to 8.5 tons GVM) and 500-Series (8.5 to 18 tons GVM) in dropside, box body, refrigerated and curtain side configurations.',
  },
  {
    question: 'Why buy a used Hino truck from A-Z?',
    answer:
      'Our team knows the Hino range and can help you choose the right model for delivery, distribution or fleet work. Hino trucks offer excellent fuel economy, proven Japanese reliability and low operating costs.',
  },
  {
    question: 'Are Hino truck spares easy to find in South Africa?',
    answer:
      'Yes, Hino has a strong dealer network and parts availability across SA. We also stock common Hino spares at our branches.',
  },
  {
    question: 'Can I test drive a Hino truck at your branch?',
    answer:
      'Visits are by appointment. Contact us to arrange a viewing and test drive at our Alberton or Boksburg branch.',
  },
]

const getHinoVehicles = unstable_cache(
  () =>
    prisma.inventory.findMany({
      where: { make: { contains: 'Hino', mode: 'insensitive' } },
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
  ['hino-brand-vehicles'],
  { tags: ['inventory'], revalidate: 86400 }
)

export default async function HinoPage() {
  const vehicles = await getHinoVehicles()

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
        name: 'Used Hino Trucks',
        item: 'https://www.a-ztrucksales.com/brands/hino',
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
            Used Hino Trucks for Sale in Gauteng
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Browse our range of used Hino 300-Series and 500-Series rigid
            trucks. Every vehicle is available for viewing at our Alberton or
            Boksburg branch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/inventory?make=Hino`}
              className="inline-flex items-center justify-center px-8 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
            >
              View All Hino Trucks
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

      {/* About Hino */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Hino Trucks — Japanese Reliability for South African Roads
              </h2>
              <div className="text-lg text-gray-600 space-y-4">
                <p>
                  Hino is one of Japan&rsquo;s leading commercial vehicle
                  manufacturers with a strong presence in South Africa. Known
                  for reliable engines, low operating costs and excellent parts
                  availability, Hino trucks are a top choice for delivery,
                  distribution and light-to-medium duty transport.
                </p>
                <p>
                  The 300-Series range covers 3.5 to 8.5 tons GVM and is ideal
                  for city delivery, retail distribution and service vehicles.
                  The 500-Series covers 8.5 to 18 tons GVM and handles
                  medium-duty route work, refrigerated transport and bulk
                  delivery.
                </p>
                <p>
                  The 300-Series range covers 3.5 to 8.5 tons GVM and is ideal
                  for city delivery, retail distribution and service vehicles.
                  The 500-Series covers 8.5 to 18 tons GVM and handles
                  medium-duty route work, refrigerated transport and bulk
                  delivery.
                </p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Why Choose a Hino Truck?
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Excellent
                  fuel economy
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Proven
                  Japanese engineering and reliability
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Low
                  operating and maintenance costs
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Wide range
                  of body configurations available
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Strong
                  dealer and service network in SA
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Good
                  resale value
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stock */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Used Hino Trucks in Stock
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Recently added Hino trucks available at our Gauteng branches.
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
              No Hino trucks currently in stock. Check back soon or contact us.
            </p>
          )}
          <div className="text-center mt-8">
            <Link
              href={`/inventory?make=Hino`}
              className="inline-flex items-center justify-center px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
            >
              View All Hino Trucks
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Hino Trucks — FAQ
            </h2>
            <p className="text-lg text-gray-600 mb-8 text-center">
              Common questions about buying used Hino trucks from A-Z Truck
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

      {/* CTA */}
      <section className="py-20 bg-linear-to-r from-amber-600 to-yellow-300 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Looking for a Used Hino Truck?
          </h2>
          <p className="text-xl mb-8">
            Contact our team to discuss your Hino truck needs or book a viewing.
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
