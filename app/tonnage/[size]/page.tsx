export const revalidate = 86400
export const dynamicParams = false

import JsonLd from '@/components/global/JsonLd'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { TONNAGE_BUCKETS, getTonnageBucket } from '@/lib/tonnage'

interface Props {
  params: Promise<{ size: string }>
}

export function generateStaticParams() {
  return TONNAGE_BUCKETS.map((b) => ({ size: b.slug }))
}

const getTonnageVehicles = unstable_cache(
  (dbValue: string) =>
    prisma.inventory.findMany({
      where: { truckSize: { equals: dbValue, mode: 'insensitive' } },
      take: 12,
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
  ['tonnage-vehicles'],
  { tags: ['inventory'], revalidate: 86400 },
)

const getTonnageCount = unstable_cache(
  (dbValue: string) =>
    prisma.inventory.count({
      where: { truckSize: { equals: dbValue, mode: 'insensitive' } },
    }),
  ['tonnage-count'],
  { tags: ['inventory'], revalidate: 86400 },
)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { size } = await params
  const bucket = getTonnageBucket(size)
  if (!bucket) return {}

  const count = await getTonnageCount(bucket.dbValue)
  const title = `${bucket.metaTitle} in Gauteng | ${count} in Stock`
  const description = `Used ${bucket.label} trucks for sale in Gauteng (${count} in stock) — ideal for ${bucket.useCases}. COF-ready, workshop-checked. View prices and photos online.`
  const canonicalUrl = `https://www.a-ztrucksales.com/tonnage/${bucket.slug}`

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
          alt: `${bucket.label} Trucks for Sale - A-Z Truck Sales`,
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

export default async function TonnagePage({ params }: Props) {
  const { size } = await params
  const bucket = getTonnageBucket(size)
  if (!bucket) notFound()

  const vehicles = await getTonnageVehicles(bucket.dbValue)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.a-ztrucksales.com' },
      { '@type': 'ListItem', position: 2, name: 'Trucks by Tonnage', item: 'https://www.a-ztrucksales.com/tonnage' },
      { '@type': 'ListItem', position: 3, name: bucket.label, item: `https://www.a-ztrucksales.com/tonnage/${bucket.slug}` },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: bucket.faqs.map((faq) => ({
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
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{bucket.h1}</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            {bucket.intro}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/inventory"
              className="inline-flex items-center justify-center px-8 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
            >
              View All Trucks in Stock
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
            What Are {bucket.label} Trucks Used For?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl">
            {bucket.label} trucks are commonly used for {bucket.useCases}.
            Every truck we sell is workshop-checked and COF-ready before sale,
            with viewing available at our Alberton or Boksburg branch.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {bucket.label} Trucks in Stock
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Current {bucket.label.toLowerCase()} trucks available at our Gauteng branches.
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
              No {bucket.label.toLowerCase()} trucks currently in stock. Check
              back soon or contact us about upcoming stock.
            </p>
          )}
          <div className="text-center mt-8">
            <Link
              href="/inventory"
              className="inline-flex items-center justify-center px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
            >
              View All Trucks in Stock
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              {bucket.label} Trucks — FAQ
            </h2>
            <p className="text-lg text-gray-600 mb-8 text-center">
              Common questions about buying a used {bucket.label.toLowerCase()} truck from A-Z Truck Sales.
            </p>
            {bucket.faqs.map((faq, i) => (
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
            Looking for a {bucket.label} Truck?
          </h2>
          <p className="text-xl mb-8">
            Contact our team to discuss your payload needs or book a viewing.
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
