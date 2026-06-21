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
  title: { absolute: 'Sell Your Used Truck in Gauteng | A-Z Truck Sales' },
  description: 'Sell or trade in your used truck with A-Z Truck Sales. Submit your truck details online and get a fair estimate from our Gauteng team.',
  alternates: {
    canonical: 'https://www.a-ztrucksales.com/sell-your-truck',
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://www.a-ztrucksales.com/sell-your-truck',
    siteName: 'A-Z Truck Sales',
    title: 'Sell Your Used Truck in Gauteng | A-Z Truck Sales',
    description: 'Sell or trade in your used truck with A-Z Truck Sales. Submit your truck details online and get a fair estimate from our Gauteng team.',
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
      <h1 className="sr-only">Sell or Trade In Your Used Truck | A-Z Truck Sales</h1>
      <div className="sr-only">
        <span>Author: A-Z Truck Sales</span>
        <span>Last Updated: 2026-06-21</span>
      </div>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={tradeInFaqSchema} />
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Sell or Trade In Your Used Truck</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              Want to sell your used truck or trade it in for another commercial vehicle? A-Z Truck Sales helps truck owners, businesses and fleet operators get a fair estimate for used trucks in Gauteng and across South Africa.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Submit your truck details, mileage, make, model, year and photos. Our team will review the information and contact you about the next step.
            </p>
          </div>
        </div>
      </section>

      <section>
        <SellYourTruckFeatures />
        <TradeInForm />
        <Process />
      </section>

      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">What Trucks Do We Consider?</h2>
            <p className="text-lg text-gray-600 mb-4">
              A-Z Truck Sales considers used commercial vehicles across different makes, sizes and body types, including Isuzu, Hino, Fuso, UD, Mercedes-Benz, MAN, Toyota, Nissan and other truck brands.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              We may consider:
            </p>
            <ul className="list-disc list-inside text-lg text-gray-600 space-y-2 mb-6">
              <li>Dropside trucks</li>
              <li>Box trucks</li>
              <li>Refrigerated trucks</li>
              <li>Curtain side trucks</li>
              <li>Chassis cabs</li>
              <li>Fleet vehicles</li>
              <li>Trade-ins</li>
              <li>Non-current stock depending on condition and demand</li>
            </ul>
            <p className="text-lg text-gray-600">
              To get a faster estimate, include clear photos, mileage, service history if available, current condition and whether the truck is licensed or COF-ready.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
