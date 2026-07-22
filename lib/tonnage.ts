export interface TonnageBucket {
  slug: string
  dbValue: string
  label: string
  h1: string
  metaTitle: string
  intro: string
  useCases: string
  faqs: { question: string; answer: string }[]
}

export const TONNAGE_BUCKETS: TonnageBucket[] = [
  {
    slug: '1-to-2-5-ton',
    dbValue: '1 to 2.5 ton',
    label: '1 to 2.5 Ton',
    h1: '1 to 2.5 Ton Trucks for Sale in Gauteng',
    metaTitle: '1 to 2.5 Ton Trucks for Sale',
    intro:
      'Light commercial trucks in the 1 to 2.5 ton class are the most affordable entry point into truck ownership, and the easiest to license and drive on a standard code.',
    useCases:
      'courier and parcel delivery, small business logistics, mobile trades and light distribution work',
    faqs: [
      {
        question: 'What can a 1 to 2.5 ton truck carry?',
        answer:
          'A 1 to 2.5 ton truck is suited to light payloads such as parcels, small furniture, tools and stock for a small business. Exact payload depends on the specific model and body type.',
      },
      {
        question: 'Do I need a special licence for a 2 ton truck?',
        answer:
          'Most trucks in this class fall under a standard Code B or Code C1 licence in South Africa. Confirm the GVM of the specific vehicle with our team before buying.',
      },
      {
        question: 'What body types are available in this range?',
        answer:
          'We stock dropside, box body and canopy configurations in the 1 to 2.5 ton range, depending on current stock. Contact us to confirm what is available.',
      },
    ],
  },
  {
    slug: '3-to-5-ton',
    dbValue: '3 to 5 ton',
    label: '3 to 5 Ton',
    h1: '3 to 5 Ton Trucks for Sale in Gauteng',
    metaTitle: '3 to 5 Ton Trucks for Sale',
    intro:
      'The 3 to 5 ton class is one of the most popular sizes for South African small and medium businesses — big enough for real payloads, small enough to drive on a standard licence.',
    useCases:
      'furniture removals, parcel and courier delivery, retail distribution and light construction supply',
    faqs: [
      {
        question: 'Is a 5 ton truck good for a delivery business?',
        answer:
          'Yes. The 3 to 5 ton class is a common choice for delivery and distribution businesses because it balances payload capacity with manoeuvrability and running costs.',
      },
      {
        question: 'What brands do you stock in the 3 to 5 ton range?',
        answer:
          'Stock varies, but this range typically includes Isuzu, Hino, Fuso, Toyota and Nissan models. Check our current inventory or contact us for availability.',
      },
      {
        question: 'Can a 3 to 5 ton truck take a refrigerated body?',
        answer:
          'Yes, refrigerated bodies are available in this class and are a common configuration for food and perishable goods transport.',
      },
    ],
  },
  {
    slug: '6-to-7-ton',
    dbValue: '6 to 7 ton',
    label: '6 to 7 Ton',
    h1: '6 to 7 Ton Trucks for Sale in Gauteng',
    metaTitle: '6 to 7 Ton Trucks for Sale',
    intro:
      'The 6 to 7 ton class sits between light delivery trucks and medium-duty distribution vehicles, offering more payload without stepping up to a heavier licence class.',
    useCases:
      'retail and wholesale distribution, building supply delivery and medium-payload route work',
    faqs: [
      {
        question: 'What is a 6 to 7 ton truck used for?',
        answer:
          'This size is common for retail distribution, building material delivery and route-based work where a bit more payload than a 5 ton truck is needed.',
      },
      {
        question: 'What licence do I need for a 7 ton truck?',
        answer:
          'Most vehicles in this range require a Code C1 licence in South Africa. Confirm the exact GVM of the vehicle you are interested in with our team.',
      },
    ],
  },
  {
    slug: '8-to-9-ton',
    dbValue: '8 to 9 ton',
    label: '8 to 9 Ton',
    h1: '8 to 9 Ton Trucks for Sale in Gauteng',
    metaTitle: '8 to 9 Ton Trucks for Sale',
    intro:
      'The 8 to 9 ton class is a workhorse size for South African fleets, offering solid payload capacity for bulk delivery, refrigerated transport and regular route work.',
    useCases:
      'bulk and wholesale delivery, refrigerated transport, route work and fleet distribution',
    faqs: [
      {
        question: 'What can an 8 ton truck carry?',
        answer:
          'An 8 to 9 ton truck typically carries several tons of palletised or bulk goods, depending on body type. This class is common for wholesale and refrigerated delivery.',
      },
      {
        question: 'Do you have refrigerated 8 ton trucks in stock?',
        answer:
          'Refrigerated bodies are a common configuration in this class. Check our current inventory or contact us to confirm what is available now.',
      },
    ],
  },
  {
    slug: '10-to-18-ton',
    dbValue: '10 to 18 ton',
    label: '10 to 18 Ton',
    h1: '10 to 18 Ton Trucks for Sale in Gauteng',
    metaTitle: '10 to 18 Ton Trucks for Sale',
    intro:
      'The 10 to 18 ton class covers medium-to-heavy rigid trucks used for long-haul distribution, construction supply and heavier route work across South Africa.',
    useCases:
      'long-haul distribution, construction and building supply, bulk freight and heavier route work',
    faqs: [
      {
        question: 'What licence do I need for a 10 ton or 16 ton truck?',
        answer:
          'Trucks in the 10 to 18 ton class generally require a Code C1 or Code C licence, depending on GVM. Confirm the specific licence requirement for the vehicle you are interested in.',
      },
      {
        question: 'Are 10 to 18 ton trucks suitable for construction work?',
        answer:
          'Yes, this class is commonly used for building material delivery, tipper work and general construction logistics.',
      },
      {
        question: 'What body types are available for 16 and 18 ton trucks?',
        answer:
          'Dropside, tautliner, box body and refrigerated configurations are all common in this range. Contact us to confirm current stock and body type availability.',
      },
    ],
  },
  {
    slug: '18-to-35-ton',
    dbValue: '18 to 35 ton',
    label: '18 to 35 Ton',
    h1: '18 to 35 Ton Trucks for Sale in Gauteng',
    metaTitle: '18 to 35 Ton Trucks for Sale',
    intro:
      'The 18 to 35 ton class covers our heaviest rigid trucks — built for demanding, high-payload work including construction, export loads and heavy-duty haulage.',
    useCases:
      'heavy construction, export freight, tipper and bulk haulage and demanding fleet work',
    faqs: [
      {
        question: 'What licence do I need for a truck over 18 tons?',
        answer:
          'Heavy rigid trucks above 18 tons GVM typically require a Code C licence. Confirm the exact requirement for the specific vehicle with our team.',
      },
      {
        question: 'Do you stock heavy trucks for export?',
        answer:
          'Yes, we regularly sell heavy trucks for export to other African countries, with the necessary paperwork handled for cross-border sales.',
      },
    ],
  },
]

export function getTonnageBucket(slug: string) {
  return TONNAGE_BUCKETS.find((b) => b.slug === slug)
}
