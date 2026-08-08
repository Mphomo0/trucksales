import Link from 'next/link'
import { getSiblingTonnageBuckets } from '@/lib/tonnage'

interface Props {
  currentSlug: string
}

/**
 * Links each tonnage page to the other payload ranges, so the cluster is
 * interlinked rather than hanging off the hub alone.
 */
export default function TonnageSiblingLinks({ currentSlug }: Props) {
  const siblings = getSiblingTonnageBuckets(currentSlug)
  if (siblings.length === 0) return null

  return (
    <section className="py-16 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Browse Other Tonnage Ranges
        </h2>
        <p className="text-gray-600 mb-8">
          Not the right payload? Compare the other truck sizes we stock in Gauteng.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {siblings.map((bucket) => (
            <Link
              key={bucket.slug}
              href={`/tonnage/${bucket.slug}`}
              className="block bg-gray-50 rounded-lg border border-gray-200 p-5 hover:border-amber-500 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-900">
                {bucket.label} Trucks
              </h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                For {bucket.useCases}.
              </p>
              <span className="text-amber-600 font-medium text-sm mt-3 inline-block">
                View {bucket.label.toLowerCase()} stock →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
