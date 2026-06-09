/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

export const revalidate = 86400

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
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Used Truck Spares & Parts in Gauteng | Alberton',
  description: 'Quality used truck spares and parts in Gauteng. Engines, gearboxes, differentials for Isuzu, Hino, Mercedes-Benz, DAF, MAN & Ford. All workshop-tested. Visit Alberton or call 011 902 6071.',
  alternates: {
    canonical: 'https://www.a-ztrucksales.com/spares',
  },
  openGraph: {
    title: 'Used Truck Spares & Parts in Gauteng | A-Z Truck Sales',
    description: 'Workshop-tested truck spares in Gauteng. Engines, gearboxes, diffs for all major brands. Visit our Alberton branch or call 011 902 6071.',
    url: 'https://www.a-ztrucksales.com/spares',
    siteName: 'A-Z Truck Sales',
    images: [
      {
        url: 'https://www.a-ztrucksales.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Used Truck Spares & Parts in Gauteng – A-Z Truck Sales',
      },
    ],
    locale: 'en_ZA',
    type: 'website',
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

/* application/ld+json */ export default async function Spares() {
  const LIMIT = 12

  const [spares, total, makesResult, categoriesResult] = await Promise.all([
    prisma.spares.findMany({
      take: LIMIT,
      skip: 0,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        make: true,
        price: true,
        noVatPrice: true,
        condition: true,
        category: true,
        description: true,
        images: true,
        slug: true,
        videoLink: true,
        specialPrice: true,
        specialPriceNoVat: true,
        specialValidFrom: true,
        specialValidTo: true,
      },
    }),
    prisma.spares.count(),
    prisma.spares.findMany({ distinct: ['make'], select: { make: true }, orderBy: { make: 'asc' } }),
    prisma.spares.findMany({ distinct: ['category'], select: { category: true }, orderBy: { category: 'asc' } }),
  ])

  const initialSpares = spares.map((item) => {
    const imgArray = Array.isArray(item.images) ? (item.images as any[]) : []
    return { ...item, thumbnail: imgArray[0] || null }
  })

  const initialMeta = { total, page: 1, limit: LIMIT, totalPages: Math.ceil(total / LIMIT) }

  const initialFilterOptions = {
    makes: makesResult.map((r) => r.make).filter(Boolean) as string[],
    categories: categoriesResult.map((r) => r.category).filter(Boolean) as string[],
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
      <h1 className="sr-only">Truck Spares & Parts | A-Z Truck Sales</h1>
      <div className="sr-only">
        <span>Author: A-Z Truck Sales</span>
        <span>Last Updated: 2026-04-27</span>
        {/* application/ld+json */}
      </div>
      <GeoHints />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={sparesFaqSchema} />
      
      

      <AllSparesFilter initialSpares={initialSpares} initialMeta={initialMeta} initialFilterOptions={initialFilterOptions} />

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
