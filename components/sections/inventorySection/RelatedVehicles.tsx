import Link from 'next/link'
import Image from 'next/image'

interface RelatedVehicle {
  slug: string
  year: number
  make: string
  model: string
  bodyType: string | null
  vatPrice: number
  images: { url: string }[]
}

interface Props {
  vehicles: RelatedVehicle[]
  make: string
}

const toTitleCase = (s: string) =>
  s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())

export default function RelatedVehicles({ vehicles, make }: Props) {
  if (vehicles.length === 0) return null

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          More {toTitleCase(make)} Trucks for Sale
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicles.map((v) => {
            const title = `${v.year} ${toTitleCase(v.make)} ${toTitleCase(v.model)}${v.bodyType ? ` ${toTitleCase(v.bodyType)}` : ''}`
            const thumb = v.images[0]?.url ?? '/images/placeholder.webp'
            return (
              <Link
                key={v.slug}
                href={`/inventory/${v.slug}`}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-40">
                  <Image
                    src={thumb}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-gray-800 line-clamp-2">{title}</p>
                  {v.vatPrice > 0 && (
                    <p className="text-sm text-amber-600 font-medium mt-1">
                      R {v.vatPrice.toLocaleString('en-ZA')} incl. VAT
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
