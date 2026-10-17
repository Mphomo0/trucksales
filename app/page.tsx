/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

export const revalidate = 86400

import AboutSection from '@/components/sections/home/AboutSection'
import BrandsSection from '@/components/sections/home/BrandsSection'
import CTA from '@/components/sections/home/CTA'
import FAQSection from '@/components/sections/home/FAQSection'
import Featured from '@/components/sections/home/Featured'
import Features from '@/components/sections/home/Features'
import Hero from '@/components/sections/home/Hero'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    absolute: 'Used Trucks for Sale, Alberton & Boksburg | A-Z Truck Sales',
  },
  description:
    'Browse quality used rigid trucks and truck spares from A-Z Truck Sales in Alberton and Boksburg. 25+ years serving Gauteng and South Africa.',
  alternates: {
    canonical: 'https://www.a-ztrucksales.com/',
  },
  openGraph: {
    title: 'Used Trucks for Sale in Alberton & Boksburg | A-Z Truck Sales',
    description:
      'Browse quality used rigid trucks and truck spares from A-Z Truck Sales in Alberton and Boksburg. 25+ years serving Gauteng and South Africa.',
    url: 'https://www.a-ztrucksales.com/',
    siteName: 'A-Z Truck Sales',
    images: [
      {
        url: 'https://www.a-ztrucksales.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'A-Z Truck Sales - Used Commercial Vehicles',
      },
    ],
    locale: 'en_ZA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: 'Used Trucks for Sale in Alberton & Boksburg | A-Z Truck Sales',
    description:
      'Browse quality used rigid trucks and truck spares from A-Z Truck Sales in Alberton and Boksburg. 25+ years serving Gauteng and South Africa.',
    images: ['https://www.a-ztrucksales.com/og-image.webp'],
  },
}

// The business (#org) is defined in app/layout.tsx and each branch (#branch) on its
// /locations page, so the homepage no longer repeats them with different data.

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Featured />
      <div className="cv-auto">
        <BrandsSection />
      </div>
      <div className="cv-auto">
        <AboutSection />
      </div>
      <div className="cv-auto">
        <FAQSection />
      </div>
      <div className="cv-auto">
        <CTA />
      </div>
    </>
  )
}
