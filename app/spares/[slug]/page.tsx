/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

import React from 'react'
import SpareDetail from '@/components/sections/spares/SpareDetail'
import { prisma } from '@/lib/prisma'
import { cache } from 'react'
import { Metadata } from 'next'
import JsonLd from '@/components/global/JsonLd'

export const dynamic = 'force-static'
export const revalidate = false

/** Cached per-request so generateMetadata and the page share one DB query */
const getSpare = cache(async (slug: string) =>
  prisma.spares.findUnique({ where: { slug } })
)

export async function generateStaticParams() {
  const spares = await prisma.spares.findMany({
    select: { slug: true },
    orderBy: { createdAt: 'desc' },
  })
  return spares.map((s) => ({ slug: s.slug }))
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const spare = await getSpare(slug)

  if (!spare) {
    return {
      title: 'Spare Part Not Found',
    }
  }

  let title = `${spare.name} | ${spare.category} | Gauteng`
  if (title.length > 60) {
    title = title.substring(0, 57) + '...'
  }

  const baseDescription = `${spare.condition} ${spare.name} for ${spare.make} trucks. Available at A-Z Truck Sales, Gauteng.`.trim()
  const charsLeft = 155 - baseDescription.length
  let description = baseDescription

  if (charsLeft > 5 && spare.description) {
    const cleanDesc = spare.description.replace(/\s+/g, ' ').trim()
    description = `${baseDescription} ${cleanDesc.substring(0, charsLeft)}${cleanDesc.length > charsLeft ? '...' : ''}`
  }

  const canonicalUrl = `https://www.a-ztrucksales.com/spares/${spare.slug}`
  const images = Array.isArray(spare.images)
    ? (spare.images as any[]).map((img) => img.url)
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

/* application/ld+json */ export default async function SparePartDetails({ params }: Props) {
  const { slug } = await params
  const spare = await getSpare(slug)

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
      <JsonLd data={productSchema} />
      <JsonLd data={spareFaqSchema} />
      <SpareDetail spare={spare} />
    </div>
  )
}
