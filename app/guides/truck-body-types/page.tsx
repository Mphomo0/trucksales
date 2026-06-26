export const revalidate = 86400

import JsonLd from '@/components/global/JsonLd'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: 'Truck Body Types: Dropside, Box & Refrigerated | A-Z' },
  description: 'Compare truck body types — dropside, box body, refrigerated, curtain side and chassis cab. Find out which body type is right for your business in Gauteng.',
  alternates: { canonical: 'https://www.a-ztrucksales.com/guides/truck-body-types' },
  openGraph: {
    title: 'Truck Body Types: Dropside, Box & Refrigerated | A-Z',
    description: 'Compare truck body types for your business. Dropside, box body, refrigerated, curtain side and chassis cab explained.',
    url: 'https://www.a-ztrucksales.com/guides/truck-body-types',
    siteName: 'A-Z Truck Sales',
    images: [{ url: 'https://www.a-ztrucksales.com/og-image.webp', width: 1200, height: 630, alt: 'Truck Body Types Guide - A-Z Truck Sales' }],
    locale: 'en_ZA', type: 'website',
  },
}

export default function TruckBodyTypesPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.a-ztrucksales.com' },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://www.a-ztrucksales.com/guides' },
      { '@type': 'ListItem', position: 3, name: 'Truck Body Types', item: 'https://www.a-ztrucksales.com/guides/truck-body-types' },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Truck Body Types Guide</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Dropside, box body, refrigerated, curtain side or chassis cab — which one suits your business? Compare each body type and find the right fit.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-x-auto mb-12">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-amber-50">
                  <th className="text-left p-4 border font-semibold">Body Type</th>
                  <th className="text-left p-4 border font-semibold">Best For</th>
                  <th className="text-left p-4 border font-semibold">Key Questions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 border font-medium">Dropside</td>
                  <td className="p-4 border">Building materials, hardware, general loads and anything loaded from the side</td>
                  <td className="p-4 border">Is the load easy to secure, and is side loading needed?</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-4 border font-medium">Box body</td>
                  <td className="p-4 border">Furniture, parcels, retail goods and protected cargo needing weather protection</td>
                  <td className="p-4 border">Does the cargo need weather protection and lockable storage?</td>
                </tr>
                <tr>
                  <td className="p-4 border font-medium">Refrigerated</td>
                  <td className="p-4 border">Food, meat, frozen goods and temperature-sensitive stock</td>
                  <td className="p-4 border">Is the fridge unit working and suitable for the required temperature range?</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-4 border font-medium">Curtain side</td>
                  <td className="p-4 border">Palletised goods and faster loading from the side</td>
                  <td className="p-4 border">Will forklifts load from the side, and is the curtain condition good?</td>
                </tr>
                <tr>
                  <td className="p-4 border font-medium">Chassis cab</td>
                  <td className="p-4 border">Custom bodies, specialist builds and superstructure mounting</td>
                  <td className="p-4 border">What body must be fitted, and is the chassis suitable for the job?</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-10">
            <div className="bg-white rounded-lg border border-neutral-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Dropside Trucks</h2>
              <div className="text-gray-600 leading-relaxed space-y-4">
                <p>Dropside trucks feature sides that open downwards, making them ideal for building materials, hardware and loads that need to be loaded from the side. They are one of the most versatile body types for general transport.</p>
                <p>Common uses include construction material delivery, landscaping supplies, refuse collection and general freight. The open design makes loading and unloading quick, but the load is exposed to weather.</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Box Body Trucks</h2>
              <div className="text-gray-600 leading-relaxed space-y-4">
                <p>Box body trucks offer enclosed, lockable storage that protects cargo from weather and theft. They are ideal for furniture, retail goods, parcels and protected cargo.</p>
                <p>Box bodies are available in various sizes and configurations including tail lifts for easier unloading. They are popular for furniture removals, retail distribution and courier work.</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Refrigerated Trucks</h2>
              <div className="text-gray-600 leading-relaxed space-y-4">
                <p>Refrigerated trucks (also called reefer trucks) maintain specific temperature ranges for food, frozen goods and temperature-sensitive products. They are essential for the cold chain logistics industry.</p>
                <p>When buying a used refrigerated truck, always check the fridge unit condition, temperature range capability, insulation integrity and service history of the refrigeration system.</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Curtain Side Trucks</h2>
              <div className="text-gray-600 leading-relaxed space-y-4">
                <p>Curtain side trucks feature curtain sides that open for side loading with forklifts. They are ideal for palletised goods and operations where fast loading and unloading is essential.</p>
                <p>Commonly used for palletised freight, warehousing distribution and logistics operations. Check curtain condition and side rail integrity when inspecting a used curtain side truck.</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Chassis Cab</h2>
              <div className="text-gray-600 leading-relaxed space-y-4">
                <p>A chassis cab provides the cab and running chassis but no body — allowing the buyer to fit a custom body or superstructure for their specific needs. This is ideal for specialist applications.</p>
                <p>Common uses include tippers, tankers, drop-side bodies, utility bodies, fire trucks and other specialist builds. When buying a chassis cab, confirm the chassis specifications match the body you plan to fit.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-amber-600 to-yellow-300 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Need Help Choosing a Truck Body Type?</h2>
          <p className="text-xl mb-8">Contact our team for advice on the right truck body for your business.</p>
          <Link href="/contact" className="inline-flex items-center justify-center px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition">Contact Our Team</Link>
        </div>
      </section>
    </>
  )
}
