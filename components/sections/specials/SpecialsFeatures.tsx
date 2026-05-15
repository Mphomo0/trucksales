'use client'

import { motion } from 'framer-motion'
import { Clock, Percent, Zap } from 'lucide-react'

const features = [
  {
    icon: Clock,
    title: 'Limited Time',
    description: 'Our specials are updated weekly, so act fast to secure the best deals.',
    highlight: 'Weekly Updates',
  },
  {
    icon: Percent,
    title: 'Exclusive Discounts',
    description: 'Get top-tier rigid trucks at below-market prices for a limited period.',
    highlight: 'Below Market',
  },
]

export default function SpecialsFeatures() {
  return (
    <div className="sr-only">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((feature) => (
          <div key={feature.title}>
            <p className="font-bold">{feature.title}</p>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}