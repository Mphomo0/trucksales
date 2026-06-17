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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export const metadata: Metadata = {
  title: 'Contact Us | Alberton & Boksburg Gauteng',
  description: 'Contact A-Z Truck Sales in Alberton (011 902 6071) or Boksburg (083 234 5377), Gauteng. Mon-Fri 8AM-5PM, Sat 8AM-1PM. Browse 100+ used trucks online.',
  alternates: {
    canonical: 'https://www.a-ztrucksales.com/contact',
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://www.a-ztrucksales.com/contact',
    siteName: 'A-Z Truck Sales',
    title: 'Contact A-Z Truck Sales | Alberton & Boksburg, Gauteng',
    description: 'Contact A-Z Truck Sales in Alberton (011 902 6071) or Boksburg (083 234 5377), Gauteng. Mon-Fri 8AM-5PM, Sat 8AM-1PM.',
    images: [{ url: 'https://www.a-ztrucksales.com/og-image.webp', width: 1200, height: 630, alt: 'Contact A-Z Truck Sales' }],
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: 'Contact A-Z Truck Sales | Alberton & Boksburg, Gauteng',
    description: 'Contact A-Z Truck Sales in Alberton (011 902 6071) or Boksburg (083 234 5377), Gauteng. Mon-Fri 8AM-5PM, Sat 8AM-1PM.',
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
      <h1 className="sr-only">Contact Us | A-Z Truck Sales Alberton</h1>
      <div className="sr-only">
        <span>Author: A-Z Truck Sales</span>
        <span>Last Updated: 2026-04-27</span>
        {/* application/ld+json */}
      </div>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={contactFaqSchema} />
      
      <div className="container mx-auto px-4 text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Have a question or need a quote? Reach out to our team of experts.
        </p>
      </div>

      <AddressSection />
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
