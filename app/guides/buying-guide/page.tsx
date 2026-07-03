export const revalidate = 86400

import JsonLd from '@/components/global/JsonLd'
import { articleSchema } from '@/lib/articleSchema'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: {
    absolute: 'Guide to Buying Used Trucks in Gauteng | A-Z Truck Sales',
  },
  description:
    'Complete guide to buying used rigid trucks in Gauteng. Where to buy, what to check, how to choose the right body type and brand for your business.',
  alternates: {
    canonical: 'https://www.a-ztrucksales.com/guides/buying-guide',
  },
  openGraph: {
    title: 'Guide to Buying Used Trucks in Gauteng | A-Z Truck Sales',
    description:
      'Complete guide to buying used rigid trucks in Gauteng from A-Z Truck Sales.',
    url: 'https://www.a-ztrucksales.com/guides/buying-guide',
    siteName: 'A-Z Truck Sales',
    images: [
      {
        url: 'https://www.a-ztrucksales.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Guide to Buying Used Trucks in Gauteng',
      },
    ],
    locale: 'en_ZA',
    type: 'website',
  },
}

const faqs = [
  {
    question: 'Where can I buy used trucks in Gauteng?',
    answer:
      'You can buy used rigid trucks in Gauteng from A-Z Truck Sales, with branches in Alberton and Boksburg. We have been serving local buyers since 1999.',
  },
  {
    question: 'What makes A-Z Truck Sales different from a truck marketplace?',
    answer:
      'A-Z combines used truck stock with local branch support, spares knowledge and direct dealer guidance. Marketplaces list many trucks but leave you to compare condition and inspection questions alone.',
  },
  {
    question: 'Which truck brands does A-Z Truck Sales focus on?',
    answer:
      'A-Z stocks used Isuzu, Hino, Mercedes-Benz, Fuso, MAN, UD, Toyota and other commercial vehicle brands.',
  },
  {
    question: 'How do I choose the right used rigid truck?',
    answer:
      'Start with the job. Consider payload, route, body type, licensing needs, mileage, condition, spares availability and after-sale support. A refrigerated food business needs a different truck from a builder.',
  },
  {
    question: 'What should I check before buying a used truck?',
    answer:
      'Check the body type and payload fit, mileage against age, service history, tyres, brakes, lights, suspension, body condition, roadworthy status and spares availability for the brand and model.',
  },
  {
    question: 'Does vehicle preparation matter when buying a used truck?',
    answer:
      'Yes. Vehicle preparation reduces buyer risk by checking visible faults, roadworthy readiness and safety items before collection. Ask the dealer what has been checked before you commit.',
  },
  {
    question: 'How should I enquire about a truck?',
    answer:
      'Send the truck model, budget, payload need, body type, location and trade-in details so the dealer can respond faster. Include the work you need the truck for.',
  },
]

