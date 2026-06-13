/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

import React from 'react'
import JsonLd from '@/components/global/JsonLd'

const guideSections = [
  {
    heading: 'Where can I buy used trucks in Gauteng?',
    content: (
      <div className="space-y-4">
        <p>
          You can buy used rigid trucks in Gauteng from A-Z Truck Sales, with
          branches in Alberton and Boksburg.
        </p>
        <p>
          A-Z Truck Sales serves local buyers in Alberton, Boksburg,
          Johannesburg, the East Rand and wider Gauteng, while also assisting
          buyers across South Africa. Many truck buyers want to inspect the
          vehicle, check the body type, ask about the service history and
          confirm what happens before collection.
        </p>
      </div>
    ),
  },
  {
    heading:
      'What makes A-Z Truck Sales different from a truck marketplace?',
    content: (
      <div className="space-y-4">
        <p>
          A-Z combines used truck stock with local branch support, workshop
          preparation, spares knowledge and direct dealer guidance.
        </p>
        <p>
          Marketplaces are useful for browsing many listings, but they often
          leave the buyer to compare condition, body type, paperwork, spares
          and inspection questions alone. A-Z can stand apart by explaining how
          buyers are helped before they choose a truck, especially when they
          need a work-ready rigid truck rather than a random listing.
        </p>
      </div>
    ),
  },
  {
    heading: 'Which truck brands does A-Z Truck Sales focus on?',
    content: (
      <div className="space-y-4">
        <p>
          A-Z stock commonly includes used Isuzu, Hino, Mercedes-Benz, Fuso,
          MAN, UD, Toyota and other commercial vehicle brands.
        </p>
        <p>
          Buyers often search by make before they search by dealer name. A
          buyer looking for a used Isuzu truck may have different needs from a
          buyer looking for a MAN, Fuso or Mercedes-Benz truck.
        </p>

      </div>
    ),
  },
  {
    heading: 'How do I choose the right used rigid truck?',
    content: (
      <div className="space-y-4">
        <p>
          Choose a used rigid truck by payload, route, body type, licensing
          needs, mileage, condition, spares and after-sale support.
        </p>
        <p>
          Most buyers should not start with the cheapest truck. They should
          start with the job. A refrigerated food business needs a different
          truck from a builder, courier, furniture mover or municipal
          contractor. A-Z should guide buyers through payload, route distance,
          body length, tail lift needs, refrigeration units, fuel type,
          transmission and how soon the vehicle must go to work.
        </p>
      </div>
    ),
  },
  {
    heading: 'Which body type should I choose for my business?',
    content: (
      <div className="space-y-4">
        <p>
          The right body type depends on what you carry, how it is loaded,
          and whether it needs protection or refrigeration.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-amber-50">
                <th className="text-left p-3 border font-semibold">
                  Truck body type
                </th>
                <th className="text-left p-3 border font-semibold">
                  Best for
                </th>
                <th className="text-left p-3 border font-semibold">
                  Buyer questions to ask
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border font-medium">Dropside</td>
                <td className="p-3 border">
                  Building materials, hardware, general loads
                </td>
                <td className="p-3 border">
                  Is the load easy to secure, and is side loading needed?
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 border font-medium">Box body</td>
                <td className="p-3 border">
                  Furniture, parcels, retail goods, protected cargo
                </td>
                <td className="p-3 border">
                  Does the cargo need weather protection and lockable
                  storage?
                </td>
              </tr>
              <tr>
                <td className="p-3 border font-medium">Refrigerated</td>
                <td className="p-3 border">
                  Food, meat, frozen goods, temperature-sensitive stock
                </td>
                <td className="p-3 border">
                  Is the fridge unit working and suitable for the required
                  temperature range?
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 border font-medium">Curtain side</td>
                <td className="p-3 border">
                  Palletised goods and faster loading
                </td>
                <td className="p-3 border">
                  Will forklifts load from the side, and is the curtain
                  condition good?
                </td>
              </tr>
              <tr>
                <td className="p-3 border font-medium">Chassis cab</td>
                <td className="p-3 border">
                  Custom bodies and specialist builds
                </td>
                <td className="p-3 border">
                  What body must be fitted, and is the chassis suitable for
                  the job?
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  {
    heading:
      'Are Isuzu trucks a good option for Gauteng buyers?',
    content: (
      <p>
        Used Isuzu trucks are popular for delivery, medium-duty work and
        fleet use when condition and support are properly checked. Common
        buyer needs include payload, N-Series and F-Series comparisons where
        relevant, roadworthy preparation, spares support and body condition.
      </p>
    ),
  },
  {
    heading:
      'Are Hino trucks suitable for delivery and fleet work?',
    content: (
      <p>
        Used Hino trucks can suit delivery, refrigerated, box-body and
        dropside work when the body and mechanical condition match the route.
        Buyers should consider whether the truck fits their daily load,
        route, driver requirements and maintenance expectations.
      </p>
    ),
  },
  {
    heading:
      'When should I consider Mercedes-Benz, MAN or heavier commercial vehicles?',
    content: (
      <p>
        Consider heavier commercial vehicles when your load, route distance,
        body size or towing needs exceed light-duty truck capacity. Buyers
        should ask about engine condition, drivetrain, body length, mileage,
        service records, licensing, tyres, brakes and whether the vehicle is
        suitable for their route and load.
      </p>
    ),
  },
  {
    heading:
      'Why does workshop preparation matter when buying a used truck?',
    content: (
      <p>
        Workshop preparation reduces buyer risk by checking visible faults,
        roadworthy readiness, safety items and work-needed issues before
        collection. A marketplace can list trucks, but a dealer with workshop
        knowledge can explain what has been checked, what has been
        refurbished, what still needs attention, and what the buyer should
        inspect before paying.
      </p>
    ),
  },
  {
    heading: 'What should I check before buying a used truck?',
    content: (
      <div className="space-y-4">
        <p>
          Check the truck's body, tyres, brakes, engine, gearbox, mileage,
          paperwork, roadworthy status, spares availability and fit for your
          workload.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Confirm the body type and payload fit your work.
          </li>
          <li>
            Check mileage against the truck's age and use.
          </li>
          <li>
            Ask what has been serviced, repaired or refurbished.
          </li>
          <li>
            Inspect tyres, brakes, lights, suspension and body condition.
          </li>
          <li>
            Ask about roadworthy or COF requirements before registration.
          </li>
          <li>
            Confirm whether spares are available for the brand and model.
          </li>
          <li>
            Request branch location, contact number and viewing details.
          </li>
        </ul>
      </div>
    ),
  },
  {
    heading:
      'Does A-Z Truck Sales also help with truck spares?',
    content: (
      <p>
        A-Z Truck Sales positions spares support as part of reducing
        downtime after buying a used commercial vehicle. Truck spares
        availability affects downtime, maintenance planning and long-term
        ownership cost. The connection between used truck sales and spares
        support is especially important for Isuzu, Hino, Mercedes-Benz,
        Fuso, MAN and other commercial vehicle buyers.
      </p>
    ),
  },
  {
    heading: 'Where is A-Z Truck Sales located?',
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
    content: (
      <p>
        Send the truck model, budget, payload need, body type, location and
        trade-in details so the dealer can respond faster. Include the work
        you need the truck for to help sales staff recommend a better-fit
        vehicle.
      </p>
    ),
  },
]

/* <h1>A-Z Truck Sales Components</h1> */ export default function FAQSection() {
  return (
    <section className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Guide to buying used trucks in Gauteng
            </h2>
            <p className="text-neutral-600 text-lg">
              Everything you need to know about finding, choosing and buying
              a used rigid truck from A-Z Truck Sales.
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
