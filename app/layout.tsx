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

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

import GeoHints from '@/components/global/GeoHints'

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'https://www.a-ztrucksales.com',
  ),

  title: {
    default: 'A-Z Truck Sales | Used Rigid Trucks Gauteng',
    template: '%s | A-Z Truck Sales',
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

            <ClientLayout>{children}</ClientLayout>
            <ToastContainer />
          </PostHogProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
