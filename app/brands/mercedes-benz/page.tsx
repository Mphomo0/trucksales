export const revalidate = 86400

import JsonLd from '@/components/global/JsonLd'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: { absolute: 'Used Mercedes-Benz Trucks for Sale | A-Z Truck Sales' },
  description:
    'Browse used Mercedes-Benz trucks for sale in Gauteng. Atego, Axor & more. Visit our Alberton or Boksburg branch.',
  alternates: {
    canonical: 'https://www.a-ztrucksales.com/brands/mercedes-benz',
  },
  openGraph: {
    title: 'Used Mercedes-Benz Trucks for Sale | A-Z Truck Sales',
    description:
      'Shop used Mercedes-Benz trucks in Gauteng. Atego, Axor and more.',
    url: 'https://www.a-ztrucksales.com/brands/mercedes-benz',
    siteName: 'A-Z Truck Sales',
    images: [
      {
        url: 'https://www.a-ztrucksales.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Used Mercedes-Benz Trucks for Sale - A-Z Truck Sales',
      },
    ],
    locale: 'en_ZA',
    type: 'website',
  },
}

const faqs = [
  {
    question: 'Does A-Z Truck Sales sell used Mercedes-Benz trucks?',
    answer:
      'Yes, we stock used Mercedes-Benz trucks including Atego and Axor models. Mercedes-Benz is a premium European brand valued for engineering, comfort and long-distance capability.',
  },
  {
    question: 'What Mercedes-Benz truck models do you sell?',
    answer:
      'We sell used Mercedes-Benz Atego (light- to medium-duty) and Axor (medium- to heavy-duty) rigid trucks in dropside, box body, refrigerated and curtain side configurations.',
  },
  {
    question: 'Why buy a used Mercedes-Benz truck from A-Z?',
    answer:
      'Mercedes-Benz trucks offer premium build quality, excellent driver comfort and strong resale value. They excel in long-distance and highway transport with robust drivetrains.',
  },
  {
    question: 'Are Mercedes-Benz truck spares available in South Africa?',
    answer:
      'Yes, Mercedes-Benz has an extensive dealer and parts network across South Africa. Parts availability is good, especially for popular models like the Atego and Axor.',
  },
  {
    question: 'Are Mercedes-Benz trucks good for long-distance transport?',
    answer:
      'Yes, Mercedes-Benz trucks excel in long-distance and highway transport. They offer excellent cab comfort, fuel-efficient engines and robust drivetrains for cross-country routes.',
  },
]

export default async function MercedesBenzPage() {
  const vehicles = await prisma.inventory.findMany({
    where: { make: { contains: 'Mercedes', mode: 'insensitive' } },
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
  })

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
        name: 'Used Mercedes-Benz Trucks',
        item: 'https://www.a-ztrucksales.com/brands/mercedes-benz',
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
            Used Mercedes-Benz Trucks for Sale in Gauteng
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Browse our range of used Mercedes-Benz Atego and Axor rigid trucks.
            Every vehicle is available for viewing at our Alberton or Boksburg
            branch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/inventory?make=Mercedes`}
              className="inline-flex items-center justify-center px-8 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
            >
              View All Mercedes-Benz Trucks
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
                Mercedes-Benz Trucks — Premium Engineering for Commercial
                Transport
              </h2>
              <div className="text-lg text-gray-600 space-y-4">
                <p>
                  Mercedes-Benz is one of the world's most recognised commercial
                  vehicle brands, known for engineering excellence, driver
                  comfort and advanced technology. In South Africa,
                  Mercedes-Benz trucks are a popular choice for premium
                  transport operations.
                </p>
                <p>
                  The Atego range covers light- to medium-duty work from 7.5 to
                  16 tons, making it ideal for distribution, refrigerated
                  transport and municipal applications. The Axor range handles
                  heavier work and long-distance routes.
                </p>
                <p>
                  The Atego range covers light- to medium-duty work from 7.5 to
                  16 tons, making it ideal for distribution, refrigerated
                  transport and municipal applications. The Axor range handles
                  heavier work and long-distance routes.
                </p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Why Choose a Mercedes-Benz Truck?
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Premium
                  build quality and engineering
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Excellent
                  driver comfort and cab features
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Advanced
                  safety and technology systems
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Good
                  long-distance and highway performance
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Strong
                  resale value in the used market
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Extensive
                  SA dealer and parts network
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Used Mercedes-Benz Trucks in Stock
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Recently added Mercedes-Benz trucks available at our Gauteng
            branches.
          </p>
          {vehicles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((truck) => (
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
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">
                      {truck.year} {truck.name}
                    </h3>
                    <p className="text-amber-600 font-bold text-lg">
                      {truck.vatPrice
                        ? `R${(truck.vatPrice / 100).toLocaleString()}`
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
              No Mercedes-Benz trucks currently in stock. Check back soon or
              contact us.
            </p>
          )}
          <div className="text-center mt-8">
            <Link
              href={`/inventory?make=Mercedes`}
              className="inline-flex items-center justify-center px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
            >
              View All Mercedes-Benz Trucks
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Mercedes-Benz Trucks — FAQ
            </h2>
            <p className="text-lg text-gray-600 mb-8 text-center">
              Common questions about buying used Mercedes-Benz trucks from A-Z
              Truck Sales.
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
            Looking for a Used Mercedes-Benz Truck?
          </h2>
          <p className="text-xl mb-8">
            Contact our team to discuss your Mercedes-Benz truck needs or book a
            viewing.
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
