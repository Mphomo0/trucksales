/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */

import AddressSection from '@/components/sections/contactSection/AddressSection'
import ContactForm from '@/components/sections/contactSection/ContactForm'
import FAQSection from '@/components/sections/home/FAQSection'
import { Metadata } from 'next'
import JsonLd from '@/components/global/JsonLd'

export const metadata: Metadata = {
  title: 'Contact Us | Visit A-Z Truck Sales in Alberton',
  description: 'Contact A-Z Truck Sales in Alberton. Visit our workshop, call us, or send an enquiry online for your truck needs.',
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoPartsStore',
  name: 'A-Z Truck Sales',
  image: 'https://www.a-ztrucksales.com/og-image.jpg',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '9 Chrislou Cres',
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
  telephone: '+27-11-902-6071',
  priceRange: '$$',
  areaServed: {
    '@type': 'Country',
    name: 'South Africa',
  },
  location: [
    {
      '@type': 'Place',
      name: 'A-Z Truck Sales - Alberton',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '9 Chrislou Cres',
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
    },
    {
      '@type': 'Place',
      name: 'A-Z Truck Sales - Boksburg',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Cnr Trichardts and Ravenswood St',
        addressLocality: 'Ravenswood',
        addressRegion: 'Gauteng',
        postalCode: '1451',
        addressCountry: 'ZA',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '-26.1711',
        longitude: '28.2414',
      },
    },
  ],
}

/* application/ld+json */ export default function Contact() {
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
        name: 'Contact',
        item: 'https://www.a-ztrucksales.com/contact',
      },
    ],
  }

  return (
    <div className="bg-gray-50 py-12">
      <h1 className="sr-only">Contact Us | Visit A-Z Truck Sales in Alberton</h1>
      <div className="sr-only">
        <span>Author: A-Z Truck Sales</span>
        <span>Last Updated: 2026-04-27</span>
        {/* application/ld+json */}
      </div>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={localBusinessSchema} />
      
      <div className="container mx-auto px-4 text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Have a question or need a quote? Reach out to our team of experts.
        </p>
      </div>

      <AddressSection />
      <ContactForm />
      <FAQSection />
    </div>
  )
}
