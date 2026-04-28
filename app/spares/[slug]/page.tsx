/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */

import React from 'react'
import SpareDetail from '@/components/sections/spares/SpareDetail'
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'
import JsonLd from '@/components/global/JsonLd'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const spare = await prisma.spares.findUnique({
    where: { slug },
  })

  if (!spare) {
    return {
      title: 'Spare Part Not Found',
    }
  }

  const title = `${spare.name} | ${spare.category} Spare Parts | A-Z Truck Sales`
  const description = `${spare.condition} ${spare.name} for ${spare.make}. ${spare.description.substring(0, 150)}...`
  
  const images = Array.isArray(spare.images) 
    ? (spare.images as any[]).map(img => img.url)
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

/* application/ld+json */ export default async function SparePartDetails({ params }: Props) {
  const { slug } = await params
  const spare = await prisma.spares.findUnique({
    where: { slug },
  })

  if (!spare) {
    return <div>Spare part not found</div>
  }

  const images = Array.isArray(spare.images) 
    ? (spare.images as any[]).map(img => img.url)
    : []

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: spare.name,
    image: images,
    description: spare.description,
    brand: {
      '@type': 'Brand',
      name: spare.make,
    },
    offers: {
      '@type': 'Offer',
      url: `https://www.a-ztrucksales.com/spares/${spare.slug}`,
      priceCurrency: 'ZAR',
      price: spare.price,
      itemCondition: spare.condition === 'NEW' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <div>
      <div className="sr-only">
        <h1>{spare.name}</h1>
        <span>Author: A-Z Truck Sales</span>
        <span>Last Updated: 2026-04-27</span>
        {/* application/ld+json */}
      </div>
      <JsonLd data={productSchema} />
      <SpareDetail />
    </div>
  )
}
