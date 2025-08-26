'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Phone, Mail, MapPin } from 'lucide-react'

export default function AddressSection() {
  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      aria-labelledby="contact-heading"
    >
      <div className="text-center mb-12">
        <h2
          id="contact-heading"
          className="text-3xl font-bold text-gray-900 mb-4"
        >
          Contact Us
        </h2>
        <p className="text-lg text-gray-600">
          Ready to purchase your perfect truck? Get in touch with us today!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Call Us */}
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="text-center">
            <Phone className="h-8 w-8 text-amber-400 mx-auto mb-2" />
            <CardTitle>Call Us</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-1">
            <p className="text-lg font-medium">011 902 6071</p>
            <p className="text-lg font-medium">Alberton: 078 127 7393</p>
            <p className="text-lg font-medium">Boksburg: 083 234 5377</p>
            <p className="text-sm text-gray-500">Mon–Fri: 8AM–5PM</p>
            <p className="text-sm text-gray-500">Sat–Sun: Closed</p>
          </CardContent>
        </Card>

        {/* Email Us */}
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="text-center">
            <Mail className="h-8 w-8 text-amber-400 mx-auto mb-2" />
            <CardTitle>Email Us</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-1">
            <p className="text-lg font-medium">aztrucksales@mweb.co.za</p>
            <p className="text-sm text-gray-500">We respond within 24 hours</p>
          </CardContent>
        </Card>

        {/* Alberton Branch */}
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="text-center">
            <MapPin className="h-8 w-8 text-amber-400 mx-auto mb-2" />
            <CardTitle>Alberton Branch</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-1">
            <p className="text-lg font-medium">
              9 Chrislou Crescent, Alberton North
            </p>
            <p className="text-sm text-gray-500">Alberton, Gauteng, 1449</p>
          </CardContent>
        </Card>

        {/* Boksburg Branch */}
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="text-center">
            <MapPin className="h-8 w-8 text-amber-400 mx-auto mb-2" />
            <CardTitle>Boksburg Branch</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-1">
            <p className="text-lg font-medium">
              Cnr Trichardts & Ravenswood St, Ravenswood
            </p>
            <p className="text-sm text-gray-500">Boksburg, Gauteng, 1451</p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
