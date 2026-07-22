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
    </>
  )
}
