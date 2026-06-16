export const revalidate = 86400

import JsonLd from '@/components/global/JsonLd'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: 'Used Truck Buying Guides | A-Z Truck Sales' },
  description: 'Practical guides to buying used rigid trucks in Gauteng. Learn about truck body types, choosing the right brand, inspection tips and more from A-Z Truck Sales.',
  alternates: { canonical: 'https://www.a-ztrucksales.com/guides' },
  openGraph: {
    title: 'Used Truck Buying Guides | A-Z Truck Sales',
    description: 'Guides to buying used rigid trucks in Gauteng. Body types, brands, inspection tips and buying advice.',
    url: 'https://www.a-ztrucksales.com/guides',
    siteName: 'A-Z Truck Sales',
    images: [{ url: 'https://www.a-ztrucksales.com/og-image.webp', width: 1200, height: 630, alt: 'Used Truck Buying Guides - A-Z Truck Sales' }],
    locale: 'en_ZA', type: 'website',
  },
}

export default function GuidesPage() {
  return (
    <>
      <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Used Truck Buying Guides</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Practical advice for buying used rigid trucks in Gauteng — from choosing the right body type to inspecting before you buy.
          </p>
        </div>
      </section>
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/guides/buying-guide" className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-md transition">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Complete Guide to Buying Used Trucks in Gauteng</h2>
              <p className="text-gray-600">Where to buy, what to check, how to choose the right truck body type and brand for your business.</p>
              <span className="text-amber-600 font-semibold mt-4 inline-block">Read Guide →</span>
            </Link>
            <Link href="/guides/truck-body-types" className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-md transition">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Truck Body Types Guide</h2>
              <p className="text-gray-600">Dropside, box body, refrigerated, curtain side or chassis cab — which body type suits your business?</p>
              <span className="text-amber-600 font-semibold mt-4 inline-block">Read Guide →</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
