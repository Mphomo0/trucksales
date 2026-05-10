/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */

import SpecialDetails from '@/components/sections/special/SpecialDetails'
import React from 'react'
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'
import JsonLd from '@/components/global/JsonLd'
import GeoHints from '@/components/global/GeoHints'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const now = new Date()
  
  const inventory = await prisma.inventory.findUnique({
    where: { slug },
  })

  if (!inventory || !inventory.specialValidTo || !inventory.specialValidFrom) {
    return { title: 'Special Not Found' }
  }

  if (now > inventory.specialValidTo || now < inventory.specialValidFrom) {
    return { title: 'Special Expired' }
  }

  const title = `Special Offer: ${inventory.year} ${inventory.make} | A-Z Truck Sales`
  const description = `Don't miss this special offer on a ${inventory.year} ${inventory.make} ${inventory.model}. Limited time deal at A-Z Truck Sales.`

  return {
    title,
    description,
    openGraph: { title, description },
    alternates: { canonical: `https://www.a-ztrucksales.com/specials/${slug}` },
  }
}

export default async function Special({ params }: Props) {
  const { slug } = await params
  const now = new Date()
  
  const inventory = await prisma.inventory.findUnique({
    where: { slug },
  })

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

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${inventory.year} ${inventory.make} ${inventory.model}`,
    image: images,
    description: inventory.description,
    sku: inventory.registrationNo || inventory.id,
    brand: { '@type': 'Brand', name: inventory.make },
    offers: {
      '@type': 'Offer',
      url: `https://www.a-ztrucksales.com/specials/${slug}`,
      priceCurrency: 'ZAR',
      price: inventory.specialPrice || inventory.vatPrice,
      itemCondition: inventory.condition === 'NEW' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
      availability: 'https://schema.org/InStock',
    },
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
    </div>
  )
}