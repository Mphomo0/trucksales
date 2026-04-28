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
  title: 'Sell Your Truck | Trade-In Your Vehicle | A-Z Truck Sales',
  description: 'Looking to sell or trade-in your used truck? We offer competitive prices and a transparent process for buying commercial vehicles in Gauteng.',
}

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

  return (
    <>
      <div className="sr-only">
        <span>Author: A-Z Truck Sales</span>
        <span>Last Updated: 2026-04-27</span>
        {/* application/ld+json */}
      </div>
      <JsonLd data={breadcrumbSchema} />
      <section className="bg-gray-50 py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Sell Your Truck or Trade In
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Looking to upgrade your truck? Our simple and transparent trade-in
              program makes it easy to get top value for your current truck.
            </p>

            <div className="max-w-4xl mx-auto">
              <SellYourTruckFeatures />
            </div>
          </div>
        </div>
      </section>
      <section>
        <TradeInForm />
        <Process />
      </section>
    </>
  )
}
