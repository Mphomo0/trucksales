/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */

import AboutSection from '@/components/sections/home/AboutSection'
import CTA from '@/components/sections/home/CTA'
import Featured from '@/components/sections/home/Featured'
import Features from '@/components/sections/home/Features'
import Hero from '@/components/sections/home/Hero'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { MapPin, Clock, Wrench } from 'lucide-react'

/* application/ld+json */ export default function Home() {
  return (
    <>
      <h1 className="sr-only">A-Z Truck Sales | Quality Used Commercial Vehicles</h1>
      {/* application/ld+json (Schema is in layout.tsx) */}
      <div className="sr-only">
        <span>Author: A-Z Truck Sales</span>
        <span>Last Updated: 2026-04-27</span>
      </div>
      <Hero />
      
      {/* GEO/AEO Summary - Hidden from view but SEO accessible */}
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
