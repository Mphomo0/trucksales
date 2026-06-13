/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

import AllVehiclesFilter from '@/components/sections/inventorySection/AllVehiclesFilter'
import InventoryFeatures from '@/components/sections/inventorySection/InventoryFeatures'
import { Metadata } from 'next'
import JsonLd from '@/components/global/JsonLd'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { prisma } from '@/lib/prisma'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Used Trucks for Sale | Alberton, Gauteng',
  description: 'Browse 100+ used rigid trucks for sale in Gauteng. 1.5-35 ton, workshop-serviced & COF-ready. Isuzu, Hino, Mercedes-Benz, Ford, DAF, MAN. Call 011 902 6071.',
  alternates: {
    canonical: 'https://www.a-ztrucksales.com/inventory',
  },
}

const inventoryFaqs = [
  {
    question: 'What brands of trucks do you stock?',
    answer: 'We stock Isuzu, Hino, Mercedes-Benz, Ford, DAF, MAN, UD Trucks, and other major brands of rigid trucks from 1.5 to 35 tons.',
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

export default async function Inventory() {
  const LIMIT = 25

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

  const initialFilterOptions = {
    makes: makesResult.map((r) => r.make).filter(Boolean) as string[],
    models: modelsResult.map((r) => r.model).filter(Boolean) as string[],
    bodyTypes: bodyTypesResult.map((r) => r.bodyType).filter(Boolean) as string[],
    truckSizes: truckSizesResult.map((r) => r.truckSize).filter(Boolean) as string[],
  }

  const initialMeta = {
    total,
    page: 1,
    limit: LIMIT,
    totalPages: Math.ceil(total / LIMIT),
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
    </div>
  )
}
