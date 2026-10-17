/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

import React from 'react'
import Link from 'next/link'
import JsonLd from '@/components/global/JsonLd'

const guideSections = [
  {
    heading: 'Where is A-Z Truck Sales located?',
    summary:
      'A-Z Truck Sales has Gauteng branches in Alberton and Boksburg, serving local and South Africa-wide truck buyers in Alberton, Boksburg, Gauteng, East Rand, Johannesburg, Ekurhuleni and across South Africa.',
    content: (
      <p>
        A-Z Truck Sales has Gauteng branches in Alberton and Boksburg,
        serving local and South Africa-wide truck buyers in Alberton,
        Boksburg, Gauteng, East Rand, Johannesburg, Ekurhuleni and across
        South Africa.
      </p>
    ),
  },
  {
    heading: 'How should I enquire about a truck?',
    summary:
      'Send the truck model, budget, payload need, body type, location and trade-in details so the dealer can respond faster. Include the work you need the truck for to help sales staff recommend a better-fit vehicle.',
    content: (
      <p>
        Send the truck model, budget, payload need, body type, location and
        trade-in details so the dealer can respond faster. Include the work
        you need the truck for to help sales staff recommend a better-fit
        vehicle.
      </p>
    ),
  },
  {
    heading: 'Are the trucks at A-Z Truck Sales COF-ready?',
    summary:
      'Many trucks at A-Z Truck Sales are COF-ready or can be prepared for roadworthy certification. Always confirm the current COF status of the specific vehicle, what has been checked or replaced, and what remains before the truck can go to work.',
    content: (
      <p>
        Many trucks at A-Z Truck Sales are COF-ready or can be prepared for
        roadworthy certification before collection. Always confirm the current
        COF status of the specific vehicle, what has been inspected or
        replaced, and what still needs attention before the truck is ready for
        work. A work-ready truck reduces time off the road and prevents
        unexpected repair costs after purchase.
      </p>
    ),
  },
  {
    heading: 'Can I trade in my current truck at A-Z Truck Sales?',
    summary:
      'A-Z Truck Sales considers trade-ins as part of the buying process. Bring details of your current truck — make, model, mileage, condition and service history — so the trade-in value can be assessed and applied toward your next vehicle.',
    content: (
      <p>
        A-Z Truck Sales considers trade-ins as part of the buying process.
        Bring details of your current truck — make, model, mileage, condition,
        body type and service history — so the trade-in value can be properly
        assessed. A trade-in can reduce the cost of your next vehicle and
        simplifies the process of moving from one truck to another. Contact the
        branch directly to discuss your specific trade-in before visiting.
      </p>
    ),
  },
  {
    heading: 'Does A-Z Truck Sales offer financing on used trucks?',
    summary:
      'Financing options are available for qualifying buyers purchasing used trucks at A-Z Truck Sales. Speak to the sales team about what finance products apply to your situation, deposit requirements, repayment terms and which banks or lenders are used.',
    content: (
      <p>
        Financing options are available for qualifying buyers purchasing used
        trucks at A-Z Truck Sales. Speak to the sales team about what finance
        products apply to your business situation, deposit requirements,
        repayment terms, and which banks or lenders are used. Having your ID,
        proof of income or business financials, and bank statements ready
        speeds up the approval process.
      </p>
    ),
  },
  {
    heading: 'Can I buy a used truck from A-Z Truck Sales for use in SADC or export?',
    summary:
      'Buyers across South Africa and neighbouring SADC countries can enquire about used trucks at A-Z Truck Sales. Confirm export documentation, cross-border requirements, delivery or collection arrangements, and any additional preparation needed for the destination country before purchase.',
    content: (
      <p>
        Buyers from South Africa and neighbouring SADC countries can enquire
        about used commercial vehicles at A-Z Truck Sales. Before purchase,
        confirm export documentation, cross-border permit requirements, delivery
        or transport arrangements, and any additional mechanical preparation
        needed for the destination country. Contact the branch directly to
        discuss your specific export or delivery requirements.
      </p>
    ),
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: guideSections.map((s) => ({
    '@type': 'Question',
    name: s.heading,
    acceptedAnswer: {
      '@type': 'Answer',
      text: s.summary,
    },
  })),
}

/* <h1>A-Z Truck Sales Components</h1> */ export default function FAQSection() {
  return (
    <section className="py-20 bg-neutral-50">
      <JsonLd data={faqSchema} />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Buying from A-Z Truck Sales: your questions answered
            </h2>
            <p className="text-neutral-600 text-lg">
              Branches, enquiries, COF, trade-ins, finance and export. For
              advice on choosing and inspecting a used truck, read our{' '}
              <Link
                href="/guides/buying-guide"
                className="text-amber-600 hover:underline"
              >
                full buying guide
              </Link>
              .
            </p>
          </div>

          <div className="space-y-12">
            {guideSections.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-8 border border-neutral-200"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {section.heading}
                </h3>
                <div className="text-neutral-600 leading-relaxed">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
