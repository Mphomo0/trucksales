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
  const special = await prisma.specials.findUnique({
    where: { slug },
    include: { inventory: true },
  })

  if (!special) {
    return {
      title: 'Special Not Found',
    }
  }

  const title = `Special Offer: ${special.inventory.year} ${special.inventory.make} | A-Z Truck Sales`
  const description = `Don't miss this special offer on a ${special.inventory.year} ${special.inventory.make} ${special.inventory.model}. Limited time deal at A-Z Truck Sales.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    alternates: {
      canonical: `https://www.a-ztrucksales.com/specials/${special.slug}`,
    },
  }
}

/* application/ld+json */ export default async function Special({ params }: Props) {
  const { slug } = await params
  const special = await prisma.specials.findUnique({
    where: { slug },
    include: { inventory: true },
  })

  if (!special) {
    return <div>Special not found</div>
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.a-ztrucksales.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Specials',
        item: 'https://www.a-ztrucksales.com/specials',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: special.inventory.name,
        item: `https://www.a-ztrucksales.com/specials/${special.slug}`,
      },
    ],
  }

  return (
    <div>
      <h1 className="sr-only">{special.inventory.year} {special.inventory.make} Special Offer</h1>
      <GeoHints />
      <JsonLd data={breadcrumbSchema} />
      <SpecialDetails />
    </div>
  )
}
