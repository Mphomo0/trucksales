import Link from 'next/link'

const GUIDES = {
  'buying-guide': 'Guide to buying used trucks in Gauteng',
  'what-to-check-before-buying': 'What to check before buying a used truck',
  'cof-ready-trucks': 'COF-ready trucks explained',
  'truck-body-types': 'Truck body types explained',
  'isuzu-vs-hino-vs-fuso': 'Isuzu vs Hino vs Fuso compared',
  'choose-truck-for-construction-delivery-cold-storage':
    'Choosing a truck for construction, delivery or cold storage',
  'finance-trade-ins-export': 'Finance, trade-ins and export',
} as const

export type GuideSlug = keyof typeof GUIDES

/** Contextual links to the buying guides from pages where the reader is deciding. */
export default function RelatedGuides({
  guides,
  heading = 'Buying guides',
}: {
  guides: GuideSlug[]
  heading?: string
}) {
  return (
    <section className="py-12 bg-white border-t border-neutral-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{heading}</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {guides.map((slug) => (
            <li key={slug}>
              <Link
                href={`/guides/${slug}`}
                className="block rounded-lg border border-gray-200 px-4 py-3 text-amber-700 hover:bg-amber-50 hover:underline"
              >
                {GUIDES[slug]}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
