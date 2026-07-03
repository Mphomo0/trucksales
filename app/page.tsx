/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

export const revalidate = 86400

import AboutSection from '@/components/sections/home/AboutSection'
import CTA from '@/components/sections/home/CTA'
import FAQSection from '@/components/sections/home/FAQSection'
import Featured from '@/components/sections/home/Featured'
import Features from '@/components/sections/home/Features'
import FindTruckSection from '@/components/sections/home/FindTruckSection'
import Hero from '@/components/sections/home/Hero'
import DealerFaqBlock from '@/components/sections/shared/DealerFaqBlock'
import JsonLd from '@/components/global/JsonLd'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'Used Trucks in Alberton & Boksburg | A-Z Truck Sales' },
  description:
    'Browse quality used rigid trucks and truck spares from A-Z Truck Sales in Alberton and Boksburg. 25+ years serving Gauteng and South Africa.',
  alternates: {
    canonical: 'https://www.a-ztrucksales.com/',
  },
  openGraph: {
    title: 'Used Trucks in Alberton & Boksburg | A-Z Truck Sales',
    description:
      'Browse quality used rigid trucks and truck spares from A-Z Truck Sales in Alberton and Boksburg. 25+ years serving Gauteng and South Africa.',
    url: 'https://www.a-ztrucksales.com/',
    siteName: 'A-Z Truck Sales',
    images: [
      {
        url: 'https://www.a-ztrucksales.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'A-Z Truck Sales - Used Commercial Vehicles',
      },
    ],
    locale: 'en_ZA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: 'Used Trucks in Alberton & Boksburg | A-Z Truck Sales',
    description:
      'Browse quality used rigid trucks and truck spares from A-Z Truck Sales in Alberton and Boksburg. 25+ years serving Gauteng and South Africa.',
    images: ['https://www.a-ztrucksales.com/og-image.webp'],
  },
}

const localBusinessAlbertonSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://www.a-ztrucksales.com/#alberton',
  name: 'A-Z Truck Sales - Alberton',
  parentOrganization: { '@id': 'https://www.a-ztrucksales.com/#org' },
  image: 'https://www.a-ztrucksales.com/og-image.webp',
  url: 'https://www.a-ztrucksales.com/locations/alberton',
  hasMap: 'https://maps.google.com/?cid=4407112129060334219',
  telephone: '+27-11-902-6071',
  email: 'aztrucksales@mweb.co.za',
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
    latitude: '-26.2694',
    longitude: '28.1221',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '17:00',
    },
  ],
  priceRange: '$$',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.0',
    reviewCount: '245',
  },
}

const localBusinessBoksburgSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://www.a-ztrucksales.com/#boksburg',
  name: 'A-Z Truck Sales - Boksburg',
  parentOrganization: { '@id': 'https://www.a-ztrucksales.com/#org' },
  image: 'https://www.a-ztrucksales.com/og-image.webp',
  url: 'https://www.a-ztrucksales.com/locations/boksburg',
  hasMap: 'https://www.google.com/maps/search/?api=1&query=-26.1711,28.2414',
  telephone: '+27-83-234-5377',
  email: 'aztruckboks@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Corner Trichardts Road & Ravenswood Street, Ravenswood',
    addressLocality: 'Boksburg',
    addressRegion: 'Gauteng',
    postalCode: '1451',
    addressCountry: 'ZA',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '-26.1711',
    longitude: '28.2414',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '17:00',
    },
  ],
  priceRange: '$$',
}

export default function Home() {
  return (
    <>
      <h1 className="sr-only">Used Trucks for Sale in Gauteng</h1>
      <JsonLd data={localBusinessAlbertonSchema} />
      <JsonLd data={localBusinessBoksburgSchema} />

      <Hero />
      <FindTruckSection />
      <Features />
      <Featured />
      <AboutSection />
      <FAQSection />
      <DealerFaqBlock />
      <CTA />
    </>
  )
}
