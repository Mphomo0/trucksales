/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

export const revalidate = 86400

import dynamic from 'next/dynamic'
import SparesFeatures from '@/components/sections/spares/SparesFeatures'
import { Metadata } from 'next'

const AllSparesFilter = dynamic(
  () => import('@/components/sections/spares/AllSparesFilter'),
  {
    loading: () => (
      <div className="py-20 text-center text-gray-500">Loading spares...</div>
    ),
  },
)
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

export const metadata: Metadata = {
  title: {
    absolute: 'Truck Spares & Parts in Gauteng | Engines, Gearboxes & Diffs',
  },
  description:
    'Find used truck spares in Gauteng, including engines, gearboxes, diffs and commercial vehicle parts from A-Z Truck Sales in Alberton and Boksburg.',
  alternates: {
    canonical: 'https://www.a-ztrucksales.com/spares',
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://www.a-ztrucksales.com/spares',
    siteName: 'A-Z Truck Sales',
    title: 'Truck Spares & Parts in Gauteng | Engines, Gearboxes & Diffs',
    description:
      'Find used truck spares in Gauteng, including engines, gearboxes, diffs and commercial vehicle parts from A-Z Truck Sales in Alberton and Boksburg.',
    images: [
      {
        url: 'https://www.a-ztrucksales.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Truck Spares & Parts - A-Z Truck Sales',
      },
    ],
  },
}

const LIMIT = 12

const sparesFaqs = [
  {
    question: 'What truck brands do you stock parts for?',
    answer:
      'We stock parts for Isuzu, Hino, Mercedes-Benz, Ford, MAN, Fuso, Toyota, Nissan, Tata, Hyundai, Volkswagen, UD Trucks and other major commercial vehicle brands.',
  },
  {
    question: 'Do you offer warranty on spare parts?',
    answer:
      'All our parts are inspected before sale. Warranty terms depend on the specific part - contact us for details.',
  },
  {
    question: 'Can I order a specific part?',
    answer:
      'Yes, we can source specific parts based on your requirements. Contact our spares team to check availability.',
  },
  {
    question: 'Do you sell engines and gearboxes?',
    answer:
      'Yes. We stock tested engines and gearboxes for various truck makes, priced according to condition and mileage.',
  },
  {
    question: 'Can I view parts before purchase?',
    answer:
      'Yes, parts can be viewed at our Alberton branch by appointment. Call 011 902 6071.',
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

const getAllSparesSlugs = unstable_cache(
  async () => {
    return prisma.spares.findMany({
      select: { slug: true, name: true },
      orderBy: { createdAt: 'desc' },
    })
  },
  ['all-spares-slugs'],
  { revalidate: 86400, tags: ['spares'] },
)

const getSparePageData = unstable_cache(
  async () => {
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
      prisma.spares.findMany({
        distinct: ['make'],
        select: { make: true },
        orderBy: { make: 'asc' },
      }),
      prisma.spares.findMany({
        distinct: ['category'],
        select: { category: true },
        orderBy: { category: 'asc' },
      }),
    ])
    return { spares, total, makesResult, categoriesResult }
  },
  ['spares-page-initial'],
  { revalidate: 86400, tags: ['spares'] },
)

