/* author: A-Z Truck Sales */
/* datePublished: 2026-09-02 */

import Link from 'next/link'

const brands = [
  { name: 'Isuzu', href: '/brands/isuzu', models: 'NPR, NQR, NPS, FRR, FSR, FVR, FVZ' },
  { name: 'Hino', href: '/brands/hino', models: '300-Series, 500-Series, FC' },
  { name: 'Fuso', href: '/brands/fuso', models: 'Canter, Fighter' },
  { name: 'UD Trucks', href: '/brands/ud-trucks', models: 'Condor, Croner' },
  { name: 'MAN', href: '/brands/man', models: 'TGL, TGM' },
  { name: 'Mercedes-Benz', href: '/brands/mercedes-benz', models: 'Atego, Axor' },
  { name: 'Tata', href: '/brands/tata', models: 'LPT 709, 912, 1615' },
  { name: 'Toyota', href: '/brands/toyota', models: 'Dyna' },
  { name: 'Hyundai', href: '/brands/hyundai', models: 'HD Series' },
]

export default function BrandsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Shop Used Trucks by Brand
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our used truck stock by brand, including Isuzu, Hino, Fuso,
            UD Trucks, MAN and Mercedes-Benz.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href={brand.href}
              className="bg-white rounded-lg border border-gray-200 p-5 text-center hover:shadow-md hover:border-amber-500 transition"
            >
              <h3 className="font-semibold text-gray-900">{brand.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{brand.models}</p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/brands"
            className="inline-flex items-center justify-center px-8 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
          >
            View All Brands
          </Link>
        </div>
      </div>
    </section>
  )
}
