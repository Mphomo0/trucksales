import Process from '@/components/sections/tradeIn/Process'
import TradeInForm from '@/components/sections/tradeIn/TradeInForm'
import React from 'react'

export default function SellYourTruck() {
  return (
    <>
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sell Your Truck/Trade In
            </h2>
            <p className="text-lg text-gray-600">
              Looking to upgrade your truck? Our simple and transparent trade-in
              program makes it easy to get top value for your current truck.
            </p>
          </div>
        </div>
      </section>
      <section>
        <TradeInForm />
        <Process />
      </section>
    </>
  )
}
