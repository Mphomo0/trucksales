export const revalidate = 86400

import JsonLd from '@/components/global/JsonLd'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: 'Used Truck Brands | Isuzu, Hino, Fuso, UD & MAN' },
  description: 'Browse used truck brands sold by A-Z Truck Sales, including Isuzu, Hino, Fuso, UD, MAN, Mercedes-Benz, Toyota, Tata and Hyundai commercial vehicles.',
  alternates: { canonical: 'https://www.a-ztrucksales.com/brands' },
  openGraph: {
    title: 'Used Truck Brands | Isuzu, Hino, Fuso, UD & MAN',
    description: 'Browse used truck brands sold by A-Z Truck Sales, including Isuzu, Hino, Fuso, UD, MAN, Mercedes-Benz, Toyota, Tata and Hyundai commercial vehicles.',
    url: 'https://www.a-ztrucksales.com/brands',
    siteName: 'A-Z Truck Sales',
    images: [{ url: 'https://www.a-ztrucksales.com/og-image.webp', width: 1200, height: 630, alt: 'Truck Brands - A-Z Truck Sales' }],
    locale: 'en_ZA',
    type: 'website',
  },
}

const brands = [
  {
    name: 'Isuzu',
    href: '/brands/isuzu',
    description:
      'N-Series and F-Series used rigid trucks. Popular for delivery, distribution and medium-duty work.',
    models: 'NPR, NQR, NPS, FRR, FSR, FVR, FVZ',
  },
  {
    name: 'Hino',
    href: '/brands/hino',
    description:
      '300-Series and 500-Series used trucks. Japanese reliability for city delivery and fleet work.',
    models: '300-Series, 500-Series, FC',
  },
  {
    name: 'Fuso',
    href: '/brands/fuso',
    description:
      'Canter and Fighter used trucks. Excellent fuel economy for light- to medium-duty transport.',
    models: 'Canter, Fighter',
  },
  {
    name: 'UD Trucks',
    href: '/brands/ud-trucks',
    description:
      'Condor and Croner used trucks. Durable and powerful for medium- to heavy-duty work.',
    models: 'Condor, Croner',
  },
  {
    name: 'MAN',
    href: '/brands/man',
    description:
      'TGL, TGM and heavy-duty used trucks. German engineering for long-distance and heavy transport.',
    models: 'TGL, TGM',
  },
  {
    name: 'Mercedes-Benz',
    href: '/brands/mercedes-benz',
    description:
      'Atego and Axor used trucks. Premium European quality for distribution and long-distance.',
    models: 'Atego, Axor',
  },
  {
    name: 'Tata',
    href: '/brands/tata',
    description:
      'LPT and other models. Competitive pricing and solid build quality for light- to medium-duty work.',
    models: 'LPT 709, 912, 1615',
  },
  {
    name: 'Toyota',
    href: '/brands/toyota',
    description:
      'Dyna and light-duty trucks. Legendary reliability and the best parts network in South Africa.',
    models: 'Dyna',
  },
  {
    name: 'Hyundai',
    href: '/brands/hyundai',
    description:
      'HD series and light-duty trucks. Modern design, competitive pricing and reliable performance.',
    models: 'HD Series',
  },
]

export default function BrandsPage() {
  return (
    <>
      <section className="bg-linear-to-r from-gray-900 to-gray-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Used Truck Brands We Sell
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A-Z Truck Sales stocks used commercial vehicles from leading truck brands in South Africa. Our stock changes regularly, but common brands include Isuzu, Hino, Fuso, UD Trucks, MAN, Mercedes-Benz, Toyota, Tata, Hyundai and Nissan.
          </p>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mt-4">
            Buyers can browse by brand or contact our team with the truck size, body type and budget they need.
          </p>
        </div>
      </section>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand) => (
              <Link
                key={brand.name}
                href={brand.href}
                className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-md transition"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {brand.name}
                </h2>
                <p className="text-sm text-gray-500 mb-3">
                  Models: {brand.models}
                </p>
                <p className="text-gray-600">{brand.description}</p>
                <span className="text-amber-600 font-semibold mt-4 inline-block">
                  Browse {brand.name} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
