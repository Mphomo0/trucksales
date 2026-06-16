/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

import AllVehiclesFilter from '@/components/sections/inventorySection/AllVehiclesFilter'
import InventoryFeatures from '@/components/sections/inventorySection/InventoryFeatures'
import { Metadata } from 'next'
import JsonLd from '@/components/global/JsonLd'
import Link from 'next/link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Browse Used Trucks for Sale in South Africa',
  description: 'Browse 100+ used trucks for sale in Gauteng. Isuzu, Hino, Mercedes-Benz, MAN, Fuso and UD Trucks from 1.5 to 35 tons. Workshop-serviced, COF-ready.',
  alternates: {
    canonical: 'https://www.a-ztrucksales.com/inventory',
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://www.a-ztrucksales.com/inventory',
    siteName: 'A-Z Truck Sales',
    title: 'Browse Used Trucks for Sale in South Africa | A-Z Truck Sales',
    description: 'Browse 100+ used trucks for sale in Gauteng. Isuzu, Hino, Mercedes-Benz, MAN, Fuso and UD Trucks from 1.5 to 35 tons. Workshop-serviced, COF-ready.',
    images: [{ url: 'https://www.a-ztrucksales.com/og-image.webp', width: 1200, height: 630, alt: 'Used Trucks for Sale - A-Z Truck Sales' }],
  },
}

const LIMIT = 25

const inventoryFaqs = [
  {
    question: 'What brands of trucks do you stock?',
    answer: 'We stock Isuzu, Hino, Mercedes-Benz, Ford, MAN, Fuso, Toyota, Nissan, Tata, Hyundai, Volkswagen and UD Trucks — rigid trucks from 1.5 to 35 tons.',
  },
  {
    question: 'Are your trucks workshop-serviced?',
    answer: 'Yes. Every truck goes through our in-house workshop and must pass a COF inspection before sale.',
  },
  {
    question: 'Do you offer delivery or transport?',
    answer: 'Yes, we can arrange transport of purchased vehicles across South Africa.',
  },
  {
    question: 'Can I view a truck before buying?',
    answer: 'Yes, visits are by appointment at our Alberton branch. Call 011 902 6071 to arrange.',
  },
  {
    question: 'Do you offer financing?',
    answer: 'We work with various vehicle finance providers. Contact our team for options.',
  },
]

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
      name: 'Inventory',
      item: 'https://www.a-ztrucksales.com/inventory',
    },
  ],
}

const inventoryFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: inventoryFaqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
}

const getAllInventorySlugs = unstable_cache(
  async () => {
    return prisma.inventory.findMany({
      select: { slug: true, year: true, make: true, model: true },
      orderBy: { createdAt: 'desc' },
    })
  },
  ['all-inventory-slugs'],
  { revalidate: 86400, tags: ['inventory'] }
)

const getInventoryPageData = unstable_cache(
  async () => {
    const [vehicles, total, makesResult, modelsResult, bodyTypesResult, truckSizesResult] = await Promise.all([
      prisma.inventory.findMany({
        take: LIMIT,
        skip: 0,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          make: true,
          model: true,
          year: true,
          vatPrice: true,
          pricenoVat: true,
          mileage: true,
          fuelType: true,
          condition: true,
          transmission: true,
          images: true,
          description: true,
          bodyType: true,
          truckSize: true,
          slug: true,
          specialPrice: true,
          specialValidFrom: true,
          specialValidTo: true,
        },
      }),
      prisma.inventory.count(),
      prisma.inventory.findMany({ distinct: ['make'], select: { make: true }, orderBy: { make: 'asc' } }),
      prisma.inventory.findMany({ distinct: ['model'], select: { model: true }, orderBy: { model: 'asc' } }),
      prisma.inventory.findMany({ distinct: ['bodyType'], select: { bodyType: true }, where: { bodyType: { not: null } } }),
      prisma.inventory.findMany({ distinct: ['truckSize'], select: { truckSize: true }, where: { truckSize: { not: null } } }),
    ])
    return { vehicles, total, makesResult, modelsResult, bodyTypesResult, truckSizesResult }
  },
  ['inventory-page-initial'],
  { revalidate: 86400, tags: ['inventory'] }
)

export default async function Inventory() {
  const [{ vehicles, total, makesResult, modelsResult, bodyTypesResult, truckSizesResult }, allVehicles] = await Promise.all([
    getInventoryPageData(),
    getAllInventorySlugs(),
  ])

  const dedupeCaseInsensitive = (items: (string | null)[]) => {
    const seen = new Set<string>()
    return items.filter((item): item is string => {
      if (!item) return false
      const lower = item.trim().toLowerCase()
      if (seen.has(lower)) return false
      seen.add(lower)
      return true
    })
  }

  const initialFilterOptions = {
    makes: dedupeCaseInsensitive(makesResult.map((r) => r.make)),
    models: dedupeCaseInsensitive(modelsResult.map((r) => r.model)),
    bodyTypes: dedupeCaseInsensitive(bodyTypesResult.map((r) => r.bodyType)),
    truckSizes: dedupeCaseInsensitive(truckSizesResult.map((r) => r.truckSize)),
  }

  const initialMeta = {
    total,
    page: 1,
    limit: LIMIT,
    totalPages: Math.ceil(total / LIMIT),
  }

  return (
    <div>
      <h1 className="sr-only">Truck Inventory | Used Rigid Trucks | A-Z Truck Sales</h1>
      <div className="sr-only">
        <span>Author: A-Z Truck Sales</span>
        <span>Last Updated: 2026-04-27</span>
        {/* application/ld+json */}
      </div>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={inventoryFaqSchema} />

      <AllVehiclesFilter initialVehicles={vehicles} initialMeta={initialMeta} initialFilterOptions={initialFilterOptions} />

      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-neutral-600">Common questions about buying a truck from us.</p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {inventoryFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-white px-6 rounded-lg mb-4 border border-neutral-200">
                  <AccordionTrigger className="text-left font-semibold py-4 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-600 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-10 border-t border-neutral-200 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-base font-semibold text-neutral-700 mb-4">All {allVehicles.length} Trucks in Stock</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {allVehicles.map((v) => (
              <li key={v.slug}>
                <Link href={`/inventory/${v.slug}`} className="text-sm text-blue-700 hover:underline">
                  {v.year} {v.make} {v.model}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
