import { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/global/JsonLd'

export const metadata: Metadata = {
  title: { absolute: 'About A-Z Truck Sales | Used Truck Dealer in Gauteng Since 1999' },
  description: 'A-Z Truck Sales is a used commercial vehicle dealer in Gauteng with branches in Alberton and Boksburg, 25+ years experience and 100+ trucks in stock.',
  alternates: { canonical: 'https://www.a-ztrucksales.com/about' },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://www.a-ztrucksales.com/about',
    siteName: 'A-Z Truck Sales',
    title: 'About A-Z Truck Sales | Used Truck Dealer in Gauteng Since 1999',
    description: 'A-Z Truck Sales is a used commercial vehicle dealer in Gauteng with branches in Alberton and Boksburg, 25+ years experience and 100+ trucks in stock.',
    images: [{ url: 'https://www.a-ztrucksales.com/og-image.webp', width: 1200, height: 630, alt: 'About A-Z Truck Sales' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About A-Z Truck Sales | Used Truck Dealer in Gauteng Since 1999',
    description: 'A-Z Truck Sales is a used commercial vehicle dealer in Gauteng with branches in Alberton and Boksburg, 25+ years experience and 100+ trucks in stock.',
    images: ['https://www.a-ztrucksales.com/og-image.webp'],
  },
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  '@id': 'https://www.a-ztrucksales.com/#org',
  name: 'A-Z Truck Sales',
  url: 'https://www.a-ztrucksales.com',
  logo: 'https://www.a-ztrucksales.com/images/logo.png',
  image: 'https://www.a-ztrucksales.com/og-image.webp',
  description:
    'Used rigid truck dealer in Gauteng, South Africa, established in 1999. Two branches in Alberton and Boksburg. COF-ready trucks and truck spares.',
  foundingDate: '1999-01-01',
  areaServed: 'Gauteng, South Africa',
  sameAs: [
    'https://web.facebook.com/p/A-Z-TRUCK-SALES-100057330584780/',
    'https://www.linkedin.com/company/a-z-truck-sales/?originalSubdomain=za',
    'https://www.youtube.com/@A-ZTRUCKSALES',
  ],
}

const localBusinessSchemaJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  '@id': 'https://www.a-ztrucksales.com/#business',
  name: 'A-Z Truck Sales',
  url: 'https://www.a-ztrucksales.com/',
  logo: 'https://www.a-ztrucksales.com/logo.png',
  description: 'A-Z Truck Sales is a used commercial vehicle dealer in Gauteng with branches in Alberton and Boksburg, supplying used rigid trucks, commercial vehicles and truck spares.',
  telephone: '+27 11 902 6071',
  email: 'aztrucksales@mweb.co.za',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '9 Chrislou Crescent, Alberton North',
    addressLocality: 'Alberton',
    addressRegion: 'Gauteng',
    postalCode: '1449',
    addressCountry: 'ZA',
  },
  areaServed: ['Alberton', 'Boksburg', 'Johannesburg', 'East Rand', 'Gauteng', 'South Africa'],
  openingHours: 'Mo-Fr 08:00-17:00',
  sameAs: [
    'https://web.facebook.com/p/A-Z-TRUCK-SALES-100057330584780/',
    'https://www.linkedin.com/company/a-z-truck-sales/?originalSubdomain=za',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://www.a-ztrucksales.com/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'About Us',
      item: 'https://www.a-ztrucksales.com/about',
    },
  ],
}

