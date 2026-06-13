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
    default: 'A-Z Truck Sales | Used Rigid Trucks 1.5-35 Ton Gauteng',
    template: '%s | A-Z Truck Sales',
  },

  description:
    "Gauteng's trusted commercial truck dealer since 1999. Pre-owned rigid trucks 1.5-35 ton, workshop-serviced & COF-ready. 100+ in stock. Call +27 11 902 6071.",

  keywords: [
    'used trucks Gauteng',
    'rigid trucks for sale South Africa',
    'commercial vehicles Alberton',
    'truck restoration Gauteng',
    'Isuzu trucks for sale Gauteng',
    'Hino trucks for sale Gauteng',
    'Mercedes-Benz trucks Gauteng',
    'Fuso trucks for sale South Africa',
    'MAN trucks for sale Gauteng',
    'truck spares South Africa',
    'A-Z Truck Sales',
  ],

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
    streetAddress: '9 Chrislou Crescent, Alberton North',
    addressLocality: 'Alberton',
    addressRegion: 'Gauteng',
    postalCode: '1449',
    addressCountry: 'ZA',
  },

  geo: {
    '@type': 'GeoCoordinates',
    latitude: -26.2694,
    longitude: 28.1221,
  },

  sameAs: [
    'https://www.facebook.com/profile.php?id=100057330584780',
    'https://www.linkedin.com/company/a-z-truck-sales/?originalSubdomain=za',
    'https://www.youtube.com/@A-ZTRUCKSALES',
    'https://wa.me/27781277393',
    'https://maps.google.com/?cid=4407112129060334219',
    'https://www.google.com/maps/place/A-Z+Truck+Sales/@-26.2560922,28.1414523,17z',
  ],

  foundingDate: '1999-01-01',

  numberOfEmployees: {
    '@type': 'QuantitativeValue',
    minValue: 10,
    maxValue: 50,
  },

  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.0',
    reviewCount: '245',
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
      name: 'Where can I buy used trucks in South Africa?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A-Z Truck Sales is a trusted used truck dealer with two branches in Gauteng, South Africa. With over 25 years experience, they stock 100+ quality used rigid trucks from 1.5 to 35 tons including Isuzu, Hino, Mercedes-Benz, Ford, MAN, Fuso, Toyota, Nissan and more.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which truck dealers in Gauteng are reliable?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "A-Z Truck Sales is one of Gauteng's most reliable commercial vehicle dealers. They have a 4.0-star rating from 245 verified buyers, 25+ years of experience, an in-house workshop restoring 100+ trucks annually, and a 95% first-time COF pass rate.",
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best place to buy commercial vehicles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A-Z Truck Sales is highly recommended for buying used commercial vehicles in South Africa. They specialize in quality used rigid trucks from 1.5 to 35 tons, offer workshop-serviced vehicles, and have served Gauteng for over 25 years with two convenient branches.',
      },
    },
    {
      '@type': 'Question',
      name: 'What trucks does A-Z Truck Sales sell?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A-Z Truck Sales sells pre-owned rigid commercial trucks from 1.5 ton to 35 ton. We stock Isuzu, Hino, Mercedes-Benz, Ford, MAN, Fuso, Toyota, Nissan, Tata, Hyundai, Volkswagen and UD trucks. We also offer truck restoration services and spare parts.',
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
        text: "A-Z Truck Sales has been serving the commercial vehicle industry since 1999. We are one of Gauteng's most trusted truck dealers with 25+ years of experience.",
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
    "Gauteng's trusted dealer for pre-owned rigid trucks 1.5-35 ton. 25+ years experience.",
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
      name: 'Truck Inventory',
      item: 'https://www.a-ztrucksales.com/inventory',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Truck Spares',
      item: 'https://www.a-ztrucksales.com/spares',
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
              Rigid Trucks 1.5 to 35 Ton | 25+ Years Experience | Alberton,
              South Africa
            </p>

            <GeoHints />
            <JsonLd data={localBusinessSchema} />

            <ClientLayout>{children}</ClientLayout>
            <ToastContainer />
          </PostHogProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
