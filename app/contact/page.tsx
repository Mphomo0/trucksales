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
  title: 'Contact Us | A-Z Truck Sales Gauteng',
  description: 'Contact A-Z Truck Sales in Alberton & Boksburg, Gauteng. Call 011 902 6071 for quality used commercial vehicles and trucks.',
  alternates: {
    canonical: 'https://www.a-ztrucksales.com/contact',
  },
}

const contactFaqs = [
  {
    question: 'Where is A-Z Truck Sales located?',
    answer: 'We have two branches: Alberton at 9 Chrislou Crescent (011 902 6071) and Boksburg at Cnr Trichardts & Ravenswood (083 234 5377). Mon-Fri 8AM-5PM.',
  },
  {
    question: 'What types of trucks do you sell?',
    answer: 'We specialize in quality used rigid trucks from 1.5 to 16 tons, including Isuzu, Hino, Mercedes-Benz, and Ford.',
  },
  {
    question: 'Do you offer truck restoration services?',
    answer: 'Yes. Our in-house workshop restores 100+ trucks annually with a 95% first-time COF pass rate.',
  },
  {
    question: 'Can I sell my truck to A-Z Truck Sales?',
    answer: 'Yes, we buy used commercial vehicles. Fill in the Sell Your Truck form with your vehicle details and we will get back to you with an offer.',
  },
  {
    question: 'What makes A-Z Truck Sales different from other dealers?',
    answer: '25+ years of experience, in-house workshop restoration, 100+ trucks always in stock, and a 4.1-star rating from verified buyers.',
  },
]

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'MotorVehicleBusiness',
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-neutral-600">Everything you need to know about our vehicles and services.</p>
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
