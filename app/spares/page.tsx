/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

import AllSparesFilter from '@/components/sections/spares/AllSparesFilter'
import SparesFeatures from '@/components/sections/spares/SparesFeatures'
import { Metadata } from 'next'
import JsonLd from '@/components/global/JsonLd'
import GeoHints from '@/components/global/GeoHints'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export const metadata: Metadata = {
  title: 'Truck Spares & Parts | Engines, Gearboxes & Diffs',
  description: 'Quality used truck spares in Gauteng. Engines, gearboxes, diffs and more.',
  alternates: {
    canonical: 'https://www.a-ztrucksales.com/spares',
  },
}

const sparesFaqs = [
  {
    question: 'What truck brands do you stock parts for?',
    answer: 'We stock parts for Isuzu, Hino, Mercedes-Benz, Ford, and other major commercial vehicle brands.',
  },
  {
    question: 'Do you offer warranty on spare parts?',
    answer: 'All our parts are workshop-tested before sale. Warranty terms depend on the specific part - contact us for details.',
  },
  {
    question: 'Can I order a specific part?',
    answer: 'Yes, we can source specific parts based on your requirements. Contact our spares team to check availability.',
  },
  {
    question: 'Do you sell engines and gearboxes?',
    answer: 'Yes. We stock tested engines and gearboxes for various truck makes, priced according to condition and mileage.',
  },
  {
    question: 'Can I view parts before purchase?',
    answer: 'Yes, parts can be viewed at our Alberton workshop by appointment. Call 011 902 6071.',
  },
]

/* application/ld+json */ export default function Spares() {
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
        name: 'Spares',
        item: 'https://www.a-ztrucksales.com/spares',
      },
    ],
  }

  const sparesFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: sparesFaqs.map((faq) => ({
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
      <h1 className="sr-only">Truck Spares & Parts | Engines, Gearboxes & Diffs | A-Z Truck Sales</h1>
      <div className="sr-only">
        <span>Author: A-Z Truck Sales</span>
        <span>Last Updated: 2026-04-27</span>
        {/* application/ld+json */}
      </div>
      <GeoHints />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={sparesFaqSchema} />
      
      <div className="bg-neutral-50 py-12 border-b">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Quality Used Truck Spares</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-8">
            Find the right parts for your commercial vehicle. We stock engines, gearboxes, diffs, and more.
          </p>

          <div className="max-w-4xl mx-auto">
            <SparesFeatures />
          </div>
        </div>
      </div>

      <AllSparesFilter />

      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-neutral-600">Common questions about our truck spares and parts.</p>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              {sparesFaqs.map((faq, index) => (
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
