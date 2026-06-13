/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

export const revalidate = 86400

import AboutSection from '@/components/sections/home/AboutSection'
import CTA from '@/components/sections/home/CTA'
import FAQSection from '@/components/sections/home/FAQSection'
import Featured from '@/components/sections/home/Featured'
import Features from '@/components/sections/home/Features'
import Hero from '@/components/sections/home/Hero'
import JsonLd from '@/components/global/JsonLd'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'Used Trucks for Sale in Gauteng | A-Z Truck Sales — Boksburg' },
  description: 'Browse used trucks for sale in Gauteng at A-Z Truck Sales. Isuzu, Hino, UD, Fuso & Toyota Dyna trucks and more in stock in Boksburg and Alberton.',
  alternates: {
    canonical: 'https://www.a-ztrucksales.com/',
  },
  openGraph: {
    title: 'Used Trucks for Sale in Gauteng | A-Z Truck Sales — Boksburg',
    description: 'Browse used trucks for sale in Gauteng at A-Z Truck Sales. Isuzu, Hino, UD, Fuso & Toyota Dyna trucks and more in stock in Boksburg and Alberton.',
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
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'A-Z Truck Sales',
  legalName: 'A-Z Truck Sales',
  url: 'https://www.a-ztrucksales.com',
  logo: 'https://www.a-ztrucksales.com/images/logo.png',
  description: 'Trusted used commercial vehicle dealer since 1999 in Gauteng, South Africa. Specializing in quality used rigid trucks from 1.5 to 35 tons.',
  telephone: '+27-11-902-6071',
  email: 'mi118@mweb.co.za',
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
  areaServed: [
    {
      '@type': 'State',
      name: 'Gauteng',
    },
    {
      '@type': 'Country',
      name: 'South Africa',
    },
  ],
  sameAs: [
    'https://web.facebook.com/p/A-Z-TRUCK-SALES-100057330584780/',
  ],
}

const autoDealerSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  name: 'A-Z Truck Sales',
  image: 'https://www.a-ztrucksales.com/og-image.webp',
  url: 'https://www.a-ztrucksales.com',
  telephone: '+27-11-902-6071',
  email: 'mi118@mweb.co.za',
  priceRange: '$$',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.0',
    reviewCount: '245',
    bestRating: '5',
    worstRating: '1',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '9 Chrislou Crescent',
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
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '08:00',
      closes: '13:00',
    },
  ],
  areaServed: {
    '@type': 'Country',
    name: 'South Africa',
  },
  department: [
    {
      '@type': 'AutoDealer',
      name: 'A-Z Truck Sales - Alberton',
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
      telephone: '+27-11-902-6071',
      email: 'mi118@mweb.co.za',
    },
    {
      '@type': 'AutoDealer',
      name: 'A-Z Truck Sales - Boksburg',
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
      telephone: '+27-83-234-5377',
      email: 'aztruckboks@gmail.com',
    },
  ],
  brand: [
    { '@type': 'Brand', name: 'Fuso' },
    { '@type': 'Brand', name: 'Hyundai' },
    { '@type': 'Brand', name: 'Volkswagen' },
    { '@type': 'Brand', name: 'Ford' },
    { '@type': 'Brand', name: 'Hino' },
    { '@type': 'Brand', name: 'Isuzu' },
    { '@type': 'Brand', name: 'MAN' },
    { '@type': 'Brand', name: 'Mercedes-Benz' },
    { '@type': 'Brand', name: 'Nissan' },
    { '@type': 'Brand', name: 'Tata' },
    { '@type': 'Brand', name: 'Toyota' },
    { '@type': 'Brand', name: 'UD Trucks' },
  ],
  description: 'A-Z Truck Sales employs qualified technicians experienced in restoring 100+ trucks annually.',
}

const localBusinessAlbertonSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://www.a-ztrucksales.com/#alberton',
  name: 'A-Z Truck Sales - Alberton',
  image: 'https://www.a-ztrucksales.com/og-image.webp',
  url: 'https://www.a-ztrucksales.com',
  telephone: '+27-11-902-6071',
  email: 'mi118@mweb.co.za',
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
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '08:00',
      closes: '13:00',
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
  image: 'https://www.a-ztrucksales.com/og-image.webp',
  url: 'https://www.a-ztrucksales.com',
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

const homeWebsiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'A-Z Truck Sales',
  url: 'https://www.a-ztrucksales.com',
  publisher: {
    '@type': 'Organization',
    name: 'A-Z Truck Sales',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.a-ztrucksales.com/images/logo.png',
    },
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.a-ztrucksales.com/inventory?search={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

export default function Home() {
  return (
    <>
      <h1 className="sr-only">Used Trucks for Sale | A-Z Truck Sales Gauteng</h1>
      <JsonLd data={organizationSchema} />
      <JsonLd data={homeWebsiteSchema} />
      <JsonLd data={autoDealerSchema} />
      <JsonLd data={localBusinessAlbertonSchema} />
      <JsonLd data={localBusinessBoksburgSchema} />

      <Hero />
      <Features />
      <Featured />
      <AboutSection />
      <FAQSection />
      <CTA />
    </>
  )
}
