export const revalidate = 86400

import JsonLd from '@/components/global/JsonLd'
import { articleSchema } from '@/lib/articleSchema'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: 'COF-Ready Trucks: What Buyers Should Know | A-Z Truck Sales' },
  description: 'Certificate of Fitness (COF) requirements for used trucks in Gauteng: inspection items, costs, validity and why COF-ready trucks save time and money.',
  alternates: { canonical: 'https://www.a-ztrucksales.com/guides/cof-ready-trucks' },
  openGraph: {
    title: 'COF-Ready Trucks: What Buyers Should Know',
    description: 'Certificate of Fitness (COF) requirements for used trucks in Gauteng: inspection items, costs, validity and why COF-ready trucks save time and money.',
    url: 'https://www.a-ztrucksales.com/guides/cof-ready-trucks',
    siteName: 'A-Z Truck Sales',
    images: [{ url: 'https://www.a-ztrucksales.com/og-image.webp', width: 1200, height: 630, alt: 'COF-Ready Trucks - What Buyers Should Know' }],
    locale: 'en_ZA', type: 'website',
  },
}

export default function CofReadyPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.a-ztrucksales.com' },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://www.a-ztrucksales.com/guides' },
      { '@type': 'ListItem', position: 3, name: 'COF-Ready Trucks', item: 'https://www.a-ztrucksales.com/guides/cof-ready-trucks' },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd
        data={articleSchema({
          headline: 'COF-Ready Trucks: What Buyers Should Know',
          description:
            'Certificate of Fitness (COF) requirements for used trucks in Gauteng: inspection items, costs, validity and why COF-ready trucks save time and money.',
          url: 'https://www.a-ztrucksales.com/guides/cof-ready-trucks',
          datePublished: '2026-06-21',
          dateModified: '2026-07-20',
        })}
      />

      <section className="bg-linear-to-r from-gray-900 to-gray-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            COF-Ready Trucks: What Buyers Should Know
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Understanding Certificate of Fitness requirements, inspection items, costs and why COF-ready trucks save time and money.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Is a COF (Certificate of Fitness)?</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                A Certificate of Fitness (COF) is a legal requirement for all commercial vehicles in South Africa weighing over 3,500 kg. It certifies that the vehicle meets minimum safety and roadworthiness standards.
              </p>
              <p>
                The COF must be renewed annually at a registered testing station. Without a valid COF, a truck cannot be registered or legally operated on public roads.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Does the COF Inspection Cover?</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>The COF inspection checks the following systems on every commercial vehicle:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Brakes:</strong> Service brake performance, handbrake efficiency, brake line condition and brake pad/drum wear.</li>
                <li><strong>Lights:</strong> Headlights (high and low beam), indicators, brake lights, reverse lights, number plate light and reflectors.</li>
                <li><strong>Tyres:</strong> Tread depth (minimum 1.6 mm), tyre condition, sidewall damage, matching tyres per axle and correct load rating.</li>
                <li><strong>Steering and suspension:</strong> Steering play, ball joints, shock absorbers, springs and bushings.</li>
                <li><strong>Body and chassis:</strong> Structural integrity, rust, corrosion, cracks and body mounting security.</li>
                <li><strong>Windscreen and mirrors:</strong> Cracks, visibility, rear-view mirror condition and windscreen washer function.</li>
                <li><strong>Exhaust and emissions:</strong> Exhaust system condition, smoke emissions and noise levels.</li>
                <li><strong>Speedometer and odometer:</strong> Accuracy and functionality.</li>
                <li><strong>Horn and wipers:</strong> Working condition and effectiveness.</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Buy a COF-Ready Truck?</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                A COF-ready truck means the seller has already passed the vehicle through a COF test and addressed any issues. This offers several advantages:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Saves time:</strong> You can register and operate the truck immediately without booking your own COF test.</li>
                <li><strong>Saves money:</strong> Repair costs for COF failures (bad tyres, brakes, lights) are already covered by the seller.</li>
                <li><strong>Confirms roadworthiness:</strong> An independent test station has verified the truck meets legal safety standards.</li>
                <li><strong>Reduces risk:</strong> COF-ready trucks have fewer hidden problems compared to trucks sold &ldquo;as-is&rdquo; without a certificate.</li>
                <li><strong>Better for finance:</strong> Some finance providers require a valid COF before approving used truck loans.</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">COF Costs and Validity</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Cost:</strong> COF testing fees vary by testing station and region, typically ranging from R300–R600 per test.</li>
                <li><strong>Validity:</strong> A COF is valid for 12 months from the date of issue and must be renewed annually.</li>
                <li><strong>Renewal:</strong> You can renew the COF up to 30 days before the expiry date without losing the remaining validity.</li>
                <li><strong>Fines:</strong> Operating a truck without a valid COF can result in traffic fines, impoundment and insurance claims being rejected.</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What to Check When Buying a Truck Without COF</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                If a truck is sold without a valid COF, you need to factor in the cost and time of getting one yourself. Before buying:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Ask why the truck does not have a valid COF — was it recently expired, or were repairs needed?</li>
                <li>Get a pre-purchase inspection from a reputable mechanic or testing station.</li>
                <li>Check the tyres, brakes and lights yourself as a starting point — these are the most common COF failures.</li>
                <li>Price up the estimated repair costs and negotiate the purchase price accordingly.</li>
                <li>Factor in the testing fee and potential downtime while COF work is completed.</li>
              </ul>
              <p>
                See our <Link href="/guides/what-to-check-before-buying" className="text-amber-600 hover:underline">what to check before buying guide</Link> for a full inspection checklist.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-linear-to-r from-amber-600 to-yellow-300 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Browse COF-Ready Trucks</h2>
          <p className="text-xl mb-8">
            All our used trucks are COF-certified before sale. Browse our inventory or contact us for current stock.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/inventory" className="inline-flex items-center justify-center px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition">Browse Inventory</Link>
            <Link href="/contact" className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  )
}
