/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

export const dynamic = 'force-static'
export const revalidate = 86400

import AllSpecials from '@/components/sections/special/AllSpecials'
import SpecialsFeatures from '@/components/sections/specials/SpecialsFeatures'
import { Metadata } from 'next'
import JsonLd from '@/components/global/JsonLd'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: 'Truck Specials Under R300 000 | A-Z Truck Sales — Gauteng' },
  description: 'Browse truck specials at A-Z Truck Sales in Alberton & Boksburg, Gauteng. Limited-time deals on quality used Isuzu, Hino, Nissan and more. View today.',
  alternates: {
    canonical: 'https://www.a-ztrucksales.com/specials',
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://www.a-ztrucksales.com/specials',
    siteName: 'A-Z Truck Sales',
    title: 'Truck Specials Under R300 000 | A-Z Truck Sales — Gauteng',
    description: 'Browse truck specials at A-Z Truck Sales in Alberton & Boksburg, Gauteng. Limited-time deals on quality used Isuzu, Hino, Nissan and more.',
    images: [{ url: 'https://www.a-ztrucksales.com/og-image.webp', width: 1200, height: 630, alt: 'Truck Specials - A-Z Truck Sales' }],
  },
}

const specialsFaqs = [
  {
    question: 'How often do you update your specials?',
    answer: 'We update our specials weekly. Check back regularly or follow us on Facebook for new arrivals.',
  },
  {
    question: 'Do specials apply to both trucks and spares?',
    answer: 'Yes. Our specials cover both quality used rigid trucks and spare parts including engines, gearboxes, and diffs.',
  },
  {
    question: 'How long are specials valid?',
    answer: 'Each special has an end date displayed on the listing. Once expired, the regular price applies.',
  },
  {
    question: 'Can I combine a special with a trade-in?',
    answer: 'Yes. You can use a trade-in as partial payment on any special-priced truck.',
  },
  {
    question: 'Are specials available for viewing in person?',
    answer: 'Yes. Special-priced trucks can be viewed at our Alberton workshop by appointment. Call 011 902 6071.',
  },
]

async function getSpecialsData() {
  const now = new Date()

  // Run both queries in parallel — cuts DB round-trip time in half
  const [vehicles, spares] = await Promise.all([
    prisma.inventory.findMany({
      where: {
        specialPrice: { not: null },
        AND: [
          { specialPrice: { gt: 0 } },
          {
            OR: [
              { specialValidTo: null },
              { specialValidTo: { gte: now } },
            ],
          },
        ],
      },
      select: {
        id: true,
        name: true,
        make: true,
        model: true,
        year: true,
        vatPrice: true,
        pricenoVat: true,
        images: true,
        description: true,
        slug: true,
        specialPrice: true,
        specialValidFrom: true,
        specialValidTo: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    prisma.spares.findMany({
      where: {
        specialPrice: { not: null },
        AND: [
          { specialPrice: { gt: 0 } },
          {
            OR: [
              { specialValidTo: null },
              { specialValidTo: { gte: now } },
            ],
          },
        ],
      },
      select: {
        id: true,
        name: true,
        make: true,
        price: true,
        noVatPrice: true,
        images: true,
        description: true,
        slug: true,
        category: true,
        condition: true,
        specialPrice: true,
        specialPriceNoVat: true,
        specialValidFrom: true,
        specialValidTo: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
  ])

  return { vehicles, spares }
}

/* application/ld+json */ export default async function Specials() {
  const { vehicles, spares } = await getSpecialsData()

  const hasVehicles = vehicles.length > 0
  const hasSpares = spares.length > 0
  const hasAnySpecial = hasVehicles || hasSpares

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
        name: 'Specials',
        item: 'https://www.a-ztrucksales.com/specials',
      },
    ],
  }

  const specialsFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: specialsFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <div className="bg-gray-100">
      <h1 className="sr-only">Truck Specials & Discounts | A-Z Truck Sales</h1>
      <div className="sr-only">
        <span>Author: A-Z Truck Sales</span>
        <span>Last Updated: 2026-04-27</span>
      </div>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={specialsFaqSchema} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Specials
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Don&lsquo;t miss out on our latest truck specials — limited-time
            deals, exclusive discounts, and unbeatable offers available now!
          </p>

          
        </div>

        {!hasAnySpecial ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              No Specials Currently Available
            </h3>
            <p className="text-lg text-gray-600">
              Be on the lookout — the next special is on the way!
            </p>
          </div>
        ) : (
          <AllSpecials
            vehicles={vehicles as any[]}
            spares={spares as any[]}
          />
        )}

        {vehicles.length > 0 && (
          <section className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-base font-semibold text-neutral-700 mb-4">Special Offer Trucks</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {vehicles.map((v) => (
                <li key={v.slug}>
                  <Link href={`/specials/${v.slug}`} className="text-sm text-blue-700 hover:underline">
                    {v.year} {v.make} {v.model}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}