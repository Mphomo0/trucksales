export const revalidate = 86400

import JsonLd from '@/components/global/JsonLd'
import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: { absolute: 'Used Trucks for Sale in Alberton | A-Z Truck Sales' },
  description:
    'Visit A-Z Truck Sales in Alberton, Gauteng for quality used rigid trucks. Isuzu, Hino, Fuso, UD & more. 25+ years experience, 100+ trucks in stock.',
  alternates: { canonical: 'https://www.a-ztrucksales.com/locations/alberton' },
  openGraph: {
    title: 'Used Trucks for Sale in Alberton | A-Z Truck Sales',
    description:
      'Alberton truck dealer with 25+ years experience. Browse 100+ used rigid trucks from Isuzu, Hino, Fuso, UD and more. Truck spares available.',
    url: 'https://www.a-ztrucksales.com/locations/alberton',
    siteName: 'A-Z Truck Sales',
    images: [
      {
        url: 'https://www.a-ztrucksales.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'A-Z Truck Sales Alberton - Used Commercial Vehicles',
      },
    ],
    locale: 'en_ZA',
    type: 'website',
  },
}

const faqs = [
  {
    question: 'Where is A-Z Truck Sales in Alberton?',
    answer:
      'A-Z Truck Sales is located at 9 Chrislou Crescent, Alberton North, Gauteng, 1449. We are open Monday to Friday 8AM-5PM and Saturday 8AM-1PM.',
  },
  {
    question: 'What trucks do you sell in Alberton?',
    answer:
      'We sell used rigid trucks from 1.5 to 35 tons including Isuzu, Hino, Mercedes-Benz, Ford, MAN, Fuso, Toyota, Nissan, Tata, Hyundai, Volkswagen and UD Trucks.',
  },
  {
    question: 'Do you have truck spares in Alberton?',
    answer:
      'Yes, we stock truck spares for all major brands including Isuzu, Hino, UD, Nissan and Mercedes-Benz. Contact us for availability.',
  },
  {
    question: 'Can I view trucks at your Alberton branch?',
    answer:
      'Yes, visits are by appointment. Call 011 902 6071 or WhatsApp us to arrange a viewing at our Alberton North location.',
  },
  {
    question: 'Do you offer financing for trucks bought in Alberton?',
    answer:
      'Yes, we work with various vehicle finance providers. Contact our Alberton sales team to discuss options.',
  },
]

