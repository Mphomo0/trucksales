/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

import AllSpecials from '@/components/sections/special/AllSpecials'
import SpecialsFeatures from '@/components/sections/specials/SpecialsFeatures'
import React from 'react'
import { Metadata } from 'next'
import JsonLd from '@/components/global/JsonLd'

export const metadata: Metadata = {
  title: 'Truck Specials & Discounts | Limited Time Offers',
  description: 'View our latest truck specials and exclusive discounts on quality used commercial vehicles in Gauteng.',
}

/* application/ld+json */ export default function Specials() {
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
        name: 'Specials',
        item: 'https://www.a-ztrucksales.com/specials',
      },
    ],
  }

  return (
    <div className="bg-gray-100">
      <h1 className="sr-only">Truck Specials & Discounts | Limited Time Offers | A-Z Truck Sales</h1>
      <div className="sr-only">
        <span>Author: A-Z Truck Sales</span>
        <span>Last Updated: 2026-04-27</span>
        {/* application/ld+json */}
      </div>
      <JsonLd data={breadcrumbSchema} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Specials
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Don&lsquo;t miss out on our latest truck specials — limited-time
            deals, exclusive discounts, and unbeatable offers available now!
          </p>

          <div className="max-w-4xl mx-auto">
            <SpecialsFeatures />
          </div>
        </div>

        <AllSpecials />
      </div>
    </div>
  )
}
