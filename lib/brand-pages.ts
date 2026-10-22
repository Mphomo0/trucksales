import type { GuideSlug } from '@/components/sections/shared/RelatedGuides'
import { BRAND_ROUTES, type BrandRoute } from './brands'

export type BrandSlug = BrandRoute['slug']

export interface BrandFaq {
  question: string
  answer: string
}

/**
 * Copy that differs between the /brands/[brand] landing pages. Everything
 * else (titles, headings, CTAs, JSON-LD) is built from the brand's label in
 * BRAND_ROUTES, so a wording change to the shared template lands on all nine
 * pages at once.
 */
export interface BrandPageContent {
  metaDescription: string
  /** Open Graph and Twitter description. */
  socialDescription: string
  heroIntro: string
  aboutHeading: string
  about: string[]
  /** Spelled out because the article goes by sound: "an Isuzu", "a UD". */
  whyHeading: string
  whyPoints: string[]
  /** Defaults to "Every <label> truck currently in stock at our Gauteng branches." */
  stockIntro?: string
  /** Defaults to "Common questions about buying used <label> trucks from A-Z Truck Sales." */
  faqIntro?: string
  /** Brand name in the vehicle JSON-LD. Defaults to the label. */
  schemaBrandName?: string
  guides: GuideSlug[]
  faqs: BrandFaq[]
}

