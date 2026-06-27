export const revalidate = 86400

import JsonLd from '@/components/global/JsonLd'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: { absolute: 'Used Fuso Trucks for Sale | A-Z Truck Sales' },
  description:
    'Browse used Fuso trucks for sale in Gauteng. Canter, Fighter & more. Visit our Alberton or Boksburg branch.',
  alternates: { canonical: 'https://www.a-ztrucksales.com/brands/fuso' },
  openGraph: {
    title: 'Used Fuso Trucks for Sale | A-Z Truck Sales',
    description: 'Shop used Fuso trucks in Gauteng. Canter and Fighter models.',
    url: 'https://www.a-ztrucksales.com/brands/fuso',
    siteName: 'A-Z Truck Sales',
    images: [
      {
        url: 'https://www.a-ztrucksales.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Used Fuso Trucks for Sale - A-Z Truck Sales',
      },
    ],
    locale: 'en_ZA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Used Fuso Trucks for Sale | A-Z Truck Sales',
    description: 'Shop used Fuso trucks in Gauteng. Canter and Fighter models.',
    images: ['https://www.a-ztrucksales.com/og-image.webp'],
  },
}

const faqs = [
  {
    question: 'Does A-Z Truck Sales sell used Fuso trucks?',
    answer:
      'Yes, we stock used Fuso trucks including the Canter and Fighter ranges. Fuso is one of our key brands, valued for its light-duty capability, fuel efficiency and parts availability.',
  },
  {
    question: 'What Fuso truck models do you sell?',
    answer:
      'We sell used Fuso Canter (3.5 to 8.5 tons GVM) and Fighter (8.5 to 18 tons GVM) rigid trucks in dropside, box body, refrigerated and curtain side configurations.',
  },
  {
    question: 'Why buy a used Fuso truck from A-Z?',
    answer:
      'Our Canter range is especially popular for city delivery and light commercial work. Fuso trucks offer excellent fuel economy, tight turning circles and reliable performance.',
  },
  {
    question: 'Are Fuso Canter trucks good for city delivery?',
    answer:
      'Yes, the Fuso Canter is one of the most popular light-duty trucks for city delivery in South Africa. Its tight turning circle, good fuel economy and 3.5 to 8.5 ton GVM range make it ideal for urban routes.',
  },
  {
    question: 'Where can I view Fuso trucks in Gauteng?',
    answer:
      'Visit our Alberton or Boksburg branch by appointment. Call us to arrange a viewing of our current Fuso stock.',
  },
]

const getFusoVehicles = unstable_cache(
  () =>
    prisma.inventory.findMany({
      where: { make: { contains: 'Fuso', mode: 'insensitive' } },
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
  ['fuso-brand-vehicles'],
  { tags: ['inventory'], revalidate: 86400 }
)

export default async function FusoPage() {
  const vehicles = await getFusoVehicles()

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
        name: 'Used Fuso Trucks',
        item: 'https://www.a-ztrucksales.com/brands/fuso',
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
            Used Fuso Trucks for Sale in Gauteng
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Browse our range of used Fuso Canter and Fighter rigid trucks. Every
            vehicle is available for viewing at our Alberton or Boksburg branch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/inventory?make=Fuso`}
              className="inline-flex items-center justify-center px-8 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
            >
              View All Fuso Trucks
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
                Fuso Trucks — Light- and Medium-Duty Excellence
              </h2>
              <div className="text-lg text-gray-600 space-y-4">
                <p>
                  Fuso is a leading commercial vehicle brand with a strong
                  reputation for light-duty trucks in South Africa. The Canter
                  range is one of the most popular choices for city delivery,
                  service vehicles and light commercial transport.
                </p>
                <p>
                  The Canter is available from 3.5 to 8.5 tons GVM, making it an
                  ideal choice for businesses needing a manoeuvrable,
                  fuel-efficient truck for urban routes. The Fighter range
                  handles heavier medium-duty work up to 18 tons GVM.
                </p>
                <p>
                  The Canter is available from 3.5 to 8.5 tons GVM, making it an
                  ideal choice for businesses needing a manoeuvrable,
                  fuel-efficient truck for urban routes. The Fighter range
                  handles heavier medium-duty work up to 18 tons GVM.
                </p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Why Choose a Fuso Truck?
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Excellent
                  fuel economy — especially the Canter
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Tight
                  turning circle for city driving
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Reliable
                  and easy to maintain
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Wide range
                  of body configurations
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span> Strong
                  dealer network in South Africa
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">-</span>{' '}
                  Competitive pricing in the light-duty segment
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Used Fuso Trucks in Stock
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Recently added Fuso trucks available at our Gauteng branches.
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
              No Fuso trucks currently in stock. Check back soon or contact us.
            </p>
          )}
          <div className="text-center mt-8">
            <Link
              href={`/inventory?make=Fuso`}
              className="inline-flex items-center justify-center px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
            >
              View All Fuso Trucks
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Fuso Trucks — FAQ
            </h2>
            <p className="text-lg text-gray-600 mb-8 text-center">
              Common questions about buying used Fuso trucks from A-Z Truck
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
            Looking for a Used Fuso Truck?
          </h2>
          <p className="text-xl mb-8">
            Contact our team to discuss your Fuso truck needs or book a viewing.
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
