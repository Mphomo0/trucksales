import JsonLd from '@/components/global/JsonLd'

export const DEALER_FAQS = [
  {
    question: 'What types of used trucks does A-Z Truck Sales stock?',
    answer:
      'A-Z Truck Sales stocks used rigid commercial trucks ranging from 1.5 to 35 tons across all major body types: dropside trucks for construction and general freight, box body trucks for secure enclosed delivery, refrigerated trucks for food and cold-chain transport, curtain side trucks for palletised warehouse distribution, and chassis cabs for specialist superstructures. Brands in stock include Isuzu (N-Series and F-Series), Hino (300 and 500 Series), Mercedes-Benz (Atego, Axor), Fuso (Canter, Fighter), MAN (TGL, TGM), UD Trucks (Condor, Croner), and Nissan. Current stock exceeds 100 units across both Gauteng branches. Browse the full inventory at a-ztrucksales.com/inventory.',
  },
  {
    question: 'Do your used trucks come with a Certificate of Fitness (COF)?',
    answer:
      "Yes. All trucks sold by A-Z Truck Sales are COF-ready — meaning each vehicle is prepared to meet the South African Certificate of Fitness roadworthiness standard before it leaves our yard. The Certificate of Fitness (COF) is issued by the Department of Transport's testing station and confirms a commercial vehicle meets legal roadworthiness and safety requirements for South African roads. Our in-house inspection process covers brakes, lights, tyres, steering, chassis integrity, and load-carrying components. Buyers receive a truck that is either COF-current or ready to be submitted for COF without requiring additional repairs. This applies to all stock at both our Alberton and Boksburg branches.",
  },
  {
    question: 'Where are A-Z Truck Sales branches located in Gauteng?',
    answer:
      'A-Z Truck Sales operates two branches in Gauteng. The Alberton branch is at 9 Chrislou Crescent, Alberton North, 1449 — serving Alberton, the South Rand, and Johannesburg. Phone: 011 902 6071. Hours: Monday to Friday 08:00–17:00, Saturday 08:00–13:00. The Boksburg branch is at the corner of Trichardts Road and Ravenswood Street, Ravenswood, Boksburg, 1451 — serving Boksburg, Brakpan, Springs, and the wider East Rand. Phone: 083 234 5377. Hours: Monday to Friday 08:00–17:00. Both branches carry used rigid trucks, spares, and offer trade-in services. Walk-in viewing is welcome at Alberton; the Boksburg branch prefers viewings by appointment — please call ahead.',
  },
  {
    question: 'Can I trade in my existing truck at A-Z Truck Sales?',
    answer:
      "Yes, A-Z Truck Sales accepts trade-ins on used commercial trucks. Whether you are upgrading to a larger unit, replacing aging fleet stock, or simply selling, you can bring your truck to either our Alberton or Boksburg branch for evaluation. We assess the vehicle's make, model, year, mileage, body condition, mechanical condition, and current COF status. Trade-in valuations are offered against new stock purchases or as a standalone sale. Fleet operators trading multiple units are welcome to contact us directly to discuss volume arrangements. To get a trade-in estimate, call the Alberton branch on 011 902 6071 or the Boksburg branch on 083 234 5377, or use the enquiry form at a-ztrucksales.com/sell-your-truck.",
  },
  {
    question: 'Do you offer financing on used trucks?',
    answer:
      'A-Z Truck Sales works with finance partners to assist buyers in securing vehicle finance on used commercial trucks. Finance options are available for qualifying buyers, subject to standard credit assessment under the National Credit Act (NCA). Whether you are an owner-operator buying your first commercial vehicle or a fleet manager replacing multiple units, we can guide you through the application process. Finance terms, deposit requirements, and monthly repayments depend on the vehicle price, your credit profile, and the lending institution\'s criteria. To discuss finance options before visiting, contact our Alberton branch on 011 902 6071 or our Boksburg branch on 083 234 5377. We recommend having your ID, proof of income, and three months of bank statements available when making an application.',
  },
  {
    question: 'Do you deliver trucks across South Africa or assist with export?',
    answer:
      'Yes. A-Z Truck Sales can assist with delivery of purchased vehicles to locations beyond Gauteng, and we have experience handling export documentation for buyers in neighbouring SADC countries. For domestic buyers outside Gauteng, transport costs and logistics are arranged on a case-by-case basis — contact either branch to discuss your delivery requirements. For cross-border export buyers in countries such as Zimbabwe, Zambia, Botswana, Mozambique, and Namibia, we assist with export documentation including NATIS clearance, roadworthy certificates, and export permits. Contact the Alberton branch at 011 902 6071 or email aztrucksales@mweb.co.za for export enquiries. Buyers are also welcome to collect in person from either branch with prior arrangement.',
  },
]

export const DEALER_FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: DEALER_FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
}

interface Props {
  heading?: string
  withSchema?: boolean
}

export default function DealerFaqBlock({
  heading = 'Common Questions About A-Z Truck Sales',
  withSchema = false,
}: Props) {
  return (
    <section className="py-20 bg-neutral-50">
      {withSchema && <JsonLd data={DEALER_FAQ_SCHEMA} />}
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            {heading}
          </h2>
          <div className="space-y-3">
            {DEALER_FAQS.map((faq, i) => (
              <details
                key={i}
                className="bg-white rounded-lg border border-neutral-200 p-6"
              >
                <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center gap-4">
                  {faq.question}
                  <span className="shrink-0 text-amber-500" aria-hidden>▾</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
