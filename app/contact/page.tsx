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

const title = 'Contact A-Z Truck Sales | Call 011 902 6071'
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
    answer: 'Isuzu is the make we stock most. Browse the used Isuzu trucks currently in stock, or call us to confirm mileage, body type, condition and which branch a truck is at before you visit.',
  },
  {
    question: 'Does A-Z Truck Sales sell Hino trucks?',
    answer: 'Yes, we stock used Hino trucks. Each listing shows the body type, tonnage, mileage, condition, branch and price, and you can browse them on our Hino page.',
  },
  {
    question: 'Can I buy Fuso trucks from outside Gauteng?',
    answer: 'Yes. Buyers across South Africa can enquire about Fuso and our other used trucks. We confirm viewing, payment, paperwork and transport details with you before any sale.',
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

// Business and branch entities live in app/layout.tsx (#org) and the /locations pages.

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
      <h1 className="sr-only">Contact A-Z Truck Sales in Alberton & Boksburg</h1>
      <div className="sr-only">
        <span>Author: A-Z Truck Sales</span>
        <span>Last Updated: 2026-06-21</span>
        {/* application/ld+json */}
      </div>
      <JsonLd data={breadcrumbSchema} />
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
