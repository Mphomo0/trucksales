export const revalidate = 86400

import JsonLd from '@/components/global/JsonLd'
import { articleSchema } from '@/lib/articleSchema'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: 'Choose a Truck: Construction, Delivery or Cold Chain' },
  description: 'Match body type to your industry: dropside for building, refrigerated for cold chain, box body for deliveries. Browse used trucks in Gauteng.',
  alternates: { canonical: 'https://www.a-ztrucksales.com/guides/choose-truck-for-construction-delivery-cold-storage' },
  openGraph: {
    title: 'Choose a Truck: Construction, Delivery or Cold Chain',
    description: 'Match truck body type and payload to your industry — dropside for building sites, refrigerated for cold chain, box body for deliveries.',
    url: 'https://www.a-ztrucksales.com/guides/choose-truck-for-construction-delivery-cold-storage',
    siteName: 'A-Z Truck Sales',
    images: [{ url: 'https://www.a-ztrucksales.com/og-image.webp', width: 1200, height: 630, alt: 'How to Choose a Truck for Construction, Delivery or Cold Storage' }],
    locale: 'en_ZA', type: 'website',
  },
}

export default function ChooseTruckPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.a-ztrucksales.com' },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://www.a-ztrucksales.com/guides' },
      { '@type': 'ListItem', position: 3, name: 'Choose Truck for Your Industry', item: 'https://www.a-ztrucksales.com/guides/choose-truck-for-construction-delivery-cold-storage' },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd
        data={articleSchema({
          headline: 'Choose a Truck: Construction, Delivery or Cold Chain',
          description:
            'Match body type to your industry: dropside for building, refrigerated for cold chain, box body for deliveries. Browse used trucks in Gauteng.',
          url: 'https://www.a-ztrucksales.com/guides/choose-truck-for-construction-delivery-cold-storage',
          datePublished: '2026-06-21',
          dateModified: '2026-07-03',
        })}
      />

      <section className="bg-linear-to-r from-gray-900 to-gray-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            How to Choose a Truck for Construction, Delivery or Cold Storage
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Match body type and payload to your industry — dropside for building sites, refrigerated for cold chain, box body for deliveries.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Choosing a Truck for Construction Work</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                Construction sites demand durable trucks that can handle rough terrain, heavy loads and frequent loading. The right truck for construction depends on what you carry and where you deliver.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Dropside trucks</strong> are the most popular choice for construction — sides open for easy loading of bricks, sand, timber and building materials.</li>
                <li><strong>Tipper bodies</strong> are ideal for sand, gravel, rubble and loose materials that need tipping discharge.</li>
                <li><strong>Chassis cab</strong> gives you the flexibility to mount a custom body for your specific construction needs.</li>
                <li>Look for reinforced suspension, heavy-duty tyres and underbody protection for site work.</li>
                <li>Consider 4x4 or all-wheel-drive options if your sites have poor road access.</li>
              </ul>
              <p>
                Construction trucks typically need higher payload capacity (5–12 tons) and durable bodies that withstand daily loading.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Choosing a Truck for Delivery and Distribution</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                Delivery trucks need easy loading, weather protection and fuel efficiency. The right body type saves time on every route.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Box body trucks</strong> are the standard for furniture, retail goods, parcels and protected cargo. Lockable and weatherproof.</li>
                <li><strong>Curtain side trucks</strong> are ideal for palletised goods that need fast forklift loading from the side.</li>
                <li><strong>Refrigerated box bodies</strong> for food and perishable delivery — essential for cold chain logistics.</li>
                <li>Tail lifts are valuable for deliveries where no loading dock is available.</li>
                <li>Automatic transmissions can reduce driver fatigue on urban delivery routes.</li>
              </ul>
              <p>
                Delivery trucks typically operate in the 1–8 ton payload range with a focus on fuel economy and manoeuvrability in urban areas.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Choosing a Truck for Cold Storage and Refrigerated Transport</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                Refrigerated transport requires specialised equipment. The truck body and refrigeration unit must maintain consistent temperatures for food safety and compliance.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Refrigerated box body</strong> — fully insulated with a built-in fridge/freezer unit. Suitable for frozen, chilled and ambient goods.</li>
                <li>Check the fridge unit type: rear-mount, under-mount or nose-mount. Each has different maintenance requirements.</li>
                <li>Verify temperature range capability — some units only cool to -5&deg;C while others reach -20&deg;C for frozen goods.</li>
                <li>Inspect insulation panel condition, door seals and internal floor drainage.</li>
                <li>Check the fridge unit service history — compressor, condenser and refrigerant levels should be documented.</li>
              </ul>
              <p>
                See our <Link href="/guides/truck-body-types" className="text-amber-600 hover:underline">truck body types guide</Link> for more details on refrigerated bodies.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">General Selection Checklist</h2>
            <div className="text-gray-600 leading-relaxed">
              <ul className="list-disc pl-6 space-y-2">
                <li>Identify the payload you need to carry (kg or tons).</li>
                <li>Consider your typical route — urban, highway or off-road.</li>
                <li>Choose the body type that matches your cargo (dropside, box, refrigerated, curtain side, tipper).</li>
                <li>Check licensing requirements — some trucks need a Code 10 or Code 14 licence.</li>
                <li>Factor in maintenance costs, parts availability and dealer support for the brand.</li>
                <li>Compare fuel economy across models and body types.</li>
                <li>Test drive to confirm the truck handles well with a representative load.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-linear-to-r from-amber-600 to-yellow-300 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Not Sure Which Truck You Need?</h2>
          <p className="text-xl mb-8">
            Tell us about your business and we will recommend the right truck body type and payload.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center justify-center px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition">Contact Our Team</Link>
            <Link href="/inventory" className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition">Browse Inventory</Link>
          </div>
        </div>
      </section>
    </>
  )
}
