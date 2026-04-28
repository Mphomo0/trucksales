/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import JsonLd from '@/components/global/JsonLd'

const faqs = [
  {
    question: 'Where is A-Z Truck Sales located?',
    answer: 'We are located at 159 Second Avenue, Alberton North, Gauteng, South Africa. We serve clients across South Africa.',
  },
  {
    question: 'What types of trucks do you sell?',
    answer: 'We specialize in quality used rigid trucks ranging from 1.5 to 16 tons. Our inventory includes various makes and models suitable for different commercial needs.',
  },
  {
    question: 'Do you offer truck restoration services?',
    answer: 'Yes, we have 25+ years of experience in truck restoration. We ensure every vehicle in our inventory is restored to high standards in our full-service workshop.',
  },
  {
    question: 'Can I sell my truck to A-Z Truck Sales?',
    answer: 'Yes, we buy used commercial vehicles. You can use our "Sell Your Truck" form on the website to provide details, and we will get back to you with an offer.',
  },
  {
    question: 'What makes A-Z Truck Sales different from other dealers?',
    answer: 'Our combination of 25+ years of industry experience, specialized focus on rigid trucks, and in-house workshop for restorations and servicing sets us apart as experts who prioritize quality and reliability.',
  },
]

/* <h1>A-Z Truck Sales Components</h1> */ export default function FAQSection() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <section className="py-20 bg-neutral-50">
      <JsonLd data={faqSchema} />
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-neutral-600">Everything you need to know about our vehicles and services.</p>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
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
  )
}
