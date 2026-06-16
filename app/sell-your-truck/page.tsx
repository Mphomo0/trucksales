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
  title: 'Sell Your Truck | We Buy Used Trucks',
  description: 'Sell or trade-in your used truck with A-Z Truck Sales. Competitive offers, fast payment. We buy 1.5-35 ton trucks in Gauteng & across South Africa.',
  alternates: {
    canonical: 'https://www.a-ztrucksales.com/sell-your-truck',
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://www.a-ztrucksales.com/sell-your-truck',
    siteName: 'A-Z Truck Sales',
    title: 'Sell Your Truck | We Buy Used Trucks | A-Z Truck Sales',
    description: 'Sell or trade-in your used truck with A-Z Truck Sales. Competitive offers, fast payment. We buy 1.5-35 ton trucks in Gauteng.',
    images: [{ url: 'https://www.a-ztrucksales.com/og-image.webp', width: 1200, height: 630, alt: 'Sell Your Truck - A-Z Truck Sales' }],
  },
}

const tradeInFaqs = [
  {
    question: 'What trucks do you buy?',
    answer: 'We buy used commercial vehicles including rigid trucks from 1.5 to 35 tons. Isuzu, Hino, Mercedes-Benz, Ford, MAN, Fuso, Toyota, Nissan, Tata, Hyundai, Volkswagen, UD Trucks and other major brands.',
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
        <SellYourTruckFeatures />
        <TradeInForm />
        <Process />
      </section>
    </>
  )
}
