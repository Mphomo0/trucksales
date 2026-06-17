/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
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

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'https://www.a-ztrucksales.com',
  ),

  title: {
    default: 'A-Z Truck Sales | Used Rigid Trucks 1.5-35 Ton Gauteng',
    template: '%s | A-Z Truck Sales',
  },

  description:
    "Gauteng's trusted commercial truck dealer since 1999. Pre-owned rigid trucks 1.5-35 ton, workshop-serviced & COF-ready. 100+ in stock. Call +27 11 902 6071.",

  authors: [{ name: 'A-Z Truck Sales' }],
  creator: 'A-Z Truck Sales',
  publisher: 'A-Z Truck Sales',

  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://www.a-ztrucksales.com',
    siteName: 'A-Z Truck Sales',
    title: 'A-Z Truck Sales | Used Rigid Trucks 1.5-35 Ton Gauteng',
    description:
      "Gauteng's #1 pre-owned rigid truck dealer. 25+ years experience. 100+ trucks in stock. Restoration & spares. Visit us in Alberton or browse online.",
    images: [
      {
        url: 'https://www.a-ztrucksales.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'A-Z Truck Sales - Quality Used Rigid Trucks in Gauteng, South Africa',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'A-Z Truck Sales | Used Rigid Trucks 1.5-35 Ton | Gauteng',
    description:
      'Buy quality pre-owned rigid trucks in Alberton, Gauteng. 25+ years experience. 100+ trucks in stock. Restoration & spares available.',
    images: ['https://www.a-ztrucksales.com/og-image.webp'],
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
  other: {
    'msvalidate.01': '6F4E7F1FC1EFA944472DB933122CB39F',
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  '@id': 'https://www.a-ztrucksales.com/#org',
  name: 'A-Z Truck Sales',
  description:
    "Gauteng's trusted commercial vehicle specialist selling pre-owned rigid trucks from 1.5 to 35 ton. 25+ years experience in truck sales, restoration and spares.",
  url: 'https://www.a-ztrucksales.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://www.a-ztrucksales.com/images/logo.png',
    width: 400,
    height: 120,
  },
  image: 'https://www.a-ztrucksales.com/og-image.webp',
  priceRange: 'ZAR 150,000 - ZAR 1,200,000',
  currenciesAccepted: 'ZAR',
  paymentAccepted: ['Cash', 'Bank Transfer', 'Finance'],
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
  telephone: '+27119026071',
  email: 'aztrucksales@mweb.co.za',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+27119026071',
    contactType: 'sales',
    areaServed: 'Gauteng',
    availableLanguage: ['English', 'Afrikaans'],
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '9 Chrislou Crescent',
    addressLocality: 'Alberton North',
    addressRegion: 'Gauteng',
    postalCode: '1449',
    addressCountry: 'ZA',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -26.2694,
    longitude: 28.1221,
  },
  areaServed: 'Gauteng, South Africa',
  foundingDate: '1999-01-01',
  sameAs: [
    'https://web.facebook.com/p/A-Z-TRUCK-SALES-100057330584780/',
    'https://www.linkedin.com/company/a-z-truck-sales/?originalSubdomain=za',
    'https://www.youtube.com/@A-ZTRUCKSALES',
    'https://maps.google.com/?cid=4407112129060334219',
  ],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://www.a-ztrucksales.com/#website',
  name: 'A-Z Truck Sales',
  url: 'https://www.a-ztrucksales.com',
  publisher: { '@id': 'https://www.a-ztrucksales.com/#org' },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.a-ztrucksales.com/inventory?search={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-ZA">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider>
          <PostHogProvider>
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />

            <JsonLd data={localBusinessSchema} />
            <JsonLd data={websiteSchema} />

            <ClientLayout>{children}</ClientLayout>
          </PostHogProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
