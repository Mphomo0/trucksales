import React from 'react'

export default function Process() {
  return (
    <div className="py-18 bg-gradient-to-r from-amber-600 to-yellow-300 text-accent-foreground ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Simple 3-Step Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-accent-foreground/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Submit Information</h3>
              <p>Fill out our online form with your vehicle details</p>
            </div>
            <div className="text-center">
              <div className="bg-accent-foreground/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Your Estimate</h3>
              <p>Receive a competitive trade-in value within 24 hours</p>
            </div>
            <div className="text-center">
              <div className="bg-accent-foreground/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Complete Your Trade
              </h3>
              <p>Apply your trade value towards your new truck purchase</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
