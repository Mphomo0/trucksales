/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

import SpecialDetails from '@/components/sections/special/SpecialDetails'
import QualityAssurance from '@/components/sections/inventorySection/QualityAssurance'

import React from 'react'
import { prisma } from '@/lib/prisma'
import { cache } from 'react'
import { Metadata } from 'next'
import JsonLd from '@/components/global/JsonLd'
import GeoHints from '@/components/global/GeoHints'

export const dynamic = 'force-static'
export const revalidate = false

interface Props {
  params: Promise<{ slug: string }>
}

/** Cached per-request so generateMetadata and the page share one DB query */
const getSpecialInventory = cache(async (slug: string) =>
  prisma.inventory.findUnique({ where: { slug } })
)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const now = new Date()
  const inventory = await getSpecialInventory(slug)

  if (!inventory || !inventory.specialValidTo || !inventory.specialValidFrom) {
    return { title: 'Special Not Found' }
  }

  if (now > inventory.specialValidTo || now < inventory.specialValidFrom) {
    return { title: 'Special Expired' }
  }

  // Layout appends "| A-Z Truck Sales" (17 chars); keep page portion ≤ 43 so full title ≤ 60
  let title = `Special: ${inventory.year} ${inventory.make} ${inventory.model}`
  if (title.length > 43) {
    title = title.substring(0, 40) + '...'
  }

  const description = `Don't miss this special offer on a ${inventory.year} ${inventory.make} ${inventory.model}. Limited time deal at A-Z Truck Sales.`

  const canonicalUrl = `https://www.a-ztrucksales.com/specials/${slug}`
  const images = Array.isArray(inventory.images)
    ? (inventory.images as any[]).map((img) => img.url)
    : []
  const ogImage = images.length > 0
    ? [{ url: images[0], width: 1200, height: 630, alt: title }]
    : [{ url: 'https://www.a-ztrucksales.com/og-image.webp', width: 1200, height: 630, alt: 'A-Z Truck Sales' }]

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      locale: 'en_ZA',
      url: canonicalUrl,
      siteName: 'A-Z Truck Sales',
      title,
      description,
      images: ogImage,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage[0].url],
    },
    alternates: { canonical: canonicalUrl },
  }
}

export default async function Special({ params }: Props) {
  const { slug } = await params
  const now = new Date()
  const inventory = await getSpecialInventory(slug)

  if (!inventory || !inventory.specialValidTo || !inventory.specialValidFrom) {
    return <div>Special not found</div>
  }

  if (now > inventory.specialValidTo || now < inventory.specialValidFrom) {
    return <div>Special expired</div>
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.a-ztrucksales.com' },
      { '@type': 'ListItem', position: 2, name: 'Specials', item: 'https://www.a-ztrucksales.com/specials' },
      { '@type': 'ListItem', position: 3, name: inventory.name, item: `https://www.a-ztrucksales.com/specials/${slug}` },
    ],
  }

  const images = Array.isArray(inventory.images)
    ? (inventory.images as any[]).map(img => img.url)
    : []

  const specialOfferSchema: Record<string, unknown> = {
    '@type': 'Offer',
    url: `https://www.a-ztrucksales.com/specials/${slug}`,
    priceCurrency: 'ZAR',
    itemCondition: inventory.condition === 'NEW' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
    availability: 'https://schema.org/InStock',
    seller: { '@type': 'Organization', name: 'A-Z Truck Sales' },
  }
  const specialPrice = inventory.specialPrice ?? inventory.vatPrice
  if (specialPrice != null) {
    specialOfferSchema.price = specialPrice
  }

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${inventory.year} ${inventory.make} ${inventory.model}`,
    image: images.length > 0 ? images : undefined,
    description: inventory.description || undefined,
    vehicleIdentificationNumber: inventory.registrationNo || undefined,
    brand: { '@type': 'Brand', name: inventory.make },
    manufacturer: { '@type': 'Organization', name: inventory.make },
    modelDate: String(inventory.year),
    mileageFromOdometer: inventory.mileage != null ? {
      '@type': 'QuantitativeValue',
      value: inventory.mileage,
      unitCode: 'KMT',
    } : undefined,
    vehicleCondition: inventory.condition === 'NEW' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
    offers: specialOfferSchema,
  }

  const specialFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is this special truck still available?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes. Specials are valid until the stated expiry date. Stock is first-come, first-served.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Can I view this truck before buying?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, visits by appointment at our Alberton branch. Call 011 902 6071 to arrange.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you offer trade-in on special trucks?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. You can use your current truck as partial or full payment on any special-priced vehicle.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is delivery available?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we can arrange transport of purchased vehicles across South Africa.',
        },
      },
    ],
  }

  return (
    <div>
      <h1 className="sr-only">{inventory.year} {inventory.make} Special Offer</h1>
      <GeoHints />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={productSchema} />
      <JsonLd data={specialFaqSchema} />
      <SpecialDetails />
      <QualityAssurance />
    </div>
  )
}