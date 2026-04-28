/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

import AllSparesFilter from '@/components/sections/spares/AllSparesFilter'
import SparesFeatures from '@/components/sections/spares/SparesFeatures'
import { Metadata } from 'next'
import JsonLd from '@/components/global/JsonLd'
import GeoHints from '@/components/global/GeoHints'

export const metadata: Metadata = {
  title: 'Truck Spares & Parts | Engines, Gearboxes & Diffs',
  description: 'Quality used truck spares and parts in Gauteng. We stock engines, gearboxes, diffs and more for various commercial vehicle makes.',
}

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
    </div>
  )
}
