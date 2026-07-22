/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */


import ContactForm from '@/components/sections/contactSection/ContactForm'
import FAQSection from '@/components/sections/home/FAQSection'
import { Metadata } from 'next'
import JsonLd from '@/components/global/JsonLd'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const title = 'Contact A-Z Truck Sales | Call 011 902 6071 (Alberton & Boksburg)'
const description = 'Call 011 902 6071 or visit A-Z Truck Sales in Alberton or Boksburg. Open Mon-Fri 8am-5pm, Sat 8am-1pm, for used trucks, spares, trade-ins and enquiries.'

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: 'https://www.a-ztrucksales.com/contact',
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://www.a-ztrucksales.com/contact',
    siteName: 'A-Z Truck Sales',
    title,
    description,
    images: [{ url: 'https://www.a-ztrucksales.com/og-image.webp', width: 1200, height: 630, alt: 'Contact A-Z Truck Sales' }],
  },
  twitter: {
    card: 'summary_large_image' as const,
    title,
    description,
    images: ['https://www.a-ztrucksales.com/og-image.webp'],
  },
}

const contactFaqs = [
  {
    question: 'Where can I find Isuzu trucks for sale in Gauteng?',
    answer: 'You can enquire with A-Z Truck Sales for used Isuzu rigid trucks in Gauteng. Always confirm current stock, mileage, body type, condition and branch location before visiting.',
  },
  {
    question: 'Does A-Z Truck Sales sell Hino trucks?',
    answer: 'A-Z Truck Sales should list current Hino stock on its inventory page and explain the body type, tonnage, mileage, condition, branch and price for each truck.',
  },
  {
    question: 'Can I buy Fuso trucks from outside Gauteng?',
    answer: 'Yes, buyers across South Africa can enquire about Fuso and other used commercial vehicles, but viewing, payment, paperwork and transport details should be confirmed first.',
  },
  {
    question: 'What documents should I ask for when buying a used truck?',
    answer: 'Ask about registration documents, proof of ownership, roadworthy or COF status, service information where available, and any paperwork needed for licensing.',
  },
  {
    question: 'Why is spares availability important when buying a used truck?',
    answer: 'Spares availability matters because a cheaper truck can become expensive if it is difficult to repair, maintain or return to work quickly.',
  },
]

const localBusinessSchemaJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  '@id': 'https://www.a-ztrucksales.com/#business',
  name: 'A-Z Truck Sales',
  url: 'https://www.a-ztrucksales.com/',
  logo: 'https://www.a-ztrucksales.com/logo.png',
  description: 'A-Z Truck Sales is a used commercial vehicle dealer in Gauteng with branches in Alberton and Boksburg, supplying used rigid trucks, commercial vehicles and truck spares.',
  telephone: '+27 11 902 6071',
  email: 'aztrucksales@mweb.co.za',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '9 Chrislou Crescent',
    addressLocality: 'Alberton North',
    addressRegion: 'Gauteng',
    postalCode: '1449',
    addressCountry: 'ZA',
  },
  areaServed: ['Alberton', 'Boksburg', 'Johannesburg', 'East Rand', 'Gauteng', 'South Africa'],
  openingHours: 'Mo-Fr 08:00-17:00',
  sameAs: [
    'https://web.facebook.com/p/A-Z-TRUCK-SALES-100057330584780/',
    'https://www.linkedin.com/company/a-z-truck-sales/?originalSubdomain=za',
  ],
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  '@id': 'https://www.a-ztrucksales.com/#org',
  name: 'A-Z Truck Sales',
  image: 'https://www.a-ztrucksales.com/og-image.webp',
  telephone: '+27119026071',
  email: 'aztrucksales@mweb.co.za',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '9 Chrislou Crescent',
    addressLocality: 'Alberton North',
    addressRegion: 'Gauteng',
    postalCode: '1449',
    addressCountry: 'ZA',
  },
  geo: { '@type': 'GeoCoordinates', latitude: -26.2694, longitude: 28.1221 },
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
  areaServed: { '@type': 'Country', name: 'South Africa' },
  department: [
    {
      '@type': 'AutoDealer',
      name: 'A-Z Truck Sales — Alberton',
      telephone: '+27119026071',
      email: 'aztrucksales@mweb.co.za',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '9 Chrislou Crescent',
        addressLocality: 'Alberton North',
        addressRegion: 'Gauteng',
        postalCode: '1449',
        addressCountry: 'ZA',
      },
    },
    {
      '@type': 'AutoDealer',
      name: 'A-Z Truck Sales — Boksburg',
      telephone: '+27832345377',
      email: 'aztruckboks@gmail.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Corner Trichardts Road & Ravenswood Street',
        addressLocality: 'Ravenswood',
        addressRegion: 'Gauteng',
        postalCode: '1451',
        addressCountry: 'ZA',
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

  const contactFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: contactFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <div className="bg-gray-50 py-12">
      <h1 className="sr-only">Contact A-Z Truck Sales | Alberton & Boksburg, Gauteng</h1>
      <div className="sr-only">
        <span>Author: A-Z Truck Sales</span>
        <span>Last Updated: 2026-06-21</span>
        {/* application/ld+json */}
      </div>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={localBusinessSchemaJsonLd} />
      <JsonLd data={contactFaqSchema} />
      
      <div className="container mx-auto px-4 text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Contact A-Z Truck Sales</h2>
        <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
          Contact A-Z Truck Sales for used truck sales, truck spares, trade-ins, stock availability and viewing arrangements. Our team assists buyers from Alberton, Boksburg, Johannesburg, the East Rand, Gauteng and across South Africa.
        </p>
      </div>

      <section className="py-8 bg-white border-t border-b border-neutral-200 mb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Alberton Branch</h3>
              <div className="text-gray-600 space-y-2">
                <p>9 Chrislou Crescent, Alberton North, Gauteng, 1449</p>
                <p>Phone: <a href="tel:0119026071" className="text-amber-600 hover:underline">011 902 6071</a></p>
                <p>Email: <a href="mailto:aztrucksales@mweb.co.za" className="text-amber-600 hover:underline">aztrucksales@mweb.co.za</a></p>
                <p>Hours: Monday to Friday, 08:00–17:00</p>
                <a
                  href="https://www.google.com/maps/place/9+Chrislou+Crescent,+Alberton+North,+Gauteng,+1449"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition text-sm font-semibold"
                >
                  View Map →
                </a>
              </div>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Boksburg Branch</h3>
              <div className="text-gray-600 space-y-2">
                <p>Corner Trichardts Road &amp; Ravenswood Street, Ravenswood, Boksburg, Gauteng, 1451</p>
                <p>Phone: <a href="tel:0832345377" className="text-amber-600 hover:underline">083 234 5377</a></p>
                <p>Email: <a href="mailto:aztruckboks@gmail.com" className="text-amber-600 hover:underline">aztruckboks@gmail.com</a></p>
                <p>Hours: Monday to Friday, 08:00–17:00</p>
                <a
                  href="https://www.google.com/maps/place/Corner+Trichardts+Road+%26+Ravenswood+Street,+Ravenswood,+Boksburg,+Gauteng,+1451"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition text-sm font-semibold"
                >
                  View Map →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactForm />
      
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently asked questions about used trucks in Gauteng</h2>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              {contactFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-white px-6 rounded-lg mb-4 border border-neutral-200">
                  <AccordionTrigger className="text-left font-semibold py-4 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-600 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  )
}
