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

  return (
    <div>
      <h1 className="sr-only">{inventory.year} {inventory.make} Special Offer</h1>
      <GeoHints />
      <JsonLd data={breadcrumbSchema} />
      <SpecialDetails />
    </div>
  )
}