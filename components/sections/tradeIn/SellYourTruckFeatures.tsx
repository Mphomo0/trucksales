'use client'


import { Clock, DollarSign, ArrowRightLeft, Zap } from 'lucide-react'

const features = [
  {
    icon: Clock,
    title: 'Fast Evaluation',
    description: 'We provide quick and fair assessments of your commercial vehicles.',
    highlight: 'Quick Process',
  },
  {
    icon: DollarSign,
    title: 'Fair Value',
    description: 'Get a competitive market price based on condition and mileage.',
    highlight: 'Best Price',
  },
  {
    icon: ArrowRightLeft,
    title: 'Seamless Trade',
    description: 'Upgrade your fleet effortlessly with our trade-in program.',
    highlight: 'Hassle-Free',
  },
]

export default function SellYourTruckFeatures() {
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