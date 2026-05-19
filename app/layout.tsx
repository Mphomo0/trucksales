/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
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
import GeoHints from '@/components/global/GeoHints'

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'https://www.a-ztrucksales.com',
  ),

  title: {
    default:
      'A-Z Truck Sales | Used Rigid Trucks 1.5-18 Ton | Alberton, Gauteng',
    template: '%s | A-Z Truck Sales | 25+ Years Trusted Truck Dealer',
  },

  description:
    "A-Z Truck Sales: Gauteng's trusted commercial vehicle dealer since 1999. Buy quality pre-owned rigid trucks (1.5 to 18 ton) in Alberton. Expert restoration, workshop services & spares. 100+ trucks in stock. Call +27 11 902 6071.",

  keywords: [
    'used trucks Gauteng',
    'rigid trucks for sale South Africa',
    'commercial vehicles Alberton',
    'truck restoration Gauteng',
    '18 ton truck for sale',
    '7.5 ton truck for sale',
    '3.5 ton truck for sale',
    '1.5 ton truck for sale',
    'truck spares South Africa',
    'A-Z Truck Sales reviews',
  ],

  authors: [{ name: 'A-Z Truck Sales' }],
  creator: 'A-Z Truck Sales',
  publisher: 'A-Z Truck Sales',

  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://www.a-ztrucksales.com',
    siteName: 'A-Z Truck Sales',
    title: 'A-Z Truck Sales | Used Rigid Trucks 1.5-18 Ton | Alberton, Gauteng',
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
    title: 'A-Z Truck Sales | Used Rigid Trucks 1.5-18 Ton | Gauteng',
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
  name: 'A-Z Truck Sales',
  description:
    "Gauteng's trusted commercial vehicle specialist selling pre-owned rigid trucks from 1.5 to 18 ton. 25+ years experience in truck sales, restoration and spares.",
  url: 'https://www.a-ztrucksales.com',
  logo: 'https://www.a-ztrucksales.com/images/logo.png',
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
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Sunday',
      opens: '00:00',
      closes: '00:00',
    },
  ],

  telephone: '+27-11-902-6071',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+27-11-902-6071',
    contactType: 'sales',
    areaServed: 'Gauteng',
    availableLanguage: ['English', 'Afrikaans'],
  },

  address: {
    '@type': 'PostalAddress',
    streetAddress: '159 Second Avenue, Alberton North',
    addressLocality: 'Alberton',
    addressRegion: 'Gauteng',
    postalCode: '1449',
    addressCountry: 'ZA',
  },

  geo: {
    '@type': 'GeoCoordinates',
    latitude: -26.2560922,
    longitude: 28.1414523,
  },

  sameAs: [
    'https://www.facebook.com/profile.php?id=100057330584780',
    'https://www.linkedin.com/company/a-z-truck-sales/?originalSubdomain=za',
    'https://www.youtube.com/@A-ZTRUCKSALES',
    'https://wa.me/27781277393',
    'https://maps.google.com/?cid=4407112129060334219',
    'https://www.google.com/maps/place/A-Z+Truck+Sales/@-26.2560922,28.1414523,17z',
  ],

  foundingDate: '2000',

  employeeCount: '10-50',

  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.0',
    reviewCount: '341',
    bestRating: '5',
    worstRating: '1',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What trucks does A-Z Truck Sales sell?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A-Z Truck Sales sells pre-owned rigid commercial trucks from 1.5 ton to 18 ton. We specialize in DAF, MAN, Hino, Isuzu, and UD trucks. We also offer truck restoration services and spare parts.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is A-Z Truck Sales located?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A-Z Truck Sales is located at 9 Chrislou Cres, Alberton, Gauteng, 1449, South Africa. We are open Monday to Friday 8AM-5PM and Saturday 8AM-1PM.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many years has A-Z Truck Sales been in business?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "A-Z Truck Sales has been serving the commercial vehicle industry for over 25 years since 2000. We are one of Gauteng's most trusted truck dealers.",
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer truck restoration services?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We have a complete in-house workshop where we service, restore, and refurbish rigid trucks. We also stock truck spares for all major brands.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can I contact A-Z Truck Sales?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can call us at +27 11 902 6071, WhatsApp us at +27781277393, or visit us at 9 Chrislou Cres, Alberton, Gauteng. You can also browse our 100+ trucks online.',
      },
    },
  ],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'A-Z Truck Sales',
  url: 'https://www.a-ztrucksales.com',
  description:
    "Gauteng's trusted dealer for pre-owned rigid trucks 1.5-18 ton. 25+ years experience.",
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate:
        'https://www.a-ztrucksales.com/inventory?search={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
  inLanguage: ['en-ZA', 'af-ZA'],
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
      name: 'Inventory',
      item: 'https://www.a-ztrucksales.com/inventory',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'About Us',
      item: 'https://www.a-ztrucksales.com/about',
    },
    {
      '@type': 'ListItem',
      position: 4,
      name: 'Contact',
      item: 'https://www.a-ztrucksales.com/contact',
    },
  ],
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

            <p className="sr-only">
              A-Z Truck Sales - Gauteng&apos;s Trusted Dealer for Pre-Owned
              Rigid Trucks 1.5 to 18 Ton | 25+ Years Experience | Alberton,
              South Africa
            </p>

            <GeoHints />
            <JsonLd data={localBusinessSchema} />
            <JsonLd data={faqSchema} />
            <JsonLd data={websiteSchema} />
            <JsonLd data={breadcrumbSchema} />

            <ClientLayout>{children}</ClientLayout>
            <ToastContainer />
          </PostHogProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
