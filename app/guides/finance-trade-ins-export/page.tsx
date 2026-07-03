export const revalidate = 86400

import JsonLd from '@/components/global/JsonLd'
import { articleSchema } from '@/lib/articleSchema'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: 'Truck Finance, Trade-Ins & Export | A-Z Truck Sales' },
  description: 'Payment options, trade-in process, export documentation and cross-border buying for African buyers. Learn about used truck finance and trade-ins in Gauteng.',
  alternates: { canonical: 'https://www.a-ztrucksales.com/guides/finance-trade-ins-export' },
  openGraph: {
    title: 'Used Truck Finance, Trade-Ins and Export Questions',
    description: 'Payment options, trade-in process, export documentation and cross-border buying for African buyers.',
    url: 'https://www.a-ztrucksales.com/guides/finance-trade-ins-export',
    siteName: 'A-Z Truck Sales',
    images: [{ url: 'https://www.a-ztrucksales.com/og-image.webp', width: 1200, height: 630, alt: 'Used Truck Finance, Trade-Ins and Export' }],
    locale: 'en_ZA', type: 'website',
  },
}

export default function FinanceTradeInsExportPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.a-ztrucksales.com' },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://www.a-ztrucksales.com/guides' },
      { '@type': 'ListItem', position: 3, name: 'Finance, Trade-Ins and Export', item: 'https://www.a-ztrucksales.com/guides/finance-trade-ins-export' },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd
        data={articleSchema({
          headline: 'Truck Finance, Trade-Ins & Export',
          description:
            'Payment options, trade-in process, export documentation and cross-border buying for African buyers. Learn about used truck finance and trade-ins in Gauteng.',
          url: 'https://www.a-ztrucksales.com/guides/finance-trade-ins-export',
        })}
      />

      <section className="bg-linear-to-r from-gray-900 to-gray-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Used Truck Finance, Trade-Ins and Export Questions
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Payment options, trade-in process, export documentation and cross-border buying for African buyers.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Used Truck Payment Options</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                A-Z Truck Sales offers several payment options to suit different buyer needs:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Cash purchase:</strong> Full payment via EFT or bank transfer. The fastest way to secure a truck.</li>
                <li><strong>Financing:</strong> Used truck finance through third-party lenders. Approval depends on credit history, deposit amount and vehicle condition.</li>
                <li><strong>Lay-by:</strong> Some trucks can be reserved with a deposit and paid off over an agreed period.</li>
                <li><strong>Export payment:</strong> International bank transfers and export letters of credit are accepted for cross-border buyers.</li>
              </ul>
              <p>
                Contact our sales team to discuss the best payment option for your situation. We will explain the documentation required and help you through the process.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Trade-In Your Current Truck</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                Trading in your current truck can reduce what you need to finance or pay for your next vehicle. The trade-in process is straightforward:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Contact A-Z Truck Sales with your current truck&rsquo;s details — make, model, year, mileage, body type and condition.</li>
                <li>Send photos of the truck from all angles, including interior and any damage.</li>
                <li>We assess the value based on market demand, condition, mileage and brand.</li>
                <li>Receive a trade-in offer. If you accept, the value is deducted from your new purchase.</li>
                <li>Complete the paperwork — we handle the ownership transfer.</li>
              </ol>
              <p>
                Trade-in values depend on the vehicle&rsquo;s condition, COF status, service history and current market demand. Well-maintained trucks with valid COF and service records attract higher trade-in offers.
              </p>
              <p>
                See our <Link href="/sell-your-truck" className="text-amber-600 hover:underline">sell your truck</Link> page for more details.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Export Requirements for Cross-Border Buyers</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                A-Z Truck Sales assists buyers from other African countries who want to purchase used trucks in South Africa for export. Here is what you need:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Proof of identity:</strong> Valid passport or national ID from your country.</li>
                <li><strong>Proof of residence:</strong> Utility bill or bank statement from your home country.</li>
                <li><strong>Export permit:</strong> South African export documentation as required by SAPS and Customs.</li>
                <li><strong>Bill of lading:</strong> For sea freight transport to your destination country.</li>
                <li><strong>Cross-border permit:</strong> For road transport through neighbouring countries.</li>
                <li><strong>Payment:</strong> International bank transfer in South African rand (ZAR) or agreed currency.</li>
              </ul>
              <p>
                We can assist with arranging transport to the border or port of departure. Contact our team with your specific export requirements and we will advise on the process.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions About Finance and Trade-Ins</h2>
            <div className="text-gray-600 leading-relaxed space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I get finance for a used truck?</h3>
                <p>Yes, used truck finance is available through lenders approved by our dealership. The interest rate and terms depend on your credit profile, the truck age and the loan amount.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What deposit is required for used truck finance?</h3>
                <p>Deposit requirements vary by lender and your credit profile. Typically, buyers can expect to pay 10–30% of the purchase price as a deposit.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I trade in a truck I still owe money on?</h3>
                <p>Yes, but the outstanding finance must be settled before the trade-in can proceed. We can help you understand the settlement process with your current lender.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How long does it take to arrange used truck finance?</h3>
                <p>Finance approvals typically take 1–3 business days once the lender has received all required documentation. Having your documents ready speeds up the process.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Do you deliver exported trucks to the border?</h3>
                <p>Yes, we can arrange transport of purchased vehicles to any South African border post or port of departure. Transport costs are quoted separately.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-linear-to-r from-amber-600 to-yellow-300 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start the Process?</h2>
          <p className="text-xl mb-8">
            Contact our sales team to discuss financing, trade-ins or export requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center justify-center px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition">Contact Us</Link>
            <Link href="/inventory" className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition">Browse Inventory</Link>
          </div>
        </div>
      </section>
    </>
  )
}