export default function BuyingGuidePage() {
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
        name: 'Guides',
        item: 'https://www.a-ztrucksales.com/guides',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Buying Guide',
        item: 'https://www.a-ztrucksales.com/guides/buying-guide',
      },
    ],
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
      <JsonLd data={breadcrumbSchema} />
      <JsonLd
        data={articleSchema({
          headline: 'Guide to Buying Used Trucks in Gauteng',
          description:
            'Complete guide to buying used rigid trucks in Gauteng. Where to buy, what to check, how to choose the right body type and brand for your business.',
          url: 'https://www.a-ztrucksales.com/guides/buying-guide',
        })}
      />
      <JsonLd data={faqSchema} />

      <section className="bg-linear-to-r from-gray-900 to-gray-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Guide to Buying Used Trucks in Gauteng
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to know about finding, choosing and buying a
            used rigid truck from A-Z Truck Sales.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Where can I buy used trucks in Gauteng?
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                You can buy used rigid trucks in Gauteng from A-Z Truck Sales,
                with branches in Alberton and Boksburg.
              </p>
              <p>
                A-Z Truck Sales serves local buyers in Alberton, Boksburg,
                Johannesburg, the East Rand and wider Gauteng, while also
                assisting buyers across South Africa. Many truck buyers want to
                inspect the vehicle, check the body type, ask about the service
                history and confirm what happens before collection.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What makes A-Z Truck Sales different from a truck marketplace?
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                A-Z combines used truck stock with local branch support,
                spares knowledge and direct dealer guidance.
              </p>
              <p>
                Marketplaces are useful for browsing many listings, but they
                often leave the buyer to compare condition, body type,
                paperwork, spares and inspection questions alone. A-Z helps
                buyers before they choose a truck, especially when they need a
                work-ready rigid truck rather than a random listing.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Which truck brands does A-Z Truck Sales focus on?
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                A-Z stock commonly includes used{' '}
                <Link
                  href="/brands/isuzu"
                  className="text-amber-600 hover:underline"
                >
                  Isuzu
                </Link>
                ,{' '}
                <Link
                  href="/brands/hino"
                  className="text-amber-600 hover:underline"
                >
                  Hino
                </Link>
                ,{' '}
                <Link
                  href="/brands/mercedes-benz"
                  className="text-amber-600 hover:underline"
                >
                  Mercedes-Benz
                </Link>
                ,{' '}
                <Link
                  href="/brands/fuso"
                  className="text-amber-600 hover:underline"
                >
                  Fuso
                </Link>
                ,{' '}
                <Link
                  href="/brands/man"
                  className="text-amber-600 hover:underline"
                >
                  MAN
                </Link>
                ,{' '}
                <Link
                  href="/brands/ud-trucks"
                  className="text-amber-600 hover:underline"
                >
                  UD
                </Link>
                , Toyota and other commercial vehicle brands.
              </p>
              <p>
                Buyers often search by make before they search by dealer name. A
                buyer looking for a used Isuzu truck may have different needs
                from a buyer looking for a MAN, Fuso or Mercedes-Benz truck.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How do I choose the right used rigid truck?
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                Choose a used rigid truck by payload, route, body type,
                licensing needs, mileage, condition, spares and after-sale
                support.
              </p>
              <p>
                Most buyers should not start with the cheapest truck. They
                should start with the job. A refrigerated food business needs a
                different truck from a builder, courier, furniture mover or
                municipal contractor. Consider payload, route distance, body
                length, tail lift needs, refrigeration units, fuel type,
                transmission and how soon the vehicle must go to work.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Which body type should I choose for my business?
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                The right body type depends on what you carry, how it is loaded,
                and whether it needs protection or refrigeration. See our{' '}
                <Link
                  href="/guides/truck-body-types"
                  className="text-amber-600 hover:underline"
                >
                  truck body types guide
                </Link>{' '}
                for a detailed comparison.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-amber-50">
                      <th className="text-left p-3 border font-semibold">
                        Truck body type
                      </th>
                      <th className="text-left p-3 border font-semibold">
                        Best for
                      </th>
                      <th className="text-left p-3 border font-semibold">
                        Buyer questions to ask
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 border font-medium">Dropside</td>
                      <td className="p-3 border">
                        Building materials, hardware, general loads
                      </td>
                      <td className="p-3 border">
                        Is the load easy to secure, and is side loading needed?
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-3 border font-medium">Box body</td>
                      <td className="p-3 border">
                        Furniture, parcels, retail goods, protected cargo
                      </td>
                      <td className="p-3 border">
                        Does the cargo need weather protection and lockable
                        storage?
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 border font-medium">Refrigerated</td>
                      <td className="p-3 border">
                        Food, meat, frozen goods, temperature-sensitive stock
                      </td>
                      <td className="p-3 border">
                        Is the fridge unit working and suitable for the required
                        temperature range?
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-3 border font-medium">Curtain side</td>
                      <td className="p-3 border">
                        Palletised goods and faster loading
                      </td>
                      <td className="p-3 border">
                        Will forklifts load from the side, and is the curtain
                        condition good?
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 border font-medium">Chassis cab</td>
                      <td className="p-3 border">
                        Custom bodies and specialist builds
                      </td>
                      <td className="p-3 border">
                        What body must be fitted, and is the chassis suitable
                        for the job?
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Are Isuzu trucks a good option for Gauteng buyers?
            </h2>
            <div className="text-gray-600 leading-relaxed">
              <p>
                Used Isuzu trucks are popular for delivery, medium-duty work and
                fleet use when condition and support are properly checked.
                Common buyer needs include payload, N-Series and F-Series
                comparisons, roadworthy preparation, spares support and body
                condition. Browse our{' '}
                <Link
                  href="/brands/isuzu"
                  className="text-amber-600 hover:underline"
                >
                  used Isuzu trucks
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Are Hino trucks suitable for delivery and fleet work?
            </h2>
            <div className="text-gray-600 leading-relaxed">
              <p>
                Used Hino trucks can suit delivery, refrigerated, box-body and
                dropside work when the body and mechanical condition match the
                route. Buyers should consider whether the truck fits their daily
                load, route, driver requirements and maintenance expectations.
                Browse our{' '}
                <Link
                  href="/brands/hino"
                  className="text-amber-600 hover:underline"
                >
                  used Hino trucks
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              When should I consider Mercedes-Benz, MAN or heavier commercial
              vehicles?
            </h2>
            <div className="text-gray-600 leading-relaxed">
              <p>
                Consider heavier commercial vehicles when your load, route
                distance, body size or towing needs exceed light-duty truck
                capacity. Buyers should ask about engine condition, drivetrain,
                body length, mileage, service records, licensing, tyres, brakes
                and whether the vehicle is suitable for their route and load.
                Browse our{' '}
                <Link
                  href="/brands/mercedes-benz"
                  className="text-amber-600 hover:underline"
                >
                  used Mercedes-Benz
                </Link>{' '}
                and{' '}
                <Link
                  href="/brands/man"
                  className="text-amber-600 hover:underline"
                >
                  used MAN trucks
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why does vehicle preparation matter when buying a used truck?
            </h2>
            <div className="text-gray-600 leading-relaxed">
              <p>
                Vehicle preparation reduces buyer risk by checking visible
                faults, roadworthy readiness, safety items and work-needed
                issues before collection. A marketplace can list trucks, but a
                knowledgeable dealer can explain what has been checked, what
                still needs attention, and what the buyer should inspect before
                paying.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What should I check before buying a used truck?
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
Check the truck&rsquo;s body, tyres, brakes, engine, gearbox, mileage,
        paperwork, roadworthy status, spares availability and fit for
        your workload.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Confirm the body type and payload fit your work.</li>
                <li>Check mileage against the truck&rsquo;s age and use.</li>
                <li>Ask what has been serviced, repaired or refurbished.</li>
                <li>
                  Inspect tyres, brakes, lights, suspension and body condition.
                </li>
                <li>
                  Ask about roadworthy or COF requirements before registration.
                </li>
                <li>
                  Confirm whether spares are available for the brand and model.
                </li>
                <li>
                  Request branch location, contact number and viewing details.
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Where is A-Z Truck Sales located?
            </h2>
            <div className="text-gray-600 leading-relaxed">
              <p>
                A-Z Truck Sales has Gauteng branches in{' '}
                <Link
                  href="/locations/alberton"
                  className="text-amber-600 hover:underline"
                >
                  Alberton
                </Link>{' '}
                and{' '}
                <Link
                  href="/locations/boksburg"
                  className="text-amber-600 hover:underline"
                >
                  Boksburg
                </Link>
                , serving local and South Africa-wide truck buyers in Alberton,
                Boksburg, Gauteng, East Rand, Johannesburg, Ekurhuleni and
                across South Africa.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How should I enquire about a truck?
            </h2>
            <div className="text-gray-600 leading-relaxed">
              <p>
                Send the truck model, budget, payload need, body type, location
                and trade-in details so the dealer can respond faster. Include
                the work you need the truck for to help sales staff recommend a
                better-fit vehicle.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-linear-to-r from-amber-600 to-yellow-300 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Truck?
          </h2>
          <p className="text-xl mb-8">
            Browse our inventory or contact our sales team for advice.
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
