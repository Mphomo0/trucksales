/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

import AllVehiclesFilter from '@/components/sections/inventorySection/AllVehiclesFilter'
import InventoryFeatures from '@/components/sections/inventorySection/InventoryFeatures'
import { Metadata } from 'next'
import JsonLd from '@/components/global/JsonLd'
import GeoHints from '@/components/global/GeoHints'

export const metadata: Metadata = {
  title: 'Truck Inventory | Used Rigid Trucks for Sale',
  description: 'Browse our extensive inventory of quality used rigid trucks for sale in Gauteng. Ranging from 1.5 to 16 tons, all vehicles are restored and workshop serviced.',
}

/* application/ld+json */ export default function Inventory() {
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

  return (
    <div>
      <h1 className="sr-only">Truck Inventory | Used Rigid Trucks for Sale | A-Z Truck Sales</h1>
      <div className="sr-only">
        <span>Author: A-Z Truck Sales</span>
        <span>Last Updated: 2026-04-27</span>
        {/* application/ld+json */}
      </div>
      <GeoHints />
      <JsonLd data={breadcrumbSchema} />
      
      <div className="bg-neutral-50 py-12 border-b">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Our Truck Inventory</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-8">
            Explore our collection of quality used rigid trucks. All vehicles are workshop-tested and ready for the job.
          </p>
          
          <div className="max-w-4xl mx-auto">
            <InventoryFeatures />
          </div>
        </div>
      </div>

      <AllVehiclesFilter />
    </div>
  )
}