/* application/ld+json */ export default async function Spares() {
  const [{ spares, total, makesResult, categoriesResult }, allSpares] =
    await Promise.all([getSparePageData(), getAllSparesSlugs()])

  const initialSpares = spares.map((item) => {
    const imgArray = Array.isArray(item.images) ? (item.images as any[]) : []
    return { ...item, thumbnail: imgArray[0] || null }
  })

  const initialMeta = {
    total,
    page: 1,
    limit: LIMIT,
    totalPages: Math.ceil(total / LIMIT),
  }

  const initialFilterOptions = {
    makes: makesResult.map((r) => r.make).filter(Boolean) as string[],
    categories: categoriesResult
      .map((r) => r.category)
      .filter(Boolean) as string[],
  }

  return (
    <div>
      <h1 className="sr-only">Truck Spares & Parts in Gauteng</h1>
      <div className="sr-only">
        <span>Author: A-Z Truck Sales</span>
        <span>Last Updated: 2026-06-21</span>
        {/* application/ld+json */}
      </div>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={sparesFaqSchema} />

      <AllSparesFilter
        initialSpares={initialSpares}
        initialMeta={initialMeta}
        initialFilterOptions={initialFilterOptions}
      />

      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-neutral-600">
                Common questions about our truck spares and parts.
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {sparesFaqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white px-6 rounded-lg mb-4 border border-neutral-200"
                >
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
          <h2 className="text-base font-semibold text-neutral-700 mb-4">
            All {allSpares.length} Spare Parts in Stock
          </h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {allSpares.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/spares/${s.slug}`}
                  className="text-sm text-blue-700 hover:underline"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 bg-white border-t border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Used Truck Parts We Can Help With
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              We assist buyers looking for:
            </p>
            <ul className="list-disc list-inside text-lg text-gray-600 space-y-2 mb-6">
              <li>Used truck engines</li>
              <li>Used truck gearboxes</li>
              <li>Differential units</li>
              <li>Truck body parts</li>
              <li>Commercial vehicle spares</li>
              <li>
                Parts for Isuzu, Hino, UD, Nissan, Fuso and Mercedes-Benz trucks
              </li>
            </ul>
            <p className="text-lg text-gray-600">
              Availability changes regularly. For faster assistance, send your
              vehicle details, part name and photos if available.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-neutral-50 border-t border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Used Truck Engines in Gauteng
              </h2>
              <div className="text-lg text-gray-600 space-y-4">
                <p>
                  A replacement engine is often the difference between writing a
                  truck off and getting several more years of work from it. We
                  stock used and reconditioned diesel engines for popular rigid
                  truck ranges, including Isuzu N- and F-Series, Hino 300/500,
                  UD/Nissan, Fuso Canter and Mercedes-Benz commercial units.
                </p>
                <p>
                  Every engine is inspected before sale, and where possible we
                  supply it with its history — mileage, compression check and
                  the donor vehicle it came from. Tell us your engine number and
                  model designation (for example 4HG1, J05C or 4D34) and we will
                  confirm fitment before you commit.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Used Truck Gearboxes
              </h2>
              <div className="text-lg text-gray-600 space-y-4">
                <p>
                  We carry manual gearboxes for light, medium and heavy rigid
                  trucks — 5-speed and 6-speed units for common Isuzu, Hino,
                  Fuso, UD and Mercedes-Benz applications. Gearboxes are tested
                  for gear engagement, synchro condition and input shaft play
                  before they go on the shelf.
                </p>
                <p>
                  When enquiring, have your truck's model, year and — where
                  possible — the gearbox casing number ready. Many ranges
                  changed gearbox specification mid-generation, and the casing
                  number is the quickest way to guarantee a correct match.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Differentials & Axle Parts
              </h2>
              <div className="text-lg text-gray-600 space-y-4">
                <p>
                  Diff failures put a working truck off the road immediately, so
                  we keep complete differential units and crown wheel and pinion
                  sets for common rigid truck axles. Ratios vary widely between
                  applications — a freight carrier and a tipper on the same
                  chassis often run different diff ratios.
                </p>
                <p>
                  Check the ratio stamped on your existing diff housing or count
                  the crown wheel and pinion teeth, and we will match a unit
                  from stock or source one through our network. We also assist
                  with related driveline parts such as propshafts and axle
                  shafts.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                How Buying Spares From Us Works
              </h2>
              <div className="text-lg text-gray-600 space-y-4">
                <p>
                  Browse the stock list above or call the Alberton branch on{' '}
                  <a href="tel:+27119026071" className="text-amber-600 hover:underline">
                    011 902 6071
                  </a>{' '}
                  with your part details. Parts can be viewed and inspected at
                  our Alberton branch by appointment before you buy, and we can
                  arrange transport for buyers elsewhere in South Africa.
                </p>
                <p>
                  Looking for a complete vehicle instead? Browse our{' '}
                  <Link href="/inventory" className="text-amber-600 hover:underline">
                    used truck inventory
                  </Link>{' '}
                  or read our{' '}
                  <Link href="/guides/what-to-check-before-buying" className="text-amber-600 hover:underline">
                    used truck inspection guide
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
