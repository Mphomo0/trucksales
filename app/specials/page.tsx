import AllSpecials from '@/components/sections/special/AllSpecials'
import React from 'react'

export default function Specials() {
  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Specials
          </h2>
          <p className="text-lg text-gray-600">
            Don't miss out on our latest truck specials — limited-time deals,
            exclusive discounts, and unbeatable offers available now!
          </p>
        </div>

        <AllSpecials />
      </div>
    </div>
  )
}
