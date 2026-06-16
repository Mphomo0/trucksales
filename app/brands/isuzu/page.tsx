export const revalidate = 86400

import JsonLd from '@/components/global/JsonLd'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: { absolute: 'Used Isuzu Trucks for Sale | A-Z Truck Sales' },
  description:
    'Browse used Isuzu trucks for sale in Gauteng. N-Series, F-Series & more. Visit our Alberton or Boksburg branch.',
  alternates: { canonical: 'https://www.a-ztrucksales.com/brands/isuzu' },
  openGraph: {
    title: 'Used Isuzu Trucks for Sale | A-Z Truck Sales',
    description:
      'Shop used Isuzu trucks in Gauteng. N-Series and F-Series rigid trucks.',
    url: 'https://www.a-ztrucksales.com/brands/isuzu',
    siteName: 'A-Z Truck Sales',
    images: [
      {
        url: 'https://www.a-ztrucksales.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Used Isuzu Trucks for Sale - A-Z Truck Sales',
      },
    ],
    locale: 'en_ZA',
    type: 'website',
  },
}

const faqs = [
  {
    question: 'Does A-Z Truck Sales sell used Isuzu trucks in Gauteng?',
    answer:
      'Yes, we stock used Isuzu trucks including N-Series and F-Series models. Isuzu is one of our most popular brands due to strong parts availability, reliable engines and broad dealer network across South Africa.',
  },
  {
    question: 'What Isuzu truck models do you sell?',
    answer:
      'We sell used Isuzu N-Series (NPR, NQR, NPS) and F-Series (FRR, FSR, FVR, FVZ) rigid trucks in various body configurations including dropside, box body, refrigerated and curtain side.',
  },
  {
    question: 'Why buy a used Isuzu truck from A-Z?',
    answer:
      'Our team knows the Isuzu range and can match the right model to your payload and route. Isuzu offers excellent parts availability, strong resale value and reliable diesel engines.',
  },
  {
    question: 'Are Isuzu truck spares available?',
    answer:
      'Isuzu has one of the strongest parts supply networks in South Africa. We also stock Isuzu truck spares at our branches for common service items.',
  },
  {
    question: 'Do you help with Isuzu truck financing?',
    answer:
      'Yes, we work with vehicle finance providers. Contact our sales team to discuss options for your Isuzu truck purchase.',
  },
]

export default async function IsuzuPage() {
  const vehicles = await prisma.inventory.findMany({
    where: { make: { contains: 'Isuzu', mode: 'insensitive' } },
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
        name: 'Used Isuzu Trucks',
        item: 'https://www.a-ztrucksales.com/brands/isuzu',
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
            Used Isuzu Trucks for Sale in Gauteng
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Browse our range of used Isuzu N-Series and F-Series rigid trucks.
            Every vehicle is available for viewing at our Alberton or Boksburg
            branch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/inventory?make=Isuzu`}
              className="inline-flex items-center justify-center px-8 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
            >
              View All Isuzu Trucks
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

      {/* About Isuzu */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Isuzu Trucks — Built for South African Roads
              </h2>
              <div className="text-lg text-gray-600 space-y-4">
                <p>
                  Isuzu is one of South Africa's most trusted commercial vehicle
                  brands. With a strong local manufacturing presence, extensive
                  dealer network and excellent parts availability, Isuzu trucks
                  are a popular choice for delivery, distribution, construction
                  and medium-duty transport.
                </p>
                <p>
                  The N-Series range (NPR, NQR, NPS) is ideal for city delivery
                  and medium-duty work, while the F-Series range (FRR, FSR, FVR,
                  FVZ) handles heavier loads and longer distance routes. Both
                  ranges are available in dropside, box body, refrigerated and
                  curtain side configurations.
                </p>
                <p>
                  The N-Series range (NPR, NQR, NPS) is ideal for city delivery
                  and medium-duty work, while the F-Series range (FRR, FSR, FVR,
                  FVZ) handles heavier loads and longer distance routes. Both
                  ranges are available in dropside, box body, refrigerated and
                  curtain side configurations.
                </p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Why Choose an Isuzu Truck?
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Excellent
                  parts availability across South Africa
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Strong
                  resale value
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Reliable
                  diesel engines with long service intervals
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Wide range
                  of body configurations
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Extensive
                  dealer and service network
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Suitable
                  for GVM from 3.5 to 18 tons
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
            Used Isuzu Trucks in Stock
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Recently added Isuzu trucks available at our Gauteng branches.
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
              No Isuzu trucks currently in stock. Check back soon or contact us.
            </p>
          )}
          <div className="text-center mt-8">
            <Link
              href={`/inventory?make=Isuzu`}
              className="inline-flex items-center justify-center px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
            >
              View All Isuzu Trucks
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Isuzu Trucks — FAQ
            </h2>
            <p className="text-lg text-gray-600 mb-8 text-center">
              Common questions about buying used Isuzu trucks from A-Z Truck
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
            Looking for a Used Isuzu Truck?
          </h2>
          <p className="text-xl mb-8">
            Contact our team to discuss your Isuzu truck needs or book a
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
