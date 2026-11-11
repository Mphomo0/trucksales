export interface BodyTypePage {
  slug: string
  /** Value stored in inventory.bodyType (matched case-insensitively). */
  dbValue: string
  /** Plural noun used in headings, e.g. "Refrigerated Trucks". */
  name: string
  h1: string
  /** Short title; the page adds " in Gauteng | A-Z Truck Sales". */
  metaTitle: string
  intro: string
  useCases: string
  /** Practical buying points shown above the stock list. */
  buyingPoints: string[]
  faqs: { question: string; answer: string }[]
}

export const BODY_TYPE_PAGES: BodyTypePage[] = [
  {
    slug: 'refrigerated-trucks',
    dbValue: 'Refrigerated Body',
    name: 'Refrigerated Trucks',
    h1: 'Refrigerated Trucks for Sale in Gauteng',
    metaTitle: 'Refrigerated Trucks for Sale',
    intro:
      'Looking for a refrigerated truck for sale? Also called reefer, fridge, freezer or cold trucks, these keep food, produce and other perishables at temperature from pickup to delivery.',
    useCases:
      'fresh produce, meat and dairy distribution, frozen goods, catering supply and pharmaceutical or floral deliveries',
    buyingPoints: [
      'A refrigerated body and its cooling unit are heavier than a dropside or curtain side, so the same chassis carries less payload. Ask us for the payload of the specific truck.',
      'Ask whether the unit is built for chilled or frozen loads, and have the cooling unit checked and running before you commit.',
      'Check the insulation, door seals and floor, because damage there makes the unit work harder and costs you cold-chain reliability.',
      'Every truck we sell is workshop-checked and COF-ready, and you are welcome to view it at our Alberton or Boksburg branch.',
    ],
    faqs: [
      {
        question: 'Do you have refrigerated trucks for sale?',
        answer:
          'Yes, refrigerated trucks are a regular part of our stock across several tonnage classes. Stock changes often, so check the trucks listed on this page or contact us to confirm what is available now.',
      },
      {
        question: 'What is the difference between a refrigerated truck and a freezer truck?',
        answer:
          'Both have an insulated body with a cooling unit. A freezer set-up is built to hold frozen temperatures, while a chilled set-up holds a higher temperature range. Ask us about the specific truck and unit before you buy.',
      },
      {
        question: 'How much can a refrigerated truck carry?',
        answer:
          'Payload depends on the chassis and the body. The insulated body and cooling unit add weight, so a refrigerated truck carries less than a dropside of the same size. We can confirm the payload and GVM for any truck in stock.',
      },
      {
        question: 'Can I view a refrigerated truck before buying?',
        answer:
          'Yes. You can view trucks at our Alberton or Boksburg branch. Contact us to arrange a time so the truck is ready for you.',
      },
    ],
  },
  {
    slug: 'dropside-trucks',
    dbValue: 'Dropside Truck',
    name: 'Dropside Trucks',
    h1: 'Dropside Trucks for Sale in Gauteng',
    metaTitle: 'Dropside Trucks for Sale',
    intro:
      'Looking for a dropside truck for sale? An open load bed with fold-down sides makes loading and offloading quick from the side, the back or with a forklift.',
    useCases:
      'building and construction supply, bulk and wholesale goods, furniture and equipment moves, general cartage and farm supply',
    buyingPoints: [
      'Dropsides are among the lightest bodies, so they leave the most payload for the chassis, which suits heavy and bulky loads.',
      'The load bed is open, so cover or secure loads that need protection from rain, dust and theft.',
      'Check the floor, the side-board hinges and locks, and the headboard for damage before you buy.',
      'Every truck we sell is workshop-checked and COF-ready, and you are welcome to view it at our Alberton or Boksburg branch.',
    ],
    faqs: [
      {
        question: 'Do you have dropside trucks for sale?',
        answer:
          'Yes, dropsides are one of our most common body types, in several tonnage classes. Stock changes often, so check the trucks listed on this page or contact us to confirm what is available now.',
      },
      {
        question: 'What is a dropside truck used for?',
        answer:
          'A dropside has an open load bed with sides that fold down. It is used for bulk and building supplies, wholesale goods, equipment and general cartage where quick loading from any side matters.',
      },
      {
        question: 'Dropside or curtain side: which should I choose?',
        answer:
          'A dropside is lighter and easier to load from the sides, but the load is open. A curtain side adds a weather cover you can pull back, which suits palletised goods that need protection. Our guide to truck body types compares them in more detail.',
      },
      {
        question: 'Is a dropside truck available in 8 ton?',
        answer:
          'Yes, dropsides are available in the 8 to 9 ton class, depending on current stock. Check the trucks on this page or our 8 ton page, or contact us to confirm availability.',
      },
    ],
  },
  {
    slug: 'curtain-side-trucks',
    dbValue: 'Curtain Side Truck',
    name: 'Curtain Side Trucks',
    h1: 'Curtain Side Trucks for Sale in Gauteng',
    metaTitle: 'Curtain Side Trucks for Sale',
    intro:
      'Looking for a curtain side truck for sale? Pull-back side curtains give you the weather cover of a closed body with the easy side loading of an open one.',
    useCases:
      'palletised goods, retail and FMCG distribution, packaged freight and loads that need cover but quick forklift access',
    buyingPoints: [
      'Curtains protect against rain and dust and open fully for side loading, which makes them popular for palletised freight.',
      'Check the curtain material, the track and rollers, and the straps and buckles, because these wear with use.',
      'A curtain side is lighter than a fully closed body, but heavier than a plain dropside, so confirm the payload for the specific truck.',
      'Every truck we sell is workshop-checked and COF-ready, and you are welcome to view it at our Alberton or Boksburg branch.',
    ],
    faqs: [
      {
        question: 'Do you have curtain side trucks for sale?',
        answer:
          'Yes, curtain side trucks are part of our stock in several tonnage classes. Stock changes often, so check the trucks listed on this page or contact us to confirm what is available now.',
      },
      {
        question: 'What is a curtain side truck?',
        answer:
          'It has a load bed with a frame and side curtains that slide open. You get cover from weather and a view of the load when closed, and full access for side loading when open.',
      },
      {
        question: 'What are the advantages over a closed body?',
        answer:
          'Side access. A forklift can load pallets from the side, which is faster than loading through rear doors. A closed body is more secure and better against the weather.',
      },
      {
        question: 'Is a curtain side available in 8 ton?',
        answer:
          'Yes, curtain sides are available in the 8 to 9 ton class, depending on current stock. Check the trucks on this page or contact us to confirm availability.',
      },
    ],
  },
  {
    slug: 'volume-body-trucks',
    dbValue: 'Volume Body',
    name: 'Volume Body Trucks',
    h1: 'Volume Body Trucks for Sale in Gauteng',
    metaTitle: 'Volume Body Trucks for Sale',
    intro:
      'Looking for a volume body truck for sale? Also known as a box body or closed body, it is a fully enclosed load area built for secure, weatherproof and bulky goods.',
    useCases:
      'furniture removals, courier and parcel delivery, retail and FMCG distribution, and light goods that need protecting from weather and theft',
    buyingPoints: [
      'A fully enclosed body keeps cargo dry and secure, which suits parcels, furniture and stock that must arrive in good condition.',
      'Volume bodies are light for their size, so they carry a lot of space for lighter, bulkier loads.',
      'Check the roof, rear doors and seals for leaks, and the floor for wear from regular loading.',
      'Every truck we sell is workshop-checked and COF-ready, and you are welcome to view it at our Alberton or Boksburg branch.',
    ],
    faqs: [
      {
        question: 'Do you have volume body trucks for sale?',
        answer:
          'Yes, volume bodies (also called box bodies) are one of our most common body types, in several tonnage classes. Stock changes often, so check the trucks listed on this page or contact us to confirm what is available now.',
      },
      {
        question: 'What is a volume body truck?',
        answer:
          'A volume body is a fully enclosed, box-shaped load area on a truck chassis. It is also called a box body or closed body, and it is built for bulky, lighter goods that need cover and security.',
      },
      {
        question: 'What is the difference between a volume body and a refrigerated body?',
        answer:
          'A volume body is an enclosed box with no cooling. A refrigerated body is insulated and has a cooling unit to keep goods at temperature. Choose a volume body for dry goods and a refrigerated body for perishables.',
      },
      {
        question: 'Is a volume body suitable for furniture removals?',
        answer:
          'Yes. The enclosed body protects furniture from rain and dust and keeps it secure. Ask us about the internal size and payload of the specific truck.',
      },
    ],
  },
]

export function getBodyTypePage(slug: string) {
  return BODY_TYPE_PAGES.find((b) => b.slug === slug)
}

/** Stored bodyType casing is inconsistent ("Dropside Truck" and "dropside truck"). */
const normaliseBody = (v: string) => v.trim().toLowerCase().replace(/\s+/g, ' ')

const PAGES_BY_BODY = new Map(
  BODY_TYPE_PAGES.map((b) => [normaliseBody(b.dbValue), b]),
)

/** Resolves the body-type page for an inventory record's `bodyType`, if we have one. */
export function getBodyTypePageByBodyType(bodyType: string | null | undefined) {
  if (!bodyType) return undefined
  return PAGES_BY_BODY.get(normaliseBody(bodyType))
}

/** The other body-type pages, for sibling cross-linking. */
export function getSiblingBodyTypePages(slug: string) {
  return BODY_TYPE_PAGES.filter((b) => b.slug !== slug)
}
