export const revalidate = 86400

import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: {
    absolute:
      'Truck Dealership Locations | Alberton & Boksburg | A-Z Truck Sales',
  },
  description:
    'Visit A-Z Truck Sales in Alberton or Boksburg, Gauteng. View used trucks, speak to our sales team or visit our workshop. Branches open Monday-Friday.',
  alternates: { canonical: 'https://www.a-ztrucksales.com/locations' },
  openGraph: {
    title: 'Truck Dealership Locations | Alberton & Boksburg',
    description: 'Visit A-Z Truck Sales in Alberton or Boksburg, Gauteng.',
    url: 'https://www.a-ztrucksales.com/locations',
    siteName: 'A-Z Truck Sales',
    images: [
      {
        url: 'https://www.a-ztrucksales.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'A-Z Truck Sales Locations',
      },
    ],
    locale: 'en_ZA',
    type: 'website',
  },
}

export default function LocationsPage() {
  return (
    <>
      <section className="bg-linear-to-r from-gray-900 to-gray-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Branches</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Visit A-Z Truck Sales at our Alberton or Boksburg branch. Both
            locations serve Gauteng and South Africa-wide buyers.
          </p>
        </div>
      </section>
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            href="/locations/alberton"
            className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-md transition"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Alberton Branch
            </h2>
            <div className="text-gray-600 space-y-2">
              <p>9 Chrislou Crescent, Alberton North, 1449</p>
              <p>Phone: 011 902 6071</p>
              <p>Hours: Mon-Fri 8AM-5PM, Sat 8AM-1PM</p>
              <p>Full workshop, 100+ trucks in stock, spares available</p>
            </div>
            <span className="text-amber-600 font-semibold mt-4 inline-block">
              View Alberton Branch →
            </span>
          </Link>
          <Link
            href="/locations/boksburg"
            className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-md transition"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Boksburg Branch
            </h2>
            <div className="text-gray-600 space-y-2">
              <p>
                Corner Trichardts Road & Ravenswood Street, Ravenswood, 1451
              </p>
              <p>Phone: 083 234 5377</p>
              <p>Hours: Mon-Fri 8AM-5PM</p>
              <p>Sales, spares and vehicle viewing by appointment</p>
            </div>
            <span className="text-amber-600 font-semibold mt-4 inline-block">
              View Boksburg Branch →
            </span>
          </Link>
        </div>
      </section>
    </>
  )
}
