/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

import SpecialDetails from '@/components/sections/special/SpecialDetails'
import QualityAssurance from '@/components/sections/inventorySection/QualityAssurance'

import React from 'react'
import { prisma } from '@/lib/prisma'
import { cache } from 'react'
import { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import JsonLd from '@/components/global/JsonLd'
import { isSpecialActive } from '@/lib/specials'
import { isOffThemeVehicle } from '@/lib/off-theme'
import { fitToLength } from '@/lib/spares'
import { formatDisplayName } from '@/lib/text'

export const revalidate = 3600 // keep in sync with SPECIALS_REVALIDATE_SECONDS

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

  if (!isSpecialActive(inventory, now)) {
    return { title: 'Special Expired', robots: { index: false } }
  }

  const truckName = `${inventory.year} ${formatDisplayName(inventory.make)} ${formatDisplayName(inventory.model)}`
  // Layout appends "| A-Z Truck Sales" (17 chars); keep page portion ≤ 43 so full title ≤ 60
  const title = fitToLength(`Special: ${truckName}`, 43)

  const description = `Don't miss this special offer on a ${truckName}. Limited time deal at A-Z Truck Sales.`

  // The vehicle's own page is the canonical home for this truck; this page only adds
  // the offer. Off-theme vehicles (not trucks) are noindex there, so noindex here too.
  const offTheme = isOffThemeVehicle(inventory)
  const canonicalUrl = `https://www.a-ztrucksales.com/inventory/${inventory.slug}`
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
    ...(offTheme && { robots: { index: false, follow: true } }),
  }
}

export default async function Special({ params }: Props) {
  const { slug } = await params
  const now = new Date()
  const inventory = await getSpecialInventory(slug)

  if (!inventory || !inventory.specialValidTo || !inventory.specialValidFrom) {
    notFound()
  }

  if (!isSpecialActive(inventory, now)) {
    // Expired specials were indexed as soft 404s; send crawlers to the live list
    permanentRedirect('/specials')
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
    name: `${inventory.year} ${formatDisplayName(inventory.make)} ${formatDisplayName(inventory.model)}`,
    image: images.length > 0 ? images : undefined,
    description: inventory.description || undefined,
    vehicleIdentificationNumber: inventory.registrationNo || undefined,
    brand: { '@type': 'Brand', name: formatDisplayName(inventory.make) },
    manufacturer: { '@type': 'Organization', name: formatDisplayName(inventory.make) },
    vehicleModelDate: inventory.year,
    mileageFromOdometer: inventory.mileage != null ? {
      '@type': 'QuantitativeValue',
      value: inventory.mileage,
      unitCode: 'KMT',
    } : undefined,
    itemCondition: inventory.condition === 'NEW' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
    offers: specialOfferSchema,
  }


  return (
    <div>
      <h1 className="sr-only">{inventory.year} {formatDisplayName(inventory.make)} Special Offer</h1>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={productSchema} />
      <SpecialDetails />
      <QualityAssurance />
    </div>
  )
}