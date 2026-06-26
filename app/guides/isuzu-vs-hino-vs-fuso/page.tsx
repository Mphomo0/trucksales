export const revalidate = 86400

import JsonLd from '@/components/global/JsonLd'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: 'Isuzu vs Hino vs Fuso: Best Used Truck for Your Business' },
  description: 'Compare Isuzu, Hino and Fuso for reliability, parts support, fuel economy and running costs. Find the right used truck brand in Gauteng.',
  alternates: { canonical: 'https://www.a-ztrucksales.com/guides/isuzu-vs-hino-vs-fuso' },
  openGraph: {
    title: 'Isuzu vs Hino vs Fuso: Best Used Truck for Your Business',
    description: 'Compare Isuzu, Hino and Fuso used trucks for reliability, parts availability, fuel economy and running costs.',
    url: 'https://www.a-ztrucksales.com/guides/isuzu-vs-hino-vs-fuso',
    siteName: 'A-Z Truck Sales',
    images: [{ url: 'https://www.a-ztrucksales.com/og-image.webp', width: 1200, height: 630, alt: 'Isuzu vs Hino vs Fuso - Used Truck Comparison' }],
    locale: 'en_ZA', type: 'website',
  },
}

export default function IsuzuVsHinoVsFusoPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.a-ztrucksales.com' },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://www.a-ztrucksales.com/guides' },
      { '@type': 'ListItem', position: 3, name: 'Isuzu vs Hino vs Fuso', item: 'https://www.a-ztrucksales.com/guides/isuzu-vs-hino-vs-fuso' },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <section className="bg-linear-to-r from-gray-900 to-gray-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Isuzu vs Hino vs Fuso: Which Used Truck Is Right for Your Business?
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Compare Japanese truck brands for reliability, parts availability, fuel economy and running costs so you can choose the best fit for your business.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Isuzu Trucks Overview</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                Isuzu is one of the most popular truck brands in South Africa, known for reliability, strong parts availability and good resale value. The N-Series (NPR, NLR, NQR) and F-Series (FRR, FSR, FVR) are the most common models in the used market.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Parts availability:</strong> Excellent — Isuzu parts are available throughout South Africa.</li>
                <li><strong>Fuel economy:</strong> Good, especially the N-Series 4-cylinder models.</li>
                <li><strong>Resale value:</strong> Strong — Isuzu trucks hold value well compared to other brands.</li>
                <li><strong>Common uses:</strong> Delivery, distribution, refrigerated transport, dropside and box body work.</li>
                <li><strong>Service network:</strong> Extensive dealer network across Gauteng and South Africa.</li>
              </ul>
              <p>
                Browse our <Link href="/brands/isuzu" className="text-amber-600 hover:underline">used Isuzu trucks</Link> in Gauteng.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Hino Trucks Overview</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                Hino, a Toyota subsidiary, is another leading Japanese truck brand in South Africa. Hino trucks are respected for durability, comfortable cabs and strong dealer support. The 300-Series and 500-Series are common in the used market.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Parts availability:</strong> Good to excellent — Hino parts widely available through Toyota/Hino dealers.</li>
                <li><strong>Fuel economy:</strong> Competitive — slightly better than Fuso in some models.</li>
                <li><strong>Resale value:</strong> Good — especially well-maintained 500-Series models.</li>
                <li><strong>Common uses:</strong> Long-distance transport, refrigerated, box body and fleet operations.</li>
                <li><strong>Service network:</strong> Toyota dealerships across South Africa service Hino trucks.</li>
              </ul>
              <p>
                Browse our <Link href="/brands/hino" className="text-amber-600 hover:underline">used Hino trucks</Link> in Gauteng.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Fuso Trucks Overview</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                Fuso (Mitsubishi Fuso) is a well-known Japanese brand in the light-to-medium truck segment. The Canter model is particularly popular for light-duty work. Fuso trucks offer good value in the used market.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Parts availability:</strong> Good — parts available through Mercedes-Benz/Fuso dealer network.</li>
                <li><strong>Fuel economy:</strong> Good — the Canter is known for efficient fuel consumption.</li>
                <li><strong>Resale value:</strong> Moderate — generally lower than Isuzu but offers better entry pricing.</li>
                <li><strong>Common uses:</strong> Light delivery, courier work, municipality fleets and dropside work.</li>
                <li><strong>Service network:</strong> Mercedes-Benz dealers across South Africa service Fuso trucks.</li>
              </ul>
              <p>
                Browse our <Link href="/brands/fuso" className="text-amber-600 hover:underline">used Fuso trucks</Link> in Gauteng.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Comparison Summary</h2>
            <div className="text-gray-600 leading-relaxed">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-amber-50">
                      <th className="text-left p-3 border font-semibold">Factor</th>
                      <th className="text-left p-3 border font-semibold">Isuzu</th>
                      <th className="text-left p-3 border font-semibold">Hino</th>
                      <th className="text-left p-3 border font-semibold">Fuso</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 border font-medium">Parts availability</td>
                      <td className="p-3 border">Excellent</td>
                      <td className="p-3 border">Good</td>
                      <td className="p-3 border">Good</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-3 border font-medium">Fuel economy</td>
                      <td className="p-3 border">Good</td>
                      <td className="p-3 border">Good</td>
                      <td className="p-3 border">Good</td>
                    </tr>
                    <tr>
                      <td className="p-3 border font-medium">Resale value</td>
                      <td className="p-3 border">Strong</td>
                      <td className="p-3 border">Good</td>
                      <td className="p-3 border">Moderate</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-3 border font-medium">Dealer network</td>
                      <td className="p-3 border">Extensive</td>
                      <td className="p-3 border">Good</td>
                      <td className="p-3 border">Good</td>
                    </tr>
                    <tr>
                      <td className="p-3 border font-medium">Entry price (used)</td>
                      <td className="p-3 border">Higher</td>
                      <td className="p-3 border">Moderate</td>
                      <td className="p-3 border">Lower</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-3 border font-medium">Payload range</td>
                      <td className="p-3 border">1–12 tons</td>
                      <td className="p-3 border">1–12 tons</td>
                      <td className="p-3 border">1–8 tons</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Which Brand Should You Choose?</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                Choose <strong>Isuzu</strong> if you prioritise parts availability, resale value and a proven track record in the South African market. Isuzu is ideal for businesses that plan to keep their trucks for 5+ years.
              </p>
              <p>
                Choose <strong>Hino</strong> if you want a comfortable long-distance truck with Toyota-backed support. Hino is a strong choice for fleet operators and refrigerated transport.
              </p>
              <p>
                Choose <strong>Fuso</strong> if you need an affordable entry into the used truck market, especially for light-duty work. The Canter is an excellent light-delivery vehicle with low running costs.
              </p>
              <p>
                Whichever brand you choose, always inspect the specific truck&rsquo;s condition, service history, body type and mileage rather than relying on brand reputation alone. See our <Link href="/guides/what-to-check-before-buying" className="text-amber-600 hover:underline">what to check before buying guide</Link> for inspection tips.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-linear-to-r from-amber-600 to-yellow-300 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Compare in Person?</h2>
          <p className="text-xl mb-8">
            Visit our Alberton or Boksburg branch to view Isuzu, Hino and Fuso trucks side by side.
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
