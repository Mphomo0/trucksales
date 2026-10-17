import { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/global/JsonLd'

const title = 'Privacy Policy | A-Z Truck Sales'
const description =
  'How A-Z Truck Sales collects, uses and protects personal information from enquiries, the website and analytics, in line with POPIA.'

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: 'https://www.a-ztrucksales.com/privacy-policy' },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://www.a-ztrucksales.com/privacy-policy',
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
      name: 'Privacy Policy',
      item: 'https://www.a-ztrucksales.com/privacy-policy',
    },
  ],
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-10">Last updated: 17 October 2026</p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <p>
              A-Z Truck Sales (&quot;we&quot;, &quot;us&quot;) respects your privacy. This
              policy explains what personal information we collect through
              www.a-ztrucksales.com, why we collect it and what your rights are under the
              Protection of Personal Information Act, 2013 (POPIA).
            </p>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Who is responsible</h2>
              <p>
                A-Z Truck Sales, 9 Chrislou Crescent, Alberton North, Gauteng, 1449, and
                our Boksburg branch at the corner of Trichardts Road and Ravenswood Street.
                Questions about this policy can be sent to{' '}
                <a className="text-amber-600 hover:underline" href="mailto:aztrucksales@mweb.co.za">
                  aztrucksales@mweb.co.za
                </a>{' '}
                or by phone on{' '}
                <a className="text-amber-600 hover:underline" href="tel:+27119026071">
                  011 902 6071
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Information we collect</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Information you give us:</strong> your name, email address, phone
                  number and message when you use an enquiry form, the contact form, the
                  sell-your-truck form or the website chat, plus any details about the vehicle
                  you are interested in or want to sell.
                </li>
                <li>
                  <strong>Information collected automatically:</strong> pages viewed, device
                  and browser type, approximate location, referring website or campaign, and
                  how you interact with the site. This is collected through cookies and
                  similar technologies.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">How we use it</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>To reply to your enquiry and arrange viewings, quotes or trade-ins.</li>
                <li>To understand which pages and channels bring us customers, and to improve the website.</li>
                <li>To keep the website secure and prevent spam and abuse.</li>
                <li>To meet legal obligations.</li>
              </ul>
              <p className="mt-3">
                We do not sell your personal information. We contact you about a specific
                enquiry; we do not send marketing messages unless you have asked for them.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Analytics and cookies</h2>
              <p>
                We use Google Analytics and PostHog to measure website use. They may record
                page views, clicks and, where enabled, anonymised session recordings, and
                they set cookies or use local storage in your browser. We also store the
                source of your first visit (for example a Google search or campaign link) in
                your browser so we can tell which channel an enquiry came from. You can block
                or delete cookies in your browser settings; the website will still work.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Who we share it with</h2>
              <p>
                We share information only with service providers who help us run the
                website and respond to you, such as our website host, email delivery,
                spam protection (Cloudflare Turnstile), image hosting and the analytics
                providers above. They may process information outside South Africa. We
                share information with authorities where the law requires it.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">How long we keep it</h2>
              <p>
                We keep enquiry details for as long as needed to deal with your enquiry and
                for a reasonable period afterwards, unless the law requires us to keep them
                longer or you ask us to delete them. Analytics data is kept according to
                the settings of the analytics providers.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Your rights</h2>
              <p>
                Under POPIA you may ask to see the personal information we hold about you,
                ask us to correct or delete it, object to our processing of it, and
                withdraw consent where we rely on it. Email us at the address above and we
                will respond within a reasonable time. If you are unhappy with how we handle
                your information, you can complain to the Information Regulator at{' '}
                <a
                  className="text-amber-600 hover:underline"
                  href="https://inforegulator.org.za"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  inforegulator.org.za
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Changes</h2>
              <p>
                We may update this policy from time to time. The date at the top shows when
                it last changed. See also our{' '}
                <Link className="text-amber-600 hover:underline" href="/terms">
                  Terms of Use
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
