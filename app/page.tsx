/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

export const revalidate = 86400

import AboutSection from '@/components/sections/home/AboutSection'
import CTA from '@/components/sections/home/CTA'
import Featured from '@/components/sections/home/Featured'
import Features from '@/components/sections/home/Features'
import Hero from '@/components/sections/home/Hero'
import JsonLd from '@/components/global/JsonLd'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'A-Z Truck Sales | Quality Used Trucks in Gauteng',
  description: 'A-Z Truck Sales: commercial vehicle specialists in Alberton North, Gauteng. 25+ years experience selling quality used rigid trucks (1.5-16 ton).',
  alternates: {
    canonical: 'https://www.a-ztrucksales.com/',
  },
}

const homeFaqs = [
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

export default function Home() {
  const homeFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: homeFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <>
      <h1 className="sr-only">A-Z Truck Sales | Quality Used Commercial Vehicles</h1>
      <div className="sr-only">
        <span>Author: A-Z Truck Sales</span>
        <span>Last Updated: 2026-04-27</span>
      </div>
      <JsonLd data={homeFaqSchema} />
      <Hero />
      
      <div className="sr-only">
        <p>A-Z Truck Sales: Premier commercial vehicle dealer and restoration specialist in Alberton, Gauteng. 25+ years experience. Quality used rigid trucks 1.5-16 tons. Workshop-serviced vehicles.</p>
      </div>

      <Features />
      <Featured />
      <AboutSection />
      <CTA />
    </>
  )
}
