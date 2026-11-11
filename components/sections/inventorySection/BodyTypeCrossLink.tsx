import Link from 'next/link'
import { getBodyTypePageByBodyType } from '@/lib/body-types'

interface Props {
  bodyType: string | null
}

/**
 * Links a truck detail page through to its body-type page.
 * Renders nothing when we have no page for the truck's body type.
 */
export default function BodyTypeCrossLink({ bodyType }: Props) {
  const page = getBodyTypePageByBodyType(bodyType)
  if (!page) return null

  return (
    <section className="bg-white py-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Looking at {page.name.toLowerCase()}?
            </h2>
            <p className="text-gray-600 mt-1">
              Compare every {page.name.toLowerCase().replace(/s$/, '')} we have in stock.
            </p>
          </div>
          <Link
            href={`/body-types/${page.slug}`}
            className="inline-flex items-center justify-center shrink-0 px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
          >
            See all {page.name.toLowerCase()} →
          </Link>
        </div>
      </div>
    </section>
  )
}
