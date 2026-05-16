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

  let title = `${spare.name} | ${spare.category}`
  if (title.length > 42) {
    title = title.substring(0, 39) + '...'
  }

  const baseDescription = `${spare.condition} ${spare.name} for ${spare.make}.`.trim()
  const charsLeft = 150 - baseDescription.length
  let description = baseDescription
  
  if (charsLeft > 5 && spare.description) {
    const cleanDesc = spare.description.replace(/\s+/g, ' ').trim()
    description = `${baseDescription} ${cleanDesc.substring(0, charsLeft)}${cleanDesc.length > charsLeft ? '...' : ''}`
  }

  
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
    alternates: {
      canonical: `https://www.a-ztrucksales.com/spares/${spare.slug}`,
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

  const spareFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is this part in stock?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Contact us at 011 902 6071 to confirm stock before visiting.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you ship parts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We can arrange courier delivery across South Africa. Shipping costs depend on size and destination.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is this part workshop-tested?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. All our spare parts are inspected and tested in our Alberton workshop before sale.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you offer warranty?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Warranty terms depend on the specific part. Contact us for details on coverage.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I return this part if it does not fit?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Please confirm compatibility before purchase. Contact us within 48 hours if the part is incorrect.',
        },
      },
    ],
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
      <JsonLd data={spareFaqSchema} />
      <SpareDetail spare={spare} />
    </div>
  )
}
