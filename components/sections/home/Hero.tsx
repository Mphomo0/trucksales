'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Hero() {
  return (
    <section
      className="relative text-white bg-cover bg-center bg-no-repeat md:h-[700px] h-[500px]"
      style={{ backgroundImage: 'url(/images/truckBg.webp)' }}
      aria-label="Hero section with promotional message"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-yellow-600 opacity-60" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Find the Right Truck for the Job
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto">
            We Are Celebrating 25 Years Of Excellent Service
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-black text-lg hover:bg-gray-100 transition p-6"
            >
              <Link href="/inventory">Browse our Inventory</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
