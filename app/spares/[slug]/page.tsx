/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

import React from 'react'
import SpareDetail from '@/components/sections/spares/SpareDetail'
import { prisma } from '@/lib/prisma'
import { cache } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/global/JsonLd'
import { buildSpareDescription, buildSpareTitle, formatMake, formatSpareName } from '@/lib/spares'

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

  const title = buildSpareTitle(spare.name)
  const description = buildSpareDescription(spare)

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
    notFound()
  }

  const images = Array.isArray(spare.images) 
    ? (spare.images as any[]).map(img => img.url)
    : []

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `https://www.a-ztrucksales.com/spares/${spare.slug}#product`,
    name: formatSpareName(spare.name),
    sku: spare.slug,
    image: images,
    description: spare.description,
    brand: {
      '@type': 'Brand',
      name: formatMake(spare.make),
    },
    offers: {
      '@type': 'Offer',
      url: `https://www.a-ztrucksales.com/spares/${spare.slug}`,
      seller: { '@id': 'https://www.a-ztrucksales.com/#org' },
      priceCurrency: 'ZAR',
      price: spare.price,
      itemCondition: spare.condition === 'NEW' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
      availability: 'https://schema.org/InStock',
    },
  }


  const related = await prisma.spares.findMany({
    where: {
      id: { not: spare.id },
      OR: [{ category: spare.category }, { make: spare.make }],
    },
    select: { slug: true, name: true, make: true, category: true, price: true },
    orderBy: { createdAt: 'desc' },
    take: 12,
  })
  // Same category first, then same make, four links max
  const relatedSpares = [
    ...related.filter((r) => r.category === spare.category),
    ...related.filter((r) => r.category !== spare.category),
  ].slice(0, 4)

  return (
    <div>
      <JsonLd data={productSchema} />
      <SpareDetail spare={spare} related={relatedSpares} />
    </div>
  )
}
