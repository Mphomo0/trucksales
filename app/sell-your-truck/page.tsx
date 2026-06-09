/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

import Process from '@/components/sections/tradeIn/Process'
import TradeInForm from '@/components/sections/tradeIn/TradeInForm'
import SellYourTruckFeatures from '@/components/sections/tradeIn/SellYourTruckFeatures'
import React from 'react'
import { Metadata } from 'next'
import JsonLd from '@/components/global/JsonLd'

export const metadata: Metadata = {
  title: 'Sell Your Truck | We Buy Used Trucks Gauteng',
  description: 'Sell or trade in your used commercial truck with A-Z Truck Sales. We buy rigid trucks 1.5–16 ton. Fast competitive offers, same-day process. Serving Gauteng and all South Africa.',
  alternates: {
    canonical: 'https://www.a-ztrucksales.com/sell-your-truck',
  },
  openGraph: {
    title: 'Sell Your Truck | We Buy Used Trucks Gauteng | A-Z Truck Sales',
    description: 'Sell or trade in your used commercial truck with A-Z Truck Sales. Fast, competitive offers on rigid trucks 1.5–16 ton. Alberton & Boksburg.',
    url: 'https://www.a-ztrucksales.com/sell-your-truck',
    siteName: 'A-Z Truck Sales',
    images: [
      {
        url: 'https://www.a-ztrucksales.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Sell Your Truck – A-Z Truck Sales Gauteng',
      },
    ],
    locale: 'en_ZA',
    type: 'website',
  },
}

const tradeInFaqs = [
  {
    question: 'What trucks do you buy?',
    answer: 'We buy used commercial vehicles including rigid trucks from 1.5 to 16 tons. Isuzu, Hino, Mercedes-Benz, Ford, and other major brands.',
  },
  {
    question: 'How do you value my truck?',
    answer: 'We assess your truck based on condition, mileage, service history, and current market value. Expect a fair, competitive offer.',
  },
  {
    question: 'Can I trade in my truck as part of a purchase?',
    answer: 'Yes. We accept trade-ins as partial or full payment for a truck from our inventory. We handle the paperwork.',
  },
  {
    question: 'How long does the trade-in process take?',
    answer: 'Once you submit your truck details, we typically respond within 24 hours. The entire process can be completed same day.',
  },
  {
    question: 'Do you collect trucks from other locations?',
    answer: 'We can arrange collection of your truck for inspection. Transport costs depend on distance from our Alberton or Boksburg branches.',
  },
]

/* application/ld+json */ export default function SellYourTruck() {
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
        name: 'Sell Your Truck',
        item: 'https://www.a-ztrucksales.com/sell-your-truck',
      },
    ],
  }

  const tradeInFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tradeInFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <>
      <h1 className="sr-only">Sell or Trade-In Your Truck | A-Z Truck Sales</h1>
      <div className="sr-only">
        <span>Author: A-Z Truck Sales</span>
        <span>Last Updated: 2026-04-27</span>
      </div>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={tradeInFaqSchema} />

      <section>
        <div className="bg-amber-600 py-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            We Buy Used Trucks — Fast, Fair, No Hassle
          </h2>
          <p className="text-amber-50 text-lg max-w-2xl mx-auto">
            Submit your truck details and get a competitive offer within 24 hours. Serving Gauteng and all South Africa.
          </p>
        </div>
        <TradeInForm />
        <Process />
      </section>
    </>
  )
}
