export const revalidate = 86400

import JsonLd from '@/components/global/JsonLd'
import { Metadata } from 'next'
import Link from 'next/link'
import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { TONNAGE_BUCKETS } from '@/lib/tonnage'

export const metadata: Metadata = {
  title: { absolute: 'Trucks for Sale by Tonnage | A-Z Truck Sales' },
  description:
    'Browse used trucks by tonnage — 1 to 2.5 ton, 3 to 5 ton, up to 18 to 35 ton — in stock at A-Z Truck Sales in Gauteng. Find the right payload for your business.',
  alternates: { canonical: 'https://www.a-ztrucksales.com/tonnage' },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    title: 'Trucks for Sale by Tonnage | A-Z Truck Sales',
    description:
      'Browse used trucks by tonnage — 1 to 2.5 ton, 3 to 5 ton, up to 18 to 35 ton — in stock at A-Z Truck Sales in Gauteng.',
    url: 'https://www.a-ztrucksales.com/tonnage',
    siteName: 'A-Z Truck Sales',
    images: [
      {
        url: 'https://www.a-ztrucksales.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Trucks by Tonnage - A-Z Truck Sales',
      },
    ],
  },
}

const getTonnageCounts = unstable_cache(
  async () => {
    const rows = await prisma.inventory.groupBy({
      by: ['truckSize'],
      _count: { _all: true },
      where: { truckSize: { not: null } },
    })
    const counts: Record<string, number> = {}
    for (const row of rows) {
      if (!row.truckSize) continue
      const key = row.truckSize.toLowerCase()
      counts[key] = (counts[key] ?? 0) + row._count._all
    }
    return counts
  },
  ['tonnage-hub-counts'],
  { tags: ['inventory'], revalidate: 86400 },
)

export default async function TonnageHub() {
  const counts = await getTonnageCounts()

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.a-ztrucksales.com' },
      { '@type': 'ListItem', position: 2, name: 'Trucks by Tonnage', item: 'https://www.a-ztrucksales.com/tonnage' },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <section className="bg-linear-to-r from-gray-900 to-gray-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Trucks for Sale by Tonnage
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From 1 to 2.5 ton light delivery trucks up to 18 to 35 ton heavy
            rigids, find the payload that matches your business — all
            workshop-checked and COF-ready.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TONNAGE_BUCKETS.map((bucket) => {
              const count = counts[bucket.dbValue] ?? 0
              return (
                <Link
                  key={bucket.slug}
                  href={`/tonnage/${bucket.slug}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {bucket.label} Trucks
                  </h2>
                  <p className="text-gray-600 mb-4">{bucket.intro}</p>
                  <p className="text-amber-600 font-semibold">
                    {count} in stock →
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            How to Choose the Right Tonnage
          </h2>
          <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
            <p>
              A truck&apos;s tonnage class is a guide to how much it can carry, but
              the number on its own can mislead. Payload is what the truck can
              carry. GVM (gross vehicle mass) is the legal maximum for the truck,
              body and load together, so it is always higher than the payload. A
              truck sold as 8 to 9 ton usually has a GVM of about 15 to 16 tonnes.
              The GVM is on the vehicle plate, and we can confirm it for any truck
              in stock.
            </p>
            <p>
              The body changes the payload too. A refrigerated or insulated body,
              a crane or a tipper is heavier than a dropside or curtain side, so it
              leaves less capacity for the same chassis. Work out the heaviest load
              you carry regularly, then choose a class with some headroom.
            </p>
            <p>
              Licensing matters as well. In South Africa a Code C1 licence covers
              vehicles with a GVM between 3,500 kg and 16,000 kg, which includes
              most trucks up to the 8 to 9 ton class. Heavier rigids need a Code C
              licence, so check the GVM of the specific truck before you buy.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            Which Class Suits Which Work
          </h2>
          <ul className="space-y-3 text-lg text-gray-600 leading-relaxed list-disc pl-5">
            {TONNAGE_BUCKETS.map((bucket) => (
              <li key={bucket.slug}>
                <Link
                  href={`/tonnage/${bucket.slug}`}
                  className="font-semibold text-amber-600 hover:underline"
                >
                  {bucket.label}
                </Link>
                : {bucket.useCases}.
              </li>
            ))}
          </ul>

          <p className="mt-10 text-lg text-gray-600">
            Not sure which class you need? Tell us what you carry and how far, and
            we will suggest trucks that fit. See the{' '}
            <Link href="/guides/buying-guide" className="text-amber-600 hover:underline">
              buying guide
            </Link>
            , browse the{' '}
            <Link href="/inventory" className="text-amber-600 hover:underline">
              full inventory
            </Link>{' '}
            or{' '}
            <Link href="/contact" className="text-amber-600 hover:underline">
              contact a branch
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  )
}