export default async function AlbertonPage() {
  const vehicles = await prisma.inventory.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      make: true,
      model: true,
      year: true,
      vatPrice: true,
      mileage: true,
      fuelType: true,
      transmission: true,
      images: true,
      slug: true,
      specialPrice: true,
    },
  })

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.a-ztrucksales.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Alberton Truck Dealer',
        item: 'https://www.a-ztrucksales.com/locations/alberton',
      },
    ],
  }
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    '@id': 'https://www.a-ztrucksales.com/locations/alberton#branch',
    name: 'A-Z Truck Sales — Alberton',
    parentOrganization: { '@id': 'https://www.a-ztrucksales.com/#org' },
    image: 'https://www.a-ztrucksales.com/og-image.webp',
    url: 'https://www.a-ztrucksales.com/locations/alberton',
    telephone: '+27119026071',
    email: 'aztrucksales@mweb.co.za',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '9 Chrislou Crescent',
      addressLocality: 'Alberton North',
      addressRegion: 'Gauteng',
      postalCode: '1449',
      addressCountry: 'ZA',
    },
    geo: { '@type': 'GeoCoordinates', latitude: -26.2694, longitude: 28.1221 },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '08:00',
        closes: '13:00',
      },
    ],
    areaServed: 'Gauteng, South Africa',
  }
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <>
      <h1 className="sr-only">
        Used Trucks for Sale in Alberton | A-Z Truck Sales
      </h1>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={faqSchema} />

      {/* Hero */}
      <section className="bg-linear-to-r from-gray-900 to-gray-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Used Trucks for Sale in Alberton
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Alberton truck dealer with 25+ years of experience. Browse 100+
            quality used rigid trucks from 1.5 to 35 tons — ready for viewing at
            our Alberton North branch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/inventory"
              className="inline-flex items-center justify-center px-8 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
            >
              Browse Inventory
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* About Alberton Branch */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Alberton Truck Dealer — 25+ Years Serving the East Rand
              </h2>
              <div className="text-lg text-gray-600 space-y-4">
                <p>
                  A-Z Truck Sales has been serving Alberton, the East Rand and
                  greater Gauteng since 1999 from our Alberton North branch. We
                  are a trusted used truck dealership specializing in pre-owned
                  rigid commercial vehicles from 1.5 to 35 tons.
                </p>
                <p>
                  We stock 100+ trucks at any time across brands including
                  Isuzu, Hino, Fuso, UD, MAN, Mercedes-Benz, Toyota and more. We
                  also carry truck spares for all major brands at our Alberton
                  branch.
                </p>
                <p>
                  Whether you need a dropside truck for building materials, a
                  box body for retail deliveries, a refrigerated body for food
                  transport, or a curtain side for palletised goods — we help
                  Alberton businesses find the right truck for the job.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-3xl font-bold text-amber-500">100+</div>
                  <div className="text-gray-600">Trucks in Stock</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-3xl font-bold text-amber-500">25+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-3xl font-bold text-amber-500">245+</div>
                  <div className="text-gray-600">Verified Reviews</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-3xl font-bold text-amber-500">2</div>
                  <div className="text-gray-600">Gauteng Branches</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Visit Our Alberton Branch
              </h3>
              <div className="text-gray-600 space-y-3">
                <p>
                  <strong>Address:</strong> 9 Chrislou Crescent, Alberton North,
                  Alberton, 1449
                </p>
                <p>
                  <strong>Phone:</strong>{' '}
                  <a
                    href="tel:+27119026071"
                    className="text-amber-600 hover:underline"
                  >
                    011 902 6071
                  </a>
                </p>
                <p>
                  <strong>Email:</strong>{' '}
                  <a
                    href="mailto:aztrucksales@mweb.co.za"
                    className="text-amber-600 hover:underline"
                  >
                    aztrucksales@mweb.co.za
                  </a>
                </p>
                <p>
                  <strong>Hours:</strong> Monday-Friday 8:00 AM - 5:00 PM,
                  Saturday 8:00 AM - 1:00 PM
                </p>
                <p>
                  <strong>Services:</strong> Used truck sales, truck spares,
                  trade-ins
                </p>
              </div>
              <div className="mt-6">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3580.5!2d28.1221!3d-26.2694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDE2JzA5LjgiUyAyOMKwMDcnMTkuNiJF!5e0!3m2!1sen!2sza!4v1"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="A-Z Truck Sales Alberton Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Trucks */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Latest Used Trucks Available in Alberton
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Recently added stock at our Alberton North branch.
          </p>
          {vehicles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((truck) => (
                <Link
                  key={truck.id}
                  href={`/inventory/${truck.slug}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
                >
                  <div className="aspect-video bg-gray-200 relative">
                    {(truck.images as any[])?.[0]?.url && (
                      <img
                        src={(truck.images as any[])[0].url}
                        alt={`${truck.year} ${truck.name}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">
                      {truck.year} {truck.name}
                    </h3>
                    <p className="text-amber-600 font-bold text-lg">
                      {truck.vatPrice
                        ? `R${(truck.vatPrice / 100).toLocaleString()}`
                        : 'Call for price'}
                    </p>
                    <div className="flex gap-2 mt-2 text-sm text-gray-500">
                      <span>{truck.mileage?.toLocaleString() ?? '-'} km</span>
                      <span>|</span>
                      <span>{truck.fuelType ?? '-'}</span>
                      <span>|</span>
                      <span>{truck.transmission ?? '-'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No trucks currently listed. Check back soon or contact us.
            </p>
          )}
          <div className="text-center mt-8">
            <Link
              href="/inventory"
              className="inline-flex items-center justify-center px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
            >
              View All Trucks
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose A-Z Alberton */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Why Choose A-Z Truck Sales in Alberton?
          </h2>
          <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            Alberton businesses choose A-Z Truck Sales for honest advice,
            quality trucks and after-sale support.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                25+ Years Local Experience
              </h3>
              <p className="text-gray-600">
                Serving Alberton and the East Rand since 1999. We know the local
                transport routes, industry needs and commercial vehicle
                requirements.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                100+ Trucks in Stock
              </h3>
              <p className="text-gray-600">
                One of the largest selections of used rigid trucks in Gauteng.
                Isuzu, Hino, Fuso, UD, MAN, Mercedes-Benz, Toyota and more
                brands available.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Truck Spares Support
              </h3>
              <p className="text-gray-600">
                We stock truck spares for all major brands including Isuzu,
                Hino, UD, Nissan and Mercedes-Benz — reducing downtime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Frequently Asked Questions About Truck Sales in Alberton
            </h2>
            <p className="text-lg text-gray-600 mb-8 text-center">
              Common questions from Alberton truck buyers.
            </p>
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="bg-white rounded-lg mb-4 border border-neutral-200 p-6"
              >
                <summary className="font-semibold text-gray-900 cursor-pointer">
                  {faq.question}
                </summary>
                <p className="mt-4 text-gray-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-linear-to-r from-amber-600 to-yellow-300 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Looking for a Used Truck in Alberton?
          </h2>
          <p className="text-xl mb-8">
            Visit our Alberton North branch or call 011 902 6071 to speak with
            our team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Contact Our Team
            </Link>
            <Link
              href="/inventory"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition"
            >
              Browse Inventory
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
