'use client'

import { motion } from 'framer-motion'
import { Clock, Percent, BadgeCheck, Zap } from 'lucide-react'

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
  {
    icon: BadgeCheck,
    title: 'Certified Quality',
    description: 'Even our special-offer trucks undergo full workshop testing.',
    highlight: 'Workshop Tested',
  },
]

export default function SpecialsFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-900/5 transition-all duration-300"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-400 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="flex items-start justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
              <feature.icon className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              {feature.highlight}
            </span>
          </div>
          
          <h2 className="font-bold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors text-lg">
            {feature.title}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </div>
  )
}