const BRAND_CONTENT = {
  isuzu: {
    metaDescription:
      'Browse used Isuzu trucks for sale in Gauteng. N-Series, F-Series & more. Visit our Alberton or Boksburg branch.',
    socialDescription:
      'Shop used Isuzu trucks in Gauteng. N-Series and F-Series rigid trucks.',
    heroIntro:
      'Browse our range of used Isuzu N-Series and F-Series rigid trucks. Every vehicle is available for viewing at our Alberton or Boksburg branch.',
    aboutHeading: 'Isuzu Trucks — Built for South African Roads',
    about: [
      'Isuzu is one of South Africa’s most trusted commercial vehicle brands. With a strong local manufacturing presence, extensive dealer network and excellent parts availability, Isuzu trucks are a popular choice for delivery, distribution, construction and medium-duty transport.',
      'The N-Series range (NPR, NQR, NPS) is ideal for city delivery and medium-duty work, while the F-Series range (FRR, FSR, FVR, FVZ) handles heavier loads and longer distance routes. Both ranges are available in dropside, box body, refrigerated and curtain side configurations.',
    ],
    whyHeading: 'Why Choose an Isuzu Truck?',
    whyPoints: [
      'Excellent parts availability across South Africa',
      'Strong resale value',
      'Reliable diesel engines with long service intervals',
      'Wide range of body configurations',
      'Extensive dealer and service network',
      'Suitable for GVM from 3.5 to 18 tons',
    ],
    guides: ['isuzu-vs-hino-vs-fuso', 'buying-guide', 'what-to-check-before-buying'],
    faqs: [
      {
        question: 'Does A-Z Truck Sales sell used Isuzu trucks in Gauteng?',
        answer:
          'Yes, we stock used Isuzu trucks for sale including N-Series and F-Series models. Isuzu is one of our most popular brands due to strong parts availability, reliable engines and broad dealer network across South Africa.',
      },
      {
        question: 'What Isuzu truck models do you sell?',
        answer:
          'We sell used Isuzu N-Series (NPR, NQR, NPS) and F-Series (FRR, FSR, FVR, FVZ) rigid trucks in various body configurations including dropside, box body, refrigerated and curtain side.',
      },
      {
        question: 'Do you have used Isuzu NPR trucks for sale?',
        answer:
          'Yes, the Isuzu NPR is one of our most popular models and stock changes regularly. The NPR is well suited to city delivery, retail distribution and service work, with strong parts availability across South Africa. Check our current stock below or contact us for the latest NPR availability.',
      },
      {
        question: 'Why buy a used Isuzu truck from A-Z?',
        answer:
          'Our team knows the Isuzu range and can match the right model to your payload and route. Isuzu offers excellent parts availability, strong resale value and reliable diesel engines.',
      },
      {
        question: 'Are Isuzu truck spares available?',
        answer:
          'Isuzu has one of the strongest parts supply networks in South Africa. We also stock Isuzu truck spares at our branches for common service items.',
      },
      {
        question: 'Do you help with Isuzu truck financing?',
        answer:
          'Yes, we work with vehicle finance providers. Contact our sales team to discuss options for your Isuzu truck purchase.',
      },
    ],
  },
  hino: {
    metaDescription:
      'Browse used Hino trucks for sale in Gauteng. 300-Series, 500-Series & FC trucks. Visit our Alberton or Boksburg branch.',
    socialDescription:
      'Shop used Hino trucks in Gauteng. 300-Series, 500-Series and FC.',
    heroIntro:
      'Browse our range of used Hino 300-Series and 500-Series rigid trucks. Every vehicle is available for viewing at our Alberton or Boksburg branch.',
    aboutHeading: 'Hino Trucks — Japanese Reliability for South African Roads',
    about: [
      'Hino is one of Japan’s leading commercial vehicle manufacturers with a strong presence in South Africa. Known for reliable engines, low operating costs and excellent parts availability, Hino trucks are a top choice for delivery, distribution and light-to-medium duty transport.',
      'The 300-Series range covers 3.5 to 8.5 tons GVM and is ideal for city delivery, retail distribution and service vehicles. The 500-Series covers 8.5 to 18 tons GVM and handles medium-duty route work, refrigerated transport and bulk delivery.',
    ],
    whyHeading: 'Why Choose a Hino Truck?',
    whyPoints: [
      'Excellent fuel economy',
      'Proven Japanese engineering and reliability',
      'Low operating and maintenance costs',
      'Wide range of body configurations available',
      'Strong dealer and service network in SA',
      'Good resale value',
    ],
    guides: ['isuzu-vs-hino-vs-fuso', 'buying-guide', 'what-to-check-before-buying'],
    faqs: [
      {
        question: 'Does A-Z Truck Sales sell used Hino trucks?',
        answer:
          'Yes, we stock used Hino trucks including the 300-Series, 500-Series and FC models. Hino is one of our key brands due to its reputation for reliability and strong dealer support in South Africa.',
      },
      {
        question: 'What Hino truck models do you sell?',
        answer:
          'We sell used Hino 300-Series (ranging from 3.5 to 8.5 tons GVM) and 500-Series (8.5 to 18 tons GVM) in dropside, box body, refrigerated and curtain side configurations.',
      },
      {
        question: 'Why buy a used Hino truck from A-Z?',
        answer:
          'Our team knows the Hino range and can help you choose the right model for delivery, distribution or fleet work. Hino trucks offer excellent fuel economy, proven Japanese reliability and low operating costs.',
      },
      {
        question: 'Are Hino truck spares easy to find in South Africa?',
        answer:
          'Yes, Hino has a strong dealer network and parts availability across SA. We also stock common Hino spares at our branches.',
      },
      {
        question: 'Can I test drive a Hino truck at your branch?',
        answer:
          'Visits are by appointment. Contact us to arrange a viewing and test drive at our Alberton or Boksburg branch.',
      },
    ],
  },
  fuso: {
    metaDescription:
      'Browse used Fuso trucks for sale in Gauteng. Canter, Fighter & more. Visit our Alberton or Boksburg branch.',
    socialDescription:
      'Shop used Fuso trucks in Gauteng. Canter and Fighter models.',
    heroIntro:
      'Browse our range of used Fuso Canter and Fighter rigid trucks. Every vehicle is available for viewing at our Alberton or Boksburg branch.',
    aboutHeading: 'Fuso Trucks — Light- and Medium-Duty Excellence',
    about: [
      'Fuso is a leading commercial vehicle brand with a strong reputation for light-duty trucks in South Africa. The Canter range is one of the most popular choices for city delivery, service vehicles and light commercial transport.',
      'The Canter is available from 3.5 to 8.5 tons GVM, making it an ideal choice for businesses needing a manoeuvrable, fuel-efficient truck for urban routes. The Fighter range handles heavier medium-duty work up to 18 tons GVM.',
    ],
    whyHeading: 'Why Choose a Fuso Truck?',
    whyPoints: [
      'Excellent fuel economy — especially the Canter',
      'Tight turning circle for city driving',
      'Reliable and easy to maintain',
      'Wide range of body configurations',
      'Strong dealer network in South Africa',
      'Competitive pricing in the light-duty segment',
    ],
    guides: ['isuzu-vs-hino-vs-fuso', 'buying-guide', 'what-to-check-before-buying'],
    faqs: [
      {
        question: 'Does A-Z Truck Sales sell used Fuso trucks?',
        answer:
          'Yes, we stock used Fuso trucks including the Canter and Fighter ranges. Fuso is one of our key brands, valued for its light-duty capability, fuel efficiency and parts availability.',
      },
      {
        question: 'What Fuso truck models do you sell?',
        answer:
          'We sell used Fuso Canter (3.5 to 8.5 tons GVM) and Fighter (8.5 to 18 tons GVM) rigid trucks in dropside, box body, refrigerated and curtain side configurations.',
      },
      {
        question: 'Why buy a used Fuso truck from A-Z?',
        answer:
          'Our Canter range is especially popular for city delivery and light commercial work. Fuso trucks offer excellent fuel economy, tight turning circles and reliable performance.',
      },
      {
        question: 'Are Fuso Canter trucks good for city delivery?',
        answer:
          'Yes, the Fuso Canter is one of the most popular light-duty trucks for city delivery in South Africa. Its tight turning circle, good fuel economy and 3.5 to 8.5 ton GVM range make it ideal for urban routes.',
      },
      {
        question: 'Where can I view Fuso trucks in Gauteng?',
        answer:
          'Visit our Alberton or Boksburg branch by appointment. Call us to arrange a viewing of our current Fuso stock.',
      },
    ],
  },
  'ud-trucks': {
    metaDescription:
      'Browse used UD Trucks for sale in Gauteng. Condor, Croner & medium-duty trucks. Visit our Alberton or Boksburg branch.',
    socialDescription:
      'Shop used UD Trucks in Gauteng. Condor and Croner models.',
    heroIntro:
      'Browse our range of used UD Trucks including Condor models. Every vehicle is available for viewing at our Alberton or Boksburg branch.',
    aboutHeading: 'UD Trucks — Built for Heavy Work',
    about: [
      'UD Trucks (formerly Nissan Diesel) has a strong reputation in South Africa for durable, powerful trucks that handle tough working conditions. The Condor range is especially popular for medium-duty transport, construction and bulk delivery.',
      'Known for their robust engines and reliable drivetrains, UD Trucks offer excellent value in the used truck market. They are a popular choice for owner-drivers and small fleet operators who need a dependable workhorse.',
    ],
    whyHeading: 'Why Choose a UD Truck?',
    whyPoints: [
      'Robust and reliable engines',
      'Good value in the used market',
      'Suitable for medium- to heavy-duty work',
      'Strong parts availability through UD network',
      'Durable drivetrains for tough conditions',
    ],
    stockIntro: 'Recently added UD Trucks available at our Gauteng branches.',
    faqIntro: 'Common questions about buying used UD Trucks from A-Z Truck Sales.',
    schemaBrandName: 'UD Trucks',
    guides: ['buying-guide', 'what-to-check-before-buying', 'cof-ready-trucks'],
    faqs: [
      {
        question: 'Does A-Z Truck Sales sell used UD Trucks?',
        answer:
          'Yes, we stock used UD Trucks including Condor and Croner models. UD Trucks are known for their durability, powerful engines and suitability for medium- to heavy-duty transport.',
      },
      {
        question: 'What UD truck models do you sell?',
        answer:
          'We sell used UD Condor (medium-duty) trucks with various body configurations including dropside, box body, refrigerated and curtain side.',
      },
      {
        question: 'Why buy a used UD truck from A-Z?',
        answer:
          'UD Trucks offer excellent value in the medium-duty segment. Known for robust engines and reliable drivetrains, they are a popular choice for owner-drivers and small fleet operators.',
      },
      {
        question: 'Are UD truck spares available in South Africa?',
        answer:
          'Yes, UD Trucks has a solid parts distribution network in South Africa. We also stock common UD spares at our branches for service items.',
      },
      {
        question: 'Where can I view UD trucks in Gauteng?',
        answer:
          'Visit our Alberton or Boksburg branch by appointment. Call or WhatsApp us to arrange a viewing.',
      },
    ],
  },
  man: {
    metaDescription:
      'Browse used MAN trucks for sale in Gauteng. MAN TGL, TGM & heavy-duty trucks. Visit our Alberton or Boksburg branch.',
    socialDescription:
      'Shop used MAN trucks in Gauteng. TGL, TGM and heavy-duty models.',
    heroIntro:
      'Browse our range of used MAN TGL, TGM and heavy-duty rigid trucks. Every vehicle is available for viewing at our Alberton or Boksburg branch.',
    aboutHeading: 'MAN Trucks — German Engineering, South African Proven',
    about: [
      'MAN is one of Europe’s leading commercial vehicle manufacturers with a strong presence in South Africa. Known for build quality, driver comfort and fuel-efficient engines, MAN trucks are a popular choice for medium- to heavy-duty transport.',
      'The TGL range is ideal for light-to-medium duty work up to 7.5 tons, while the TGM handles medium-duty work up to 18 tons. MAN also offers heavier rigid trucks for construction, bulk transport and long-distance logistics.',
    ],
    whyHeading: 'Why Choose a MAN Truck?',
    whyPoints: [
      'German engineering and build quality',
      'Excellent driver comfort and cab design',
      'Fuel-efficient engine technology',
      'Strong long-distance and highway capability',
      'Well-established SA dealer and parts network',
    ],
    guides: ['buying-guide', 'what-to-check-before-buying', 'cof-ready-trucks'],
    faqs: [
      {
        question: 'Does A-Z Truck Sales sell used MAN trucks?',
        answer:
          'Yes, we stock used MAN trucks including TGL, TGM and heavier commercial models. MAN is a well-regarded European brand known for engineering quality and driver comfort.',
      },
      {
        question: 'What MAN truck models do you sell?',
        answer:
          'We sell used MAN TGL (light-duty), TGM (medium-duty) and heavier rigid trucks in dropside, box body, refrigerated and curtain side configurations.',
      },
      {
        question: 'Why buy a used MAN truck from A-Z?',
        answer:
          'MAN trucks offer excellent build quality, strong performance and good long-distance capability. Their German engineering provides driver comfort, fuel efficiency and reliable operation.',
      },
      {
        question: 'Are MAN truck spares available in South Africa?',
        answer:
          'Yes, MAN has a well-established dealer and parts network across South Africa. We also stock common MAN spares at our branches for service items.',
      },
      {
        question: 'Are MAN trucks good for long-distance transport?',
        answer:
          'Yes, MAN trucks are well-suited for long-distance routes. They are built for comfort, fuel efficiency and reliability on national roads, making them a strong choice for cross-province transport.',
      },
    ],
  },
  'mercedes-benz': {
    metaDescription:
      'Browse used Mercedes-Benz trucks for sale in Gauteng. Atego, Axor & more. Visit our Alberton or Boksburg branch.',
    socialDescription:
      'Shop used Mercedes-Benz trucks in Gauteng. Atego, Axor and more.',
    heroIntro:
      'Browse our range of used Mercedes-Benz Atego and Axor rigid trucks. Every vehicle is available for viewing at our Alberton or Boksburg branch.',
    aboutHeading: 'Mercedes-Benz Trucks — Premium Engineering for Commercial Transport',
    about: [
      'Mercedes-Benz is one of the world’s most recognised commercial vehicle brands, known for engineering excellence, driver comfort and advanced technology. In South Africa, Mercedes-Benz trucks are a popular choice for premium transport operations.',
      'The Atego range covers light- to medium-duty work from 7.5 to 16 tons, making it ideal for distribution, refrigerated transport and municipal applications. The Axor range handles heavier work and long-distance routes.',
    ],
    whyHeading: 'Why Choose a Mercedes-Benz Truck?',
    whyPoints: [
      'Premium build quality and engineering',
      'Excellent driver comfort and cab features',
      'Advanced safety and technology systems',
      'Good long-distance and highway performance',
      'Strong resale value in the used market',
      'Extensive SA dealer and parts network',
    ],
    stockIntro: 'Recently added Mercedes-Benz trucks available at our Gauteng branches.',
    guides: ['buying-guide', 'what-to-check-before-buying', 'cof-ready-trucks'],
    faqs: [
      {
        question: 'Does A-Z Truck Sales sell used Mercedes-Benz trucks?',
        answer:
          'Yes, we stock used Mercedes-Benz trucks including Atego and Axor models. Mercedes-Benz is a premium European brand valued for engineering, comfort and long-distance capability.',
      },
      {
        question: 'What Mercedes-Benz truck models do you sell?',
        answer:
          'We sell used Mercedes-Benz Atego (light- to medium-duty) and Axor (medium- to heavy-duty) rigid trucks in dropside, box body, refrigerated and curtain side configurations.',
      },
      {
        question: 'Why buy a used Mercedes-Benz truck from A-Z?',
        answer:
          'Mercedes-Benz trucks offer premium build quality, excellent driver comfort and strong resale value. They excel in long-distance and highway transport with robust drivetrains.',
      },
      {
        question: 'Are Mercedes-Benz truck spares available in South Africa?',
        answer:
          'Yes, Mercedes-Benz has an extensive dealer and parts network across South Africa. Parts availability is good, especially for popular models like the Atego and Axor.',
      },
      {
        question: 'Are Mercedes-Benz trucks good for long-distance transport?',
        answer:
          'Yes, Mercedes-Benz trucks excel in long-distance and highway transport. They offer excellent cab comfort, fuel-efficient engines and robust drivetrains for cross-country routes.',
      },
    ],
  },
  tata: {
    metaDescription:
      'Browse used Tata trucks for sale in Gauteng. Tata LPT 709, 912, 1615 & more. Quality used rigid trucks. Visit our Alberton or Boksburg branch.',
    socialDescription:
      'Shop used Tata trucks in Gauteng. Quality used rigid trucks available at our Alberton or Boksburg branches.',
    heroIntro:
      'Browse our range of used Tata rigid trucks. Every vehicle is available for viewing at our Alberton or Boksburg branch.',
    aboutHeading: 'Tata Trucks — Value-Driven Commercial Transport',
    about: [
      'Tata Motors is one of India’s largest commercial vehicle manufacturers with a growing presence in South Africa. Tata trucks are known for competitive pricing, solid build quality and good parts availability.',
      'The Tata LPT range covers light- to medium-duty transport needs including dropside, box body and chassis cab configurations. Tata offers strong value for budget-conscious buyers.',
    ],
    whyHeading: 'Why Choose a Tata Truck?',
    whyPoints: [
      'Competitive pricing and good value',
      'Solid build quality',
      'Growing SA dealer and parts network',
      'Suitable for light- to medium-duty work',
    ],
    guides: ['buying-guide', 'what-to-check-before-buying', 'cof-ready-trucks'],
    faqs: [
      {
        question: 'Does A-Z Truck Sales sell used Tata trucks?',
        answer:
          'Yes, we stock used Tata trucks including LPT and other models. Tata offers good value in the light- to medium-duty truck segment with competitive pricing and strong parts availability.',
      },
      {
        question: 'What Tata truck models do you sell?',
        answer:
          'We sell used Tata rigid trucks in dropside, box body and other configurations suitable for light- to medium-duty transport.',
      },
      {
        question: 'Why buy a used Tata truck from A-Z?',
        answer:
          'Tata trucks offer excellent value, solid build quality and good parts availability in South Africa. Our team can help you find the right model for your payload and budget.',
      },
      {
        question: 'Are Tata truck spares available in South Africa?',
        answer:
          'Yes, Tata has a growing dealer and parts network in South Africa with good availability for common service items.',
      },
    ],
  },
  toyota: {
    metaDescription:
      'Browse used Toyota trucks for sale in Gauteng. Toyota Dyna, Hino & more. Quality used rigid trucks. Visit our Alberton or Boksburg branch.',
    socialDescription:
      'Shop used Toyota trucks in Gauteng. Quality used rigid trucks available at our Alberton or Boksburg branches.',
    heroIntro:
      'Browse our range of used Toyota light-duty trucks. Every vehicle is available for viewing at our Alberton or Boksburg branch.',
    aboutHeading: 'Toyota Trucks — Legendary Reliability',
    about: [
      'Toyota is South Africa’s most trusted automotive brand, and their commercial vehicles carry the same reputation for reliability, durability and excellent parts availability.',
      'The Toyota Dyna is a popular light-duty truck for city delivery, service vehicles and light commercial transport. Toyota trucks offer strong resale value and the peace of mind that comes with the largest dealer network in the country.',
    ],
    whyHeading: 'Why Choose a Toyota Truck?',
    whyPoints: [
      'Legendary Toyota reliability',
      'Largest dealer and parts network in SA',
      'Strong resale value',
      'Ideal for light-duty delivery and service work',
    ],
    guides: ['buying-guide', 'what-to-check-before-buying', 'cof-ready-trucks'],
    faqs: [
      {
        question: 'Does A-Z Truck Sales sell used Toyota trucks?',
        answer:
          'Yes, we stock used Toyota trucks including the Dyna and other light-duty commercial models. Toyota is known for reliability and excellent parts availability in South Africa.',
      },
      {
        question: 'What Toyota truck models do you sell?',
        answer:
          'We sell used Toyota Dyna and other light-duty trucks in dropside, box body and other configurations.',
      },
      {
        question: 'Why buy a used Toyota truck from A-Z?',
        answer:
          'Toyota trucks offer legendary reliability, strong resale value and the best parts availability in South Africa. They are ideal for light-duty delivery and service work.',
      },
      {
        question: 'Are Toyota truck spares easy to find?',
        answer:
          'Toyota has the largest dealer and parts network in South Africa. Spares for Toyota commercial vehicles are widely available.',
      },
    ],
  },
  hyundai: {
    metaDescription:
      'Browse used Hyundai trucks for sale in Gauteng. Hyundai HD & light-duty trucks. Quality used rigid trucks. Visit our Alberton or Boksburg branch.',
    socialDescription:
      'Shop used Hyundai trucks in Gauteng. Quality used rigid trucks available at our Alberton or Boksburg branches.',
    heroIntro:
      'Browse our range of used Hyundai light-duty trucks. Every vehicle is available for viewing at our Alberton or Boksburg branch.',
    aboutHeading: 'Hyundai Trucks — Modern, Reliable, Affordable',
    about: [
      'Hyundai has established itself as a trusted commercial vehicle brand in South Africa, known for modern design, reliable performance and competitive pricing.',
      'The Hyundai HD series covers light-duty transport needs including dropside, box body and other configurations. Hyundai trucks offer good fuel efficiency and a comfortable driving experience.',
    ],
    whyHeading: 'Why Choose a Hyundai Truck?',
    whyPoints: [
      'Modern design and features',
      'Competitive pricing',
      'Good fuel efficiency',
      'Growing SA dealer and parts network',
    ],
    guides: ['buying-guide', 'what-to-check-before-buying', 'cof-ready-trucks'],
    faqs: [
      {
        question: 'Does A-Z Truck Sales sell used Hyundai trucks?',
        answer:
          'Yes, we stock used Hyundai trucks including HD and light-duty models. Hyundai offers good value and reliable performance in the light- to medium-duty segment.',
      },
      {
        question: 'What Hyundai truck models do you sell?',
        answer:
          'We sell used Hyundai HD series and other light-duty trucks in dropside, box body and other configurations.',
      },
      {
        question: 'Why buy a used Hyundai truck from A-Z?',
        answer:
          'Hyundai trucks offer competitive pricing, modern design and good parts availability. Our team can help you find the right model for your needs.',
      },
      {
        question: 'Are Hyundai truck spares available in South Africa?',
        answer:
          'Yes, Hyundai has a growing dealer and parts network in South Africa with good availability for commercial vehicle spares.',
      },
    ],
  },
} satisfies Record<BrandSlug, BrandPageContent>

export type BrandPage = BrandRoute & BrandPageContent

export function getBrandPage(slug: string): BrandPage | undefined {
  const route = BRAND_ROUTES.find((b) => b.slug === slug)
  if (!route) return undefined
  return { ...route, ...BRAND_CONTENT[route.slug] }
}
