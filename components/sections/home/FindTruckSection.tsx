/* author: A-Z Truck Sales */
/* datePublished: 2026-06-21 */
/* application/ld+json */

import Link from 'next/link'

export default function FindTruckSection() {
  return (
    <section className="py-26 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Find the Right Used Truck for Your Business
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            Choosing a used truck is not only about price. The right truck depends on payload, body type, route, mileage, condition, spares availability and how quickly the vehicle needs to start working.
          </p>
          <p className="text-lg text-gray-600 mb-6">
            At A-Z Truck Sales, buyers can compare different makes, tonnage options and body types, including dropside trucks, box trucks, refrigerated trucks, curtain side trucks, chassis cabs and other commercial vehicles. Our team helps buyers choose a truck that fits the job, not just the budget.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/inventory"
              className="text-blue-700 hover:text-blue-800 font-medium"
            >
              Browse our used truck inventory →
            </Link>
            <Link
              href="/specials"
              className="text-blue-700 hover:text-blue-800 font-medium"
            >
              View truck specials →
            </Link>
            <Link
              href="/spares"
              className="text-blue-700 hover:text-blue-800 font-medium"
            >
              Find truck spares →
            </Link>
            <Link
              href="/sell-your-truck"
              className="text-blue-700 hover:text-blue-800 font-medium"
            >
              Sell or trade in your truck →
            </Link>
            <Link
              href="/contact"
              className="text-blue-700 hover:text-blue-800 font-medium sm:col-span-2"
            >
              Contact our Alberton or Boksburg branch →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
