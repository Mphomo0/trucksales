export const revalidate = 86400

import JsonLd from '@/components/global/JsonLd'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: 'Used Truck Buying Guides | A-Z Truck Sales Gauteng' },
  description:
    'Read practical used truck buying guides from A-Z Truck Sales, including body types, inspection tips, COF readiness and choosing the right commercial vehicle.',
  alternates: { canonical: 'https://www.a-ztrucksales.com/guides' },
  openGraph: {
    title: 'Used Truck Buying Guides | A-Z Truck Sales Gauteng',
    description:
      'Read practical used truck buying guides from A-Z Truck Sales, including body types, inspection tips, COF readiness and choosing the right commercial vehicle.',
    url: 'https://www.a-ztrucksales.com/guides',
    siteName: 'A-Z Truck Sales',
    images: [{ url: 'https://www.a-ztrucksales.com/og-image.webp', width: 1200, height: 630, alt: 'Used Truck Buying Guides - A-Z Truck Sales' }],
    locale: 'en_ZA',
    type: 'website',
  },
}

export default function GuidesPage() {
  return (
    <>
      <section className="bg-linear-to-r from-gray-900 to-gray-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Used Truck Buying Guides
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Practical advice for buying used rigid trucks in Gauteng — from
            choosing the right body type to inspecting before you buy.
          </p>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-lg text-gray-600 space-y-4 mb-12">
            <p>
              Buying a used truck is a major business decision. The right vehicle can improve delivery, reduce downtime and support growth. The wrong truck can create unexpected repair costs, loading problems and delays.
            </p>
            <p>
              Our used truck buying guides help buyers understand truck body types, payload needs, inspection checks, COF readiness, mileage, paperwork and brand considerations before buying.
            </p>
          </div>
        </div>
      </section>
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/guides/buying-guide"
              className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-md transition"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Complete Guide to Buying Used Trucks in Gauteng
              </h2>
              <p className="text-gray-600">
                Where to buy, what to check, how to choose the right truck body
                type and brand for your business.
              </p>
              <span className="text-amber-600 font-semibold mt-4 inline-block">
                Read Guide →
              </span>
            </Link>
            <Link
              href="/guides/truck-body-types"
              className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-md transition"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Truck Body Types Explained
              </h2>
              <p className="text-gray-600">
                Dropside, box body, refrigerated, curtain side or chassis cab —
                which body type suits your business?
              </p>
              <span className="text-amber-600 font-semibold mt-4 inline-block">
                Read Guide →
              </span>
            </Link>
            <Link
              href="/guides/what-to-check-before-buying"
              className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-md transition"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                What to Check Before Buying a Used Truck
              </h2>
              <p className="text-gray-600">
                Inspection checklist covering engine, gearbox, body condition, tyres, brakes, paperwork and roadworthy requirements.
              </p>
              <span className="text-amber-600 font-semibold mt-4 inline-block">
                Read Guide →
              </span>
            </Link>
            <Link
              href="/guides/isuzu-vs-hino-vs-fuso"
              className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-md transition"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Isuzu vs Hino vs Fuso: Which Used Truck Is Right for Your Business?
              </h2>
              <p className="text-gray-600">
                Compare Japanese truck brands for reliability, parts availability, fuel economy and running costs.
              </p>
              <span className="text-amber-600 font-semibold mt-4 inline-block">
                Read Guide →
              </span>
            </Link>
            <Link
              href="/guides/choose-truck-for-construction-delivery-cold-storage"
              className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-md transition"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                How to Choose a Truck for Construction, Delivery or Cold Storage
              </h2>
              <p className="text-gray-600">
                Match body type and payload to your industry — dropside for building sites, refrigerated for cold chain, box body for deliveries.
              </p>
              <span className="text-amber-600 font-semibold mt-4 inline-block">
                Read Guide →
              </span>
            </Link>
            <Link
              href="/guides/cof-ready-trucks"
              className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-md transition"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                COF-Ready Trucks: What Buyers Should Know
              </h2>
              <p className="text-gray-600">
                Understanding Certificate of Fitness requirements, inspection items, costs and why COF-ready trucks save time and money.
              </p>
              <span className="text-amber-600 font-semibold mt-4 inline-block">
                Read Guide →
              </span>
            </Link>
            <Link
              href="/guides/finance-trade-ins-export"
              className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-md transition"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Used Truck Finance, Trade-Ins and Export Questions
              </h2>
              <p className="text-gray-600">
                Payment options, trade-in process, export documentation and cross-border buying for African buyers.
              </p>
              <span className="text-amber-600 font-semibold mt-4 inline-block">
                Read Guide →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
