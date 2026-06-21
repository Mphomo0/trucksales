import React from 'react'
import TruckDetail from '@/components/sections/inventorySection/TruckDetail'
import QualityAssurance from '@/components/sections/inventorySection/QualityAssurance'

import { prisma } from '@/lib/prisma'
import { cache } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/global/JsonLd'

export const dynamic = 'force-static'
export const revalidate = false

/** Cached per-request so generateMetadata and the page share one DB query */
const getVehicle = cache(async (slug: string) =>
  prisma.inventory.findUnique({ where: { slug } })
)

export async function generateStaticParams() {
  const vehicles = await prisma.inventory.findMany({
    select: { slug: true },
    orderBy: { createdAt: 'desc' },
  })
  return vehicles.map((v) => ({ slug: v.slug }))
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const vehicle = await getVehicle(slug)

  if (!vehicle) {
    notFound()
  }

  const titlePage = `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.bodyType ? ` ${vehicle.bodyType}` : ''} for Sale`

  const mileageDesc = vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : ''
  const transmissionDesc = vehicle.transmission?.toLowerCase() ?? 'manual'
  const fuelDesc = vehicle.fuelType?.toLowerCase() ?? 'diesel'
  const description = `View this ${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.bodyType ? ` ${vehicle.bodyType}` : ''} for sale in Gauteng.${mileageDesc ? ` ${mileageDesc},` : ''} ${transmissionDesc}, ${fuelDesc}. Contact A-Z Truck Sales for price, viewing and availability.`

  const canonicalUrl = `https://www.a-ztrucksales.com/inventory/${vehicle.slug}`
  const images = Array.isArray(vehicle.images)
    ? (vehicle.images as { url: string }[]).map((img) => img.url)
    : []
  const ogImage = images.length > 0
    ? [{ url: images[0], width: 1200, height: 630, alt: titlePage }]
    : [{ url: 'https://www.a-ztrucksales.com/og-image.webp', width: 1200, height: 630, alt: 'A-Z Truck Sales' }]

  return {
    title: titlePage,
    description,
    openGraph: {
      type: 'website',
      locale: 'en_ZA',
      url: canonicalUrl,
      siteName: 'A-Z Truck Sales',
      title: titlePage,
      description,
      images: ogImage,
    },
    twitter: {
      card: 'summary_large_image',
      title: titlePage,
      description,
      images: [ogImage[0].url],
    },
    alternates: { canonical: canonicalUrl },
  }
}

/* application/ld+json */ export default async function VehicleDetails({ params }: Props) {
  const { slug } = await params
  const vehicle = await getVehicle(slug)

  if (!vehicle) {
    notFound()
  }

  const images = Array.isArray(vehicle.images)
    ? (vehicle.images as { url: string }[]).map(img => img.url)
    : []

  const description = `This ${vehicle.year} ${vehicle.make} ${vehicle.model} is a used ${vehicle.truckSize ?? ''} ${vehicle.bodyType ?? ''} truck available from A-Z Truck Sales in Gauteng. It has ${vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : ''}, a ${(vehicle.fuelType ?? 'diesel').toLowerCase()} engine and ${(vehicle.transmission ?? 'manual').toLowerCase()} transmission.`

  const offerSchema: Record<string, unknown> = {
    '@type': 'Offer',
    url: `https://www.a-ztrucksales.com/inventory/${vehicle.slug}`,
    priceCurrency: 'ZAR',
    itemCondition: vehicle.condition === 'NEW'
      ? 'https://schema.org/NewCondition'
      : 'https://schema.org/UsedCondition',
    availability: 'https://schema.org/InStock',
    seller: { '@id': 'https://www.a-ztrucksales.com/#business' },
  }
  const price = vehicle.vatPrice ?? vehicle.pricenoVat
  if (price != null) {
    offerSchema.price = price
  }

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `https://www.a-ztrucksales.com/inventory/${vehicle.slug}#product`,
    name: `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.bodyType ? ` ${vehicle.bodyType}` : ''}`,
    description,
    image: images.length > 0 ? images : undefined,
    brand: { '@type': 'Brand', name: vehicle.make },
    sku: vehicle.registrationNo || vehicle.slug,
    offers: offerSchema,
  }

  const vehicleFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is this truck still available?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Stock changes daily. Contact us at 011 902 6071 to confirm availability.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I view and test drive this truck?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Viewings by appointment at our Alberton branch. Call 011 902 6071 to arrange.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you offer warranty on this truck?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Every truck is COF-certified before sale. Contact us for full vehicle details.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I trade in my current truck?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. We accept trade-ins and can use your current truck as partial payment.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you deliver trucks?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we can arrange transport of purchased vehicles across South Africa.',
        },
      },
    ],
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.a-ztrucksales.com/' },
      { '@type': 'ListItem', position: 2, name: 'Inventory', item: 'https://www.a-ztrucksales.com/inventory' },
      { '@type': 'ListItem', position: 3, name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`, item: `https://www.a-ztrucksales.com/inventory/${vehicle.slug}` },
    ],
  }

  return (
    <div>
      <JsonLd data={productSchema} />
      <JsonLd data={vehicleFaqSchema} />
      <JsonLd data={breadcrumbSchema} />
      <TruckDetail vehicle={vehicle} />
      <QualityAssurance />
    </div>
  )
}
