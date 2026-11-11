export const revalidate = 3600
export const dynamicParams = false

import JsonLd from '@/components/global/JsonLd'
import { formatNumber } from '@/lib/format'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'
import ListingPrice, { listingPriceSelect } from '@/components/shared/ListingPrice'
import RelatedGuides from '@/components/sections/shared/RelatedGuides'
import { buildVehicleItemList } from '@/lib/vehicle-list-schema'
import { BODY_TYPE_PAGES, getBodyTypePage } from '@/lib/body-types'
import { TONNAGE_BUCKETS } from '@/lib/tonnage'
import BodyTypeSiblingLinks from '@/components/sections/bodyTypes/BodyTypeSiblingLinks'
import { fitToLength } from '@/lib/spares'

interface Props {
  params: Promise<{ type: string }>
}

export function generateStaticParams() {
  return BODY_TYPE_PAGES.map((b) => ({ type: b.slug }))
}

const getBodyTypeVehicles = unstable_cache(
  (dbValue: string) =>
    prisma.inventory.findMany({
      where: { bodyType: { equals: dbValue, mode: 'insensitive' } },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        make: true,
        year: true,
        truckSize: true,
        ...listingPriceSelect,
        mileage: true,
        fuelType: true,
        transmission: true,
        images: true,
        slug: true,
      },
    }),
  ['body-type-vehicles'],
  { tags: ['inventory'], revalidate: 3600 },
)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params
  const page = getBodyTypePage(type)
  if (!page) return {}

  // No live stock count here: it drifted from the page and the sitemap
  const title = `${page.metaTitle} in Gauteng | A-Z Truck Sales`
  const baseDescription = `Used ${page.name.toLowerCase()} for sale in Gauteng, ideal for ${page.useCases}.`
  const description =
    `${baseDescription} COF-ready and workshop-checked. View prices online.`.length <= 158
      ? `${baseDescription} COF-ready and workshop-checked. View prices online.`
      : fitToLength(baseDescription, 158)
  const canonicalUrl = `https://www.a-ztrucksales.com/body-types/${page.slug}`

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'website',
      locale: 'en_ZA',
      url: canonicalUrl,
      siteName: 'A-Z Truck Sales',
      title,
      description,
      images: [
        {
          url: 'https://www.a-ztrucksales.com/og-image.webp',
          width: 1200,
          height: 630,
          alt: `${page.name} for Sale - A-Z Truck Sales`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://www.a-ztrucksales.com/og-image.webp'],
    },
  }
}

export default async function BodyTypePage({ params }: Props) {
  const { type } = await params
  const page = getBodyTypePage(type)
  if (!page) notFound()

  const vehicles = await getBodyTypeVehicles(page.dbValue)
  const pageUrl = `https://www.a-ztrucksales.com/body-types/${page.slug}`
  const inventoryHref = `/inventory?bodyType=${encodeURIComponent(page.dbValue)}`

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.a-ztrucksales.com' },
      { '@type': 'ListItem', position: 2, name: 'Trucks by Body Type', item: 'https://www.a-ztrucksales.com/body-types' },
      { '@type': 'ListItem', position: 3, name: page.name, item: pageUrl },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      {vehicles.length > 0 && (
        <JsonLd
          data={buildVehicleItemList({
            id: `${pageUrl}#inventory`,
            name: `Used ${page.name} in Stock`,
            vehicles,
          })}
        />
      )}

      <section className="bg-linear-to-r from-gray-900 to-gray-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{page.h1}</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            {page.intro}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={inventoryHref}
              className="inline-flex items-center justify-center px-8 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
            >
              View {page.name} in Stock
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
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            What Are {page.name} Used For?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mb-8">
            {page.name.charAt(0) + page.name.slice(1).toLowerCase()} are commonly used for {page.useCases}.
          </p>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            What to Check Before You Buy
          </h3>
          <ul className="space-y-3 text-lg text-gray-600 max-w-3xl list-disc pl-5">
            {page.buyingPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {page.name} in Stock
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Current {page.name.toLowerCase()} available at our Gauteng branches.
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
                    {(truck.images as { url: string }[])?.[0]?.url && (
                      <Image
                        src={(truck.images as { url: string }[])[0].url}
                        alt={truck.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                        priority={i === 0}
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">
                      {truck.name}
                    </h3>
                    <ListingPrice truck={truck} className="text-lg" />
                    <div className="flex gap-2 mt-2 text-sm text-gray-500">
                      <span>{formatNumber(truck.mileage) ?? '-'} km</span>
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
              No {page.name.toLowerCase()} currently in stock. Check back soon
              or contact us about upcoming stock.
            </p>
          )}
          <div className="text-center mt-8">
            <Link
              href={inventoryHref}
              className="inline-flex items-center justify-center px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
            >
              Filter the Full Inventory to {page.name}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Browse {page.name} by Tonnage
          </h2>
          <p className="text-gray-600 mb-6">
            Need a specific payload? Pick a tonnage class.
          </p>
          <ul className="flex flex-wrap gap-3">
            {TONNAGE_BUCKETS.map((bucket) => (
              <li key={bucket.slug}>
                <Link
                  href={`/tonnage/${bucket.slug}`}
                  className="inline-block rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:border-amber-500 hover:text-amber-700 transition"
                >
                  {bucket.label} trucks
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              {page.name} — FAQ
            </h2>
            <p className="text-lg text-gray-600 mb-8 text-center">
              Common questions about buying {page.name.toLowerCase()} from A-Z Truck Sales.
            </p>
            {page.faqs.map((faq, i) => (
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

      <RelatedGuides
        guides={[
          'truck-body-types',
          'buying-guide',
          'choose-truck-for-construction-delivery-cold-storage',
          'finance-trade-ins-export',
        ]}
      />

      <BodyTypeSiblingLinks currentSlug={page.slug} />

      <section className="py-20 bg-linear-to-r from-amber-600 to-yellow-300 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Looking for the Right Body Type?
          </h2>
          <p className="text-xl mb-8">
            Tell us what you carry and our team will suggest a truck that fits, or book a viewing.
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
