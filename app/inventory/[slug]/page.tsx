/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */

import React from 'react'
import TruckDetail from '@/components/sections/inventorySection/TruckDetail'
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'
import JsonLd from '@/components/global/JsonLd'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const vehicle = await prisma.inventory.findUnique({
    where: { slug },
  })

  if (!vehicle) {
    return {
      title: 'Vehicle Not Found',
    }
  }

  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} | A-Z Truck Sales`
  const description = `${vehicle.condition} ${vehicle.year} ${vehicle.make} ${vehicle.model} for sale. ${vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km.` : ''} ${vehicle.description.substring(0, 100)}...`
  
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
  }
}

/* application/ld+json */ export default async function VehicleDetails({ params }: Props) {
  const { slug } = await params
  const vehicle = await prisma.inventory.findUnique({
    where: { slug },
  })

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

  return (
    <div>
      <div className="sr-only">
        <h1>{vehicle.year} {vehicle.make} {vehicle.model}</h1>
        <span>Author: A-Z Truck Sales</span>
        <span>Last Updated: 2026-04-27</span>
        {/* application/ld+json */}
      </div>
      <JsonLd data={productSchema} />
      <TruckDetail />
    </div>
  )
}
