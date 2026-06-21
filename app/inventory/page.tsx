/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

import dynamic from 'next/dynamic'
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

const AllVehiclesFilter = dynamic(() => import('@/components/sections/inventorySection/AllVehiclesFilter'), {
  loading: () => <div className="py-20 text-center text-gray-500">Loading trucks...</div>,
})

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Used Trucks for Sale in South Africa',
  description: 'Browse used rigid trucks, commercial vehicles, dropside trucks, refrigerated trucks and box trucks from A-Z Truck Sales in Gauteng. View prices, mileage and details online.',
  alternates: {
    canonical: 'https://www.a-ztrucksales.com/inventory',
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://www.a-ztrucksales.com/inventory',
    siteName: 'A-Z Truck Sales',
    title: 'Used Trucks for Sale in South Africa | A-Z Truck Sales',
    description: 'Browse used rigid trucks, commercial vehicles, dropside trucks, refrigerated trucks and box trucks from A-Z Truck Sales in Gauteng. View prices, mileage and details online.',
    images: [{ url: 'https://www.a-ztrucksales.com/og-image.webp', width: 1200, height: 630, alt: 'Used Trucks for Sale - A-Z Truck Sales' }],
  },
}

const LIMIT = 25

const inventoryFaqs = [
  {
    question: 'What brands of trucks do you stock?',
    answer: 'We stock used Isuzu, Hino, Fuso, UD, Mercedes-Benz, MAN, Toyota, Nissan, Tata, Hyundai and other commercial vehicle brands. Our stock changes regularly, so buyers should check the inventory page or contact our Alberton or Boksburg team for current availability.',
  },
  {
    question: 'Are your trucks COF-ready?',
    answer: 'Many of our trucks are prepared and checked before sale, including inspection of important items such as engine, gearbox, body condition, tyres, brakes and roadworthy-related items. Ask our sales team about the current COF status of the specific truck you are interested in.',
  },
  {
    question: 'Do you offer delivery or transport?',
    answer: 'A-Z Truck Sales assists buyers from Gauteng and across South Africa. If you are outside Alberton or Boksburg, contact us with the truck you are interested in and your location so our team can advise on collection or transport options.',
  },
  {
    question: 'Can I view a truck before buying?',
    answer: 'Yes. Buyers can view trucks at our Alberton or Boksburg branches. We recommend contacting the branch first to confirm that the specific truck is still available and at the correct location.',
  },
  {
    question: 'Do you offer financing?',
    answer: 'Contact our sales team to discuss available payment options. For faster assistance, send the truck model, your budget, business details and preferred branch.',
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
      <h1 className="sr-only">Used Trucks for Sale in South Africa | A-Z Truck Sales</h1>
      <div className="sr-only">
        <span>Author: A-Z Truck Sales</span>
        <span>Last Updated: 2026-06-21</span>
        {/* application/ld+json */}
      </div>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={inventoryFaqSchema} />

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 leading-relaxed">
              Browse quality used trucks for sale from A-Z Truck Sales in Gauteng. Our inventory includes used rigid trucks, dropside trucks, refrigerated trucks, box trucks, curtain side trucks, chassis cabs and other commercial vehicles from trusted brands such as Isuzu, Hino, Fuso, UD, Mercedes-Benz, MAN and Toyota.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mt-4">
              Each listing includes important buying details such as year, mileage, fuel type, transmission, body type, truck size and price. Buyers can contact our Alberton or Boksburg team to confirm availability, arrange viewing, ask about COF readiness or discuss trade-in options.
            </p>
          </div>
        </div>
      </section>

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

      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How to Choose the Right Used Truck</h2>
            <p className="text-lg text-gray-600 mb-4">
              Before choosing a truck, consider what the vehicle must carry, how far it will travel, how it will be loaded and whether the load needs protection or refrigeration.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              Dropside trucks are often used for building materials, hardware and general loads. Box trucks are useful for furniture, parcels and protected cargo. Refrigerated trucks are suitable for food, meat, frozen goods and temperature-sensitive deliveries. Curtain side trucks are useful where side loading and palletised goods are important.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              If you are unsure which truck fits your work, contact A-Z Truck Sales with your payload needs, budget, route and preferred body type.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/specials" className="text-blue-700 hover:text-blue-800 font-medium">
                Need a cheaper deal? View truck specials →
              </Link>
              <Link href="/spares" className="text-blue-700 hover:text-blue-800 font-medium">
                Need parts? Browse truck spares →
              </Link>
              <Link href="/sell-your-truck" className="text-blue-700 hover:text-blue-800 font-medium">
                Selling your current truck? Get a trade-in estimate →
              </Link>
              <Link href="/contact" className="text-blue-700 hover:text-blue-800 font-medium">
                Need help choosing? Contact our team →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
