import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: 'Page Not Found | A-Z Truck Sales' },
  robots: {
    index: false,
    follow: true,
  },
}

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-6xl font-bold text-neutral-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-3">Page Not Found</h2>
        <p className="text-neutral-600 mb-2">
          The page you are looking for does not exist or may have been removed.
        </p>
        <p className="text-neutral-600 mb-8">
          If you were looking for a specific truck, it may have been sold. Browse our current stock or contact us for assistance.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/inventory"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
          >
            Browse Inventory
          </Link>
          <a
            href="tel:+27119026071"
            className="inline-flex items-center justify-center px-6 py-3 border border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Call 011 902 6071
          </a>
        </div>
      </div>
    </div>
  )
}
