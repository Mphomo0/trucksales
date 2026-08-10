import Link from 'next/link'
import { getBrandRouteByMake } from '@/lib/brands'

interface Props {
  make: string
}

/**
 * Links a truck detail page through to its brand landing page.
 * Renders nothing for makes with no dedicated brand page (Nissan, Ford, etc).
 */
export default function BrandCrossLink({ make }: Props) {
  const brand = getBrandRouteByMake(make)
  if (!brand) return null

  return (
    <section className="bg-gray-50 py-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Looking for more {brand.label} trucks?
            </h2>
            <p className="text-gray-600 mt-1">
              Browse our full range of used {brand.label} trucks in stock in Gauteng.
            </p>
          </div>
          <Link
            href={`/brands/${brand.slug}`}
            className="inline-flex items-center justify-center shrink-0 px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
          >
            See all {brand.label} trucks →
          </Link>
        </div>
      </div>
    </section>
  )
}
