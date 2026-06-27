/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

/* <h1>A-Z Truck Sales Components</h1> */ export default function Hero() {
  return (
    <section
      className="relative text-white overflow-hidden md:h-175 h-125"
      aria-label="Hero section with promotional message"
    >
      <Image
        src="/images/truckBg.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden="true"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-amber-600 to-yellow-600 opacity-60" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Browse Our Gauteng Truck Stock
          </h2>

          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto">
            A-Z Truck Sales supplies quality used rigid trucks, commercial
            vehicles and truck spares from our Alberton and Boksburg branches.
            We help businesses, fleet owners, contractors, logistics companies
            and owner-drivers find reliable trucks for work across Gauteng and
            South Africa.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            <Button
              asChild
              size="lg"
              className="bg-white text-black text-lg hover:bg-gray-100 transition p-6 w-full sm:w-auto"
            >
              <Link href="/inventory">Browse our Inventory</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white hover:text-black text-lg transition p-6 w-full sm:w-auto"
            >
              <Link href="/contact">Contact A-Z Truck Sales</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
