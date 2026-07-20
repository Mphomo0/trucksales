import React from 'react'
import TruckDetail from '@/components/sections/inventorySection/TruckDetail'
import QualityAssurance from '@/components/sections/inventorySection/QualityAssurance'
import RelatedVehicles from '@/components/sections/inventorySection/RelatedVehicles'

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

  const toTitleCase = (s: string) =>
    s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())

  const buildTitle = () => {
    const suffix = ' for Sale | A-Z Truck Sales'
    const make = toTitleCase(vehicle.make)
    const model = toTitleCase(vehicle.model)
    const body = vehicle.bodyType ? ` ${toTitleCase(vehicle.bodyType)}` : ''
    // Differentiates identical stock units that share year/make/model/body
    const unit = vehicle.mileage
      ? ` ${Math.round(vehicle.mileage / 1000)}k km`
      : vehicle.registrationNo
        ? ` ${vehicle.registrationNo.toUpperCase()}`
        : ''
    // Drop parts in priority order until the full title fits within 60 chars
    const candidates = [
      `${vehicle.year} ${make} ${model}${body}${unit}${suffix}`,
      `${vehicle.year} ${make} ${model}${unit}${suffix}`,
      `${vehicle.year} ${make} ${model}${body}${suffix}`,
      `${vehicle.year} ${make} ${model}${suffix}`,
    ]
    for (const c of candidates) if (c.length <= 60) return c
    const available = 60 - suffix.length - String(vehicle.year).length - 1 - make.length - 1
    return `${vehicle.year} ${make} ${model.slice(0, Math.max(available, 10))}${suffix}`
  }
  const titlePage = buildTitle()

  const mileageDesc = vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : ''
  const transmissionDesc = vehicle.transmission?.toLowerCase() ?? 'manual'
  const fuelDesc = vehicle.fuelType?.toLowerCase() ?? 'diesel'
  let description = `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.bodyType ? ` ${vehicle.bodyType}` : ''} for sale in Gauteng.${mileageDesc ? ` ${mileageDesc},` : ''} ${transmissionDesc}, ${fuelDesc}. Contact A-Z Truck Sales to view.`
  if (description.length > 155) {
    description = `${vehicle.year} ${vehicle.make} ${vehicle.model} for sale in Gauteng. Contact A-Z Truck Sales to view.`
  }

  const canonicalUrl = `https://www.a-ztrucksales.com/inventory/${vehicle.slug}`
  const images = Array.isArray(vehicle.images)
    ? (vehicle.images as { url: string }[]).map((img) => img.url)
    : []
  const ogImage = images.length > 0
    ? [{ url: images[0], width: 1200, height: 630, alt: titlePage }]
    : [{ url: 'https://www.a-ztrucksales.com/og-image.webp', width: 1200, height: 630, alt: 'A-Z Truck Sales' }]

  return {
    title: { absolute: titlePage },
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
    seller: { '@id': 'https://www.a-ztrucksales.com/#org' },
  }
  const price = vehicle.vatPrice ?? vehicle.pricenoVat
  if (price != null) {
    offerSchema.price = price
  }

  const toTitleCase = (s: string) =>
    s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())

  const vehicleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    '@id': `https://www.a-ztrucksales.com/inventory/${vehicle.slug}#product`,
    name: `${vehicle.year} ${toTitleCase(vehicle.make)} ${toTitleCase(vehicle.model)}${vehicle.bodyType ? ` ${toTitleCase(vehicle.bodyType)}` : ''}`,
    description,
    image: images.length > 0 ? images : undefined,
    brand: { '@type': 'Brand', name: toTitleCase(vehicle.make) },
    sku: vehicle.registrationNo || vehicle.slug,
    vehicleModelDate: `${vehicle.year}-01-01`,
    ...(vehicle.mileage != null && {
      mileageFromOdometer: {
        '@type': 'QuantitativeValue',
        value: vehicle.mileage,
        unitCode: 'KMT',
      },
    }),
    ...(vehicle.transmission && { vehicleTransmission: vehicle.transmission }),
    ...(vehicle.fuelType && { fuelType: vehicle.fuelType }),
    ...(vehicle.bodyType && { bodyType: vehicle.bodyType }),
    vehicleCondition: vehicle.condition === 'NEW'
      ? 'https://schema.org/NewCondition'
      : 'https://schema.org/UsedCondition',
    offers: offerSchema,
  }

  const productSchema = vehicleSchema

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

  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/)
    return match ? match[1] : null
  }

  const relatedVehicles = await prisma.inventory.findMany({
    where: { make: vehicle.make, slug: { not: vehicle.slug } },
    select: { slug: true, year: true, make: true, model: true, bodyType: true, vatPrice: true, images: true },
    orderBy: { createdAt: 'desc' },
    take: 4,
  })

  const videoSchema = vehicle.videoLink
    ? (() => {
        const ytId = extractYouTubeId(vehicle.videoLink)
        if (!ytId) return null
        const vehicleName = `${vehicle.year} ${toTitleCase(vehicle.make)} ${toTitleCase(vehicle.model)}${vehicle.bodyType ? ` ${toTitleCase(vehicle.bodyType)}` : ''}`
        return {
          '@context': 'https://schema.org',
          '@type': 'VideoObject',
          name: `${vehicleName} - Vehicle Walkthrough`,
          description: `Watch this video walkthrough of the ${vehicleName} available at A-Z Truck Sales in Gauteng.`,
          thumbnailUrl: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
          embedUrl: `https://www.youtube.com/embed/${ytId}`,
          uploadDate: `${vehicle.year}-01-01T00:00:00+00:00`,
          publisher: {
            '@type': 'Organization',
            name: 'A-Z Truck Sales',
            logo: {
              '@type': 'ImageObject',
              url: 'https://www.a-ztrucksales.com/images/logo.png',
            },
          },
        }
      })()
    : null

  return (
    <div>
      <JsonLd data={productSchema} />
      <JsonLd data={vehicleFaqSchema} />
      <JsonLd data={breadcrumbSchema} />
      {videoSchema && <JsonLd data={videoSchema} />}
      <TruckDetail vehicle={vehicle} />
      <RelatedVehicles
        vehicles={relatedVehicles.map(v => ({ ...v, images: (v.images as { url: string }[]) }))}
        make={vehicle.make}
      />
      <QualityAssurance />
    </div>
  )
}
