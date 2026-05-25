/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

import AllVehiclesFilter from '@/components/sections/inventorySection/AllVehiclesFilter'
import InventoryFeatures from '@/components/sections/inventorySection/InventoryFeatures'
import { Metadata } from 'next'
import JsonLd from '@/components/global/JsonLd'
import GeoHints from '@/components/global/GeoHints'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { prisma } from '@/lib/prisma'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Used Truck Inventory | A-Z Truck Sales South Africa',
  description: 'Browse quality used trucks for sale at A-Z Truck Sales. 1.5-16 ton rigids, all workshop-serviced. Isuzu, Hino, Mercedes-Benz, Ford.',
  alternates: {
    canonical: 'https://www.a-ztrucksales.com/inventory',
  },
}

const inventoryFaqs = [
  {
    question: 'What brands of trucks do you stock?',
    answer: 'We stock Isuzu, Hino, Mercedes-Benz, Ford, and other major brands of rigid trucks from 1.5 to 16 tons.',
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

  const [vehicles, total] = await Promise.all([
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
  ])

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
    '@id': 'https://www.a-ztrucksales.com/inventory/#faq',
    name: 'Inventory - Frequently Asked Questions',
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
      <GeoHints />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={inventoryFaqSchema} />
      
      

      <AllVehiclesFilter initialVehicles={vehicles} initialMeta={initialMeta} />

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
