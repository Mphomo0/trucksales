export const revalidate = 86400

import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: {
    absolute: 'Truck Dealers in Alberton & Boksburg | A-Z Truck Sales',
  },
  description:
    'Find used rigid trucks at A-Z Truck Sales in Alberton and Boksburg, Gauteng. Two branches, 100+ trucks in stock, 25+ years experience.',
  alternates: { canonical: 'https://www.a-ztrucksales.com/locations' },
  openGraph: {
    title: 'Truck Dealers in Alberton & Boksburg | A-Z Truck Sales',
    description:
      'Find used rigid trucks at A-Z Truck Sales in Alberton and Boksburg, Gauteng. Two branches, 100+ trucks in stock, 25+ years experience.',
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
  twitter: {
    card: 'summary_large_image',
    title: 'Truck Dealers in Alberton & Boksburg | A-Z Truck Sales',
    description:
      'Find used rigid trucks at A-Z Truck Sales in Alberton and Boksburg, Gauteng. Two branches, 100+ trucks in stock, 25+ years experience.',
    images: ['https://www.a-ztrucksales.com/og-image.webp'],
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
              <p>100+ trucks in stock, spares available</p>
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

      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Visiting a Branch
          </h2>
          <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
            <p>
              A-Z Truck Sales has traded since 1999 and sells used rigid trucks and
              truck spares from two branches. Alberton is where we started.
              Boksburg opened later to serve more of the East Rand, with sales,
              spares and vehicle viewing by appointment.
            </p>
            <p>
              Stock changes often, so call before you travel. Tell us the type of
              truck, payload and budget you have in mind and we will confirm which
              branch the trucks are at.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            What You Can Do at Either Branch
          </h2>
          <ul className="space-y-3 text-lg text-gray-600 leading-relaxed list-disc pl-5">
            <li>View and inspect used trucks, all workshop-checked and COF-ready before sale.</li>
            <li>
              Ask about trade-ins, finance options and{' '}
              <Link href="/sell-your-truck" className="text-amber-600 hover:underline">
                selling your truck
              </Link>
              .
            </li>
            <li>
              Buy{' '}
              <Link href="/spares" className="text-amber-600 hover:underline">
                truck spares
              </Link>{' '}
              such as engines, gearboxes and diffs.
            </li>
            <li>
              Arrange delivery or collection across South Africa, and get help with
              export paperwork for cross-border buyers.
            </li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            Before You Visit
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Browse the{' '}
            <Link href="/inventory" className="text-amber-600 hover:underline">
              current inventory
            </Link>{' '}
            or{' '}
            <Link href="/tonnage" className="text-amber-600 hover:underline">
              trucks by tonnage
            </Link>{' '}
            to shortlist what you want to see. If you are buying for a business,
            bring your licence code, the payload you need and any body type
            requirements. Opening hours are Monday to Friday 8AM to 5PM at both
            branches, plus Saturday 8AM to 1PM in Alberton. Questions first? Use
            the{' '}
            <Link href="/contact" className="text-amber-600 hover:underline">
              contact page
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  )
}
