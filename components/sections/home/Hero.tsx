/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

/* <h1>A-Z Truck Sales Components</h1> */ export default function Hero() {
  return (
    <section
      className="relative text-white bg-cover bg-center bg-no-repeat md:h-175 h-125"
      style={{ backgroundImage: 'url(/images/truckBg.webp)' }}
      aria-label="Hero section with promotional message"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-amber-600 to-yellow-600 opacity-60" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            100+ Used Trucks in Alberton & Boksburg — Workshop-Serviced,
            COF-Ready
          </h2>

          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Rigid trucks 1.5–18 ton. All tested. All priced to move.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-black text-lg hover:bg-gray-100 transition p-6"
            >
              <Link href="/inventory">Browse our Inventory</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-white border-white text-lg hover:bg-white hover:text-black transition p-6"
            >
              <Link href="/sell-your-truck">Sell Your Truck</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
