import React from 'react'
import TruckDetail from '@/components/sections/inventorySection/TruckDetail'
import QualityAssurance from '@/components/sections/inventorySection/QualityAssurance'

import { prisma } from '@/lib/prisma'
import { cache } from 'react'
import { Metadata } from 'next'
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
    return {
      title: 'Vehicle Not Found',
    }
  }

  let title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`
  if (title.length > 40) {
    title = title.substring(0, 37) + '...'
  }

  const baseDescription = `${vehicle.condition} ${vehicle.year} ${vehicle.make} ${vehicle.model} for sale in Gauteng. ${vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km.` : ''}`.trim()
  const charsLeft = 155 - baseDescription.length
  let description = baseDescription

  if (charsLeft > 5 && vehicle.description) {
    const cleanDesc = vehicle.description.replace(/\s+/g, ' ').trim()
    description = `${baseDescription} ${cleanDesc.substring(0, charsLeft)}${cleanDesc.length > charsLeft ? '...' : ''}`
  }

  const canonicalUrl = `https://www.a-ztrucksales.com/inventory/${vehicle.slug}`
  const images = Array.isArray(vehicle.images)
    ? (vehicle.images as any[]).map((img) => img.url)
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
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

/* application/ld+json */ export default async function VehicleDetails({ params }: Props) {
  const { slug } = await params
  const vehicle = await getVehicle(slug)

  if (!vehicle) {
    return <div>Vehicle not found</div>
  }

  const images = Array.isArray(vehicle.images) 
    ? (vehicle.images as any[]).map(img => img.url)
    : []

  const offerSchema: Record<string, unknown> = {
    '@type': 'Offer',
    url: `https://www.a-ztrucksales.com/inventory/${vehicle.slug}`,
    priceCurrency: 'ZAR',
    itemCondition: vehicle.condition === 'NEW' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
    availability: 'https://schema.org/InStock',
    seller: { '@type': 'Organization', name: 'A-Z Truck Sales' },
  }
  if (vehicle.vatPrice != null) {
    offerSchema.price = vehicle.vatPrice
  }

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    image: images.length > 0 ? images : undefined,
    description: vehicle.description || undefined,
    vehicleIdentificationNumber: vehicle.registrationNo || undefined,
    brand: { '@type': 'Brand', name: vehicle.make },
    manufacturer: { '@type': 'Organization', name: vehicle.make },
    modelDate: String(vehicle.year),
    mileageFromOdometer: vehicle.mileage != null ? {
      '@type': 'QuantitativeValue',
      value: vehicle.mileage,
      unitCode: 'KMT',
    } : undefined,
    vehicleCondition: vehicle.condition === 'NEW' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
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
          text: 'Yes. Viewings by appointment at our Alberton workshop. Call 011 902 6071 to arrange.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you offer warranty on this truck?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Every truck is workshop-serviced and COF-certified before sale. Ask about our service packages.',
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

  return (
    <div>
      <JsonLd data={productSchema} />
      <JsonLd data={vehicleFaqSchema} />
      <TruckDetail vehicle={vehicle} />
      <QualityAssurance />
    </div>
  )
}
