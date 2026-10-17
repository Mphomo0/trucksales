import { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/global/JsonLd'

const title = 'Terms of Use | A-Z Truck Sales'
const description =
  'Terms for using the A-Z Truck Sales website: vehicle information, pricing, availability and liability.'

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: 'https://www.a-ztrucksales.com/terms' },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://www.a-ztrucksales.com/terms',
    siteName: 'A-Z Truck Sales',
    title,
    description,
    images: [
      {
        url: 'https://www.a-ztrucksales.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'A-Z Truck Sales',
      },
    ],
  },
}

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
      name: 'Terms of Use',
      item: 'https://www.a-ztrucksales.com/terms',
    },
  ],
}

export default function TermsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Use</h1>
          <p className="text-sm text-gray-500 mb-10">Last updated: 17 October 2026</p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <p>
              These terms apply to your use of www.a-ztrucksales.com, operated by A-Z Truck
              Sales. By using the website you agree to them.
            </p>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Vehicle and parts information</h2>
              <p>
                We work to keep listings accurate, but descriptions, photos, mileage,
                specifications and prices on the website are a guide and can contain errors
                or change without notice. Stock sells quickly, so a listed vehicle or part
                may no longer be available. Please contact us to confirm availability,
                price and condition before you travel or pay.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Prices and specials</h2>
              <p>
                Prices are in South African rand. Where a price is marked incl. VAT it includes
                VAT; otherwise confirm the VAT position with us. Specials are valid only for
                the dates shown and while stock lasts.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">No offer or contract</h2>
              <p>
                Content on the website is an invitation to enquire, not an offer to sell. A
                sale is concluded only when we confirm it with you in writing and the terms of
                the sale, including any warranty, have been agreed.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Using the website</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Do not misuse the website, attempt to disrupt it or access it by automated means that harm its performance.</li>
                <li>Information you submit through our forms must be accurate and yours to share.</li>
                <li>Text, images and logos on the website belong to A-Z Truck Sales or are used with permission. Do not copy them for commercial use without our written consent.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Limitation of liability</h2>
              <p>
                To the extent the law allows, A-Z Truck Sales is not liable for losses
                arising from your use of, or reliance on, the website, or from interruptions
                or errors on it. Nothing in these terms limits any right you have under the
                Consumer Protection Act, 2008, or other law that cannot be excluded.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Links to other sites</h2>
              <p>
                The website may link to third-party sites such as maps or social media. We are
                not responsible for their content or privacy practices.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Governing law and changes</h2>
              <p>
                These terms are governed by the laws of South Africa. We may update them from
                time to time; the date above shows the latest version. How we handle personal
                information is described in our{' '}
                <Link className="text-amber-600 hover:underline" href="/privacy-policy">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Contact</h2>
              <p>
                Questions about these terms:{' '}
                <a className="text-amber-600 hover:underline" href="mailto:aztrucksales@mweb.co.za">
                  aztrucksales@mweb.co.za
                </a>{' '}
                or{' '}
                <a className="text-amber-600 hover:underline" href="tel:+27119026071">
                  011 902 6071
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
