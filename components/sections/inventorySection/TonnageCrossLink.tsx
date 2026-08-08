import Link from 'next/link'
import { getTonnageBucketBySize } from '@/lib/tonnage'

interface Props {
  truckSize: string | null
}

/**
 * Links a truck detail page through to its tonnage category page.
 * Renders nothing when the truck's size falls outside our tonnage buckets.
 */
export default function TonnageCrossLink({ truckSize }: Props) {
  const bucket = getTonnageBucketBySize(truckSize)
  if (!bucket) return null

  return (
    <section className="bg-white py-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Looking at {bucket.label.toLowerCase()} trucks?
            </h2>
            <p className="text-gray-600 mt-1">
              This truck is in our {bucket.label.toLowerCase()} range — commonly used for{' '}
              {bucket.useCases}.
            </p>
          </div>
          <Link
            href={`/tonnage/${bucket.slug}`}
            className="inline-flex items-center justify-center shrink-0 px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
          >
            See all {bucket.label} trucks →
          </Link>
        </div>
      </div>
    </section>
  )
}
