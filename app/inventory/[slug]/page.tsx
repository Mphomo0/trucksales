import React from 'react'
import TruckDetail from '@/components/sections/inventorySection/TruckDetail'
import QualityAssurance from '@/components/sections/inventorySection/QualityAssurance'

import { prisma } from '@/lib/prisma'
import { cache } from 'react'
import { Metadata } from 'next'
import JsonLd from '@/components/global/JsonLd'

export const dynamic = 'force-static'
export const revalidate = 86400

/** Cached per-request so generateMetadata and the page share one DB query */
const getVehicle = cache(async (slug: string) =>
  prisma.inventory.findUnique({ where: { slug } })
)

export async function generateStaticParams() {
  const vehicles = await prisma.inventory.findMany({
    select: { slug: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
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
  if (title.length > 42) {
    title = title.substring(0, 39) + '...'
  }

  const baseDescription = `${vehicle.condition} ${vehicle.year} ${vehicle.make} ${vehicle.model} for sale. ${vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km.` : ''}`.trim()
  const charsLeft = 150 - baseDescription.length
  let description = baseDescription
  
  if (charsLeft > 5 && vehicle.description) {
    const cleanDesc = vehicle.description.replace(/\s+/g, ' ').trim()
    description = `${baseDescription} ${cleanDesc.substring(0, charsLeft)}${cleanDesc.length > charsLeft ? '...' : ''}`
  }

  
  const images = Array.isArray(vehicle.images) 
    ? (vehicle.images as any[]).map(img => img.url)
    : []

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: images.length > 0 ? [images[0]] : [],
    },
    alternates: {
      canonical: `https://www.a-ztrucksales.com/inventory/${vehicle.slug}`,
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

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    image: images,
    description: vehicle.description,
    sku: vehicle.registrationNo || vehicle.id,
    brand: {
      '@type': 'Brand',
      name: vehicle.make,
    },
    offers: {
      '@type': 'Offer',
      url: `https://www.a-ztrucksales.com/inventory/${vehicle.slug}`,
      priceCurrency: 'ZAR',
      price: vehicle.vatPrice,
      itemCondition: vehicle.condition === 'NEW' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
      availability: 'https://schema.org/InStock',
    },
  }

  const vehicleFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `https://www.a-ztrucksales.com/inventory/${vehicle.slug}/#faq`,
    name: `${vehicle.name} - Frequently Asked Questions`,
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
      <div className="sr-only">
        <h1>{vehicle.year} {vehicle.make} {vehicle.model}</h1>
        <span>Author: A-Z Truck Sales</span>
        <span>Last Updated: 2026-04-27</span>
        {/* application/ld+json */}
      </div>
      <JsonLd data={productSchema} />
      <JsonLd data={vehicleFaqSchema} />
      <TruckDetail vehicle={vehicle} />
      <QualityAssurance />
    </div>
  )
}
