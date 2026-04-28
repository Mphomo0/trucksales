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