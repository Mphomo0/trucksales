'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Wrench, Truck } from 'lucide-react'

const features = [
  {
    icon: CheckCircle2,
    title: 'Quality Assurance',
    description: 'Every truck undergoes a rigorous multi-point inspection before listing.',
    highlight: 'Workshop Tested',
  },
  {
    icon: Wrench,
    title: 'Expert Restoration',
    description: '25+ years of experience in truck restoration and servicing.',
    highlight: '25+ Years',
  },
  {
    icon: Truck,
    title: 'Wide Selection',
    description: 'Rigid trucks ranging from 1.5 to 35 tons for every need.',
    highlight: '1.5-35 Tons',
  },
]

export default function InventoryFeatures() {
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