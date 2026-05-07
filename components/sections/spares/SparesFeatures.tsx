'use client'

import { motion } from 'framer-motion'
import { Cog, Settings, Wrench } from 'lucide-react'

const features = [
  {
    icon: Cog,
    title: 'Engines & Gearboxes',
    description: 'Tested and reliable power units for major truck makes.',
    highlight: 'Tested',
  },
  {
    icon: Settings,
    title: 'Differential Units',
    description: 'Quality used diffs available for various tonnage ratings.',
    highlight: 'Quality',
  },
  {
    icon: Wrench,
    title: 'Workshop Serviced',
    description: 'All spares are inspected by our expert technical team.',
    highlight: 'Inspected',
  },
]

export default function SparesFeatures() {
  return (
    <div className="sr-only">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((feature) => (
          <div key={feature.title}>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}