export default function AboutPage() {
  return (
    <>
      <JsonLd data={orgSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={localBusinessSchemaJsonLd} />

      {/* Hero */}
      <section className="bg-linear-to-r from-gray-900 to-gray-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About A-Z Truck Sales
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Gauteng&apos;s trusted used rigid truck dealer since 1999 — two
            branches and 100+ trucks in stock.
          </p>
        </div>
      </section>

      {/* Why Buyers Choose */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Buyers Choose A-Z Truck Sales</h2>
            <div className="text-lg text-gray-600 space-y-4">
              <p>
                A-Z Truck Sales is built for businesses that need practical, work-ready commercial vehicles. We understand that a truck is not just transport — it is part of how a business earns money.
              </p>
              <p>
                Our team helps buyers compare body type, payload, mileage, condition, spares availability and roadworthy requirements before choosing a vehicle. With branches in Alberton and Boksburg, we serve truck buyers across Gauteng and South Africa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              25+ Years in the Commercial Vehicle Industry
            </h2>
            <div className="text-lg text-gray-600 space-y-4">
              <p>
                A-Z Truck Sales was established in 1999 and has grown into one
                of Gauteng&apos;s most trusted used commercial vehicle dealers.
                From our roots in Alberton, we expanded to open a second branch
                in Boksburg to serve more of the East Rand and greater Gauteng.
              </p>
              <p>
                We specialise in pre-owned rigid trucks from 1.5 to 35 tons
                across all major commercial vehicle brands — Isuzu, Hino,
                Mercedes-Benz, Fuso, MAN, UD Trucks, Toyota, Nissan, Tata and
                Hyundai. Every truck we sell is COF-ready (Certificate of
                Fitness) before it leaves our yard.
              </p>
              <p>
                Beyond sales, we stock truck spares for all major brands, accept
                trade-ins, and assist buyers with export documentation for
                cross-border purchases. Our team provides honest advice,
                transparent pricing, and practical after-sale support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '1999', label: 'Established' },
              { value: '25+', label: 'Years Experience' },
              { value: '100+', label: 'Trucks in Stock' },
              { value: '2', label: 'Gauteng Branches' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-6 bg-white rounded-lg border border-gray-200"
              >
                <div className="text-3xl font-bold text-amber-500">
                  {stat.value}
                </div>
                <div className="text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'COF-Ready Trucks',
                body: 'Every truck we sell is prepared and must pass its Certificate of Fitness (COF) inspection before sale — ready to put to work immediately.',
              },
              {
                title: 'Truck Spares',
                body: 'We stock used truck parts for Isuzu, Hino, UD, Nissan, Mercedes-Benz and more — reducing downtime for our customers.',
              },
              {
                title: 'Trade-Ins & Export',
                body: 'We accept trade-ins and assist buyers with export documentation for cross-border purchases across Africa.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 bg-white rounded-lg border border-gray-200"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Branches */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Our Two Gauteng Branches
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Alberton Branch (Main)
              </h3>
              <address className="not-italic text-gray-600 space-y-2">
                <p>9 Chrislou Crescent, Alberton North, Gauteng, 1449</p>
                <p>
                  <a
                    href="tel:+27119026071"
                    className="text-amber-600 hover:underline"
                  >
                    011 902 6071
                  </a>
                </p>
                <p>
                  <a
                    href="mailto:aztrucksales@mweb.co.za"
                    className="text-amber-600 hover:underline"
                  >
                    aztrucksales@mweb.co.za
                  </a>
                </p>
                <p>Mon–Fri: 08:00–17:00 | Sat: 08:00–13:00</p>
              </address>
              <Link
                href="/locations/alberton"
                className="mt-4 inline-block text-amber-600 font-medium hover:underline"
              >
                View Alberton branch →
              </Link>
            </div>
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Boksburg Branch
              </h3>
              <address className="not-italic text-gray-600 space-y-2">
                <p>
                  Corner Trichardts Road &amp; Ravenswood Street, Ravenswood,
                  Boksburg, Gauteng, 1451
                </p>
                <p>
                  <a
                    href="tel:+27832345377"
                    className="text-amber-600 hover:underline"
                  >
                    083 234 5377
                  </a>
                </p>
                <p>
                  <a
                    href="mailto:aztruckboks@gmail.com"
                    className="text-amber-600 hover:underline"
                  >
                    aztruckboks@gmail.com
                  </a>
                </p>
                <p>Mon–Fri: 08:00–17:00</p>
              </address>
              <Link
                href="/locations/boksburg"
                className="mt-4 inline-block text-amber-600 font-medium hover:underline"
              >
                View Boksburg branch →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-linear-to-r from-amber-600 to-yellow-300 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Next Truck?
          </h2>
          <p className="text-xl mb-8">
            Browse 100+ trucks in stock or contact our team today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/inventory"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Browse Inventory
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
