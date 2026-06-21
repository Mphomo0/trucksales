export const revalidate = 86400

import JsonLd from '@/components/global/JsonLd'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: 'What to Check Before Buying a Used Truck | A-Z Truck Sales' },
  description: 'Used truck inspection checklist: engine, gearbox, body condition, tyres, brakes, paperwork, COF and roadworthy requirements for Gauteng buyers.',
  alternates: { canonical: 'https://www.a-ztrucksales.com/guides/what-to-check-before-buying' },
  openGraph: {
    title: 'What to Check Before Buying a Used Truck | A-Z Truck Sales',
    description: 'Used truck inspection checklist: engine, gearbox, body condition, tyres, brakes, paperwork, COF and roadworthy requirements for Gauteng buyers.',
    url: 'https://www.a-ztrucksales.com/guides/what-to-check-before-buying',
    siteName: 'A-Z Truck Sales',
    images: [{ url: 'https://www.a-ztrucksales.com/og-image.webp', width: 1200, height: 630, alt: 'What to Check Before Buying a Used Truck' }],
    locale: 'en_ZA', type: 'website',
  },
}

export default function WhatToCheckPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.a-ztrucksales.com' },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://www.a-ztrucksales.com/guides' },
      { '@type': 'ListItem', position: 3, name: 'What to Check Before Buying', item: 'https://www.a-ztrucksales.com/guides/what-to-check-before-buying' },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <section className="bg-linear-to-r from-gray-900 to-gray-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            What to Check Before Buying a Used Truck
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A practical inspection checklist — engine, gearbox, body condition, tyres, brakes, paperwork and roadworthy requirements.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Engine and Drivetrain</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                The engine is the most expensive component to repair or replace on a used truck. Start your inspection here.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Check for unusual noises, knocking, rattling or excessive vibration at idle and under load.</li>
                <li>Look for oil leaks around the engine block, turbo, sump and rocker cover.</li>
                <li>Inspect the coolant for signs of oil contamination (milky appearance) or rust.</li>
                <li>Check the exhaust for blue smoke (burning oil) or white smoke (coolant leak).</li>
                <li>Verify service intervals — a well-maintained engine should have documented oil changes every 10,000–15,000 km.</li>
                <li>Ask about the timing belt or chain replacement history.</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Gearbox and Clutch</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                Transmission problems can be expensive. Test the gearbox thoroughly before committing.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Test drive through all gears — listen for grinding, whining or difficulty engaging.</li>
                <li>Check clutch bite point and feel for slipping under acceleration.</li>
                <li>Inspect for oil leaks around the gearbox housing.</li>
                <li>Ask when the clutch was last replaced — clutches typically last 200,000–300,000 km depending on use.</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Body and Chassis Condition</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                The body condition affects payload capacity, safety and resale value. Rust and structural damage can be deal-breakers.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Check the chassis rails for cracks, rust, bends or previous welding repairs.</li>
                <li>Inspect the load body for rust, rot, panel damage and structural integrity.</li>
                <li>Check dropside hinges and locking mechanisms — they must open and close properly.</li>
                <li>For box bodies, check for water ingress, door seals and lock condition.</li>
                <li>For refrigerated bodies, inspect the fridge unit, insulation panels and door gaskets.</li>
                <li>Check the cab for rust, accident damage, windscreen condition and door alignment.</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tyres, Brakes and Suspension</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                Tyres and brakes are both safety-critical and a significant cost factor. Worn items give you negotiating room.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Check tyre tread depth (minimum 1.6 mm legally, but 3 mm+ is preferable for a work truck).</li>
                <li>Look for uneven tyre wear — this indicates alignment, suspension or steering issues.</li>
                <li>Inspect tyre sidewalls for cracks, bulges or damage.</li>
                <li>Test brake pedal feel — spongy or low pedals suggest air in the system or worn pads.</li>
                <li>Check brake drums or discs for wear, scoring and cracks.</li>
                <li>Test the handbrake on an incline.</li>
                <li>Bounce each corner of the truck — excessive bouncing indicates worn shock absorbers.</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Paperwork and Legal Requirements</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                Missing paperwork can delay registration and add unexpected costs. Always verify documentation before paying.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Check the vehicle registration document (NATIS/ENatis) matches the vehicle details.</li>
                <li>Verify the chassis number and engine number match the registration documents.</li>
                <li>Ask for the previous COF (Certificate of Fitness) certificate and check the test date.</li>
                <li>Request service history records and any major repair invoices.</li>
                <li>Confirm whether the vehicle has any outstanding finance or traffic fines.</li>
                <li>Ask if the roadworthy certificate is included or needs to be obtained.</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Roadworthy and COF Readiness</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                A COF-ready truck saves you time and money. COF (Certificate of Fitness) testing checks lights, brakes, tyres, emissions, steering and body condition.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Confirm whether the truck is sold with a valid COF or roadworthy certificate.</li>
                <li>Check all lights are working — headlights, indicators, brake lights, reverse lights and reflectors.</li>
                <li>Verify the speedometer and odometer are functioning.</li>
                <li>Check the windscreen for cracks or chips in the driver&rsquo;s line of sight.</li>
                <li>Ensure the horn, wipers and washers work properly.</li>
              </ul>
              <p className="mt-4">
                See our <Link href="/guides/cof-ready-trucks" className="text-amber-600 hover:underline">COF-ready trucks guide</Link> for a detailed breakdown.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Final Checklist Before Buying</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <ul className="list-disc pl-6 space-y-2">
                <li>Does the body type and payload match your work requirements?</li>
                <li>Is the mileage reasonable for the age and maintenance history?</li>
                <li>Are replacement parts and tyres readily available for this make and model?</li>
                <li>Have you taken the truck for a thorough test drive including highway and bumpy roads?</li>
                <li>Have you asked about warranty, cooling-off period or after-sale support?</li>
                <li>Have you confirmed viewing and inspection arrangements with the dealer?</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-linear-to-r from-amber-600 to-yellow-300 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to View a Truck?</h2>
          <p className="text-xl mb-8">
            Contact A-Z Truck Sales to arrange a viewing or test drive.
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
