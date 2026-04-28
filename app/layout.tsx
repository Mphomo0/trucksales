/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { SessionProvider } from 'next-auth/react'
// import GlobalWhatsAppButton from '@/components/global/GlobalWhatsAppButton'
import ClientLayout from '@/components/global/ClientLayout'
import { PostHogProvider } from './providers'
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from 'next/script'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

import JsonLd from '@/components/global/JsonLd'
import GeoHints from '@/components/global/GeoHints'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://www.a-ztrucksales.com'),
  title: {
    default: 'A-Z Truck Sales | Quality Used Commercial Vehicles in Gauteng',
    template: '%s | A-Z Truck Sales',
  },
  description:
    'A-Z Truck Sales are your commercial vehicle specialists in Alberton North, Gauteng. 25+ years experience in selling and restoring quality used rigid trucks (1.5-16 ton).',
  keywords: ['truck sales', 'used trucks gauteng', 'commercial vehicles south africa', 'rigid trucks', 'truck restoration'],
  authors: [{ name: 'A-Z Truck Sales' }],
  creator: 'A-Z Truck Sales',
  publisher: 'A-Z Truck Sales',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://www.a-ztrucksales.com',
    siteName: 'A-Z Truck Sales',
    title: 'A-Z Truck Sales | Quality Used Commercial Vehicles',
    description: 'Specialists in used commercial vehicles, rigid trucks, and truck restoration in Gauteng.',
    images: [
      {
        url: '/og-image.jpg', // Make sure this exists or I'll need to generate/suggest it
        width: 1200,
        height: 630,
        alt: 'A-Z Truck Sales',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A-Z Truck Sales | Quality Used Commercial Vehicles',
    description: 'Specialists in used commercial vehicles, rigid trucks, and truck restoration in Gauteng.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'NSttRQu748qaKY6XHYe8AVd8vlsBpvXA_q8EcB7BI_Q',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'A-Z Truck Sales',
  url: 'https://www.a-ztrucksales.com',
  logo: 'https://www.a-ztrucksales.com/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+27-11-902-6071',
    contactType: 'sales',
    areaServed: 'ZA',
    availableLanguage: ['English', 'Afrikaans'],
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '159 Second Avenue',
    addressLocality: 'Alberton North',
    addressRegion: 'Gauteng',
    postalCode: '1449',
    addressCountry: 'ZA',
  },
  sameAs: [
    'https://www.facebook.com/aztrucksales',
    // Add other social links if available
  ],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'A-Z Truck Sales',
  url: 'https://www.a-ztrucksales.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://www.a-ztrucksales.com/inventory?search={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <PostHogProvider>
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
            <Script src="https://analytics.ahrefs.com/analytics.js" data-key="azIimokFbaOWQUGS+ZhBzA" strategy="afterInteractive" />
            <h1 className="sr-only">A-Z Truck Sales | Premium Commercial Vehicles</h1>
            <GeoHints />
            <JsonLd data={organizationSchema} />
            <JsonLd data={websiteSchema} />
            <ClientLayout>
              {children}
            </ClientLayout>
            <ToastContainer />
            {/* <GlobalWhatsAppButton /> */}
          </PostHogProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
