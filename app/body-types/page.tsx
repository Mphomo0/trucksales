export const revalidate = 86400

import JsonLd from '@/components/global/JsonLd'
import { Metadata } from 'next'
import Link from 'next/link'
import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { BODY_TYPE_PAGES } from '@/lib/body-types'

const DESCRIPTION =
  'Browse used trucks by body type — refrigerated, dropside, curtain side and volume (box) body — in stock at A-Z Truck Sales in Gauteng.'

export const metadata: Metadata = {
  title: { absolute: 'Trucks for Sale by Body Type | A-Z Truck Sales' },
  description: DESCRIPTION,
  alternates: { canonical: 'https://www.a-ztrucksales.com/body-types' },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    title: 'Trucks for Sale by Body Type | A-Z Truck Sales',
    description: DESCRIPTION,
    url: 'https://www.a-ztrucksales.com/body-types',
    siteName: 'A-Z Truck Sales',
    images: [
      {
        url: 'https://www.a-ztrucksales.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Trucks by Body Type - A-Z Truck Sales',
      },
    ],
  },
}

const getBodyTypeCounts = unstable_cache(
  async () => {
    const rows = await prisma.inventory.groupBy({
      by: ['bodyType'],
      _count: { _all: true },
      where: { bodyType: { not: null } },
    })
    const counts: Record<string, number> = {}
    for (const row of rows) {
      if (!row.bodyType) continue
      const key = row.bodyType.trim().toLowerCase()
      counts[key] = (counts[key] ?? 0) + row._count._all
    }
    return counts
  },
  ['body-types-hub-counts'],
  { tags: ['inventory'], revalidate: 86400 },
)

export default async function BodyTypesHub() {
  const counts = await getBodyTypeCounts()

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.a-ztrucksales.com' },
      { '@type': 'ListItem', position: 2, name: 'Trucks by Body Type', item: 'https://www.a-ztrucksales.com/body-types' },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <section className="bg-linear-to-r from-gray-900 to-gray-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Trucks for Sale by Body Type
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Refrigerated, dropside, curtain side or volume body: choose the
            body that suits what you carry. Every truck is workshop-checked and
            COF-ready.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {BODY_TYPE_PAGES.map((page) => {
              const count = counts[page.dbValue.toLowerCase()] ?? 0
              return (
                <Link
                  key={page.slug}
                  href={`/body-types/${page.slug}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {page.name}
                  </h2>
                  <p className="text-gray-600 mb-4">{page.intro}</p>
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
            Which Body Suits Which Work
          </h2>
          <ul className="space-y-3 text-lg text-gray-600 leading-relaxed list-disc pl-5">
            {BODY_TYPE_PAGES.map((page) => (
              <li key={page.slug}>
                <Link
                  href={`/body-types/${page.slug}`}
                  className="font-semibold text-amber-600 hover:underline"
                >
                  {page.name}
                </Link>
                : {page.useCases}.
              </li>
            ))}
          </ul>
          <p className="mt-10 text-lg text-gray-600">
            Compare them in our{' '}
            <Link href="/guides/truck-body-types" className="text-amber-600 hover:underline">
              truck body types guide
            </Link>
            , browse{' '}
            <Link href="/tonnage" className="text-amber-600 hover:underline">
              trucks by tonnage
            </Link>
            , see the{' '}
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
